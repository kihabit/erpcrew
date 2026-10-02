import type { NextConfig } from "next";

const apiUrl =
  process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000";

const apiHost = new URL(apiUrl);
const isLocalApiHost = ["127.0.0.1", "localhost", "::1"].includes(
  apiHost.hostname
);

const nextConfig: NextConfig = {
  // output: "export",

  images: {
   // unoptimized: true,
    remotePatterns: [
      {
        protocol: apiHost.protocol === "https:" ? "https" : "http",
        hostname: apiHost.hostname,
        port: apiHost.port,
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
    ...(isLocalApiHost ? { dangerouslyAllowLocalIP: true } : {}),
  },

  experimental: {
    cpus: 1,
  },
};

export default nextConfig;