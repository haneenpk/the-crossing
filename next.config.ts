import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The hero poster is the LCP element and covers the entire viewport, so
    // the default quality of 75 is visibly soft on the city lights. Next 16
    // only permits quality values listed here.
    qualities: [75, 92],
  },
};

export default nextConfig;
