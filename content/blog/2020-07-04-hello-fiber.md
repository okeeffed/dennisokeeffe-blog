---
title: Dipping Your Feet Into Golang Servers With Fiber
description: In this entry into Fiber, we will cover installation of Fiber, as well as the basics of GET + POST requests, handling errors and returning JSON.
date: "2020-07-04"
---

In this entry into Fiber, we will cover installation of Fiber, as well as the basics of GET + POST requests, handling errors and returning JSON.

**This will be the first in a small series** I will write over the coming week on using Fiber and hooking it up to things like databases and deployments to AWS.

> I've done a bunch of blog posts so far on JavaScript, so I think I might follow the pattern of changing language every week or so to keep spitting out different content. Where possible, I'll still try to bring in an interesting spin to how we can use those languages to do cool things (not the beginner posts though - this will be one of them).

It expects that you Golang installed and understand the basics of running Go applications.

<Ad />

## Installing Fiber

```s
go get -u github.com/gofiber/fiber
```

<Ad />

## Running our Hello World

Create a new directory, change into it and add a main.go file:

```s
mkdir hello-fiber
cd hello-fiber
touch main.go
```

Add the following to `main.go`:

```go
package main

import "github.com/gofiber/fiber"

func main() {
  app := fiber.New()

  app.Get("/", func(c *fiber.Ctx) {
    c.Send("Hello, World 👋!")
  })

  app.Listen(3000)
}
```

We can use `go run main.go` to get the local server going. You should now be faced with something similar to the following (with slight differences based on hardware, OS etc):

```s
> go run main.go
        _______ __
  ____ / ____(_) /_  ___  _____   HOST   127.0.0.1  OS    DARWIN
_____ / /_  / / __ \/ _ \/ ___/   PORT   3000       CORES 8
  __ / __/ / / /_/ /  __/ /       TLS    FALSE      MEM   16G
    /_/   /_/_.___/\___/_/1.12.3  ROUTES 1          PPID  70043
```

We only currently have the one route at `http://localhost:3000/`. Let's fire a call that way in a fresh terminal window.

```s
> curl http://localhost:3000
Hello, World 👋!%
```

We are in business!

<Ad />

## Using POST requests

Let's add our first basic POST request! In this example, we want to simply pass some data and send it back.

The basic `Body` signature from docs is the following:

```s
c.Body() string
```

This tells us that the Fiber Context has a `Body` function that will return a string. Let's see this in action!

```go
// the rest of the code is omitted for brevity
// add to your main function

app.Post("/first", func(c *fiber.Ctx) {
   // Get raw body from POST request:
   body := c.Body() // user=john
   c.Send(body)
})
```

Here, we are going to use the `Post` method to setup a POST route that takes two arguments similar to what we have for the GET route! The route path and a function to handle what is sent to that route.

Let's fire a cURL request and see what comes back:

```s
> curl -X POST http://localhost:3000 -d hello=world
hello=world%
```

Peaches! We get back what we send as expected.

<Ad />

## Binding the request body to a struct

We can use `BodyParser` out-of-the-box to support decoding query parameters:

```go
c.BodyParser(out interface{}) error
```

This tells us that we pass an `interface` as an argument to which the request body will be binded to, and will get out an error `err` if there are any issues.

From the docs, we can see the following `Content-Type` headers are supported:

- application/json
- application/xml
- application/x-www-form-urlencoded
- multipart/form-data

Let's use an example passing these different data types!

Update the `main.go` file to look like the following:

```go
package main

import (
  "github.com/gofiber/fiber"
  "log"
)

// Person field names should start with an uppercase letter
type Person struct {
	Name string `json:"name" xml:"name" form:"name" query:"name"`
	Age uint8 `json:"age" xml:"age" form:"age" query:"age"`
}

func main() {
  app := fiber.New()

  app.Get("/", func(c *fiber.Ctx) {
    c.Send("Hello, World 👋!")
	})

	app.Post("/first", func(c *fiber.Ctx) {
		// Get raw body from POST request:
		body := c.Body() // user=john
		c.Send(body)
	})

	app.Post("/person", func(c *fiber.Ctx) {
		// Create new person p
		p := new(Person)

		// Bind data to p or log error
		if err := c.BodyParser(p); err != nil {
        log.Println(err)
				c.Status(500).Send("Failed")
				return
		}

		log.Println(p.Name)
		log.Println(p.Age)

		c.Send("Success")
	})

  app.Listen(3000)
}
```

> We are adding the "log" package in the imports to log some values to the console.

We've added a `/person` route to handle accepting POST data for the values of "name" and "age". You may be wondering why I've gone with `uint8` as well. `uint8` gives us eight bits, and since a bit can be 0 or 1, we get 2^8 for an unsigned int. This gives us values from 0 up to 255 in value - more than the age of any person. We are also going unsigned as you cannot have a negative age. Small details really, but this is just for memory efficiency.

Let's run some examples to see what we get from the command line passing the different types (and one with an error):

```s
# JSON
> curl -X POST -H "Content-Type: application/json" --data "{\"name\":\"Dennis\",\"age\":27}" localhost:3000/person
Success%
# XML
> curl -X POST -H "Content-Type: application/xml" --data "<login><name>Dennis</name><age>27</age></login>" localhost:3000/person
Success%
# x-www-form-urlencoded
> curl -X POST -H "Content-Type: application/x-www-form-urlencoded" --data "name=Dennis&age=27" localhost:3000/person
Success%
# Form data
> curl -X POST -F name=Dennis -F age=27 http://localhost:3000/person
Success%
# Query values
> curl -X POST "http://localhost:3000/person?name=Dennis&age=27"
Success%
# Error Example passing age as a string
> curl -X POST -H "Content-Type: application/json" --data "{\"name\":\"Dennis\",\"age\":\"27\"}" localhost:3000/person
Failed%
```

You'll notice that in our other terminal where the server is running, we then get the following messages:

```s
        _______ __
  ____ / ____(_) /_  ___  _____   HOST   127.0.0.1  OS    DARWIN
_____ / /_  / / __ \/ _ \/ ___/   PORT   3000       CORES 8
  __ / __/ / / /_/ /  __/ /       TLS    FALSE      MEM   16G
    /_/   /_/_.___/\___/_/1.12.3  ROUTES 3          PPID  72661

2020/07/04 09:47:38 Dennis
2020/07/04 09:47:38 27
2020/07/04 09:47:52 Dennis
2020/07/04 09:47:52 27
2020/07/04 09:47:58 Dennis
2020/07/04 09:47:58 27
2020/07/04 09:48:16 Dennis
2020/07/04 09:48:16 27
2020/07/04 09:48:21 Dennis
2020/07/04 09:49:24 json: cannot unmarshal string into Go struct field Person.age of type uint8
```

Nice! Things are up and running!

<Ad />

## Returning JSON

In the last example today, let's unmarshall the values, edit them a little bit and then return them back as JSON!

From the docs, we can do this using context's `JSON` method. Here is the signature:

```go
c.JSON(v interface{}) error
```

Similar to the POST calls, it takes an interface to bind the data to and will surface an error if there is an issue.

We are going to reuse our `Person` struct that we already have.

Add the following as our final route in the `main.go` file:

```go
app.Post("/json", func(c *fiber.Ctx) {
  // Create new person p
  p := new(Person)

  // Bind data to p or log error
  if err := c.BodyParser(p); err != nil {
    log.Println(err)
    c.Status(500).Send("Failed")
    return
  }

  // Create data struct:
  data := Person{
    Name: strings.ToUpper(p.Name),
    Age:  p.Age + 10,
  }

  if err := c.JSON(data); err != nil {
    c.Status(500).Send(err)
    return
  }
})
```

And ensure to add `strings` to our imports:

```go
import (
  "github.com/gofiber/fiber"
	"log"
  "strings"
)
```

We are ready to go! Restart the server and we'll send the same JSON request we did above but to the `/json` route:

```s
> curl -X POST -H "Content-Type: application/json" --data "{\"name\":\"Dennis\",\"age\":27}" localhost:3000/json -v
{"name":"DENNIS","age":37}%
```

Woo! Our uppercased name and age with an extra decade have come back!.

If we run the same cURL with `-v` for verbose, we can get a little extra info:

```s
> curl -X POST -H "Content-Type: application/json" --data "{\"name\":\"Dennis\",\"age\":27}" localhost:3000/json -v
Note: Unnecessary use of -X or --request, POST is already inferred.
*   Trying ::1...
* TCP_NODELAY set
* Connection failed
* connect to ::1 port 3000 failed: Connection refused
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 3000 (#0)
> POST /json HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.54.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 26
>
* upload completely sent off: 26 out of 26 bytes
< HTTP/1.1 200 OK
< Date: Sat, 04 Jul 2020 00:02:38 GMT
< Content-Type: application/json
< Content-Length: 26
<
* Connection #0 to host localhost left intact
{"name":"DENNIS","age":37}%
```

There are some intering points that come from here. For starters, apparently I've been using `-X` unnecessarily my whole life (oops). Secondly, we can see that the `Content-Type` we get back with our called it already set to be `application/json` thanks to the `c.JSON` method!

<Ad />

## Wrap Up

In today's post, we went through the basics with the Fiber library for getting setup, basic GET and POST requests, plus how to handle POST data and return JSON.

Between this information, you are already in a great position to start building out some wickedly cool APIs. Bring in any other Go knowledge you already have and the world is your oyster!

We'll continue using Fiber in the following blog posts and start getting into handling things like deployments and connecting to databases!

<Ad />

## Final code

Here is our final `main.go` file:

```go
package main

import (
	"github.com/gofiber/fiber"
	"log"
	"strings"
)

// Person field names should start with an uppercase letter
type Person struct {
	Name string `json:"name" xml:"name" form:"name" query:"name"`
	Age uint8 `json:"age" xml:"age" form:"age" query:"age"`
}

func main() {
  app := fiber.New()

  app.Get("/", func(c *fiber.Ctx) {
    c.Send("Hello, World 👋!")
	})

	app.Post("/first", func(c *fiber.Ctx) {
		// Get raw body from POST request:
		body := c.Body() // user=john
		c.Send(body)
	})

	app.Post("/person", func(c *fiber.Ctx) {
		// Create new person p
		p := new(Person)

		// Bind data to p or log error
		if err := c.BodyParser(p); err != nil {
				log.Println(err)
				c.Status(500).Send("Failed")
				return
		}

		log.Println(p.Name)
		log.Println(p.Age)

		c.Send("Success")
	})

	app.Post("/json", func(c *fiber.Ctx) {
		// Create new person p
		p := new(Person)

		// Bind data to p or log error
		if err := c.BodyParser(p); err != nil {
			log.Println(err)
			c.Status(500).Send("Failed")
			return
		}

		// Create data struct:
		data := Person{
			Name: strings.ToUpper(p.Name),
			Age:  p.Age + 10,
		}

		if err := c.JSON(data); err != nil {
			c.Status(500).Send(err)
			return
		}
	})

  app.Listen(3000)
}
```

<Ad />

## Resources and Further Reading

1. [Completed project](https://github.com/okeeffed/hello-fiber)
2. [fiber - GitHub](https://github.com/gofiber/fiber)
3. [fiber recipes - GitHub](https://github.com/gofiber/recipes)
4. [Go - installation](https://golang.org/doc/install)
5. [Go - Brew Formulae](https://formulae.brew.sh/formula/go)
6. [Go - strings package](https://golang.org/pkg/strings/)
7. [Go - log package](https://golang.org/pkg/log/)

_Image credit: [Franck V.](https://unsplash.com/@franckinjapan)_
