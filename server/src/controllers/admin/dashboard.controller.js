/** Admin dashboard controllers. */
import { User, Booking, Order, ActivityLog } from '../../models/index.js';
import { isFallbackActive } from '../../config/database.js';
import { wrap } from '../../lib/utils.js';

export const get_dashboard = wrap(async (req, res) => {
    const nowIST = new Date(Date.now() + 330 * 60000);
    const startIST = new Date(Date.UTC(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate()) - 330 * 60000);

    let ordersToday = 0;
    let pendingBookings = 0;
    let customers = 0;
    let openOrders = 0;
    let recentOrders = [];
    let recentBookings = [];
    let paidRevenue = 0;
    let paidOrders = 0;
    let totalVolume = 0;
    let totalOrders = 0;
    const dayMap = {};

    // Initialize last 7 days keys in IST
    for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000 + 330 * 60000);
        const key = d.toISOString().slice(0, 10);
        dayMap[key] = { date: key, paidRevenue: 0, totalVolume: 0, orders: 0, samples: 0 };
    }

    try {
        pendingBookings = await Booking.countDocuments({ status: 'pending' });
        customers = await User.countDocuments({ role: 'customer' });
        openOrders = await Order.countDocuments({ status: { $in: ['placed', 'accepted', 'preparing', 'ready'] } });
        recentOrders = (await Order.find().populate('customer', 'name').sort({ createdAt: -1 }).limit(8).lean()) || [];
        recentBookings = (await Booking.find().sort({ createdAt: -1 }).limit(6).lean()) || [];

        // Fetch all orders for comprehensive metrics & trend graph
        const allOrders = (await Order.find().lean()) || [];
        totalOrders = allOrders.length;

        allOrders.forEach(o => {
            const oCreated = new Date(o.createdAt);
            const isToday = oCreated >= startIST;
            if (isToday) {
                ordersToday++;
            }

            const val = Number(o.total) || 0;
            if (!['cancelled', 'rejected'].includes(o.status)) {
                totalVolume += val;
                if (o.paymentStatus === 'paid') {
                    paidRevenue += val;
                    paidOrders++;
                }
            }

            // Map into trend graph
            const dateKey = new Date(oCreated.getTime() + 330 * 60000).toISOString().slice(0, 10);
            if (dayMap[dateKey]) {
                dayMap[dateKey].orders += 1;
                if (!['cancelled', 'rejected'].includes(o.status)) {
                    dayMap[dateKey].totalVolume += val;
                    if (o.paymentStatus === 'paid') {
                        dayMap[dateKey].paidRevenue += val;
                    }
                }
            }
        });

        // Add sample requests into daily trend
        const allBookings = (await Booking.find().lean()) || [];
        allBookings.forEach(b => {
            const bCreated = new Date(b.createdAt);
            const dateKey = new Date(bCreated.getTime() + 330 * 60000).toISOString().slice(0, 10);
            if (dayMap[dateKey]) {
                dayMap[dateKey].samples += 1;
            }
        });

    } catch (e) {
        // Safe fallback
    }

    res.json({
        data: {
            ordersToday,
            pendingBookings,
            customers,
            openOrders,
            revenue: paidRevenue,
            paidRevenue,
            totalVolume,
            paidOrders,
            totalOrders,
            recentOrders,
            recentBookings,
            dailyStats: Object.values(dayMap)
        }
    });
});

export const get_reports = wrap(async (req, res) => {
    let statuses = [];
    let revenueByDay = [];
    let topDishes = [];
    let bookings = [];

    try {
        if (!isFallbackActive()) {
            [statuses, revenueByDay, topDishes, bookings] = await Promise.all([
                Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
                Order.aggregate([
                    { $match: { paymentStatus: 'paid', status: { $nin: ['cancelled', 'rejected'] } } },
                    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
                    { $sort: { _id: -1 } },
                    { $limit: 30 }
                ]),
                Order.aggregate([
                    { $unwind: '$items' },
                    { $group: { _id: '$items.name', quantity: { $sum: '$items.quantity' }, revenue: { $sum: '$items.lineTotal' } } },
                    { $sort: { quantity: -1 } },
                    { $limit: 10 }
                ]),
                Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
            ]);
        } else {
            // Local fallback aggregation
            const allOrders = (await Order.find().lean()) || [];
            const allBookings = (await Booking.find().lean()) || [];

            // Status counts
            const statusMap = {};
            allOrders.forEach(o => {
                const s = o.status || 'placed';
                statusMap[s] = (statusMap[s] || 0) + 1;
            });
            statuses = Object.entries(statusMap).map(([_id, count]) => ({ _id, count }));

            // Revenue by day
            const dayRevMap = {};
            allOrders.forEach(o => {
                if (o.paymentStatus === 'paid' && !['cancelled', 'rejected'].includes(o.status)) {
                    const d = new Date(new Date(o.createdAt).getTime() + 330 * 60000).toISOString().slice(0, 10);
                    if (!dayRevMap[d]) dayRevMap[d] = { _id: d, revenue: 0, orders: 0 };
                    dayRevMap[d].revenue += Number(o.total) || 0;
                    dayRevMap[d].orders += 1;
                }
            });
            revenueByDay = Object.values(dayRevMap).sort((a, b) => b._id.localeCompare(a._id));

            // Top products
            const productMap = {};
            allOrders.forEach(o => {
                (o.items || []).forEach(it => {
                    const name = it.name || 'Uniform Item';
                    if (!productMap[name]) productMap[name] = { _id: name, quantity: 0, revenue: 0 };
                    productMap[name].quantity += Number(it.quantity) || 1;
                    productMap[name].revenue += Number(it.lineTotal || (it.price * it.quantity)) || 0;
                });
            });
            topDishes = Object.values(productMap).sort((a, b) => b.quantity - a.quantity).slice(0, 10);

            // Booking statuses
            const bookingMap = {};
            allBookings.forEach(b => {
                const s = b.status || 'pending';
                bookingMap[s] = (bookingMap[s] || 0) + 1;
            });
            bookings = Object.entries(bookingMap).map(([_id, count]) => ({ _id, count }));
        }
    } catch (e) {
        // Safe fallback
    }

    res.json({
        data: {
            statuses,
            revenueByDay: (revenueByDay || []).reverse(),
            topDishes: topDishes || [],
            bookings: bookings || []
        }
    });
});

export const get_activity = wrap(async (req, res) => {
    try {
        const data = await ActivityLog.find().populate('actor', 'name email').sort({ createdAt: -1 }).limit(100).lean();
        res.json({ data: data || [] });
    } catch (e) {
        res.json({ data: [] });
    }
});
