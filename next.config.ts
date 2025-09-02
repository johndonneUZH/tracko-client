import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  async rewrites() {
    return isProd
      ? [
          // PRODUCCIÓN (Vercel) → proxy a tu backend en casa
          { source: "/api/:path*", destination: "http://antonlee.dedyn.io:8080/:path*" },
        ]
      : [
          // DESARROLLO local → proxy a tu backend local
          { source: "/api/:path*", destination: "http://antonlee.dedyn.io:8080/:path*" },
        ];
  },
};

export default nextConfig;
