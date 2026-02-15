/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'via.placeholder.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
  // Éviter le cache agressif du logo pour que les mises à jour soient visibles sans navigation privée
  async headers() {
    return [
      {
        source: '/images/logo.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  // Permettre les uploads > 1 Mo (limite par défaut Next.js)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    proxyClientMaxBodySize: '10mb',
  },
}

module.exports = nextConfig;
