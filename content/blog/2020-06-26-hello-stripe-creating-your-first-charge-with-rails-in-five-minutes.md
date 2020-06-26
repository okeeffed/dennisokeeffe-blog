---
title: Creating your first Charge with Stripe in 5 minutes
description: Follow along in this short Stripe series as we take a look at making a Stripe charge in a few different languages!
date: "2020-06-26"
---

In this short series, we are going to look at how to create a charge to Stripe in a number of their officially supported languages!

Today, we are going to look at how to do so in Rails.

The expectations are that you have both Rails installed and have your [Stripe API keys](https://stripe.com/docs/keys) setup and ready to go.

> The following comes in part from my [documentation website](https://docs.dennisokeeffe.com/manual-stripe-rails-stripe-configuration).

## Getting Started

Assuming you have Rails installed, run the following:

```shell
rails new ruby-rails-stripe
cd ruby-rails-stripe
```

Add the following to the top of your `Gemfile` for us to read local `.env` file values and bundle Stripe.

```ruby
gem 'dotenv-rails', groups: [:development, :test]
gem 'stripe'
```

On the console, run `bundle`.

## Setting up your environment variables

For your Stripe account, add in your PK and SK test values.

```s
PK_TEST_KEY=
SK_TEST_KEY=
```

## Scaffolding the Charges Route

From the console run:

```shell
rails generate controller Charges create
```

This will scaffold our `app/controllers/charges_controller.rb` controller.

Inside that, let's update the code:

```ruby
require 'stripe'

class ChargesController < ApplicationController
  # POST /charge
  # POST /charge.json
  def create
    # `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
    charge = Stripe::Charge.create({
      amount: params[:amount],
      currency: 'aud',
      source: 'tok_amex',
      receipt_email: params[:receipt_email],
      description: 'My First Test Charge (created for API docs)',
    })
    render json: charge
  end
end
```

This code will make a charge to Stripe using the JSON body params `amount` and `receipt_email`.

If the charge is successful, it will return the charge information as JSON.

## Updating config/routes.rb

Ensure routes has the following for POST:

```ruby
Rails.application.routes.draw do
  # ... the rest is omitted for brevity
  post 'charges/create'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
```

This ensures that we can send a POST request to `http://localhost:PORT/charges/create` when we run the server.

## Running the code

Run `rails server` to get our server up and running (defaulting to 3000).

In this example using [HTTPie](https://httpie.org/), call `http POST http://localhost:3000/charges/create amount:=1700 receipt_email=hello_rails@example.com` and we will get back our charge results sent as JSON. Hooray!

I chose to use HTTPie because I feel it is a fun tool that more should know about! Alternative, you could do the above using `curl` as well (or anything that can make a POST request for a matter of fact).

```s
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"amount":1700,"receipt_email":"hello_rails@example.com"}' \
  http://localhost:3000/charges/create
```

If you now go and check your Stripe dashboard, you will be able to see a charge

## Resources and further reading

1. [Using Rails for API only](https://guides.rubyonrails.org/api_app.html)
2. [Stripe Ruby Github](https://github.com/stripe/stripe-ruby)
3. [Dotenv Ruby Github](https://github.com/bkeepers/dotenv)
4. [Scaffolding routes](http://www.xyzpub.com/en/ruby-on-rails/3.2/scaffold_anlegen.html)
5. [HTTP Requests in Rails Apps](https://thoughtbot.com/blog/back-to-basics-http-requests)
6. [Action Controlller Overview](https://guides.rubyonrails.org/v5.2/action_controller_overview.html)
7. [HTTPie](https://httpie.org/)

_Image credit: [Alexandru Acea](https://unsplash.com/@alexacea)_