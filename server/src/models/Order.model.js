
import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const config = { timestamps: true };

// Schema for individual order items
const lineSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      default: null
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    sizeBreakdown: {
      type: Schema.Types.Mixed,
      default: {}
    },
    customization: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    items: {
      type: [lineSchema],
      required: true
    },
    totalPieces: {
      type: Number,
      default: 0
    },
    fulfillment: {
      type: String,
      default: 'road_transport'
    },
    address: {
      name: String,
      orgName: String,
      phone: String,
      email: String,
      line1: String,
      city: String,
      state: String,
      pincode: String,
      gstin: String,
      transportPreference: String
    },
    notes: {
      type: String,
      default: ''
    },
    subtotal: Number,
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    promoCode: { type: String, default: '' },
    total: Number,
    paymentMethod: {
      type: String,
      default: 'bank_transfer'
    },
    paymentStatus: {
      type: String,
      default: 'unpaid'
    },
    status: {
      type: String,
      default: 'placed'
    },
    statusHistory: [
      {
        status: String,
        at: Date,
        by: String
      }
    ]
  },
  config
);

export const Order = model('Order', orderSchema);
