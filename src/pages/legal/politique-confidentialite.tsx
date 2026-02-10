import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/common/PageTransition';

const PolitiqueConfidentialite: NextPage = () => {
  return (
    <PageTransition>
    <>
      <Head>
        <title>Politique de Confidentialité - Le Neuf</title>
        <meta name="description" content="Politique de confidentialité du site Le Neuf" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Politique de Confidentialité
            </h1>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Collecte des données
              </h2>
              <p className="text-gray-600 mb-6">
                Nous collectons les données personnelles que vous nous fournissez volontairement lors de :
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>La création de votre compte utilisateur</li>
                  <li>Le passage de commande</li>
                  <li>L'inscription à notre newsletter</li>
                  <li>Le contact avec notre service client</li>
                </ul>
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Types de données collectées
              </h2>
              <p className="text-gray-600 mb-6">
                Les données que nous collectons incluent :
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse de livraison</li>
                  <li>Préférences alimentaires</li>
                </ul>
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Utilisation des données
              </h2>
              <p className="text-gray-600 mb-6">
                Vos données personnelles sont utilisées pour :
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>Traiter vos commandes</li>
                  <li>Vous contacter concernant votre commande</li>
                  <li>Améliorer nos services</li>
                  <li>Vous envoyer des offres promotionnelles (avec votre consentement)</li>
                </ul>
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Partage des données
              </h2>
              <p className="text-gray-600 mb-6">
                Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers, 
                sauf dans les cas suivants :
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>Avec votre consentement explicite</li>
                  <li>Pour respecter une obligation légale</li>
                  <li>Avec nos prestataires de services (livreurs, paiement) dans le cadre strict de leur mission</li>
                </ul>
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Vos droits
              </h2>
              <p className="text-gray-600 mb-6">
                Conformément au RGPD, vous disposez des droits suivants :
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification</li>
                  <li>Droit d'effacement</li>
                  <li>Droit à la portabilité</li>
                  <li>Droit d'opposition</li>
                </ul>
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Contact
              </h2>
              <p className="text-gray-600 mb-6">
                Pour exercer vos droits ou pour toute question concernant cette politique de confidentialité :
                <br />
                Email : privacy@leneuf.fr
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link 
                href="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
    </PageTransition>
  );
};

export default motion(PolitiqueConfidentialite);
