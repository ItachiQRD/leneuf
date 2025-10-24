const mongoose = require('mongoose');
require('dotenv').config();

// Schéma de promotion (copié du modèle)
const PromotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'buy_x_get_y', 'free_delivery'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrder: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  applicableProducts: [{
    type: String
  }],
  applicableCategories: [{
    type: String
  }],
  conditions: {
    minQuantity: {
      type: Number,
      default: 1
    },
    buyQuantity: {
      type: Number,
      default: 1
    },
    getQuantity: {
      type: Number,
      default: 1
    },
    freeProduct: {
      type: String,
      default: null
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const Promotion = mongoose.model('Promotion', PromotionSchema);

// Données des promotions par défaut
const promotionsData = [
  {
    name: "2 Pizzas Seniors achetées = 3ème Offerte",
    description: "Achetez 2 pizzas seniors et obtenez la 3ème gratuitement",
    type: "buy_x_get_y",
    value: 0,
    minOrder: 0,
    applicableCategories: ["pizza"],
    conditions: {
      buyQuantity: 2,
      getQuantity: 1,
      minQuantity: 2
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    isActive: true,
    usageLimit: 100,
    usedCount: 0
  },
  {
    name: "2 Pizzas Mégas achetées = 3ème Offerte",
    description: "Achetez 2 pizzas mégas et obtenez la 3ème gratuitement",
    type: "buy_x_get_y",
    value: 0,
    minOrder: 0,
    applicableCategories: ["pizza"],
    conditions: {
      buyQuantity: 2,
      getQuantity: 1,
      minQuantity: 2
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    isActive: true,
    usageLimit: 100,
    usedCount: 0
  },
  {
    name: "10% de réduction sur les burgers",
    description: "Profitez de 10% de réduction sur tous nos burgers",
    type: "percentage",
    value: 10,
    minOrder: 15,
    maxDiscount: 5,
    applicableCategories: ["burger"],
    conditions: {
      minQuantity: 1
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 jours
    isActive: true,
    usageLimit: 50,
    usedCount: 0
  },
  {
    name: "Livraison gratuite dès 25€",
    description: "Livraison gratuite pour toute commande de 25€ et plus",
    type: "free_delivery",
    value: 0,
    minOrder: 25,
    applicableCategories: ["pizza", "burger", "salad", "sandwich"],
    conditions: {
      minQuantity: 1
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 jours
    isActive: true,
    usageLimit: null,
    usedCount: 0
  },
  {
    name: "5€ de réduction sur les salades",
    description: "Économisez 5€ sur votre commande de salades",
    type: "fixed",
    value: 5,
    minOrder: 20,
    applicableCategories: ["salad"],
    conditions: {
      minQuantity: 1
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 jours
    isActive: true,
    usageLimit: 75,
    usedCount: 0
  },
  {
    name: "Menu Sandwichs - 15% de réduction",
    description: "Profitez de 15% de réduction sur tous nos sandwichs",
    type: "percentage",
    value: 15,
    minOrder: 12,
    maxDiscount: 8,
    applicableCategories: ["sandwich"],
    conditions: {
      minQuantity: 1
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 jours
    isActive: true,
    usageLimit: 60,
    usedCount: 0
  }
];

async function seedPromotions() {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://itachielqar_db_user:UZvFCbAOQCmuvIIP@cluster0.yylun0z.mongodb.net/fastfood';
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Vérifier s'il y a déjà des promotions
    const existingPromotions = await Promotion.countDocuments();
    console.log(`📊 ${existingPromotions} promotions existantes trouvées`);

    if (existingPromotions > 0) {
      console.log('⚠️  Des promotions existent déjà. Voulez-vous les supprimer et les remplacer ?');
      console.log('   Pour supprimer les promotions existantes, décommentez les lignes suivantes dans le script');
      
      // Décommentez ces lignes si vous voulez supprimer les promotions existantes
      // await Promotion.deleteMany({});
      // console.log('🗑️  Promotions existantes supprimées');
    }

    // Insérer les nouvelles promotions
    const insertedPromotions = await Promotion.insertMany(promotionsData);
    console.log(`✅ ${insertedPromotions.length} promotions ajoutées avec succès`);

    // Afficher un résumé
    console.log('\n📋 Résumé des promotions ajoutées :');
    insertedPromotions.forEach((promotion, index) => {
      console.log(`${index + 1}. ${promotion.name} (${promotion.type})`);
    });

    console.log('\n🎉 Script terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des promotions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
seedPromotions();
