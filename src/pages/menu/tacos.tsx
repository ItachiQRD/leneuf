import Head from 'next/head';
import TacosOrderForm from '@/components/menu/tacos/TacosOrderForm';

export default function TacosPage() {
  return (
    <>
      <Head>
        <title>Le Neuf - Composer votre Tacos | Menu</title>
        <meta
          name="description"
          content="Composez votre tacos sur mesure avec nos viandes, sauces et extras."
        />
      </Head>

      <main className="min-h-screen bg-background py-8 mt-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-playfair font-bold text-center mb-8">
            Composez votre Tacos
          </h1>
          <TacosOrderForm />
        </div>
      </main>
    </>
  );
}