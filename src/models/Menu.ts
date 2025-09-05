import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  productType: { 
    type: String, 
    required: true,
    enum: ['food', 'drink', 'side', 'dessert']
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 1,
    min: 1
  },
  size: { 
    type: String 
  },
  variant: { 
    type: String 
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  }
}, { _id: false });

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: 0
  },
  type: {
    type: String,
    enum: ['combo', 'promotion', 'family', 'couple', 'senior', 'trio'],
    required: [true, 'Le type est requis']
  },
  items: {
    type: [menuItemSchema],
    required: true,
    validate: {
      validator: function(items: any[]) {
        return items.length > 0;
      },
      message: 'Au moins un article est requis'
    }
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise']
  },
  available: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  },
  validUntil: {
    type: Date
  },
  minOrderValue: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  isPromotion: {
    type: Boolean,
    default: false
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  savings: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: {
    transform(_, ret) {
      ret._id = ret._id.toString();
      return ret;
    }
  }
});

// Indexes
menuSchema.index({ type: 1, available: 1 });
menuSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Menu || mongoose.model('Menu', menuSchema);