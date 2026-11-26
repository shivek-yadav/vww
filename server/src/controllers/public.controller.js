/** Business controllers for public. Route wiring is kept separately. */
import { z } from 'zod';
import { Category, MenuItem, GalleryImage, FAQ, Testimonial, PageContent, SiteSettings, Inquiry, Order, User, Coupon } from '../models/index.js';
import { wrap, parse, httpError } from '../lib/utils.js';
const publicSettings = (s) => s ? {
    restaurantName: s.restaurantName,
    tagline: s.tagline,
    phone: s.phone,
    email: s.email,
    address: s.address,
    city: s.city,
    mapUrl: s.mapUrl,
    instagram: s.instagram,
    facebook: s.facebook,
    openingHours: s.openingHours,
    bookingEnabled: s.bookingEnabled,
    orderingEnabled: s.orderingEnabled,
    deliveryEnabled: s.deliveryEnabled,
    deliveryFee: s.deliveryFee,
    freeDeliveryThreshold: s.freeDeliveryThreshold,
    taxPercentage: s.taxPercentage,
    currencySymbol: s.currencySymbol || '₹',
    announcement: s.announcement,
    announcementEnabled: s.announcementEnabled,
    promoCode: s.promoCode,
    promoDiscount: s.promoDiscount,
    heroTitle: s.heroTitle,
    heroSubtitle: s.heroSubtitle,
    heroBadge: s.heroBadge,
    heroImage: s.heroImage,
    reservationMaxGuests: s.reservationMaxGuests
} : {};
const inquirySchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().email().max(150), phone: z.string().max(30).optional().default(''), subject: z.string().max(150).optional().default(''), message: z.string().trim().min(10).max(2500) });
export const get_settings_public = wrap(async (req, res) => res.json({ data: publicSettings(await SiteSettings.findOne({ key: 'primary' })) }));
export const get_categories = wrap(async (req, res) => res.json({ data: await Category.find({ published: true }).sort({ sortOrder: 1, name: 1 }).lean() }));
export const get_menu = wrap(async (req, res) => {
    const filter = { published: true };
    if (req.query.featured === 'true')
        filter.featured = true;
    if (req.query.category)
        filter.category = req.query.category;
    if (req.query.search)
        filter.name = { $regex: String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 60), $options: 'i' };
    const data = await MenuItem.find(filter).populate('category', 'name slug').sort({ featured: -1, name: 1 }).limit(150).lean();
    res.json({ data });
});
export const get_menu_slug = wrap(async (req, res) => {
    const isId = /^[0-9a-fA-F]{24}$/.test(req.params.slug);
    const filter = isId 
        ? { _id: req.params.slug, published: true } 
        : { slug: req.params.slug, published: true };
    const data = await MenuItem.findOne(filter).populate('category', 'name slug');
    if (!data)
        return res.status(404).json({ message: 'Product not found' });
    res.json({ data });
});
export const get_gallery = wrap(async (req, res) => res.json({ data: await GalleryImage.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean() }));
export const get_faqs = wrap(async (req, res) => res.json({ data: await FAQ.find({ published: true }).sort({ sortOrder: 1 }).lean() }));
export const get_testimonials = wrap(async (req, res) => res.json({ data: await Testimonial.find({ published: true }).sort({ createdAt: -1 }).limit(12).lean() }));
export const get_pages_slug = wrap(async (req, res) => {
    const data = await PageContent.findOne({ slug: req.params.slug, published: true }).lean();
    if (!data)
        return res.status(404).json({ message: 'Page not found' });
    res.json({ data });
});
export const post_inquiries = wrap(async (req, res) => {
    const data = parse(inquirySchema, req.body);
    await Inquiry.create(data);
    res.status(201).json({ message: 'Thank you! We will get back to you shortly.' });
});

export const post_order_request = wrap(async (req, res) => {
    const body = req.body || {};
    const items = body.items || [];
    if (!items.length) {
        return res.status(400).json({ message: 'At least one product item is required' });
    }

    const orderNumber = `VWW-${Date.now().toString().slice(-6)}`;
    const totalPieces = items.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
    const subtotal = items.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);

    let customerId = req.user?._id || null;
    if (!customerId && (body.address?.email || body.email)) {
        const orderEmail = (body.address?.email || body.email).toLowerCase().trim();
        const existingUser = await User.findOne({ email: orderEmail });
        if (existingUser) customerId = existingUser._id;
    }

    const orderDoc = {
        orderNumber,
        customer: customerId,
        items: items.map(it => ({
            name: it.name,
            quantity: Number(it.quantity) || 1,
            price: Number(it.price) || 0,
            sizeBreakdown: it.sizeBreakdown || {},
            customization: it.customization || {}
        })),
        fulfillment: body.fulfillment || 'road_transport',
        address: body.address || {
            name: body.contactPerson || body.name || 'Direct Client',
            orgName: body.institutionName || '',
            phone: body.phone || '',
            email: body.email || '',
            line1: 'Direct Factory Dispatch',
            city: 'Ludhiana',
            state: 'Punjab',
            pincode: '141008'
        },
        notes: body.notes || '',
        subtotal,
        deliveryFee: 0,
        discount: 0,
        total: subtotal,
        totalPieces,
        paymentMethod: body.paymentMethod || 'bank_transfer',
        paymentStatus: 'unpaid',
        status: 'placed'
    };

    const savedOrder = await Order.create(orderDoc);

    // Also log into CRM Inquiry leads for factory management
    try {
        const itemSummary = items.map(it => `${it.name} (${it.quantity} pcs)`).join(', ');
        await Inquiry.create({
            name: body.contactPerson || body.name || body.institutionName || 'Wholesale Client',
            email: body.email || 'orders@vijaywoollenworks.com',
            phone: body.phone || '',
            subject: `Wholesale Order Request: ${orderNumber} - ${totalPieces} pcs (${body.institutionName || 'Institutional Order'})`,
            message: `Institution: ${body.institutionName || 'N/A'}\nContact: ${body.contactPerson || body.name}\nPhone: ${body.phone}\nDestination: ${body.address?.city || ''}, ${body.address?.state || ''} (PIN: ${body.address?.pincode || ''})\nLogistics: ${body.fulfillment}\nPayment Preference: ${body.paymentMethod}\nItems:\n${itemSummary}\nEstimated Total: ₹${subtotal}\nSpecial Notes: ${body.notes || 'None'}`
        });
    } catch (e) {
        // Non-blocking inquiry creation
    }

    res.status(201).json({
        message: 'Wholesale order request submitted successfully',
        data: savedOrder
    });
});

export const validate_coupon = wrap(async (req, res) => {
    const code = (req.query.code || req.body?.code || '').trim().toUpperCase();
    if (!code) throw httpError(400, 'Please provide a coupon code');

    // Check Coupon model
    const coupon = await Coupon.findOne({ code, active: true }).lean();
    if (coupon) {
        return res.json({
            valid: true,
            code: coupon.code,
            discountPercent: coupon.discountPercent,
            minOrderValue: coupon.minOrderValue || 0,
            description: coupon.description || `${coupon.discountPercent}% off on wholesale order`
        });
    }

    // Check SiteSettings fallback promoCode
    const settings = (await SiteSettings.findOne().lean()) || {};
    if (settings.promoCode && settings.promoCode.trim().toUpperCase() === code) {
        return res.json({
            valid: true,
            code: settings.promoCode.trim().toUpperCase(),
            discountPercent: Number(settings.promoDiscount || 10),
            minOrderValue: 0,
            description: 'Special Promotional Discount'
        });
    }

    throw httpError(404, 'Invalid or expired coupon code');
});
