import mongoose from 'mongoose';

const promotionConditionSchema = new mongoose.Schema({
  minQuantity: { type: Number, min: 1 },
  minOrderValue: { type: Number, min: 0 },
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId }],
  applicableCategories: [{ type: String }],
  productTypes: [{ 
    type: String, 
    enum: ['food', 'drink', 'side', 'dessert'] 
  }]
}, { _id: false });

const promotionRewardSchema = new mongoose.Schema({
  freeItems: [{
    productId: { type: mongoose.Schema.Types.ObjectId },
    quantity: { type: Number, min: 1 },
    name: { type: String }
  }],
  discountPercentage: { type: Number, min: 0, max: 100 },
  discountAmount: { type: Number, min: 0 },
  freeDelivery: { type: Boolean, default: false }
}, { _id: false });

const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  type: {
    type: String,
    enum: ['buy_x_get_y', 'percentage_discount', 'fixed_discount', 'free_delivery', 'combo_offer', 'pizza_promotion'],
    required: [true, 'Le type est requis']
  },
  conditions: {
    type: promotionConditionSchema,
    required: true
  },
  reward: {
    type: promotionRewardSchema,
    required: true
  },
  validFrom: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  validUntil: {
    type: Date,
    required: [true, 'La date de fin est requise']
  },
  active: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  },
  priority: {
    type: Number,
    default: 0
  },
  maxUses: {
    type: Number,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  // Informations spécifiques aux promotions de pizza
  pizzaSizes: [{
    type: String,
    enum: ['junior', 'senior', 'mega']
  }],
  // Texte de la promotion (ex: "2 Pizzas Seniors achetées = 3ème Offerte")
  promotionText: {
    type: String
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
promotionSchema.index({ validFrom: 1, validUntil: 1 });
promotionSchema.index({ active: 1, type: 1 });
promotionSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Promotion || mongoose.model('Promotion', promotionSchema);

