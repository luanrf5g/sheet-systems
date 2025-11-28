import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard', // substitua pelo caminho da sua página desejada
        permanent: true, // true para redirecionamento 308, melhor para SEO
      },
    ]
  },
  allowedDevOrigins: [
    '192.168.3.54',
    '192.168.3.213',
    '192.168.1.106',
    '192.168.56.2',
    '192.168.3.213'
  ],
};

export default nextConfig;
