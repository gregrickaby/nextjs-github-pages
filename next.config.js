// @ts-check

/**
 * The repository slug. Change this to match your repository!
 *
 * Use slug in production but don't for local development.
 *
 * @example https://github.com/username/nextjs-github-pages
 */
const repoPath =
  process.env.NODE_ENV === "production" ? "/nextjs-github-pages" : "";

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  /**
   * Enable static exports for the App Router.
   *
   * @see https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
   */
  output: "export",

  /**
   * Set base path. This is usually the name of your repository.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: repoPath,

  /**
   * Automatically prefix all asset URLs with the base path.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/assetPrefix
   */
  assetPrefix: repoPath,

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
