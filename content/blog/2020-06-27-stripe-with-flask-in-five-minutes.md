---
title: Creating your first Stripe Charge with Python + Flask in 5 minutes
description: Follow along in this short Stripe series as we take a look at making a Stripe charge in a few different languages!
date: "2020-06-27"
---

In this short series, we are going to look at how to create a charge to Stripe in a number of their officially supported languages!

Today, we are going to look at how to do so with Python and Flask.

The expectations are that you have both Python 3 and `pip3` installed and have your [Stripe API keys](https://stripe.com/docs/keys) setup and ready to go.

> The following comes in part from my [documentation website](https://docs.dennisokeeffe.com/manual-stripe-flask-stripe-configuration).

## Getting Started

```shell
mkdir python-flask-stripe && cd python-flask-stripe
# pip or pip3 depending on env
pip3 install Flask
pip3 install stripe
pip3 install -U python-dotenv
touch .env server.py
```

## Setting up .env

Fetch your keys from Stripe and replace the following in the file:

```shell
SK_TEST_KEY=sk... # replace sk...
```

## Writing server.py

Set up the file to look like the following:

```python
from flask import Flask
from flask import request
from dotenv import load_dotenv
import stripe
import os

# Load local .env file and assign key
load_dotenv()
stripe.api_key = os.environ.get("SK_TEST_KEY")

app = Flask(__name__)

@app.route("/api/charge", methods = ['POST'])
def charge():
    try:
        content = request.get_json()
        # Print what JSON comes in for the sake of checking
        print(content)

        resp = stripe.Charge.create(
            amount=content['amount'],
            currency="usd",
            source="tok_visa",
            receipt_email=content['receiptEmail'],
        )
        print("Success: %r" % (resp))
        return "Successfully charged", 201
    except Exception as e:
        print(e)
        return "Charge failed", 500

if __name__ == "__main__":
    app.run()
```

The above:

1. Fetches and sets OS env from .env file.
2. Sets the Stripe API key.
3. Sets a route `/api/charge` that only takes the `POST` method and creates a charge based on the amount we pass.

## Running the server

`python3 server.py` will start the server on port 5000.

Running `http POST http://localhost:5000/api/charge amount:=1700 receiptEmail=hello_flask@example.com` (using HTTPie) will come back with success. Check your Stripe dashboard and you will see a charge made for AUD\$17.00! Hooray!

I chose to use HTTPie because I feel it is a fun tool that more should know about! Alternative, you could do the above using `curl` as well (or anything that can make a POST request for a matter of fact).

```s
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"amount":1700,"receipt_email":"hello_flask@example.com"}' \
  http://localhost:5000/api/charge
```

![Stripe Dashboard](../assets/2020-06-26-stripe-dashboard.png)

## Resources and Further Reading

1. [Stripe API](https://stripe.com/docs/api?lang=python)
2. [Flask Hello World Docs](https://docs.dennisokeeffe.com/manual-flask-hello-world)
3. [Stripe Python Github](https://github.com/stripe/stripe-python)
4. [Python Try/Except](https://www.w3schools.com/python/python_try_except.asp)
5. [Status codes in Flask](https://stackoverflow.com/questions/45412228/flask-sending-data-and-status-code-through-a-response-object/45412576)
6. [Parsing JSON data w/ Flask](https://techtutorialsx.com/2017/01/07/flask-parsing-json-data/)
7. [Python Dotenv Github](https://github.com/theskumar/python-dotenv)

_Image credit: [Pankaj Patel](https://unsplash.com/@pankajpatel)_