const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // serverActions is enabled by default in Next.js 16
  },
  // Turbopack config (empty - using defaults)
  // Developer Mode is enabled, so symlinks work without issues
  turbopack: {},
  images: {
    remotePatterns: [
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
      {
        protocol: "http",
        hostname: "localhost:3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "oneclickrentcar.com",
        pathname: "/uploads/**",
      },

      {
        protocol: "http",
        hostname: "localhost:3002",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "oneclickrentcar.com",
        pathname: "/uploads/**",
      },
    ],
  },
  // API routes configuration
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
    ];
  },
};

module.exports = withNextIntl(nextConfig);
