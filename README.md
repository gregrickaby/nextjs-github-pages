# Next.js Github Pages

Deploy Next.js to Github Pages with Github Actions. 👉 [View the deployed app](https://gregrickaby.github.io/nextjs-github-pages/)

---

Vercel promotes itself as _"The easiest way to deploy your Next.js app"_ and Netlify offers a similar service. However, both Vercel and Netlify really want you on _their platforms_. I'm interested in owning my own data and wanted to see if I could deploy a Next.js app to Github Pages.

During my research, **I've found very little documentation around deploying a static Next.js app to Github Pages.** I spent an entire Saturday working through it and want to share what I learned with you.

> Update: Vercel has since published an [official example](https://github.com/vercel/next.js/tree/canary/examples/github-pages). I recommend you take a look at the official example before making any major decisions.

---

## Configure Next.js

In order to get assets to display correctly, you'll need to prefix the assets directory. Additionally, you'll need to disable [automatic image optimization](https://nextjs.org/blog/next-12-3#disable-image-optimization-stable) since _dynamic features don't work_ when using `next export`.

1. Create `next.config.js` file
2. Add the following:

```js[class="line-numbers"]
// next.config.js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? '/your-github-repo-name/' : '',
  images: {
    unoptimized: true,
  },
}
```

3. Save the `next.config.js`

4. Finally, place a `.nojekyll` file in the `/public` directory to disable Github Pages from trying to create a [Jekyll](https://github.blog/2009-12-29-bypassing-jekyll-on-github-pages/) website.

```treeview
.
├── pages/
├── public/
│   └── .nojekyll
├── styles/
├── next.config.js
```

Perfect! This is all you need to configure Next.js to work on Github Pages.

> Heads up! Github Pages _does not_ support serverless functions. This means dynamic functionality will be disabled. [Learn more](https://nextjs.org/docs/advanced-features/static-html-export#unsupported-features)

---

## Configure Github Repository

Next you need to configure Github for automated deployments via Github Actions.

### Generate Deploy Keys

Before Github Actions can commit and push to the `gh-pages` branch, it needs to authenticate. You'll need to generate new Public and Private keys. _Don't worry, these new keys won't override your personal SSH keys._

In your Next.js app directory, run the following command:

```bash
ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f gh-pages -N ""
```

Open the keys in your code editor, because in a minute, you're going to copy and paste the contents into your Github repository settings.

### Setup Deploy Key

In your Github repository:

1. Go to **Settings --> Deploy Keys**
2. Add Title: `Public key of ACTIONS_DEPLOY_KEY`
3. Add Key: (paste the public key)
4. Check: Allow write access
5. Click: Add key

![screenshot of github deploy key setup](https://user-images.githubusercontent.com/200280/203811622-861c6c94-3f3a-4048-8e78-3cc50589c0bc.png)

### Setup Private Key

In your Github repository:

1. Go to **Settings --> Secrets --> Actions**
2. Add Click: Add a new secret
3. Add Name: `ACTIONS_DEPLOY_KEY`
4. Add Value: (paste the private key)
5. Click: Add key

![screenshot of github action secret key setup](https://user-images.githubusercontent.com/200280/203811897-6b8dcace-ba95-4b7b-86a7-84fbd951a98c.png)

Now Github Actions will be able to authenticate with your repository. You can safely delete the two keys from the Next.js app directory.

### Setup Github Actions

This is where the magic happens! The [workflow file](https://github.com/gregrickaby/nextjs-github-pages/blob/main/.github/workflows/deploy.yml) is running a few commands to automatically deploy the app when you push to the `main` branch.

![screenshot of github actions](https://user-images.githubusercontent.com/200280/203812362-f733579f-bd09-4a4e-997d-fba74e02e839.png)

My Github Action workflow uses [this action](https://github.com/peaceiris/actions-gh-pages) to handle the actual deployment. I went with a third-party action, because I don't want to have to maintain it.

Here are the Workflow steps:

1. Check out `main` branch
2. Setup Node
3. Get NPM's cache from the last build 🚀
4. Build the app
5. Deploy the app to the `/gh-pages` branch (using a the `ACTIONS_DEPLOY_KEY` you generated earlier).

Here's the workflow in `.yml`:

```yml
name: Deploy to Github Pages

on:
  push:
    branches:
      - main

  workflow_dispatch:

jobs:
  deployment:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 'lts/*'
          cache: 'npm'

      - name: Build
        run: |
          npm i
          npm run build
          npm run export

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
          publish_dir: ./out
```

### Activate Github Pages

This is the easiest step, because as soon as Github recognizes there's a `/gh-pages` branch, it'll automatically activate the Github Pages feature!

In a moment, you should be able to see your Next.js app at `https://your-username.github.io/your-repo-name/`

---

## Wrap up

Thanks for reading and I hope this helps. If you noticed someting wrong, please [file an issue](https://github.com/gregrickaby/nextjs-github-pages/issues). Good luck! 🍻

---
