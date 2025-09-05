import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Utensils, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Buttons';
import { Select } from '@/components/ui/Select';

export function OrderSection() {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');

  return (
    <div className="bg-surface py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-playfair font-bold mb-4">
              Commander maintenant
            </h2>
            <p className="text-text-secondary">
              Livraison rapide ou retrait en restaurant
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            <Button
              variant={orderType === 'delivery' ? 'default' : 'ghost'}
              onClick={() => setOrderType('delivery')}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Livraison
            </Button>
            <Button
              variant={orderType === 'pickup' ? 'default' : 'ghost'}
              onClick={() => setOrderType('pickup')}
              className="flex items-center gap-2"
            >
              <Utensils className="w-4 h-4" />
              À emporter
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            {orderType === 'delivery' ? (
              <div className="space-y-4">
                <Input
                  placeholder="Votre adresse de livraison"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Délai de livraison"
                    options={[
                      { value: 'asap', label: 'Au plus tôt' },
                      { value: '30min', label: 'Dans 30 min' },
                      { value: '60min', label: 'Dans 1h' }
                    ]}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Select
                  label="Restaurant"
                  options={[
                    { value: 'paris9', label: 'Paris 9ème' },
                    { value: 'paris11', label: 'Paris 11ème' }
                  ]}
                />
                <Select
                  label="Heure de retrait"
                  options={[
                    { value: 'asap', label: 'Au plus tôt' },
                    { value: '15min', label: 'Dans 15 min' },
                    { value: '30min', label: 'Dans 30 min' }
                  ]}
                />
              </div>
            )}

            <div className="mt-6">
              <Button className="w-full" size="lg">
                Voir le menu et commander
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: ShoppingBag,
                title: 'Livraison rapide',
                description: '30 minutes en moyenne'
              },
              {
                icon: Clock,
                title: 'Horaires',
                description: '11h - 23h, 7j/7'
              },
              {
                icon: MapPin,
                title: 'Zone de livraison',
                description: 'Paris et proche banlieue'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-text-secondary text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}