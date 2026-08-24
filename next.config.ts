import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next"

const withSerwist = withSerwistInit({
  swSrc: "src/service-worker/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default withSerwist(nextConfig);
