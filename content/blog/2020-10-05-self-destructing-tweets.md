---
title: Self-Destructing Tweets
description: A look into how you can run a cron job to self-destruct tweets
date: "2020-09-30"
tags: javascript,typescript,tutorial,beginner
---

I will be the first to admit it: _**I don't like socia media**_.

It's not that I do not enjoy the idea of staying connected with the ones that I love and having a way to keep up with their lives. In fact, the dream would be to use social media for just that.

The reason I do not like social media is because **social media has more control over me than I have over it**. There, I admitted it. Happy?

Call me overly-optimistic, but I still believe that I can still somehow make it work. However, to make it work for me is going to require some _fine tuning_.

Fine tuning for Facebook and Instagram meant deleting it. I did this six months ago. I am sure there will be a use case for the Facebook account down the track for business and advertising reasons, but applying Occam's razor to why I used both applications at moment _was not for business purposes_, ergo I gave it the flick.

As for Twitter, it can be a real negative Nancy, however I do get a number of really important notifications from there. What I want to do with Twitter is minimise the negativity and remove any trace of my history from the app where I can.

To start this process, I built a simple Twitter bot that runs on a cron job and will delete any tweet older than seven days from my profile.

In this tutorial, I will demonstrate the first part of deleting Tweets.

## Prerequisites

1. Basic Nodejs understanding.
2. Basic Typescript understanding.
3. Read my post on [Building Your First Twitter Bot With JavaScript](https://blog.dennisokeeffe.com/blog/2020-07-11-twitter-bot/). I will not double over that content.
4. Read my post on [Using the AWS CDK to invoke a Lambda function during a cron job](https://blog.dennisokeeffe.com/blog/2020-06-22-cdk-lambda-to-send-slack-message/). I will not cover the cron job part today in this tutorial.
5. Your required credentials for [Twit](https://github.com/ttezel/twit).

## Getting started

In a new folder of your choice, run the following:

```s
npm init -y
npm i twit dayjs
npm i --save-dev @types/twit dotenv esbuild-node-tsc nodemon typescript
mkdir src
touch src/index.js tsconfig.json nodemon.json .env
```

In this tutorial, I wanted to try out [esbuild-node-tsc](https://github.com/a7ul/esbuild-node-tsc) that I saw online last week and [DayJS](https://github.com/iamkun/dayjs) as I haven't yet had a chance to try that one out either!

## Setting up Dotenv

If you followed the prerequisites, you will have your account keys.

Add the keys to the correct variable into `.env`:

```s
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN_KEY=
TWITTER_ACCESS_TOKEN_SECRET=
```

## Setting up TypeScript, Nodemon.json and Package.json

In `tsconfig.json`, we are going to tell it to target Node requirements. We are adding the `ES2020.Promise` lib so we can make use of `Promise.allSettled`, but you could leave it out if you want to use `Promise.all` instead (not that any rejection will result in all rejecting if not `allSettled`).

Add the following to the file:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
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

In `nodemon.json`, we are basically going to tell it is run `etsc` when a file changes with the `ts` extension.

```json
{
  "watch": ["src"],
  "ignore": ["src/**/*.test.ts"],
  "ext": "ts",
  "exec": "etsc && node ./dist/index.js",
  "legacyWatch": true
}
```

As for `package.json`, add the following to the scripts key (the rest is omitted for brevity):

```json
{
  "scripts": {
    "build": "tsc -p .",
    "start": "nodemon"
  }
}
```

## Creating our Twitter helper file

```s
# from the root
mkdir src/twitter
touch src/twitter/index.ts
```

Inside of `src/twitter/index.ts`, add the following:

```ts
import Twit from "twit"
import { config } from "dotenv"
// Init env vars from the .env file
config()

// Initialise our twitter client
const client = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

// enum to prevent hardcoded string issues
enum TwitterEndpoints {
  updateStatus = "statuses/update",
  destroyStatus = "statuses/destroy/:id",
  getUserTimeline = "statuses/user_timeline",
}

// Getting tweets from the user timeline
type GetUserTimelineFn = (params?: Twit.Params) => Promise<Twit.PromiseResponse>
export const getUserTimeline: GetUserTimelineFn = params =>
  client.get(TwitterEndpoints.getUserTimeline, params)

// Destroy Many Tweets
interface IDestroyManyParams {
  /* Tweet IDs */
  tweets: Twit.Twitter.Status[]
}
type DestroyManyFn = (
  params: IDestroyManyParams
) => Promise<PromiseSettledResult<Twit.PromiseResponse>[]>
export const destroyMany: DestroyManyFn = ({ tweets }) => {
  const promiseArr = tweets.map(tweet =>
    client.post(TwitterEndpoints.destroyStatus, { id: tweet.id_str })
  )
  return Promise.allSettled(promiseArr)
}
```

This post expects you to be able to understand the above, but the long and short of it is that we are using `dotenv` to require the local variables from the `.env` file.

We then have two main functions `getUserTimeline` and `destroyMany` that will get up to `n` tweets from your account and then destroy all those tweets respectively.

Now it is time to write the main script that will make use of these functions.

## Writing the main script

In `src/index.ts`, add the following:

```ts
import dayjs from "dayjs"
import { Twitter } from "twit"
import { getUserTimeline, destroyMany } from "./util/twitter"

type UserTimelineResponse = {
  data: Twitter.Status[]
}

export const main = async () => {
  try {
    // casting as typing Twit.Response gives incorrect data structure
    const res = (await getUserTimeline({ count: 200 })) as UserTimelineResponse

    const tweetsToDelete = []
    for (const tweet of res.data) {
      if (dayjs(tweet.created_at).isBefore(dayjs().subtract(7, "day"))) {
        tweetsToDelete.push({
          text: tweet.text,
          id_str: tweet.id_str,
        })
      }
    }

    const manyDestroyed = await destroyMany({
      tweets: tweetsToDelete,
    })
    console.log(manyDestroyed)
  } catch (err) {
    console.error(err)
  }
}
```

Here we are waiting to get the maximum tweet count (200) with out `getUserTimeline` call, then iterating through the response data to figure out if the create date is older than a week. If it is, we are pushing it to a `tweetsToDelete` array and then finally passing that array to `destroyMany`.

We log out the `manyDestroyed` variable to see which requests were fulfilled and had the tweets deleted.

## Running the script

To run the script mode, run `npm start` (to run with `nodemon` in watch mode). This will start Nodemon and if successful you will see your tweets older than 7 days beginning to delete!

If you've tweeted more than 200 times, you may need to run the script over again a few times until it is comes back with no more to delete!

## Conclusion

This was a quick-fire post, but it was an overview of how I wrote a script to start deleting my tweets older than a week!

Moving on from here, I set up a cron job to run every day at midnight to re-check and delete any other tweets.

I am really hoping this gives _inspires_ (I use the term loosely) to stop posting on Twitter and use it to consume. My next move with Twitter will be to add something that filters tweets on in my feed using some ML/AI.

## Resources and Further Reading

1. [Building Your First Twitter Bot With JavaScript](https://blog.dennisokeeffe.com/blog/2020-07-11-twitter-bot/)
2. [Using the AWS CDK to invoke a Lambda function during a cron job](https://blog.dennisokeeffe.com/blog/2020-06-22-cdk-lambda-to-send-slack-message/)
3. [Twit - GitHub](https://github.com/ttezel/twit)
4. [esbuild-node-tsc - GitHub](https://github.com/a7ul/esbuild-node-tsc)
5. [DayJS - GitHub](https://github.com/iamkun/dayjs)

_Image credit: [Patrick Perkins](https://unsplash.com/@stay_in_touch)_