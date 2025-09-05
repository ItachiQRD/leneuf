import Link from 'next/link';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail,
  Clock
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  const contactInfo = [
    { 
      icon: MapPin, 
      text: '123 Avenue Example, 75001 Paris',
      href: 'https://goo.gl/maps/example' 
    },
    { 
      icon: Phone, 
      text: '01 23 45 67 89',
      href: 'tel:0123456789' 
    },
    { 
      icon: Mail, 
      text: 'contact@leneuf.fr',
      href: 'mailto:contact@leneuf.fr' 
    },
    {
      icon: Clock,
      text: 'Lun-Dim: 11h00 - 23h00',
      href: undefined
    }
  ];

  return (
    <footer className="bg-surface border-t border-border-light">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Logo et description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-playfair font-bold text-primary">
              Le Neuf
            </h2>
            <p className="text-text-secondary text-sm max-w-xs">
              Une expérience culinaire unique dans un cadre moderne et chaleureux. 
              La fusion parfaite entre tradition et innovation.
            </p>
          </div>

          {/* Navigation rapide */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {['Menu', 'À propos', 'Contact', 'Réservation'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase()}`}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations de contact */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">
              Contact
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <item.icon className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    {item.href ? (
                      <a 
                        href={item.href}
                        className="text-text-secondary hover:text-primary transition-colors"
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-text-secondary">{item.text}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter et réseaux sociaux */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">
              Suivez-nous
            </h3>
            <div className="space-y-6">
              {/* Newsletter */}
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-2 text-sm border border-border-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm"
                >
                  S'inscrire à la newsletter
                </button>
              </form>

              {/* Réseaux sociaux */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="p-2 text-text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-alt"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border-light">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-tertiary text-sm">
              © {currentYear} Le Neuf. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              {['Mentions légales', 'Politique de confidentialité', 'CGV'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-text-tertiary hover:text-primary transition-colors text-sm"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;