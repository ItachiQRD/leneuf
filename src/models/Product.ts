import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['burgers', 'sandwichs', 'pizzas', 'assiettes', 'accompagnements', 'tacos', 'paninis', 'tex-mex', 'ptite-faim', 'menu-enfants', 'boissons', 'desserts']
  },
  type: {
    type: String,
    default: 'food',
    enum: ['food', 'drink', 'dessert']
  },
  sizes: [{
    name: String,
    price: Number,
    description: String,
    isDefault: { type: Boolean, default: false }
  }],
  ingredients: [{
    name: String,
    price: Number,
    type: String
  }],
  available: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexation
productSchema.index({ category: 1 });
productSchema.index({ name: 1 });
productSchema.index({ available: 1 });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
