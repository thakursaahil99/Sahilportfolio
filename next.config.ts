import type { NextConfig } from "next";
import { OLD_HOSTS, SITE_URL } from "./src/lib/site";

const nextConfig: NextConfig = {
  // one address for search engines: the old production hosts move permanently to SITE_URL
  async redirects() {
    return OLD_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `${SITE_URL}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
