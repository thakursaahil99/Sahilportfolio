/** Public origin of the deployed site — used for metadata, sitemap and social previews. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sahil-thakur-dev.vercel.app").replace(/\/$/, "");

/** Earlier production addresses: they redirect (301) to SITE_URL so search engines see one site. */
export const OLD_HOSTS = ["sahilportfolio-tau.vercel.app", "sahilportfolio-sahilt.vercel.app"];
