---
title: Web Fetch Api
date: "2019-06-16"
description: Looking at usage of the web "fetch" API. This example uses the node-fetch library for demonstration purposes.
---

# Using fetch with the JavaScript API

Full disclosure, I normally use `axios` as my library of choice for http fetching. This is in case I get asked this question in the upcoming interviews and they want me to use a native web API.

## Setup

We are going to use Nodejs for this, so just create a file `index.js` anywhere you want.

The `fetch` API is promise based, so let's take a look as a basic implementation and then using `async/await`.

Because we are using node, we need to download the `npm` package that uses the same API. Let's setup the repo and package with the following:

```shell
yarn init -y | yarn add node-fetch
```

## Usage

We will basically run the script as blocking, but syntax-wise we will run through both an `await` version and standard.

We will use `https://postman-echo.com/post` as our endpoint to essentially test if we make a successful call and look for the 200 status.

### Standard

```javascript
const fetch = require("node-fetch")
const runFetch = () => {
  const url = "https://postman-echo.com/post"
  const json = {
    foo: "bar",
  }

  return fetch(url, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(json),
  })
    .then(function(data) {
      console.log("Request succeeded with JSON response", data.status)
    })
    .catch(function(error) {
      console.log("Request failed", error)
    })
}

const run = async () => await runFetch()
run()
```

If we run `node index.js` from our CLI we will see `Request succeeded with JSON response 200`.

### Await

```javascript
const fetch = require("node-fetch")
const runFetch = () => {
  return new Promise((resolve, reject) => {
    const url = "https://postman-echo.com/post"
    const json = {
      foo: "bar",
    }

    try {
      const data = fetch(url, {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(json),
      })
      console.log("Request succeeded with JSON response", data.status)
      resolve()
    } catch (err) {
      console.log("Request failed", error)
      reject()
    }
  })
}

const run = async () => await runFetch()
run()
```

With this method, we are returning a `Promise` to begin with but manually running our `try/catch` block with a `resolve/reject` resolution based on failure or success.

## Reference

- https://developers.google.com/web/updates/2015/03/introduction-to-fetch
