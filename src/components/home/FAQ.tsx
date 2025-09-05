import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Quelle est la zone de livraison ?",
    answer: "Nous livrons dans un rayon de 5km autour de nos restaurants. La zone de livraison couvre Paris et certaines communes limitrophes. Vous pouvez vérifier si vous êtes dans notre zone de livraison en entrant votre adresse lors de la commande."
  },
  {
    question: "Quel est le délai de livraison moyen ?",
    answer: "Notre délai de livraison moyen est de 25-30 minutes. Pendant les heures de pointe, le délai peut être légèrement plus long. Vous pouvez suivre votre commande en temps réel via notre application."
  },
  {
    question: "Proposez-vous des options végétariennes ?",
    answer: "Oui ! Nous avons une sélection variée de plats végétariens. Vous trouverez des salades, des burgers végétariens et d'autres options dans notre menu. Tous nos plats végétariens sont clairement indiqués."
  },
  {
    question: "Comment puis-je payer ?",
    answer: "Nous acceptons plusieurs moyens de paiement : cartes bancaires, Apple Pay, Google Pay, et espèces à la livraison. Pour les commandes en ligne, le paiement se fait de manière sécurisée au moment de la commande."
  }
];

export default function FAQ() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-playfair font-bold mb-4"
        >
          Questions fréquentes
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary max-w-2xl mx-auto"
        >
          Retrouvez les réponses aux questions les plus courantes
        </motion.p>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-4"
          >
            <button
              onClick={() => setActiveId(activeId === index ? null : index)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-surface-alt transition-colors"
            >
              <span className="font-medium text-left">{faq.question}</span>
              <ChevronDown 
                className={`w-5 h-5 text-text-secondary transition-transform ${
                  activeId === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {activeId === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 text-text-secondary bg-surface-alt rounded-b-lg">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}