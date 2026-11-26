import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const config = { timestamps: true };
export const SiteSettings = model('SiteSettings', new Schema({
    key: { type: String, unique: true, default: 'primary' },
    restaurantName: { type: String, default: 'Dakshayani' },
    tagline: { type: String, default: 'The Art of Indian Dining' },
    phone: { type: String, default: '+91 98765 43210' },
    email: { type: String, default: 'hello@dakshayani.example' },
    address: { type: String, default: 'Grand Heritage Avenue, Connaught Place, New Delhi, India' },
    city: { type: String, default: 'New Delhi' },
    mapUrl: String,
    instagram: String,
    facebook: String,
    openingHours: [{ day: String, open: String, close: String, closed: Boolean }],
    bookingEnabled: { type: Boolean, default: true },
    orderingEnabled: { type: Boolean, default: true },
    deliveryEnabled: { type: Boolean, default: true },
    deliveryFee: { type: Number, default: 50 },
    freeDeliveryThreshold: { type: Number, default: 799 },
    taxPercentage: { type: Number, default: 5 },
    currencySymbol: { type: String, default: '₹' },
    announcement: { type: String, default: '✦ Special Welcome Offer: Get 10% off with coupon ROYAL10 ✦ Free delivery above ₹799 ✦' },
    announcementEnabled: { type: Boolean, default: true },
    promoCode: { type: String, default: 'ROYAL10' },
    promoDiscount: { type: Number, default: 10 },
    heroTitle: { type: String, default: 'Where Heritage Meets Royal Flavours' },
    heroSubtitle: { type: String, default: 'An authentic fine dining and gourmet delivery experience' },
    heroBadge: { type: String, default: 'ESTD. 1998 · AWARD-WINNING INDIAN CUISINE' },
    heroImage: String,
    reservationMaxGuests: { type: Number, default: 12 },
    minReservationLeadHours: { type: Number, default: 2 }
}, config));
