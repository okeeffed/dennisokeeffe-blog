---
title: Yargs Parser
date: "2018-10-12"
description: Say hello to an easy way to parse CLI args and options with yargs parser.
---

# Hello Series #3: Parsing args with Yargs Parser

Published: 20th September 2018

[Yargs parser](https://github.com/yargs/yargs-parser) is an incredibly basic option parser for the command line.

This is a basic library I tend to use a lot for any of my CLI tools that I am building out.

## Installation

```bash
# NPM
npm install yargs-parser --save

# or yarn
yarn add yargs-parser
```

## Example code

The main use case we will use is for options and arguments passed from the command line.

First, create an index.js file and require the following:

```javascript
var argv = require("yargs-parser")(process.argv.slice(2))
console.log(argv)
```

Now we can already run the script from the command line, pass options and arguments and see what happens:

```bash
node index.js hello --foo=33 --bar world
# prints { _: ['hello'], foo: 33, bar: 'world' }
```

If we disect the above command, we note that anything passed after `node index.js` becomes an accessible argument from our `argv` object under `argv._`. All the other options passed as the object key as a property of `argv` with the corresponding value passed.

Taking all this into account, the above is now accesible as follows:

```javascript
var argv = require("yargs-parser")(process.argv.slice(2))
console.log(argv._[0]) // hello
console.log(argv.foo) // 33
console.log(argv.bar) // world
```

Great! Now we can start building our Node.js commandline tools.

For now, let's just set up a basic example of how you could run a command line tool that just logs out some basic information based on the first argument passed and options.

```javascript
var argv = require("yargs-parser")(process.argv.slice(2))

const help = `
    Usage
    $ node index.js <action> <option>

    Action
    ---
    hello [name]    Echoes hello. Defaults to "world".
    friends         Echoes what they are

    Examples
    $ node index.js hello
    $ node index.js hello --name clark
    $ node index.js friends
`

const hello = () => {
  const name = argv.name ? argv.name : "clark"
  console.log(`hello ${name}`)
}

const friends = () => console.log("are like flowers")

/**
 * Run a function based on the argument provided.
 *
 */
const main = async () => {
  try {
    switch (argv._[0]) {
      case "hello":
        hello()
        break
      case "friends":
        friends()
        break
      default:
        console.log(help)
        break
    }
  } catch (err) {
    console.error(err)
  }
}

// Run the program
main()
```

Now we can run our tool above!

```bash
node index.js hello
# prints hello clark
node index.js hello --name tim
# prints hello tim
node index.js hello --name=bob
# prints hello bob
node index.js friends
# prints are like flowers
```

Get creative and start building some useful Node.js CLI tools for your workflow.

Code can be [found on my Github](https://github.com/okeeffed/hello-yargs).

_**Hello** is a series that is about short, sharp examples. Read more on this series to find small gems to add your toolset._
