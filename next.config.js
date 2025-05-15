/** @type {import('next').NextConfig} */
const nextConfig = {
  output:"export",
  images: {
    domains: ['utfs.io'], // ← Add correct CDN if used
  },
    
};

module.exports = nextConfig;
