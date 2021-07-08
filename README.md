# Deploy a Next.js app on Github Pages with Github Actions <!-- omit in toc -->

![Github Pages](https://github.com/gregrickaby/nextjs-github-pages/workflows/github%20pages/badge.svg)

👉 **[View the deployed app](https://gregrickaby.github.io/nextjs-github-pages/)**

## Table of Contents

- [Update](#update)
- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Specify the Asset Directory](#specify-the-asset-directory)
- [Generate Deploy Key](#generate-deploy-key)
  - [Public Key](#public-key)
  - [Private Key](#private-key)
- [Github Actions](#github-actions)
- [Github Pages](#github-pages)
- [Wrap up](#wrap-up)

## Update

> Vercel has since published [an official gh-pages example](https://github.com/vercel/next.js/tree/canary/examples/gh-pages). While the implementation below still works, I recommend looking at their example before making any major decisions.

## Introduction

[Vercel](https://vercel.com/) promotes itself as _"The easiest way to deploy your Next.js app"_...and it's really great. You could totally use it. [Netlify](https://www.netlify.com/) offers a similar service for building modern web apps which is also amazing.

However, I feel like Vercel and Netlify really want you on _their SaaS_. If you're interested in owning your own data (like I am), hosting on a SaaS _could be problem_. I've also found almost no current documentation around deploying a static NextJS app to Github Pages. Well, I figured it out and I'm sharing my findings with you.

## Getting Started

I'm going to gloss over this part, because I assume you already know how to **create a [Github repo](https://help.github.com/en/github/getting-started-with-github/create-a-repo)** and **generate a [Next.js app](https://nextjs.org/docs/getting-started#setup)**. You'll also need to place a `.nojekyll` file in `/public` to bypass Github Pages from trying to [auto-generate a static Jekyll site](https://github.blog/2009-12-29-bypassing-jekyll-on-github-pages/).

## Specify the Asset Directory

Next.js [allows you to prefix the assets directory](https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix) with the `assetPrefix` setting. You'll need to do this so assets served from `/_next/static` work correctly on Github pages.

1. Create `next.config.js` file
2. Add the following and edit `your-github-repo-name` to match your Github repo name:

```js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  // Use the prefix in production and not development.
  assetPrefix: isProd ? '/your-github-repo-name/' : '',
}
```
3. Save the file.

## Generate Deploy Key

Before Github Actions can commit and push to the `gh-pages` branch, it needs to authenticate with itself (sorry, I find this hilarious 😆). You'll need to generate new Public and Private keys. _Don't worry, these new keys won't override your personal SSH keys._

In your next.js app directory, run the following command:

```bash
ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f gh-pages -N ""
```

Now open the keys in your code editor. In just a minute, you're going to copy and paste the contents into your Github repository settings.

### Public Key

In your Github repository:

1. Go to **Settings --> Deploy Keys**
2. Title: `Public key of ACTIONS_DEPLOY_KEY`
3. Key: (copy and paste the public key)
4. Check: Allow write access
5. Click: Add key

![screenshot](https://dl.dropbox.com/s/f07paydl30xgz3i/Screenshot%202020-03-21%2010.00.52.png?dl=0)

### Private Key

In your Github repository:

1. Go to **Settings --> Secrets**
2. Click: Add a new secret
3. Name: `ACTIONS_DEPLOY_KEY`
4. Value: (copy and paste the private key)
5. Click: Add key

![screenshot](https://dl.dropbox.com/s/i64avq115i4qugi/Screenshot%202020-03-21%2010.02.25.png?dl=0)

Now Github Actions will be able to authenticate with your Github repository. You can safely delete the two keys from your computer.

## Github Actions

This is where the magic happens. The [workflow file](https://github.com/gregrickaby/nextjs-github-pages/blob/main/.github/workflows/deploy.yml) is running a few commands to deploy the app.

![screenshot](https://dl.dropbox.com/s/expkrrcgono8zo8/Screen%20Shot%202021-06-04%20at%2009.35.37.png?dl=0)

Here are the steps:

1. Check out `/main` branch
2. Setup Node LTS
3. Get NPM's cache from the last build 🚀
4. Build the app
5. Deploy the app to the `/gh-pages` branch (using a the `ACTIONS_DEPLOY_KEY` you generated earlier).

My Github Action workflow uses [this action](https://github.com/peaceiris/actions-gh-pages) to handle the actual deployment. I went with a third-party action, because I don't want to have to maintain it.

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

    strategy:
      matrix:
        node-version: [14.x]

    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
          
      - name: Use NPM 7
        run: npm i -g npm@latest

      - name: Cache dependencies
        uses: actions/cache@v2
        with:
          path: ~/.npm
          key: ${{ runner.OS }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.OS }}-node-
            ${{ runner.OS }}-

      - name: Build
        run: |
          npm ci --legacy-peer-deps
          npm run build
          npm run export

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
          publish_dir: ./out
```

## Github Pages

This is the easiest step, because as soon as Github recognizes there's a `/gh-pages` branch, it'll automatically activate the Github Pages feature.

You should be able to see your app right away at <https://your-username.github.io/your-repo-name/>

## Wrap up

Thanks for reading and I hope this helps. If you noticed someting wrong, please [file an issue](https://github.com/gregrickaby/nextjs-github-pages/issues). Good luck!

-[Greg](https://twitter.com/GregRickaby)
