---
title: Authentication with Next Auth
description: Use Next Auth to login into a Next.js application using GitHub Credentials, and store them in a local MySQL Docker container
date: "2020-06-24"
---

In this example, we are going to use "Next Auth" to do some basic authentication from their example and set up a MySQL DB in a local development Docker container to store the session and user information.

The prerequisites are that you have Docker and the use Nodejs suspects installed.

Understanding some basics behind Docker and MySQL is recommended, but not essential to get to the end (famous last words).

<Ad />

## Setting up MySQL with Docker

```shell
docker pull mysql/mysql-server
docker run --name sql-test -e MYSQL_ROOT_PASSWORD=password -p 6000:3306 -d mysql/mysql-server:latest
# confirm container running
docker ps
```

You should see something like the following:

```s
CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS                            PORTS                               NAMES
30be83a35610        mysql/mysql-server:latest   "/entrypoint.sh mysq…"   6 seconds ago       Up 2 seconds (health: starting)   33060/tcp, 0.0.0.0:6000->3306/tcp   sql-test
```

> Note that anything store in the container will be lost without persisting the data. For development purposes, this is okay by us.

We have the server port forwarding from 3306 on the container to 6000 for us to access on localhost.

```s
# where 30be83a35610 is there CONTAINER ID
docker exec 30be83a35610 -it /bin/bash
```

This will take you into the Docker container shell, where we can login into MySQL.

```s
mysql -u root -p
# enter "password" when prompted
```

> You can go straight into mysql from the docker exec, but I thought going the long way might be more fun for those playing around with containers.

Now we can create a database to use for this example.

```sql
create database next_auth;
show databases;
-- you should now be able to see "next_auth"
```

In order to get things going, you may need to make some changes. I had to do the following.

```sql
UPDATE mysql.user SET Host='%' WHERE Host='localhost' AND User='root';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;
```

> Note: Using the root isn't a great idea, but this is simply for demonstration purposes and to get things up and running.

For here, you can `exit` the MySQL shell and run `exit` it again to leave the Docker container.

### Setting up Next.js

We are going to use a basic setup using `create-next-app` and make some adjustments from there.

```shell
npx create-next-app
```

Fill out the defaults for it to move onto the next part of installing some extra packages.

```shell
yarn add next-auth mysql dotenv
```

> We are using "dotenv" for loading a local `.env` file for local development.

Here, we are just going to use [GitHub OAuth](https://next-auth.js.org/providers/github) for logging in.

<Ad />

## Setting up Next Auth in the application

Create a file `pages/api/auth/[...nextauth].js`.

Add the following:

```javascript
import NextAuth from "next-auth"
import Providers from "next-auth/providers"

require("dotenv").config()

const options = {
  site: process.env.SITE || "http://localhost:3000",

  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL,
}

export default (req, res) => NextAuth(req, res, options)
```

Then we will update the `pages/index.js` to show a basic login format taken from the Next Auth example:

```javascript
import React from "react"
import { useSession } from "next-auth/client"

export default () => {
  const [session, loading] = useSession()

  return (
    <p>
      {!session && (
        <>
          Not signed in <br />
          <a href="/api/auth/signin">Sign in</a>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <a href="/api/auth/signout">Sign out</a>
        </>
      )}
    </p>
  )
}
```

That is all we need to do for the application! We won't start running anything just yet... there are a couple of things we want to get setup first.

<Ad />

## Setting up ngrok

We are using tunneling to forward our localhost address out to the big, bad world.

If you haven't got [ngrok](https://ngrok.com/) installed, visit the website for setup instructions. If you use Brew, you can use `brew cask install ngrok`.

```s
ngrok http 3000 # will forward 3000 out
```

Once you run that, you will get an address to use.

> Alternatively, you may use [PageKite](https://pagekite.net/) as another tunneling service.

Here a look at my editor once ngrok was up and running in the terminal:

![ngrok](../assets/2020-06-24-ngrok-running.png)

<Ad />

## Setting up GitHub OAuth

Follow the guide on how to set up a [GitHub OAuth Application](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)

We will need to grab both the ID and the token given back.

> Note: For the authentication callback, you will need to keep the format `{server}/api/auth/callback/{provider}`. This will be the ngrok server address.

This is a look at how my setup was for this particular example:

![GitHub OAuth App](../assets/2020-06-24-github-oauth-app-example.png)

<Ad />

## Env Variables

We are now at a place where we need to create our `.env` file and add the credentials and address that we got from before:

```shell
GITHUB_ID=<from-github>
GITHUB_SECRET=<from-github>
# The MySQL database being forwarded from Docker,
# where 'next_auth' is the database we created
DATABASE_URL="mysql://root:password@127.0.0.1:6000/next_auth?synchronize=true"
SITE=<ngrok-server>
```

> For the `DATABASE_URL`, note that we are running on port 6000 as we are forwarding from 3306 on the Docker container to 6000. This ensures you won't clash with any local MySQL application you may have running on your local machine. The `next_auth` is the name of the database we creating in the initial steps.

<Ad />

## Running Dev

Now is the fun part.

```shell
yarn dev
```

If we head to `http://localhost:3000`, we will see the application, however we want to head to the ngrok address instead in our case.

![Homepage](../assets/2020-06-24-login.png)

If we click on `sign in`, we'll be taken to a default setup page for logging in with GitHub.

![Login](../assets/2020-06-24-github-login.png)

Clicking this will take you through a familiar flow for signing into an OAuth app with GitHub.

![GitHub App acceptance](../assets/2020-06-24-github-auth.png)

Finally, once the callback runs its normal phase, we will arrive back home.

![Post-auth](../assets/2020-06-24-signed-in.png)

Notice now that we are now signed in! Hooray!

<Ad />

## Checking out what changed in MySQL

Given that we opted to use a database to store sessions, we could now attach to the Docker container once again and jump into MySQL.

Once back into the MySQL shell, run the following:

```sql
USE next_auth;
SHOW tables;
SELECT * FROM sessions;
SELECT * FROM users;
```

Here we can see our info has come across! Easy peasy!

![MySQL DB](../assets/2020-06-24-checking-in-docker-mysql-container.png)

This has been a real barebones look at working with MySQL within a Docker container and running a Nextjs app with Next Auth, but there are a bunch of really next OAuth and database options they support - each essentially a similar approach as the above! Jump onto their docs and play around.

<Ad />

## Resources and Further Reading

1. [Next.js - Getting Started](https://nextjs.org/docs/getting-started)
2. [Next Auth](https://next-auth.js.org/providers/credentials)
3. [Set up a GitHub OAuth Application](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)
4. [Ngrok](https://ngrok.com/)
5. [Ngrok alternative - PageKite](https://pagekite.net/)
6. [Docker - mysql/mysql-server](https://hub.docker.com/r/mysql/mysql-server/)
