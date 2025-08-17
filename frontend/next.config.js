/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js']
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
