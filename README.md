<h1>Deploy a Next.JS app on Github Pages with Github Actions</h1>

![Github Pages](https://github.com/gregrickaby/nextjs-github-pages/workflows/github%20pages/badge.svg)

👉 **[View the website](https://gregrickaby.github.io/nextjs-github-pages/)**

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Generate Deploy Key](#generate-deploy-key)
  - [Public Key](#public-key)
  - [Private Key](#private-key)
- [Github Actions](#github-actions)
- [Github Pages](#github-pages)
- [Wrap up](#wrap-up)

## Introduction

Zeit promotes [Zeit Now](https://zeit.co/) as _"The easiest way to deploy your Next.js app"_...and it's really great. You should totally use it. [Netlify](https://www.netlify.com/) offers a similar service for building modern web apps which is also amazing.

However, I feel like Ziet and Netlify really want you on _their SaaS_. If you're interested in owning your own data, hosting on a SaaS _could be problem_. I've found almost no (current) documentation around deploying a Next.JS app to Github Pages.

So here we are my fellow data-ownership friends...I figured out how to do it, and I'm documenting my findings for others to read. Here's how to deploy a Next.JS app to [Github Pages](https://pages.github.com/) using [Github Actions](https://github.com/features/actions) so you can own your data.

## Getting Started

I'm going to gloss over this part, because I assume you already know how to **create a [Github repo](https://help.github.com/en/github/getting-started-with-github/create-a-repo)** and **generate a [Next.JS app](https://nextjs.org/docs/getting-started#setup)**.

## Generate Deploy Key

Before Github can commit and push to a `github-pages` branch, it needs to authenticate. You'll need to generate new Public and Private keys. _Don't worry, these new keys wont override your personal SSH keys._

In your app directory, run the following command:

```bash
ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f gh-pages -N ""
```

Now open the keys in any code/text editor. We're going to copy and paste the contents into your Github repository settings in just a minute.

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

You can safely delete the two keys from your computer.

## Github Actions

This is where the magic happens. The [workflow file](https://github.com/gregrickaby/nextjs-github-pages/blob/master/.github/workflows/nodejs.yml) is running a few commands to deploy the app.

![screenshot](https://dl.dropbox.com/s/59p760lil6obvlr/Screenshot%202020-03-21%2010.17.34.png?dl=0)

Here are the steps from my [worflow file](https://github.com/gregrickaby/nextjs-github-pages/blob/master/.github/workflows/nodejs.yml):

1. Check out `/master` branch
2. Setup Node LTS
3. Get Yarn's cache from the last build
4. Build the app
5. Deploy the app to `/github-pages` branch (using a the `ACTIONS_DEPLOY_KEY` you generated earlier).

_For the deployment step, I'm using [Peaceiris's workflow](https://github.com/peaceiris/actions-gh-pages)._

```yml
# This workflow will do a clean install of node dependencies, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: github pages

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v1
        with:
          node-version: "12.x"

      - name: Get yarn cache
        id: yarn-cache
        run: echo "::set-output name=dir::$(yarn cache dir)"

      - name: Cache dependencies
        uses: actions/cache@v1
        with:
          path: ${{ steps.yarn-cache.outputs.dir }}
          key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-
      - run: yarn install
      - run: yarn build
      - run: yarn export

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
          publish_dir: ./out
```

## Github Pages

This is the easiest step, because as soon as Github recognizes there's a `/gh-pages` branch, it will turn automatically turn on Github Pages. You should be able to see your app right away at https://your-username.github.io/your-repo-name/

## Wrap up

Thanks for reading and I hope this helps. If you noticed someting wrong, please [file an issue](https://github.com/gregrickaby/nextjs-github-pages/issues). Good luck!

-[Greg](https://twitter.com/GregRickaby)
