import { useState } from 'react';
import { X, User, Clock, Gift, Shield, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import Link from 'next/link';

interface AccountCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
}

export default function AccountCreationModal({ isOpen, onClose, onSkip }: AccountCreationModalProps) {
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const advantages = [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Commandes plus rapides",
      description: "Vos informations sont sauvegardées pour commander en 2 clics"
    },
    {
      icon: <Gift className="w-6 h-6 text-green-500" />,
      title: "Offres exclusives",
      description: "Recevez des promotions spéciales et des codes de réduction"
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: "Suivi de commande",
      description: "Suivez votre commande en temps réel et recevez des notifications"
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: "Programme de fidélité",
      description: "Gagnez des points à chaque commande et obtenez des récompenses"
    }
  ];

  const handleCreateAccount = () => {
    setIsCreating(true);
    // Rediriger vers la page d'inscription
    window.location.href = '/auth/register?redirect=/checkout';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Créez votre compte
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Et profitez d'avantages exclusifs !
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Avantages */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pourquoi créer un compte ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0">
                    {advantage.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {advantage.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Avantages supplémentaires */}
          <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Création de compte gratuite et rapide
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Inscription en moins de 30 secondes</li>
              <li>• Aucun frais caché, c'est 100% gratuit</li>
              <li>• Vos données sont protégées et sécurisées</li>
              <li>• Vous pouvez supprimer votre compte à tout moment</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCreateAccount}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              loading={isCreating}
            >
              {isCreating ? 'Redirection...' : 'Créer mon compte (gratuit)'}
            </Button>
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex-1"
            >
              Continuer sans compte
            </Button>
          </div>

          {/* Lien de connexion */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vous avez déjà un compte ?{' '}
              <Link
                href="/auth/login?redirect=/checkout"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Se connecter
              </Link>
            </p>
          </div>

          {/* Note de confidentialité */}
          <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              En créant un compte, vous acceptez nos{' '}
              <Link href="/legal/conditions-generales" className="underline hover:text-gray-700 dark:hover:text-gray-300">
                conditions d'utilisation
              </Link>
              {' '}et notre{' '}
              <Link href="/legal/politique-confidentialite" className="underline hover:text-gray-700 dark:hover:text-gray-300">
                politique de confidentialité
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
