---
title: Exploring Internationalisation With Nextjs 10 and react-intl
description: This blog post will explore the new internationalised routing in Next.js 10 and how you can use this to your advantage with react-intl for React.js
date: "2020-11-08"
tags: nextjs,react,vercel,i18n
---

In this post, we will be diving into one of Next.js 10's new advanced features in [internationalised routing](https://nextjs.org/docs/advanced-features/i18n-routing) and how we can use this with [react-intl](https://www.npmjs.com/package/react-intl).

## Getting started

Create a new Next.js 10 project by running `npx create-next-app i18n-example` to create a new project name **i18n-example**.

We will run some other commands to set things up:

```s
# Create new Next.js 10 project "i18n-example"
npx create-next-app i18n-example
cd i18n-example
# A place to pop some internationalisation content
mkdir -p content/locale
# A place for some languages
# French
touch content/locale/fr.js
# Spanish
touch content/locale/es.js
# English
touch content/locale/en.js
# A barrel file
touch content/locale/index.js
# Installing react-intl for i18n within components
npm i react-intl --legacy-peer-deps
# Required for updating config
touch next.config.js
```

> For installing `react-intl` I've used `--legacy-peer-deps` as there was a peer dependency of `react@^16.3.0` and I was running npm v7.

Now that we have some files going, let's get started with some basic content!

## Setting up Next.js i18n

Follow on from the docs on [getting started](https://nextjs.org/docs/advanced-features/i18n-routing), we need to update `next.config.js`:

```js
// next.config.js
module.exports = {
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en", "fr", "es"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en",
  },
}
```

Here we are going with [sub-path routing](https://nextjs.org/docs/advanced-features/i18n-routing#sub-path-routing), so the tl;dr is that `our-website.com` will be the default locale (English), whereas `our-website.com/fr` and `our-website.com/es` will direct us to the French and Spanish websites respectively.

Now that we have that out of the way, let's update the `pages/index.js` page!

## Internationalising our home page

We can use the Next router to grab which locale we are on.

There is a [straight forward example](https://github.com/vercel/next.js/blob/canary/examples/i18n-routing/pages/index.js) from Vercel's GitHub that we can take for inspiration.

Replace `pages/index.js` to look like the following:

```js
import { useRouter } from "next/router"

export default function IndexPage(props) {
  const router = useRouter()
  const { locale, locales, defaultLocale } = router

  return (
    <div>
      <h1>Hello, world!</h1>
      <p>Welcome to your internationalised page!</p>
      <br />
      <p>Current locale: {locale}</p>
      <p>Default locale: {defaultLocale}</p>
      <p>Configured locales: {JSON.stringify(locales)}</p>
    </div>
  )
}
```

With this, we are ready to start our app and see the results.

Run `npm run dev` to start the server and head to the localhost port-specific (likely `http://localhost:3000`).

Once you are there, you will see the current locale of English as well as what locales are configured!

![Base page](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-08-1-localhost.png?raw=true)

<figcaption>Base page</figcaption>

Given what we mentioned previously about the sub-routing, we can now go to `/fr` and `/es` and expect the current locale to change. The below image will be just for the `/fr` route to show our sub-routing works.

![French locale](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-08-2-localhost-fr-not-i18n.png?raw=true)

<figcaption>French locale</figcaption>

Amazing! Now that we are done here, we can get to using this with `react-intl`.

## Switching copy with react-intl

We will run a simple example here with `react-intl`, but what we need to do first is prep some content that we wish to swap out!

Inside of `content/locale/en.js`, let's through in some basic JSON to replace our "Hello, world!" and welcome message:

```js
export const en = {
  "/": {
    hello: "Hello, world!",
    welcomeMessage: "Welcome to your internationalised page!",
  },
  "/alt": {
    hello: "Yo",
  },
}
```

> The structure of these files is up to you, but I am going with a top-level key of the page name for now and identifiers in the string. Places I have worked previous keep this as JSON to upload to places such as [Smartling](https://www.smartling.com/), so you may want to go down an avenue that transforms JSON to the above ES6 format I am using.

Let's copy-paste that across to our Spanish and French files and use some possibly inaccurate Google translations to help us out.

For the French:

```js
export const fr = {
  "/": {
    hello: "Bonjour le monde!",
    welcomeMessage: "Bienvenue sur votre page internationalisée!",
  },
  "/alt": {
    hello: "Bonjour",
  },
}
```

For the Spanish:

```js
export const es = {
  "/": {
    hello: "¡Hola Mundo!",
    welcomeMessage: "¡Bienvenido a tu página internacionalizada!",
  },
  "/alt": {
    hello: "¡Hola!",
  },
}
```

Finally, we want to update our barrel file `content/locale/index.js`:

```js
export * from "./en"
export * from "./fr"
export * from "./es"
```

Great! Now that we are there, let's go back to `pages/_app.js` to add our required provider.

```js
// pages/_app.js
import { IntlProvider } from "react-intl"
import { useRouter } from "next/router"
// import all locales through barrel file
import * as locales from "../content/locale"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const { locale, defaultLocale, pathname } = router
  const localeCopy = locales[locale]
  const messages = localeCopy[pathname]

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={defaultLocale}
      messages={messages}
    >
      <Component {...pageProps} />
    </IntlProvider>
  )
}

export default MyApp
```

We are doing a number of things here:

1. Importing all the locale files through the barrel file we created.
2. Import the `IntlProvider` from `react-intl` to use in each of our pages as part of the app.
3. Using the `pathname` given by the Next.js router to determine what copy of the locale to use based on the page.

Now let's go back to `pages/index.js` and make use of `react-intl`.

```js
// pages/index.js
import { useRouter } from "next/router"
import { useIntl } from "react-intl"

export default function IndexPage(props) {
  const { formatMessage } = useIntl()
  const f = id => formatMessage({ id })
  const router = useRouter()
  const { locale, locales, defaultLocale } = router

  return (
    <div>
      <h1>{f("hello")}</h1>
      <p>{f("welcomeMessage")}</p>
      <br />
      <p>Current locale: {locale}</p>
      <p>Default locale: {defaultLocale}</p>
      <p>Configured locales: {JSON.stringify(locales)}</p>
    </div>
  )
}
```

On this page, I am importing the `useIntl` hook, destructuring `formatMessage` from that hook, making a helper function `f` that abstract the need to always pass an object with the id and replace the appropriate code with our key name for the page in the locale content.

Let's fire up the app with `npm run dev` and see what happens!

If we check `/`, `/fr` and `/es` we get the following respectively:

![English home](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-08-3-local-en.png?raw=true)

<figcaption>English home</figcaption>

![French home](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-08-4-fr.png?raw=true)

<figcaption>French home</figcaption>

![Spanish home](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-08-5-es.png?raw=true)

<figcaption>Spanish home</figcaption>

Success!

As an added bonus to show how the other locale pages would work with the `/alt` route key we put in the locale files, we can create a new file `pages/alt.js` and add something similar:

```js
import { useIntl } from "react-intl"

export default function IndexPage(props) {
  const { formatMessage } = useIntl()
  const f = id => formatMessage({ id })

  return (
    <div>
      <h1>{f("hello")}</h1>
    </div>
  )
}
```

Going to `/fr/alt` and `/es/alt` respectively give us the following:

![Alt image - French](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-08-6-fr-alt.png?raw=true)

<figcaption>Alt image - French</figcaption>

![Alt image - Spanish](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-08-7-es-alt.png?raw=true)

<figcaption>Alt image - Spanish</figcaption>

Notice that we have re-used the `hello` key for this page too but we are not getting that clash thanks to how we set up the locales and `pages/_app.js` page? Very handy. I am unsure if that is the best way to lay it out (there may be issues I am yet to run into at scale) but for this demo, it works rather nicely.

> Note: if you are having an error pop up in the terminal about missing Polyfills, refer to the [formatjs documentation](https://formatjs.io/docs/react-intl/#runtime-requirements). The tl;dr is that you need Node v13+ or you can install a package.

## Summary

In conclusion, we have explored Next.js internationalisation and used the `react-intl` package to help make our locales come to life!

See the final project (although lacking aesthetics) [here](https://hello-nextjs-i18n.vercel.app/) and the final code [here](https://github.com/okeeffed/hello-nextjs-i18n).

## Resources and further reading

1. [react-intl](https://www.npmjs.com/package/react-intl)
2. [Next.js 10 - i18n routing](https://nextjs.org/docs/advanced-features/i18n-routing)
3. [Completed project](https://hello-nextjs-i18n.vercel.app/)
4. [Final code](https://github.com/okeeffed/hello-nextjs-i18n)
5. [react-intl runtime requirements](https://formatjs.io/docs/react-intl/#runtime-requirements)
6. [Smartling](https://www.smartling.com/)

_Image credit: [Andrew Butler](https://unsplash.com/@drewbutler)_

_Originally posted on my [blog](https://blog.dennisokeeffe.com/blog/2020-11-08-nextjs-intl-with-react-intl/). Follow me on Twitter for more hidden gems [@dennisokeeffe92](https://twitter.com/dennisokeeffe92)._
