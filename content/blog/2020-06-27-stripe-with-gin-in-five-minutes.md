---
title: Creating your first Stripe Charge with Gin + Golang in 5 minutes
description: Follow along in this short Stripe series as we take a look at making a Stripe charge in a few different languages!
date: "2020-06-27"
---

In this short series, we are going to look at how to create a charge to Stripe in a number of their officially supported languages!

In this article, we are going to look at how to do so with Golang and Gin. It assumes that you have Go setup on your local machine.

The expectations are that you have both Dotnet installed and have your [Stripe API keys](https://stripe.com/docs/keys) setup and ready to go.

> The following comes in part from my [documentation website](https://docs.dennisokeeffe.com/manual-stripe-gin-stripe-configuration).

## Setting up

We need a few libs to get this all going. Run the following to fetch prerequisite packages:

```shell
# Gin server lib
go get -u github.com/gin-gonic/gin
# Stripe Go API
go get github.com/stripe/stripe-go
# Dotenv package for Golang
go get github.com/joho/godotenv
```

## Setting up main.go

The Golang API (in my opinion) has some more complexity as opposed to others for setting up a basic charge.

Reading over Stripe's example tests on [Github](https://github.com/stripe/stripe-go/blob/master/charge/client_test.go) is the perfect way to see how to conform and adhere to the types -- particularly for our basic example.

```go
package main

import (
        "log"
        "net/http"
        "os"

        "github.com/gin-gonic/gin"
        "github.com/joho/godotenv"
        "github.com/stripe/stripe-go"
        "github.com/stripe/stripe-go/charge"
)

// ChargeJSON incoming data for Stripe API
type ChargeJSON struct {
        Amount       int64  `json:"amount"`
        ReceiptEmail string `json:"receiptEmail"`
}

func main() {
  // load .env file
  err := godotenv.Load()
  if err != nil {
    log.Fatal("Error loading .env file")
  }

  // set up server
  r := gin.Default()

  // basic hello world GET route
  r.GET("/", func(c *gin.Context) {
    c.JSON(200, gin.H{
            "message": "Hello, World!",
    })
  })

  // our basic charge API route
  r.POST("/api/charges", func(c *gin.Context) {
    // we will bind our JSON body to the `json` var
    var json ChargeJSON
    c.BindJSON(&json)

    // Set Stripe API key
    apiKey := os.Getenv("SK_TEST_KEY")
    stripe.Key = apiKey

    // Attempt to make the charge.
    // We are setting the charge response to _
    // as we are not using it.
    _, err := charge.New(&stripe.ChargeParams{
      Amount:       stripe.Int64(json.Amount),
      Currency:     stripe.String(string(stripe.CurrencyUSD)),
      Source:       &stripe.SourceParams{Token: stripe.String("tok_visa")}, // this should come from clientside
      ReceiptEmail: stripe.String(json.ReceiptEmail)})

    if err != nil {
      // Handle any errors from attempt to charge
      c.String(http.StatusBadRequest, "Request failed")
      return
    }

    c.String(http.StatusCreated, "Successfully charged")
  })

  r.Run(":8080")
}
```

## Making A Test Charge

We can run our server with the following:

```shell
go run main.go
```

In another terminal, run `http POST http://localhost:8080/api/charges amount:=1700 receiptEmail=hello_gin@example.com` (using [HTTPie](https://httpie.org/)) and we will get back `Successfully charged`! Hooray! We made it.

I chose to use HTTPie because I feel it is a fun tool that more should know about! Alternative, you could do the above using `curl` as well (or anything that can make a POST request for a matter of fact).

```s
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"amount":1700,"receiptEmail":"hello_gin@example.com"}' \
  http://localhost:8080/api/charges
```

If you now go and check your Stripe dashboard, you will be able to see a charge.

![Stripe Dashboard](../assets/2020-06-26-stripe-dashboard.png)

## Resources and Further Reading

1. [Go Docs Stripe](https://godoc.org/github.com/stripe/stripe-go#CardParams)
2. [Stripe API](https://godoc.org/github.com/stripe/stripe-go#CardParams)
3. [Stripe Testing Cards](https://stripe.com/docs/testing#cards)
4. [Github Stripe Go Charge Testing](https://github.com/stripe/stripe-go/blob/master/charge/client_test.go)
5. [Gin Github](https://github.com/gin-gonic/gin)
6. [Golang Dotenv Github](https://github.com/joho/godotenv)
7. [HTTPie](https://httpie.org/)

_Image credit: [Lee Campbell](https://unsplash.com/@leecampbell)_
