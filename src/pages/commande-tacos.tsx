import Head from 'next/head';
import TacosOrderForm from '@/components/menu/tacos/TacosOrderForm';

export default function CommandeTacosPage() {
  return (
    <>
      <Head>
        <title>Le 9 - Composez votre Tacos | Commande</title>
        <meta
          name="description"
          content="Composez votre tacos ou bowl sur mesure avec nos viandes, sauces et extras. Personnalisez votre commande selon vos goûts."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-light text-gray-900 mb-6 font-serif">
              Composez votre <span className="text-orange-600">Tacos</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Personnalisez votre tacos ou bowl selon vos envies avec nos ingrédients frais
            </p>
          </div>
          <TacosOrderForm />
        </div>
      </main>
    </>
  );
}
