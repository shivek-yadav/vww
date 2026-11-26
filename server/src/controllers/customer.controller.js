/** Business controllers for customer. Route wiring is kept separately. */
import { calculateTotals } from '../services/order.service.js';
import { z } from 'zod';
import { MenuItem, Order, Booking, Inquiry, SiteSettings } from '../models/index.js';
import { wrap, parse, uid, clean, ensure, validId } from '../lib/utils.js';
const orderSchema = z.object({
    items: z.array(z.object({
        id: z.string(),
        name: z.string().optional(),
        quantity: z.number().int().min(1).max(50000),
        sizeBreakdown: z.any().optional(),
        customization: z.any().optional(),
        price: z.number().optional()
    })).min(1).max(100),
    fulfillment: z.string().optional().default('road_transport'),
    address: z.object({
        name: z.string().min(1).max(100).optional(),
        orgName: z.string().optional(),
        phone: z.string().min(1).max(25).optional(),
        email: z.string().optional(),
        line1: z.string().min(1).max(250).optional(),
        city: z.string().min(1).max(100).optional(),
        state: z.string().optional(),
        pincode: z.string().min(1).max(12).optional(),
        gstin: z.string().optional(),
        transportPreference: z.string().optional()
    }).optional(),
    notes: z.string().max(1000).optional().default(''),
    promoCode: z.string().max(50).optional(),
    paymentMethod: z.string().optional()
});
const bookingSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), guests: z.number().int().min(1).max(20), name: z.string().min(2).max(100), email: z.string().email(), phone: z.string().min(7).max(25), occasion: z.string().max(100).optional().default(''), notes: z.string().max(500).optional().default('') });
export const get_account = (req, res) => res.json({ data: clean(req.user) });
export const patch_account = wrap(async (req, res) => {
    const d = parse(z.object({
        name: z.string().trim().min(2).max(100).optional(),
        phone: z.string().max(25).optional(),
        orgName: z.string().max(150).optional(),
        gstin: z.string().max(25).optional(),
        address: z.string().max(300).optional(),
        city: z.string().max(100).optional(),
        state: z.string().max(100).optional(),
        pincode: z.string().max(15).optional()
    }), req.body);
    Object.assign(req.user, d);
    await req.user.save();
    res.json({ data: clean(req.user), message: 'Profile updated successfully' });
});
export const get_orders_my = wrap(async (req, res) => {
    const userEmail = (req.user.email || '').toLowerCase().trim();
    const orders = await Order.find({
        $or: [
            { customer: req.user._id },
            ...(userEmail ? [{ 'address.email': userEmail }] : [])
        ]
    }).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ data: orders });
});
export const get_orders_my_id = wrap(async (req, res) => {
    ensure(validId(req.params.id), 400, 'Invalid order');
    const o = await Order.findOne({ _id: req.params.id, customer: req.user._id }).lean();
    ensure(o, 404, 'Order not found');
    res.json({ data: o });
});
export const post_orders = wrap(async (req, res) => {
    const d = parse(orderSchema, req.body);
    const s = await SiteSettings.findOne({ key: 'primary' });
    ensure(s?.orderingEnabled !== false, 400, 'Online ordering is currently unavailable');
    ensure(d.fulfillment !== 'delivery' || s?.deliveryEnabled, 400, 'Delivery is currently unavailable');
    if (d.fulfillment === 'delivery')
        ensure(d.address, 400, 'Delivery address required');
    const ids = d.items.map(x => x.id);
    ensure(ids.every(validId), 400, 'Invalid dish selection');
    ensure(new Set(ids).size === ids.length, 400, 'Duplicate dishes are not allowed');
    const products = await MenuItem.find({ _id: { $in: ids }, published: true, available: true });
    ensure(products.length === ids.length, 400, 'Some dishes are no longer available');
    const byId = new Map(products.map(p => [String(p._id), p]));
    const lines = d.items.map(item => {
        const p = byId.get(item.id);
        return { menuItem: p._id, product: p._id, name: p.name, price: p.price, quantity: item.quantity, image: p.image, lineTotal: Math.round(p.price * item.quantity * 100) / 100 };
    });
    let { subtotal, deliveryFee: fee, total } = calculateTotals(lines, d.fulfillment, s?.deliveryFee);
    if (d.fulfillment === 'delivery' && s?.freeDeliveryThreshold && subtotal >= s.freeDeliveryThreshold) {
        fee = 0;
        total = subtotal;
    }
    let discount = 0;
    let promoCodeApplied = '';
    if (d.promoCode && s?.promoCode && d.promoCode.trim().toUpperCase() === s.promoCode.trim().toUpperCase()) {
        const pct = Number(s.promoDiscount || 0);
        discount = Math.round((subtotal * pct) / 100 * 100) / 100;
        promoCodeApplied = s.promoCode.toUpperCase();
        total = Math.max(0, Math.round((subtotal - discount + fee) * 100) / 100);
    }
    const validPayments = ['pay_on_pickup', 'cash_on_delivery', 'upi_on_delivery', 'card_on_delivery'];
    let method = d.paymentMethod && validPayments.includes(d.paymentMethod)
        ? d.paymentMethod
        : (d.fulfillment === 'delivery' ? 'cash_on_delivery' : 'pay_on_pickup');

    const order = await Order.create({
        orderNumber: uid('DKO'),
        customer: req.user._id,
        items: lines,
        fulfillment: d.fulfillment,
        address: d.fulfillment === 'delivery' ? d.address : undefined,
        notes: d.notes,
        subtotal,
        deliveryFee: fee,
        discount,
        promoCode: promoCodeApplied,
        total,
        paymentMethod: method,
        statusHistory: [{ status: 'placed', at: new Date(), by: 'customer' }]
    });
    res.status(201).json({ data: order, message: 'Your order has been placed!' });
});
export const get_bookings_my = wrap(async (req, res) => {
    // 1. Fetch from Booking collection
    const bookings = await Booking.find({ customer: req.user._id }).sort({ createdAt: -1 }).limit(100).lean();
    
    // 2. Also fetch any quotation inquiries submitted by this user (EXCLUDING wholesale orders and existing samples)
    const userEmail = (req.user.email || '').toLowerCase().trim();
    const userPhone = (req.user.phone || '').replace(/[^0-9]/g, '');
    const userName = (req.user.name || '').toLowerCase().trim();
    
    let inquiries = [];
    try {
        const allInq = await Inquiry.find({}).sort({ createdAt: -1 }).limit(200).lean();
        inquiries = allInq.filter(inq => {
            const subject = (inq.subject || '').toLowerCase();
            // CRITICAL: NEVER include wholesale orders in sample quotes! They belong exclusively to Wholesale Orders
            if (subject.includes('wholesale order') || subject.includes('order request') || inq.message?.includes('Logistics:') || inq.message?.includes('Payment Preference:')) {
                return false;
            }

            const inqEmail = (inq.email || '').toLowerCase().trim();
            const inqPhone = (inq.phone || '').replace(/[^0-9]/g, '');
            const inqName = (inq.name || '').toLowerCase().trim();
            const matchesUser = (userEmail && inqEmail === userEmail) || 
                   (userPhone && inqPhone && (userPhone.includes(inqPhone) || inqPhone.includes(userPhone))) ||
                   (userName && inqName && (userName === inqName || userName.includes(inqName) || inqName.includes(userName)));

            if (!matchesUser) return false;

            // CRITICAL: Exclude duplicate if this sample/quote is already in Booking
            const isAlreadyInBookings = bookings.some(b => {
                if (b.bookingNumber && (inq.message?.includes(b.bookingNumber) || inq.subject?.includes(b.bookingNumber))) return true;
                if (inq.createdAt && b.createdAt) {
                    const timeDiff = Math.abs(new Date(inq.createdAt) - new Date(b.createdAt));
                    if (timeDiff < 600000) return true; // same request within 10 minutes
                }
                return false;
            });

            return !isAlreadyInBookings;
        });
    } catch (e) {
        // Safe fallback
    }

    const inquiryItems = inquiries.map(inq => {
        const isSample = (inq.subject || '').toLowerCase().includes('sample');
        const refMatch = inq.message?.match(/Sample Ref:\s*([A-Z0-9-]+)/i) || inq.subject?.match(/(VWW-[A-Z0-9-]+)/i);
        const refNumber = refMatch ? refMatch[1] : (isSample ? `VWW-SMP-${inq._id.toString().slice(-4).toUpperCase()}` : `VWW-QTE-${inq._id.toString().slice(-4).toUpperCase()}`);
        
        return {
            _id: inq._id,
            bookingNumber: refNumber,
            customer: req.user._id,
            name: inq.name || req.user.name,
            email: inq.email || req.user.email,
            phone: inq.phone || req.user.phone,
            date: inq.createdAt ? new Date(inq.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            time: '11:00',
            guests: 1,
            occasion: inq.subject || (isSample ? 'Uniform Sample Request' : 'Wholesale Quotation Request'),
            notes: inq.message || '',
            status: inq.status === 'resolved' ? 'completed' : (inq.status === 'in_progress' ? 'confirmed' : 'pending'),
            adminNote: inq.adminNote || '',
            createdAt: inq.createdAt || new Date().toISOString(),
            isFromInquiry: true
        };
    });

    const existingRefNumbers = new Set(bookings.map(b => b.bookingNumber));
    const merged = [...bookings];
    for (const item of inquiryItems) {
        if (!existingRefNumbers.has(item.bookingNumber)) {
            merged.push(item);
        }
    }

    merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ data: merged });
});

export const post_bookings = wrap(async (req, res) => {
    const raw = req.body || {};
    const bookingNumber = raw.bookingNumber || uid('VWW-SMP');
    const booking = await Booking.create({
        bookingNumber,
        customer: req.user._id,
        name: raw.name || req.user.name,
        email: raw.email || req.user.email,
        phone: raw.phone || req.user.phone || '',
        date: raw.date || new Date().toISOString().slice(0, 10),
        time: raw.time || '11:00',
        guests: Number(raw.guests) || 1,
        occasion: raw.occasion || 'Uniform Sample Swatch',
        notes: raw.notes || '',
        status: 'pending',
        adminNote: ''
    });
    res.status(201).json({ data: booking, message: 'Sample / Quotation request submitted successfully!' });
});

export const patch_bookings_my_id_cancel = wrap(async (req, res) => {
    ensure(validId(req.params.id), 400, 'Invalid request ID');
    let b = await Booking.findOne({ _id: req.params.id, customer: req.user._id });
    if (b) {
        ensure(['pending', 'confirmed'].includes(b.status), 400, 'This request can no longer be cancelled');
        b.status = 'cancelled';
        await b.save();
        return res.json({ data: b, message: 'Sample request cancelled' });
    }
    // Also check Inquiry with user ownership check to prevent unauthorized cancellation (IDOR)
    const userEmail = (req.user.email || '').toLowerCase().trim();
    const userPhone = (req.user.phone || '').trim();
    const userConditions = [
        ...(userEmail ? [{ email: userEmail }] : []),
        ...(userPhone ? [{ phone: userPhone }] : []),
        { name: req.user.name }
    ];
    let inq = await Inquiry.findOne({ _id: req.params.id, $or: userConditions });
    if (inq) {
        ensure(['pending', 'in_progress', 'new'].includes(inq.status || 'pending'), 400, 'This request can no longer be cancelled');
        inq.status = 'cancelled';
        await inq.save();
        return res.json({ data: inq, message: 'Sample request cancelled' });
    }
    ensure(false, 404, 'Record not found');
});
