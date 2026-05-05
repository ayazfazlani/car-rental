const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dynamic metadataBase (better for multiple domains)
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://oneclickrentcar.com'),

  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://oneclickrentcar.com',
  },
  async redirects() {
    return [
      {
        source: '/cars/hyundai-staria-2025-11-s-staria-2025-11-s-2025',
        destination: '/cars/hyundai-staria-11s-staria-11s-2025',
        permanent: true,
      },
      {
        source: '/cars/lamborghini-hurricane-evo-spyder-lamborghini-hurricane-evo-spyder-2024',
        destination: '/cars/lamborghini-huracan-evo-spyder-evo-spyder-2022',
        permanent: true,
      },
      {
        source: '/cars/lamborghini-urus-2025-urus-2025-2025',
        destination: '/cars/lamborghini-urus-urus-2024',
        permanent: true,
      },
      {
        source: '/cars/hyundai-kona-2023-kona-2023-2023',
        destination: '/cars/hyundai-kona-kona-2023',
        permanent: true,
      },
      {
        source: '/cars/range-rover-sport-2020',
        destination: '/brands/range-rover',
        permanent: true,
      },
      {
        source: '/cars/mercedes-benz-maybach-s650-2020-benz-maybach-s650-2020-2020',
        destination: '/brands/mercedes',
        permanent: true,
      },
      {
        source: '/cars/range-rover-sport-sport-2022-2022',
        destination: '/brands/range-rover',
        permanent: true,
      },
      {
        source: '/cars/mercedes-benz-s500-2024-s500-2024-2024',
        destination: '/brands/mercedes',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/cars?hasChauffeur=true',
        permanent: true,
      },
      {
        source: '/bmw-m4-competition-2024',
        destination: '/brands/bmw',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/company/contact',
        permanent: true,
      },
      {
        source: '/cars/audi-r8-v10-performance-2023',
        destination: '/cars/audi-r8-v10-performance-2024',
        permanent: true,
      },
      {
        source: '/cars/mercedes-benz-maybach-s650-2020-benz-maybach-s650-2020-2020',
        destination: '/brands/mercedes',
        permanent: true,
      },
      {
        source: '/our-cars',
        destination: '/',
        permanent: true,
      },
      {
        source: '/cars/mercedes-benz-maybach-v300-2023-maybach-v300-2023-2023',
        destination: '/brands/mercedes',
        permanent: true,
      },
      {
        source: '/cars/bentley-continental-gtc-speed-v12-2024-2024',
        destination: '/cars/bentley-continental-gtc-speed-v12-continental-gtc-speed-v12-2024',
        permanent: true,
      },
    ];
  },

  experimental: {
    // serverActions is enabled by default in Next.js 16
  },

  turbopack: {},

  // ==================== IMAGE CONFIG ====================
  images: {
    unoptimized: true,           // ← This fixes your blog image issue
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oneclickrentcar.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "oneclickrentcar.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3002",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "luxuscarrental.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "luxuscarrental.com",
        pathname: "/uploads/**",
      },
    ],
  },
  // =====================================================

  // Headers
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
      // Add static cache headers for uploads (helps with new images)
      {
        source: "/uploads/:all*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, immutable" }, // 30 days
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);