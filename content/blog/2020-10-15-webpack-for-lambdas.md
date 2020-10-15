---
title: Webpack 5 Builds for AWS Lambda with TypeScript
description: Using Webpack 5 to build lambdas for AWS deployments
date: "2020-10-15"
tags: typescript,javascript,webpack,lambda,aws
---

In a previous post, I wrote about [self-destructing tweets](https://blog.dennisokeeffe.com/blog/2020-10-05-self-destructing-tweets/) which runs as an AWS Lambda function every night at midnight.

While that post was about the code itself, most of the AWS CDK infrastructure information had been written in a previous post about [sending a serverless Slack message](https://blog.dennisokeeffe.com/blog/2020-06-22-cdk-lambda-to-send-slack-message/) which demonstrated how to run an AWS Lambda on a cron timer.

Today's post will be a short overview that bridges these together: it shows how I bundled the TypeScript code from the Twitter post with node modules and prepare it for deployment.

## The Folder Structure

I am making assumptions here. The most "complex" set up I normally have for Lambdas is to write them in TypeScript and use Babel for transpilation.

Given this will be a familiar standing for most, let's work with that.

Here is how most of my lambdas following this structure will look from within the function folder:

```s
.
├── nodemon.json
├── package-lock.json
├── package.json
├── src
│   ├── index.local.ts
│   ├── index.ts
│   └── function.ts
├── tsconfig.json
├── .babelrc
└── webpack.config.js
```

Casting aside the Nodemon file, the important parts for the build are basically `.babelrc`, `src/index.ts` and `webpack.config.js`.

You might also note I have both an `index.ts` and `index.local.ts` file. `index.ts` in my project is generally the entry point for the lambda, where the `index.local.ts` file is normally just used for local development where I swap out my lambda handler for code that let's me run.

Both generally import the main function from another file (here denoted as `function.ts`) and just call it.

> Webpack will bundle everything into one file later, so it is fine for me to structure the folder however I see fit.

## Setting Up Your Own Project

Inside of a fresh npm project that houses a TypeScript lambda, we need to add to required Babel and Webpack dependencies:

```s
npm i --save-dev \
  # install required babel deps
  @babel/core \
  @babel/preset-env \
  @babel/preset-typescript \
  # webpack deps and loaders required
  webpack \
  webpack-cli \
  babel-loader \
  cache-loader \
  fork-ts-checker-webpack-plugin \
  # finally install TypeScript
  typescript
```

Once installed, we can set up Babel and TypeScript.

## Babel Run Command File

Inside of `.babelrc`, add the following:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "12"
        }
      }
    ],
    ["@babel/preset-typescript"]
  ]
}
```

For those unfamiliar with Babel, we are telling it to use the `@babel/preset-env` and `@babel/preset-typescript` plugins, and adding some configuration options to the env preset to target Node 12 (which is what normally I target in AWS lambda).

## Setting Up TypeScript

This part you will need to adjust to flavour, but here is the config that I have for the Twitter bot:

```json
{
  "compilerOptions": {
    "module": "es2015",
    "target": "esnext",
    "outDir": "./dist",
    "strict": false,
    "types": ["node"],
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "lib": ["ES2020.Promise"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

Given that we are using Webpack, the config above likely doesn't need to be so complex with `outDir` etc, but I will leave it to you to figure out what options you want there.

## Webpack

In this example, I am expecting that you are using Webpack 5.

In `webpack.config.js`:

```js
const path = require("path")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, "dist"),
    filename: "index.js",
  },
  target: "node",
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "cache-loader",
            options: {
              cacheDirectory: path.resolve(".webpackCache"),
            },
          },
          "babel-loader",
        ],
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
}
```

Given I don't use Webpack for local development of the lambda, I always have it set for production.

Here we tell Webpack to set the `src/index.ts` as the entry point and to convert to `commonjs`.

We set our Babel and Cache loaders to test and compile any `ts` or `js` file that it finds from that entry point.

Given that we are not using Node Externals which avoids bundling node modules, then any node modules required will also be compiled into the output.

That means that the output in `dist/index.js` which run our project without node modules installed, which is perfect for AWS Lambda!

## Testing Your Projects

I use [lambda-local](https://github.com/ashiina/lambda-local) for testing the build before deployment with the AWS CDK. It targets Nodejs, which is perfect for your TypeScript/JavaScript projects!

Follow the instructions on the website to install and give it a whirl! If things run smoothly, you can be confident with your deployment.

## Conclusion

This post focused purely on the build process. As mentioned in the intro, some of my other posts will cover writing lambda functions and the actual AWS CDK deployments.

## Resources and Further Reading

1. [Self-Destructing Tweets](https://blog.dennisokeeffe.com/blog/2020-10-05-self-destructing-tweets/)
2. [Sending a serverless Slack message](https://blog.dennisokeeffe.com/blog/2020-06-22-cdk-lambda-to-send-slack-message/)
3. [lambda-local](https://github.com/ashiina/lambda-local)
