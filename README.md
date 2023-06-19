# Next.js Github Pages

Deploy Next.js to Github Pages with Github Actions.

👉 [View the deployed app](https://gregrickaby.github.io/nextjs-github-pages/) 🚀

Now with Next.js 13 App Router support! If you're looking for Pages Router support [click here](https://github.com/gregrickaby/nextjs-github-pages/releases/tag/pages_dir).

---

## Configure Next.js

> ⚠️ Heads up! Github Pages _does not_ support serverless or edge functions. This means dynamic functionality will be disabled. [Learn more](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#unsupported-features)

First, you need to configure Next.js to support static exports. To do this, specifiy the output type as `export`, set the base path, and disable automatic image optimization [since dynamic features don't work](https://nextjs.org/blog/next-12-3#disable-image-optimization-stable) with static exports.

1. Create `next.config.js` file
2. Add the following:

```js[class="line-numbers"]
// @ts-check

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
   * Set base path for GitHub Pages.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: "/nextjs-github-pages",

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
```

3. Save the `next.config.js`

4. Finally, place a `.nojekyll` file in the `/public` directory to disable Github Pages from trying to create a [Jekyll](https://github.blog/2009-12-29-bypassing-jekyll-on-github-pages/) website.

```treeview
.
├── app/
├── public/
│   └── .nojekyll
├── next.config.js
```

Perfect! This is all you need to configure Next.js to work on Github Pages.

> Heads up! Github Pages _does not_ support serverless or edge functions. This means dynamic functionality will be disabled. [Learn more](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#unsupported-features)

---

## Configure Github Repository

Next you need to configure Github for automated deployments via Github Actions.

### Enable Github Pages

Next up, you need to enable Github Pages for your repository. This is where your app will be deployed.

The following settings use the new [Github Action Workflow (beta)](https://github.blog/changelog/2022-07-27-github-pages-custom-github-actions-workflows-beta/) to deploy. I prefer this workflow because you don't need to generate SSH keys or use a personal access token.

1. Go to your repository's **Settings** tab
2. Click "Pages" in the sidebar
3. Under "Build and Deployment", select "Github Actions" as the source:

### Setup Github Action

This is where the magic happens! The [workflow file](https://github.com/gregrickaby/nextjs-github-pages/blob/main/.github/workflows/deploy.yml) was automatically generated when I enabled Github Actions as the method for generating pages. This workflow will automatically build and deploy the app when you push to the `main` branch.

I needed to slightly modify the auto-generated workflow file since it doesn't appear to support the `App` router.

1. Create `.github/workflows/deploy.yml` file
2. Paste the contents of <https://github.com/gregrickaby/nextjs-github-pages/blob/main/.github/workflows/deploy.yml>
3. Save the `deploy.yml` file

### Push to Github

Now that everything is configured, you can push your code to Github. This will trigger the Github Action workflow and deploy your app to Github Pages.

```bash
git add . && git commit -m "Initial commit" && git push
```

You should see your site deployed to Github Pages in a few minutes. 🚀

---

## Wrap up

Thanks for reading and I hope this helps. If you noticed someting wrong, please [file an issue](https://github.com/gregrickaby/nextjs-github-pages/issues). Good luck! 🍻

---
