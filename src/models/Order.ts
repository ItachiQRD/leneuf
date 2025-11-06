import mongoose from 'mongoose';
import { OrderModel } from '../types/models';
import { createBaseSchema } from './BaseSchema';

const orderSchema = createBaseSchema<OrderModel>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optionnel pour les commandes sans compte
  },
  customer: {
    name: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash'],
      required: false
    },
    deliveryInstructions: {
      type: String,
      required: false
    }
  },
  items: [{
    productId: {
      type: String, // Peut être un ObjectId ou 'custom-product'
      required: true
    },
    productName: {
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
    options: [{
      name: String,
      choice: {
        name: String,
        price: Number
      }
    }],
    customIngredients: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
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
  orderType: {
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery'
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