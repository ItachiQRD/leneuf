import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const ConditionsGenerales: NextPage = () => {
  return (
    <>
      <Head>
        <title>Conditions Générales de Vente - Le Neuf</title>
        <meta name="description" content="Conditions générales de vente du site Le Neuf" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Conditions Générales de Vente
            </h1>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Article 1 - Objet
              </h2>
              <p className="text-gray-600 mb-6">
                Les présentes conditions générales de vente régissent les relations contractuelles entre Le Neuf 
                et ses clients pour la vente de produits de restauration rapide.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Article 2 - Commandes
              </h2>
              <p className="text-gray-600 mb-6">
                Les commandes sont passées via notre site web ou application mobile. 
                Toute commande implique l'acceptation pleine et entière des présentes conditions générales.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Article 3 - Prix
              </h2>
              <p className="text-gray-600 mb-6">
                Les prix indiqués sur le site sont exprimés en euros TTC. 
                Ils peuvent être modifiés à tout moment sans préavis.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Article 4 - Paiement
              </h2>
              <p className="text-gray-600 mb-6">
                Le paiement s'effectue en ligne par carte bancaire ou via PayPal. 
                Le paiement est exigible à la commande.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Article 5 - Livraison
              </h2>
              <p className="text-gray-600 mb-6">
                Les délais de livraison sont donnés à titre indicatif. 
                En cas de retard, nous nous efforcerons de vous en informer.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Article 6 - Retour et remboursement
              </h2>
              <p className="text-gray-600 mb-6">
                En raison de la nature périssable de nos produits, aucun retour n'est accepté. 
                En cas de problème avec votre commande, contactez-nous dans les plus brefs délais.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Article 7 - Responsabilité
              </h2>
              <p className="text-gray-600 mb-6">
                Notre responsabilité ne saurait être engagée en cas de force majeure ou d'événements 
                indépendants de notre volonté.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Article 8 - Droit applicable
              </h2>
              <p className="text-gray-600 mb-6">
                Les présentes conditions sont soumises au droit français. 
                Tout litige sera de la compétence exclusive des tribunaux français.
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

export default ConditionsGenerales;
