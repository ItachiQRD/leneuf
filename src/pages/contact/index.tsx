import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/Buttons';
import { Input } from '@/components/ui/Input';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const heroRef = useRef(null);
  const contactRef = useRef(null);
  const faqRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const contactInView = useInView(contactRef, { once: true, amount: 0.2 });
  const faqInView = useInView(faqRef, { once: true, amount: 0.2 });

  const heroY = useTransform(smoothProgress, [0, 0.5], [0, -100]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi (remplacer par vraie API)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Contact - LE NEUF | Fast Food & Grill</title>
        <meta 
          name="description" 
          content="Contactez LE NEUF, votre restaurant de fast-food à Reims. Nous sommes là pour répondre à toutes vos questions." 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
        {/* Hero Section avec parallax */}
        <motion.section 
          ref={heroRef}
          className="relative h-screen flex items-center justify-center overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Background animé */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-orange-600">
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                backgroundSize: '200% 200%',
              }}
            />
          </div>

          {/* Éléments décoratifs animés */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 bg-white/10 rounded-full blur-2xl"
              style={{
                left: `${20 + i * 20}%`,
                top: `${30 + i * 15}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}

          {/* Contenu principal */}
          <motion.div 
            className="relative z-10 text-center text-white px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="mb-8"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <MessageSquare className="w-24 h-24 mx-auto text-yellow-300" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 font-serif"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Contactez-<span className="text-yellow-300 font-bold">Nous</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl text-red-100 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Nous sommes là pour vous aider et répondre à vos questions
            </motion.p>

            {/* Indicateur de scroll */}
            <motion.div
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <ArrowRight className="w-8 h-8 rotate-90 text-white opacity-70" />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Contact Info & Form */}
        <motion.section 
          ref={contactRef}
          className="py-24 relative overflow-hidden"
        >
          {/* Background décoratif */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-30"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 50, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, -30, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
              }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="grid lg:grid-cols-2 gap-12"
              initial={{ opacity: 0 }}
              animate={contactInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              {/* Informations de Contact */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-8"
                  whileHover={{ scale: 1.05 }}
                >
                  Nos Coordonnées
                </motion.h2>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: MapPin,
                      title: "Adresse",
                      content: (
                        <>
                          9 route de Bétheny<br />
                          51100 Reims, France
                        </>
                      ),
                      color: "from-red-500 to-pink-500",
                      delay: 0
                    },
                    {
                      icon: Phone,
                      title: "Téléphone",
                      content: (
                        <a href="tel:0326407967" className="hover:text-red-600 transition-colors">
                          03 26 40 79 67
                        </a>
                      ),
                      color: "from-blue-500 to-cyan-500",
                      delay: 0.1
                    },
                    {
                      icon: Mail,
                      title: "Email",
                      content: (
                        <a href="mailto:contact@le9.fr" className="hover:text-red-600 transition-colors">
                          contact@le9.fr
                        </a>
                      ),
                      color: "from-green-500 to-emerald-500",
                      delay: 0.2
                    },
                    {
                      icon: Clock,
                      title: "Horaires d'Ouverture",
                      content: (
                        <div className="space-y-1">
                          <p>Lun - Jeu : 11h - 14h30 & 18h - 23h</p>
                          <p>Ven - Dim : 18h - 23h</p>
                        </div>
                      ),
                      color: "from-orange-500 to-amber-500",
                      delay: 0.3
                    }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        initial={{ opacity: 0, y: 30 }}
                        animate={contactInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: item.delay }}
                        whileHover={{ scale: 1.02, x: 10 }}
                      >
                        <motion.div
                          className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600">
                            {item.content}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Carte */}
                <motion.div
                  className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={contactInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Navigation className="w-5 h-5 mr-2 text-red-600" />
                    Nous Trouver
                  </h3>
                  <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
                    <iframe
                      src="https://www.google.com/maps?q=9+Route+de+B%C3%A9theny,+51100+Reims,+France&output=embed&z=16"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                      title="Localisation Le 9 Restaurant - 9 route de Bétheny, 51100 Reims"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Formulaire de Contact */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-8"
                  whileHover={{ scale: 1.05 }}
                >
                  Envoyez-nous un Message
                </motion.h2>

                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={contactInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                    >
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                        className="w-full"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="votre@email.com"
                        className="w-full"
                      />
                    </motion.div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                    >
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="06 12 34 56 78"
                        className="w-full"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                    >
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Sujet de votre message"
                        className="w-full"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre demande..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    />
                  </motion.div>

                  {/* Status Messages */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-xl border-2 border-green-200"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Message envoyé avec succès ! Nous vous répondrons bientôt.</span>
                      </motion.div>
                    )}

                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border-2 border-red-200"
                      >
                        <AlertCircle className="w-5 h-5" />
                        <span>Erreur lors de l'envoi. Veuillez réessayer.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Envoyer le Message</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          ref={faqRef}
          className="py-24 bg-white relative overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Questions Fréquentes
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Trouvez rapidement les réponses à vos questions
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Quels sont vos horaires d'ouverture ?",
                  answer: "Nous sommes ouverts du lundi au jeudi de 11h à 14h30 et de 18h à 23h, vendredi et samedi de 18h à 23h, et le dimanche de 18h à 23h."
                },
                {
                  question: "Proposez-vous la livraison ?",
                  answer: "Oui, nous proposons la livraison dans un rayon de 5km autour du restaurant. Les frais de livraison sont de 3€, et la livraison est gratuite pour les commandes de plus de 50€."
                },
                {
                  question: "Acceptez-vous les commandes en ligne ?",
                  answer: "Absolument ! Vous pouvez commander directement sur notre site web et récupérer votre commande au restaurant ou opter pour la livraison."
                },
                {
                  question: "Avez-vous des options végétariennes ?",
                  answer: "Oui, nous proposons plusieurs options végétariennes dans notre menu, notamment des burgers végétariens, des tacos aux légumes et des salades variées."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-red-200"
                  initial={{ opacity: 0, y: 30, rotateX: -10 }}
                  animate={faqInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                    </motion.div>
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed pl-11">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
