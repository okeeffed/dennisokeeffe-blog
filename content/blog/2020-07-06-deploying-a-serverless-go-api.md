---
title: Deploying Serverless Golang APIs With The AWS CDK
description: Deploy your first
date: "2020-07-06"
---

After our last piece looking into [Go Servers with Fiber](https://dev.to/okeeffed/dipping-your-feet-into-servers-with-golang-fiber-4kop), we are going to continue and take this to the next step: deploying a serverless API on AWS.

There is something important at this point that I need to mention: we are not going to use the [Fiber](https://github.com/gofiber/fiber) library that we looked at in the last article. In fact, we are going to use Gin.

Why? There is support from AWS Labs that enables us to deploy Gin. Simple as that! Luckily, we will be taking one simple example from the Gin framework to get things up and running!

This tutorial expects that you have Golang installed and the AWS CDK for TypeScript.

## Setting up the project

Inside of the terminal, we are going to set up a monorepo that contains a `infra` folder for our AWS CDK infrastructure and a `functions` folder to hold our Lambda functions:

```s
mkdir hello-gin-lambda-aws-cdk
cd hello-gin-lambda-aws-cdk
mkdir functions infra
```

## Writing our Go lambda server

Let's jump into the `functions` folder and make a folder for the Gin server that we will work in for the Lambda function!

Once we create the folder, we will add a simple `main.go` file.

```s
cd functions
mkdir gin-server
cd gin-server
touch main.go
```

Inside of the Go file, let's add the following:

```go
package main

import (
	"log"
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
)

var ginLambda *ginadapter.GinLambda

// init the Gin Server
func init() {
	// stdout and stderr are sent to AWS CloudWatch Logs
	log.Printf("Gin cold start")
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	ginLambda = ginadapter.New(r)
}

// Handler will deal with Gin working with Lambda
func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}
```

Let's go through this part-by-part!

1. Import the required packages, including the dependencies required
2. Declare a variable `ginLambda`
3. Write a `init` function which handles the running of the Gin server
4. A `Handler` function that will deal with Gin when running with Lambda
5. A `main` entry function that starts the `Handler`

The `init` function is special function that is run prior to main during package initialization. Read more about [init in this great article](https://medium.com/golangspec/init-functions-in-go-eac191b3860a).

> If you have not yet, be sure to `go get <package>` for the non-standard library packages we are installed from GitHub.

Starting a Gin server is nice and straightforward too:

```go
r := gin.Default()
r.GET("/ping", func(c *gin.Context) {
   c.JSON(200, gin.H{
      "message": "pong",
   })
})
```

Here we are simple starting a server with only one GET route `/ping` which simply returns some basic JSON.

This API is _**super, super simple**_, but the main focus is to get it up and running!

## Go Lambda

For us to be able to deploy this, we need to build the Go binary and follow some [guidelines](https://docs.aws.amazon.com/lambda/latest/dg/golang-package.html) on how it needs to be built.

The guideline link above will show requirements for different systems, but in the case of Mac, you need to run `go build` with the following environment variables:

```s
GOOS=linux GOARCH=amd64 go build -o main main.go
```

Inline those environment variables means that they will be environment variables only while executing that line in the terminal.

Once you have run this, our `main` binary output (from the `-o` flag) will be what we need to reference when deploying via the AWS CDK.

## Deploying our Go Lambda function using the CDK

Change back into our `infra` folder from the root of the project and initialize a new Node project.

```s
# give default answers
npm init -y
```

This will generate the `package.json` file. If you want a reference, you can follow the layout I have in my `infra/package.json` file.

```json
{
  "name": "infra",
  "version": "1.0.0",
  "description": "Infra for serverless Golang API",
  "private": true,
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "cdk": "cdk",
    "deploy": "cdk deploy",
    "destroy": "cdk destroy",
    "synth": "cdk synth"
  },
  "author": {
    "name": "Amazon Web Services",
    "url": "https://aws.amazon.com",
    "organization": true
  },
  "license": "Apache-2.0",
  "devDependencies": {
    "@types/node": "^10.17.26",
    "typescript": "~3.7.2"
  },
  "dependencies": {
    "@aws-cdk/aws-apigateway": "^1.49.1",
    "@aws-cdk/aws-events": "*",
    "@aws-cdk/aws-events-targets": "*",
    "@aws-cdk/aws-lambda": "*",
    "@aws-cdk/aws-s3-assets": "^1.46.0",
    "@aws-cdk/core": "*"
  }
}
```

If you've have copied the above in, make sure you install the dependencies running `npm install`.

You'll also want to create a `infra/tsconfig.json` file and add the following:

```s
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "lib": ["es2016", "es2017.object", "es2017.string"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": false,
    "inlineSourceMap": true,
    "inlineSources": true,
    "experimentalDecorators": true,
    "strictPropertyInitialization": false
  }
}
```

Finally, add a `infra/cdk.json` file and add this:

```json
{
  "app": "node index"
}
```

These are all required config for transpiling the TypeScript and running the CDK.

## Writing the infrastructure code

Now, inside of `infra/index.ts` we will add our simple stack:

```typescript
import lambda = require("@aws-cdk/aws-lambda")
import apigw = require("@aws-cdk/aws-apigateway")
import cdk = require("@aws-cdk/core")
import assets = require("@aws-cdk/aws-s3-assets")
import path = require("path")

export class GoAPILambdaStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id)

    // The following Golang example defines an directory
    // asset which is archived as a .zip file and uploaded to
    // S3 during deployment.
    // See https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-assets-readme.html
    const myLambdaAsset = new assets.Asset(
      // @ts-ignore - this expects Construct not cdk.Construct :thinking:
      this,
      "HelloGoServerLambdaFnZip",
      {
        path: path.join(__dirname, "../functions/gin-server"),
      }
    )

    const lambdaFn = new lambda.Function(this, "HelloGoServerLambdaFn", {
      code: lambda.Code.fromBucket(
        myLambdaAsset.bucket,
        myLambdaAsset.s3ObjectKey
      ),
      timeout: cdk.Duration.seconds(300),
      runtime: lambda.Runtime.GO_1_X,
      handler: "main",
    })

    // API Gateway
    new apigw.LambdaRestApi(
      // @ts-ignore - this expects Construct not cdk.Construct :thinking:
      this,
      "HelloGoServerLambdaFnEndpoint",
      {
        handler: lambdaFn,
      }
    )
  }
}

const app = new cdk.App()
new GoAPILambdaStack(app, "HelloGoServerLambdaFn")
app.synth()
```

> Important to note: above I have two `@ts-ignore` comments. The first argument was throwing type errors which I didn't read too deep into... so I used `ts-ignore` to silence them during build.

Here, we do the following:

1. Import the required packages
2. Export a class that the CDK app will synthesize
3. Create a new `app` from the `cdk` package to pass to the class constructor
4. Synthesize the app

The magic itself happens in the class we declare `GoAPILambdaStack`. Inside of here, we need to accomplish three things:

1. Zip up and store the assets in an S3 bucket that will be called at runtime
2. Create the lambda function
3. Add the lambda function to API Gateway to add an endpoint for us to access

I'm not going to dive too deep into number one and three. The important information that may seemingly come out of no where is in the Lambda constructor:

```ts
const lambdaFn = new lambda.Function(this, "HelloGoServerLambdaFn", {
  code: lambda.Code.fromBucket(myLambdaAsset.bucket, myLambdaAsset.s3ObjectKey),
  timeout: cdk.Duration.seconds(300),
  runtime: lambda.Runtime.GO_1_X,
  handler: "main",
})
```

So let's explain the third options argument pass to the `lambda.Function`:

- code: We are telling this value to get the code to execute from the lambda asset we created above. This will be the zip of our Golang function folder `gin-server`
- timeout: a simple max duration of 300s
- runtime: Here we tell the CDK we want to use the Go runtime supported in lambda
- handler: Here we define the binary output we generated that we want to call

With this simple code stack, we are ready to deploy!

> Note: As this is a simple stack, I have opted just to keep it all in the one file. For best practices, I recommend checking out the [open CDK](https://github.com/kevinslin/open-cdk) repo if you want to define more structure.

## Deploying the code

If you are using my `package.json` example I provided above, there will be some scripts we can use to help run:

```json
{
  // rest omitted from brevity
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "cdk": "cdk",
    "deploy": "cdk deploy",
    "destroy": "cdk destroy",
    "synth": "cdk synth"
  }
}
```

First, we can run `npm run build` to compile our `index.ts` file to `index.js`.

Once that is done, we can run `cdk synth` followed by `cdk deploy` to start running our deployment!

If successful, the CDK will give you a URL back in the terminal that we can now use to run our simple cURL. Grab it run it with the `/ping` for our GET route and you can get back our expected `pong` JSON!

```s
> curl https://url-example.us-east-1.amazonaws.com/prod/ping
{"message":"pong"}
```

Great success!

As a bonus, the lambda function will also send our logs to AWS CloudWatch. If you jump onto your AWS console and click through to the CloudWatch logs, you will end up with something similar to the following:

```s
2020-07-06T09:04:08.623+10:00
START RequestId: 57c62f65-d48d-40bf-a484-39f63169a6ca Version: $LATEST

2020-07-06T09:04:08.623+10:00
2020/07/05 23:04:08 Gin cold start

2020-07-06T09:04:08.623+10:00
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

2020-07-06T09:04:08.623+10:00
[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.

2020-07-06T09:04:08.623+10:00
- using env: export GIN_MODE=release

2020-07-06T09:04:08.623+10:00
- using code: gin.SetMode(gin.ReleaseMode)

2020-07-06T09:04:08.623+10:00
[GIN-debug] GET /ping --> main.init.0.func1 (3 handlers)

2020-07-06T09:04:08.634+10:00
[GIN] 2020/07/05 - 23:04:08 | 200 | 18.267µs | 211.27.74.18 | GET /ping

2020-07-06T09:04:08.653+10:00
END RequestId: 57c62f65-d48d-40bf-a484-39f63169a6ca

2020-07-06T09:04:08.653+10:00
REPORT RequestId: 57c62f65-d48d-40bf-a484-39f63169a6ca Duration: 21.35 ms Billed Duration: 100 ms Memory Size: 128 MB Max Memory Used: 39 MB Init Duration: 108.66 ms
```

Congratulations! You have just deployed an incredibly useless serverless Go API! Now you can go forth and start adding your own routes and endpoints and make this simple Ping Pong API do some incredible things.

## Conclusion

Today's post is a bit of a whirlwind into deploying a Go binary to AWS using the CDK to run a serverless API.

While brief, we have covered **a lot** of ground.

As always, these small projects kickstart the bigger applications, so I hope you are inspired to start running some neat Go lambda functions!

## Resources and Further Reading

1. [Fiber - GitHub](https://github.com/gofiber/fiber)
2. [Gin - GitHub](https://github.com/gin-gonic/gin)
3. [Go Servers with Fiber Blog Post](https://dev.to/okeeffed/dipping-your-feet-into-servers-with-golang-fiber-4kop)
4. [AWS CDK reference](https://docs.aws.amazon.com/cdk/latest/guide/reference.html)

_Image credit: [Jr Korpa](https://unsplash.com/@korpa)_
