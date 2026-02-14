/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'res.cloudinary.com'],
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
