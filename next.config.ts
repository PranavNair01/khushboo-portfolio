import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    loader: "custom",
    loaderFile: "./sanity/lib/image-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        // Leave CSS Modules alone; rewriting them as "*.css" would strip their scoping.
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
