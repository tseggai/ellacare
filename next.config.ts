import type { NextConfig } from "next";

// Old WordPress URLs → new routes, so existing links and search rankings keep working.
const legacy: Record<string, string> = {
  "/about-us": "/about",
  "/contact-us": "/contact",
  "/menus": "/dining",
  "/security": "/safety",
  "/policy": "/safety",
  "/feed": "/",
};

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  async redirects() {
    return [
      ...Object.entries(legacy).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      ...["wp-content", "wp-includes", "wp-admin", "wp-json"].map((dir) => ({
        source: `/${dir}/:path*`,
        destination: "/",
        permanent: true,
      })),
      { source: "/xmlrpc.php", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
