import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sheets', // substitua pelo caminho da sua página desejada
        permanent: true, // true para redirecionamento 308, melhor para SEO
      },
    ]
  },
  allowedDevOrigins: [
    '192.168.3.54',
    '192.168.3.213', // The specific IP that was blocked
    // You can add other development origins here if needed
  ],
};

export default nextConfig;
