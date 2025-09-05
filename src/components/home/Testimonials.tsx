import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sophie Martin",
    role: "Cliente fidèle",
    image: "/images/testimonials/client1.jpg",
    content: "Les meilleurs burgers du quartier ! La livraison est toujours rapide et la nourriture arrive chaude. Je recommande particulièrement leur sauce signature.",
    rating: 5
  },
  {
    id: 2,
    name: "Thomas Dubois",
    role: "Client régulier",
    image: "/images/testimonials/client2.jpg",
    content: "Un rapport qualité-prix imbattable. Les portions sont généreuses et les ingrédients toujours frais. Le service est également excellent.",
    rating: 5
  },
  {
    id: 3,
    name: "Marie Laurent",
    role: "Cliente occasionnelle",
    image: "/images/testimonials/client3.jpg",
    content: "Je recommande particulièrement leurs options végétariennes. Les salades sont délicieuses et créatives. La livraison est toujours ponctuelle.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-playfair font-bold mb-4"
        >
          Avis de nos clients
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-text-secondary max-w-2xl mx-auto"
        >
          Découvrez les avis de nos clients satisfaits et rejoignez notre communauté de gourmets
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                <p className="text-text-secondary text-sm">{testimonial.role}</p>
              </div>
            </div>
            
            <div className="flex mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star 
                  key={i} 
                  className="w-5 h-5 text-warning fill-current" 
                />
              ))}
            </div>
            
            <p className="text-text-secondary italic">"{testimonial.content}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}