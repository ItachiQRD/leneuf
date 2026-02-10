import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const MentionsLegales: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mentions Légales - Le Neuf</title>
        <meta name="description" content="Mentions légales du site Le Neuf" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Mentions Légales
            </h1>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Informations générales
              </h2>
              <p className="text-gray-600 mb-6">
                Le présent site web est édité par Le Neuf, société de restauration rapide.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Hébergement
              </h2>
              <p className="text-gray-600 mb-6">
                Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Propriété intellectuelle
              </h2>
              <p className="text-gray-600 mb-6">
                L'ensemble du contenu de ce site (textes, images, vidéos, etc.) est protégé par le droit d'auteur.
                Toute reproduction ou utilisation sans autorisation est interdite.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Données personnelles
              </h2>
              <p className="text-gray-600 mb-6">
                Les données personnelles collectées sur ce site sont traitées conformément à notre politique de confidentialité.
                Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Contact
              </h2>
              <p className="text-gray-600 mb-6">
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter à l'adresse suivante :
                <br />
                Email : contact@leneuf.fr
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
  );
};

export default MentionsLegales;
