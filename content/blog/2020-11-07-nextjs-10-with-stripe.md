---
title: Taking Stripe Payments With Next.js 10, TypeScript 4, React 17 and Vercel
description: Learn how to create a test Stripe example, update that example and deploy to Vercel for a Stripe payment gateway, React 17, TypeScript 4 and Next.js 10
date: "2020-11-07"
tags: nextjs,stripe,typescript,vercel
---

Over my previous posts, I have been exploring some of the neat things about Next.js 10 and using Vercel as a host.

Today we are going to show how you can build out your next store or start financing your own dreams.

We will use a Stripe + Nextjs starter template, upgrade React to version 17, TypeScript to version 4 and deploy the final working application to Vercel via the CLI.

_I tell you what, I sure am ready to leave me 9-5 job._



## Prerequisites and requirements

1. Have a Stripe account.
2. Have your [API keys](https://support.stripe.com/questions/locate-api-keys-in-the-dashboard#:~:text=Users%20with%20Administrator%20permissions%20can,and%20clicking%20on%20API%20Keys.&text=If%20you%20have%20already%20enabled,one%20or%20more%20hardware%20security%E2%80%A6) ready.
3. A [Vercel](https://vercel.com) account.



## Getting started

Thanks to `create-next-app`, we already have an example that we can get started with and explore!

Run the following to create a Next.js example app in the folder `with-stripe-typescript-app`:

```s
# Create Stripe TypeScript example
npx create-next-app --example with-stripe-typescript with-stripe-typescript-app
```

Change into the newly-created directory.

Optionally, We are going to make some changes to this template for the sake of bringing TypeScript and React things up to version 4 and 17 respectively!

```s
# Move TypeScript from v3 -> v4, React from v16 -> v17
npm install react@latest react-dom@latest
# Update types
npm install --save-dev typescript@latest @types/react@latest
```

In my case, this brought TypeScript up to v4.0.5 and React + ReactDOM to v17.0.1. Note that in future, breaking changes could break the app.

> You could check for the other packages as well (Stripe, etc.) but I will leave them for the sake of working with what is currently there.



## Preparing the app

Before we go too deep into exploration, we need to add in your [Stripe API Keys](https://dashboard.stripe.com/apikeys). In my case, I will just use the test keys from the dashboard.

As for the webhook secret, this comes from the [Stripe CLI](https://stripe.com/docs/stripe-cli). Follow the instructions on the link to install.

After installing the Stripe CLI, run `stripe login` and log into your account (this will open up the browser to confirm).

Next, run `stripe listen --forward-to localhost:<your-port-likely-3000>/api/webhooks`. This will give you back a webhook secret you can use.

From the root of the project, run `cp .env.local.example` to `.env.local.example`.

Inside, you'll fine some environment variables that we need to update:

```s
# Stripe keys
# https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-pk>
STRIPE_SECRET_KEY=<your-stripe-sk>
STRIPE_PAYMENT_DESCRIPTION='Software development services'
# https://stripe.com/docs/webhooks/signatures
STRIPE_WEBHOOK_SECRET=<your-webhook-secret-from-stripe-cli>
```



## Exploring the app

To start the app, run `npm run dev` in the terminal.

Head to **http://localhost:3000** and you'll be faced with the following screen:

![Localhost running](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-07-1-localhost-nextjs-app.png?raw=true)

<figcaption>Localhost running</figcaption>

This page allows us to run three examples:

1. Donation using Stripe Checkout.
2. Donation using Stripe Elements.
3. Using the Shopping Cart.

Let's explore the code for each page.



## Donate with Stripe Checkout

Checking out the first option with **Donation with Checkout**.

The code for how this page works can be found at `pages/donate-with-checkout.tsx`.

```ts
import { NextPage } from "next"
import Layout from "../components/Layout"

import CheckoutForm from "../components/CheckoutForm"

const DonatePage: NextPage = () => {
  return (
    <Layout title="Donate with Checkout | Next.js + TypeScript Example">
      <div className="page-container">
        <h1>Donate with Checkout</h1>
        <p>Donate to our project 💖</p>
        <CheckoutForm />
      </div>
    </Layout>
  )
}

export default DonatePage
```

> All the future examples can be found at `pages/path/to/route`. I won't be touching deeper on the page entry points moving further.

Within that form, we can see the checkout form in `components/CheckoutForm`.

While I won't go too deep into each and every piece of information here, if we look at the code and see the `handleSubmit` closure function, we can see where most the important information comes from:

```ts
const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
  e.preventDefault()
  setLoading(true)
  // Create a Checkout Session.
  const response = await fetchPostJSON("/api/checkout_sessions", {
    amount: input.customDonation,
  })

  if (response.statusCode === 500) {
    console.error(response.message)
    return
  }

  // Redirect to Checkout.
  const stripe = await getStripe()
  const { error } = await stripe!.redirectToCheckout({
    // Make the id field from the Checkout Session creation API response
    // available to this file, so you can provide it as parameter here
    // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
    sessionId: response.id,
  })
  // If `redirectToCheckout` fails due to a browser or network
  // error, display the localized error message to your customer
  // using `error.message`.
  console.warn(error.message)
  setLoading(false)
}
```

This code re-directs us to the Stripe Checkout where we can pay with some test cards.

The API call code it uses to authorize the checkout session comes from `pages/api/checkout_sessions/*.ts` where `*` refers to any of the three files that help out here.

If we run through the UI and click on "donate" we can see that in action.

![Stripe Checkout](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-07-2-stripe-checkout.png?raw=true)

<figcaption>Stripe Checkout</figcaption>

Using a [Stripe test card](https://stripe.com/docs/testing) we can pop in `4242 4242 4242 4242` for the card number, any 3 digits for the CVC and any future date for validating the purchase.

If we check our terminal, we will see some neat confirmation logs for both the Nextjs app logs and webhook logs:

```s
# Nextjs App logs
✅ Success: evt_1Hke6eJV8JMnC8XlhOPbQAy2
💵 Charge id: ch_1Hke6dJV8JMnC8XltpI9mM15
✅ Success: evt_1Hke6eJV8JMnC8Xlm2EtO9Cq
🤷‍♀️ Unhandled event type: payment_method.attached
✅ Success: evt_1Hke6eJV8JMnC8XlpWp04upc
🤷‍♀️ Unhandled event type: customer.created
✅ Success: evt_1Hke6fJV8JMnC8Xl29TUZxrT
💰 PaymentIntent status: succeeded
✅ Success: evt_1Hke6fJV8JMnC8XlcTKuetWs
🤷‍♀️ Unhandled event type: checkout.session.completed
# Stripe Webhook Logs
2020-11-07 10:04:59  <--  [200] POST http://localhost:3000/api/webhooks [evt_id]
2020-11-07 10:08:46   --> payment_intent.created [evt_id]
2020-11-07 10:08:46  <--  [200] POST http://localhost:3000/api/webhooks [evt_id]
2020-11-07 10:12:33   --> charge.succeeded [evt_id]
2020-11-07 10:12:33  <--  [200] POST http://localhost:3000/api/webhooks [evt_id]
2020-11-07 10:12:34   --> payment_method.attached [evt_1Hke6eJV8JMnC8Xlm2EtO9Cq]
2020-11-07 10:12:34  <--  [200] POST http://localhost:3000/api/webhooks [evt_id]
2020-11-07 10:12:34   --> customer.created [evt_1Hke6eJV8JMnC8XlpWp04upc]
2020-11-07 10:12:34  <--  [200] POST http://localhost:3000/api/webhooks [evt_id]
2020-11-07 10:12:34   --> payment_intent.succeeded [evt_1Hke6fJV8JMnC8Xl29TUZxrT]
2020-11-07 10:12:34  <--  [200] POST http://localhost:3000/api/webhooks [evt_id]
2020-11-07 10:12:34   --> checkout.session.completed [evt_1Hke6fJV8JMnC8XlcTKuetWs]
2020-11-07 10:12:34  <--  [200] POST http://localhost:3000/api/webhooks [evt_id]
```

The UI itself will redirect to `/result` where the response JSON body will be shown.

![Response on result page](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-07-3-checkout-result.png?raw=true)

<figcaption>Response on result page</figcaption>



## Donate with Stripe Elements

If we return to the home page and select the `Donate with Elements` option, we will come to a similar donation page but with the difference that we are now using Stripe Elements from the `@stripe/react-stripe-js` package.

This enables you to make purchase attempts directly from within your website and has flexible styling options to keep it within your styling.

Similar to before, it is the `handleSubmit` closure function from the `components/ElementsForm.tsx` form that will give us the most information on what is happening:

```ts
const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    // Abort if form isn't valid
    if (!e.currentTarget.reportValidity()) return
    setPayment({ status: 'processing' })

    // Create a PaymentIntent with the specified amount.
    const response = await fetchPostJSON('/api/payment_intents', {
      amount: input.customDonation,
    })
    setPayment(response)

    if (response.statusCode === 500) {
      setPayment({ status: 'error' })
      setErrorMessage(response.message)
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements!.getElement(CardElement)

    // Use your card Element with other Stripe.js APIs
    const { error, paymentIntent } = await stripe!.confirmCardPayment(
      response.client_secret,
      {
        payment_method: {
          card: cardElement!,
          billing_details: { name: input.cardholderName },
        },
      }
    )

    if (error) {
      setPayment({ status: 'error' })
      setErrorMessage(error.message ?? 'An unknown error occured')
    } else if (paymentIntent) {
      setPayment(paymentIntent)
    }
  }
```

The API call code it uses to authorize the checkout session comes from `pages/api/payment_intents/*.ts` where `*` refers to any of the three files that help out here.

If we fill out the details similar to before with the same test card and click `Donate $x`, you will see that the entire payment process happens on the page as opposed to running through the redirects.

![Elements form](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-07-4-elements.png?raw=true)

<figcaption>Elements form</figcaption>

![Elements paid](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-07-5-elements-result.png?raw=true)

<figcaption>Elements paid</figcaption>



## Exploring the Shopping Cart

As for the final option of **Use Shopping Cart**, you'll see the example gives us a lovely set of options to add items to a cart, then checkout.

This actually works by using a package called [use-shopping-cart](https://github.com/dayhaysoos/use-shopping-cart) which is a delightful package that helps maintain a Stripe shopping cart using React hooks and the related [stock keeping units (SKUs)](https://stripe.com/docs/api/skus) used in Stripe.

> In real-world usage, you can add the products through the Stripe Dashboard.

This example follows a similar route to the basic checkout example. If you add some items to the cart and checkout, you will be redirected to Stripe Checkout to complete to order and follow a similar redirect path.

![Shopping cart page](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-07-6-shopping-cart.png?raw=true)

<figcaption>Shopping cart page</figcaption>

The difference in this cart, however, is that your items will show on the checkout page!

![Checkout with shopping cart](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-07-7-shopping-cart-checkout.png?raw=true)

<figcaption>Checkout with shopping cart</figcaption>



## See the payments in the dashboard

If you head to the **Payments** section of your Stripe Dashboard, you will be able to confirm the test payments we made.

![Payments in the dashboard](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-07-8-payments-stripe-dashboard.png?raw=true)

<figcaption>Payments in the dashboard</figcaption>



## Deploying to Vercel

If you have not already, install Vercel using `npm i -g vercel`.

Now, simply run `vercel` from the root of the application and follow the prompts.

> The above requires you to have a Vercel account setup.

Once this is done, you will have a link to the live website! The battle, however, is not over yet. If you try to run the checkout from here, your Developer Tools console will inform you that the API keys are **not** set.

We need to now add our keys to Vercel.

### Creating the webhook in Stripe

In order to capture webhooks in our production app, we need to create a webhook URL in the Stripe Dashboard. It will look something like `https://your-url.your-account.vercel.app/api/webhooks`.

![Creating a production webhook](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-07-9-creating-the-webhook.png?raw=true)

<figcaption>Creating a production webhook</figcaption>

Once created in the dashboard, grab the **Signing Secret** and get ready to add this to Vercel.

### Adding Environment Variables

There will be a link to the settings for your application given back on terminal (something like **https://vercel.com/[your-account]/[app-name]/settings**).

Head to this link and select **Environment Variables** from the sidebar. From here, we want to add back in our variables using what we had from `.env.local` in our project, only replace the `STRIPE_WEBHOOK_SECRET` with the actual link we created in the section before.

Once these values have been filled out, run `vercel --prod` from the terminal once again from the root directory of the repo to re-deploy the app so that the new environment variables take place.

Head to your URL now, run through one of the flows we described during this post and you are done. Congratulations!

![Production Example Payment](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-07-10-production-success.png?raw=true)

<figcaption>Production Example Payment</figcaption>

![Production payment on the Stripe Dashboard](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/2020-11-07-11-production-payment-on-dashboard.png?raw=true)

<figcaption>Production payment on the Stripe Dashboard</figcaption>



## Conclusion

In summary, we have looked today at setting up React 17 and TypeScript 4.x in a Nextjs 10 application and event taken it to production using Vercel to host the live website with the ability to accept payments.

Most of these example API routes and implementations from the app can be re-used in the real-world for your own projects.

Stripe + Vercel = Greatness. Happy hacking!



## Resources and further reading

1. [Base Stripe repo](https://github.com/stripe-samples/nextjs-typescript-react-stripe-js)
2. [Forked repo](https://github.com/okeeffed/nextjs-typescript-react-stripe-js)
3. [Locating API keys in Stripe](https://support.stripe.com/questions/locate-api-keys-in-the-dashboard#:~:text=Users%20with%20Administrator%20permissions%20can,and%20clicking%20on%20API%20Keys.&text=If%20you%20have%20already%20enabled,one%20or%20more%20hardware%20security%E2%80%A6)
4. [Stripe API Keys link](https://dashboard.stripe.com/apikeys)
5. [Stripe test cards](https://stripe.com/docs/testing)
6. [Vercel](https://vercel.com)
7. [Production URL](https://with-stripe-typescript-app-ten.vercel.app/)
8. [Completed Project](https://github.com/okeeffed/with-stripe-typescript-nextjs-app)

_Image credit: [Sam Dan Truong](https://unsplash.com/@sam_truong)_

_Originally posted on my [blog](https://blog.dennisokeeffe.com/blog/2020-11-07-nextjs-10-with-stripe/). Follow me on Twitter for more hidden gems [@dennisokeeffe92](https://twitter.com/dennisokeeffe92)._
