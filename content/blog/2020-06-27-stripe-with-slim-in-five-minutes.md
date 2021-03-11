---
title: Creating your first Stripe Charge with Slim + PHP in 5 minutes
description: Follow along in this short Stripe series as we take a look at making a Stripe charge in a few different languages!
date: "2020-06-27"
---

In this short series, we are going to look at how to create a charge to Stripe in a number of their officially supported languages!

In this article, we are going to look at how to do so with PHP and Slim.

The expectations are that you have PHP + Composer installed and have your [Stripe API keys](https://stripe.com/docs/keys) setup and ready to go.

> The following comes in part from my [documentation website](https://docs.dennisokeeffe.com/manual-stripe-slim-stripe-configuration).



## Get Started

Ensure `composer` is installed correctly and run the following. Note that you need to ensure that the downloaded `composer.phar` file from the installation instructions must be in your `$PATH` as `composer`.

```shell
mkdir slim-stripe && cd slim-stripe
composer require slim/slim:"4.*"
# required to enable App::Run() etc without manual ServerRequest
composer require slim/psr7
# installing for Stripe
composer require stripe/stripe-php
# required to read dotenv vars
composer require vlucas/phpdotenv
mkdir -p src/public
touch src/public/index.php
touch .env
```

To check Slim is up and working, add this to `src/public/index.php`:

```php
<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});

$app->run();
```

Once completed, change into `src/public` and run `php -S localhost:8080`.

If we now ping `curl localhost:8080` we will see our `Hello world!` response.



## Setting up .env

Our `.env` file should contain our keys for development. Get these from your Stripe Developer dashboard.

Add the following to the `.env` file in the root of your project directory:

```s
SK_TEST_KEY= sk_test...
PK_TEST_KEY=pk_test...
```



## Making a simple charge with Stripe API

Let us update `src/public/index.php` to take a simple request to make a charge to our Stripe account.

```php
<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..');
$dotenv->load();

$stripeKey = getenv('SK_TEST_KEY');
\Stripe\Stripe::setApiKey($stripeKey);

$app = AppFactory::create();

// Parse json, form data and xml
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});

$app->post('/api/charge', function (Request $request, Response $response, $args) {
  try {
    $data = $request->getParsedBody();

    // parse attributes from JSON
    $receiptEmail = $data['receiptEmail'];
    $amount = $data['amount'];

    // create the charge
    $charge = \Stripe\Charge::create([
      'amount' => $amount,
      'currency' => 'usd',
      'source' => 'tok_visa',
      'receipt_email' => $receiptEmail
    ]);

    $response->getBody()->write('Successful charge');
    $response->withStatus(201);
    return $response;
  } catch (Exception $e) {
    $response->getBody()->write('Failed charge');
    $response->withStatus(500);
    return $response;
  }
});

$app->run();
```

Note that in the above example we are loading keys from `.env`, setting the Stripe API key, then using Slim 4's body parsing middleware to help us with parsing the request body from JSON.

If we run `http POST http://localhost:8080/api/charge amount:=1700 receiptEmail=hello_slim@example.com` (using HTTPie) from the console, we will get our `Successful charge` message back.

I chose to use HTTPie because I feel it is a fun tool that more should know about! Alternative, you could do the above using `curl` as well (or anything that can make a POST request for a matter of fact).

```s
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"amount":1700,"receiptEmail":"hello_slim@example.com"}' \
  http://localhost:8080/api/charge
```

If you now go and check your Stripe dashboard, you will be able to see a charge.

![Stripe Dashboard](../assets/2020-06-26-stripe-dashboard.png)



## Resources and Further Reading

1. [Composer installation](https://getcomposer.org/download/)
2. [Getting started with Slim](http://www.slimframework.com/docs/v4/start/installation.html)
3. [Request Object - Slim](http://www.slimframework.com/docs/v4/objects/request.html)
4. [PHP Exceptions](https://www.php.net/manual/en/language.exceptions.php)
5. [Receiving input into a Slim 4 application](https://akrabat.com/receiving-input-into-a-slim-4-application/)
6. [PHP Dotenv](https://github.com/vlucas/phpdotenv)
7. [Stripe PHP Github](https://github.com/stripe/stripe-php)
8. [Stripe API](https://stripe.com/docs/api)
9. [getParsedBody Slim](https://hotexamples.com/examples/slim.http/Request/getParsedBody/php-request-getparsedbody-method-examples.html)

_Image credit: [Sai Kiran Anagani](https://unsplash.com/@_imkiran)_
