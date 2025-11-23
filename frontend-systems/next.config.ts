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
};

export default nextConfig;
