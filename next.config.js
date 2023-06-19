// @ts-check

const isProd = process.env.NODE_ENV === "production";

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  /**
   * Enable static exports for App Router.
   *
   * @see https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
   */
  output: "export",

  /**
   * Tell Next.js where the `public` folder is.
   * Replace `nextjs-github-pages` with your Github repo project name.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/assetPrefix
   */
  assetPrefix: isProd ? "/nextjs-github-pages/" : "",

  /**
   * Disable server-based image optimization.
   *
   * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
