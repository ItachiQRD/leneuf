import mongoose from 'mongoose';
import { OrderModel } from '../types/models';
import { createBaseSchema } from './BaseSchema';

const orderSchema = createBaseSchema<OrderModel>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
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
    options: [{
      name: String,
      choice: {
        name: String,
        price: Number
      }
    }]
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    complement: String
  },
  deliveryTime: Date,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'],
    required: true
  },
  notes: String
});

// Indexation
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model<OrderModel>('Order', orderSchema);

export default Order;