import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The site is served as plain files from Hostinger, so the build writes a
   * finished `out/` folder rather than something that needs a Node process.
   *
   * Nothing on the site needs a server: content is read from Supabase in the
   * visitor's browser, the inquiry form posts straight to Apps Script, and
   * /studio signs in against Supabase Auth. See docs/HOSTINGER.md.
   *
   * Routes keep their clean shape (/services, not /services/). Apache is told
   * how to resolve those to the exported .html by public/.htaccess.
   */
  output: "export",

  /* Every image on the site is a plain <img> from /public; there is no
     optimiser to run at request time. */
  images: { unoptimized: true },
};

export default nextConfig;
