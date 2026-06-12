import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The three soap illustrations are our own static SVGs.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
