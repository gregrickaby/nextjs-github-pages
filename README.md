# Next.js GitHub Pages

Deploy Next.js to GitHub Pages with GitHub Actions. [View the deployed app](https://gregrickaby.github.io/nextjs-github-pages/) 🚀

> ⚠️ Heads up! GitHub Pages _is not_ a Node.js server. So dynamic logic that cannot be computed during the build process, are not supported! See all the [unsupported features](https://nextjs.org/docs/app/building-your-application/deploying/static-exports#unsupported-features).

---

## Configure Next.js

### Next.js Config

First, you need to configure Next.js to [deploy static exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports). This is required for GitHub Pages to work.

1. Open the `next.config.ts` file
2. Add the following:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Enable static exports.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: "export",

  /**
   * Set base path. This is the slug of your GitHub repository.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: "/nextjs-github-pages",

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

3. Save the `next.config.ts`

4. Finally, place a `.nojekyll` file in the `/public` directory to disable GitHub Pages from trying to create a [Jekyll](https://github.blog/2009-12-29-bypassing-jekyll-on-github-pages/) website.

```treeview
.
├── app/
├── public/
│   └── .nojekyll
├── next.config.ts
```

Perfect! This is all you need to configure Next.js to deploy on GitHub Pages.

### Add base path to `page.tsx`

Next, you will need to add the base path to images in `page.tsx` file. This is required for the images to appear on GitHub Pages.

1. Open `app/page.tsx`
2. Find the `Image` components
3. Add `/nextjs-github-pages/` (or the slug of your GitHub repository) to the `src` prop:

```tsx
<Image
  src="/nextjs-github-pages/vercel.svg"
  alt="Vercel Logo"
  className={styles.vercelLogo}
  width={100}
  height={24}
  priority
/>
```

4. Save the `page.tsx` file

Learn more by reading the official documentation [for basePath and images](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath#images).

---

## Configure GitHub Repository

Now that Next.js is configured, you need to set up your GitHub repository to deploy to GitHub Pages.

### Setup GitHub Action

This is where the magic happens! This [workflow file](https://github.com/gregrickaby/nextjs-github-pages/blob/main/.github/workflows/deploy.yml) will automatically build and deploy the app when you push to the `main` branch.

1. Create `.github/workflows/deploy.yml` file
2. Paste the contents of <https://github.com/gregrickaby/nextjs-github-pages/blob/main/.github/workflows/deploy.yml>
3. Save the `deploy.yml` file

### Enable GitHub Pages

1. Go to your repository's **Settings** tab
2. Click "Pages" in the sidebar
3. Under "Build and Deployment", select "GitHub Actions" as the source:

![screenshot of github pages settings](https://dl.dropboxusercontent.com/s/vf74zv2wcepnt9w/Screenshot%202025-02-03%20at%2021.10.06.png?dl=0)

### Push to GitHub

Now that everything is configured, you can commit your code and push to GitHub. This will trigger the GitHub Action workflow and deploy your app to GitHub Pages.

```bash
git add . && git commit -m "initial commit" && git push
```

You should see your site deployed to GitHub Pages in a few minutes. 🚀

---

## Wrap up

Thanks for reading and I hope this helps. If you noticed something wrong, please [open an issue](https://github.com/gregrickaby/nextjs-github-pages/issues). Cheers! 🍻

---
