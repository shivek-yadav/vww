import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const config = { timestamps: true };

export const Coupon = model('Coupon', new Schema({
    code: { type: String, required: true, uppercase: true, trim: true, unique: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    description: String,
    expiresAt: String,
    active: { type: Boolean, default: true }
}, config));
