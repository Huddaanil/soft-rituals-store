import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The three soap illustrations are our own static SVGs.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Product photos uploaded through the owner panel live in Supabase Storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "famgmcdoximypahdbqzn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
