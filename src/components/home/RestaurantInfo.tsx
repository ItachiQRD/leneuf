import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Buttons';

export default function RestaurantInfo() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-playfair font-bold">Notre Restaurant</h2>
            <p className="text-text-secondary">
              Découvrez notre cuisine authentique dans un cadre moderne et chaleureux.
              Service sur place, à emporter ou en livraison.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Adresse</h3>
                <p className="text-text-secondary">123 Avenue Exemple, 75009 Paris</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Horaires</h3>
                <p className="text-text-secondary">Lundi - Dimanche : 11h00 - 23h00</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Téléphone</h3>
                <a href="tel:0123456789" className="text-text-secondary hover:text-primary">
                  01 23 45 67 89
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <a href="mailto:contact@leneuf.fr" className="text-text-secondary hover:text-primary">
                  contact@leneuf.fr
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1">
              Commander maintenant
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              Voir la carte
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
        >
          <Image
            src="/images/restaurant-interior.jpg"
            alt="Intérieur du restaurant Le Neuf"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
}