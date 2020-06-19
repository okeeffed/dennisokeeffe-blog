---
title: Depth Sharp Cli
date: "2018-09-22"
description: Use the incredible Sharp package for Node and build a simple CLI image compression tool.
---

## Intro to Sharp

Sharp is a powerful image compression library for Node. As defined by it's [summary on Github](https://github.com/lovell/sharp), Sharp is a _"High performance Node.js image processing, the fastest module to resize JPEG, PNG, WebP and TIFF images. Uses the libvips library."_

It's simple API means that usage is incredibly simple. It would simply even just reduce image size with the following:

```javascript
// example.js
// usage from cli: node example.js
const sharp = require("sharp")

;(async () => {
  await sharp("path/to/file.jpg").toFile("path/to/file-output.jpg")
})()
```

## Project

While Sharp has some incredible features I recommend delving in, in this scenario we will create a simple script that runs like a command line tool.

This project will be taking some liberties and assuming some knowledge of the `fs`, `util` and `yargs-parser` modules.

### 1. Installation

Initialise a new npm project and run the following:

```bash
# using npm
npm install yargs-parser sharp

# OR using yarn
yarn add yargs-parser sharp
```

### 2. Basic setup

In the below code, we will create a basic setup to use with node on the CLI.

We will do the following:

1. Require modules.
2. Set up a basic help fallback to display when no args equate to a command.
3. Add a basic compressImage function that fires on arg "compress".
4. Add a basic switch function "run" to run when the node script is executed.
5. Run that switch function.

Create a file `index.js` at root of your project and add the following:

```javascript
// 1. Require modules.
const cwd = process.cwd()
const yp = require("yargs-parser")
const argv = yp(process.argv.slice(2))
const sharp = require("sharp")
const fs = require("fs")
const util = require("util")

// 2. Set up a basic help fallback to display when no args equate to a command.
const help = `
    Usage
    $ sharp <action> <option>

    Action
    ---
    compress path/to/file       Compress image
    --width=800, --height=null
    
    batch path/to/folder        Compress folder of images
    --width=800, --height=null

    Examples
    $ sharp compress path/to/file
    $ sharp compress path/to/file --width 200
`

// 3. Add a basic compressImage function that fires on arg "compress".
/**
 * Compress an image.
 *
 * @param {*} file The path to the file.
 */
const compressImage = async () => {
  try {
    console.log("[node index.js compress] fires!")
  } catch (err) {
    console.error("Errored", err)
  }
}

// 4. Add a basic switch to run when the node script is executed.
/**
 * Run a function based on the argument provided.
 *
 */
const run = async () => {
  console.log("Running Image Compression CLI")

  try {
    switch (argv._[0]) {
      case "compress":
        compressImage()
        break
      default:
        console.log(help)
        break
    }
  } catch (err) {
    console.error(err)
  }
}

// 5. Run that switch function.
run()
```

From the command line, if you now run `node index.js compress` you should get the `console.log` message that the `compressImage` function fired and for any argument the `help` variable should log out!

### 3. Adding basic compression to a file

Now in the compressImage function, we will update the code to take a `file` argument that is passed as an argument from the command line.

To pass this argument, we will add `argv._[1]` as the argument passed in the switch that calls the `compressImage` function.

Sharp itself requires an output file name that is different to the input, so for the sake of the example, we will just add some logic to set a file `file-name.jpg` to output as `file-name-compressed.jpg` (this assumption goes off the idea that there is only one '.' within the file name). This naming can be done with some small string manipulation and will be set as `output`.

We will also update the code so that if our command line passes a `width` flag, it will resize the image to that width. We can do this with a basic if/else statement block to determine whether or not to fire the `resize` method or not.

Our updated code now looks like so:

```javascript
// Previous code omitted for brevity

/**
 * Compress an image.
 *
 * @param {*} file The path to the file.
 */
const compressImage = async file => {
  try {
    const outputArr = file.split(".")
    const output = outputArr[0] + "-compressed." + outputArr[1]
    let res
    if (argv.width) {
      res = await sharp(file)
        .resize(argv.width)
        .toFile(output)
    } else {
      res = await sharp(file).toFile(output)
    }

    const result = util.inspect(res, { depth: null })
    console.log(`Image compressed! ${result}`)
  } catch (err) {
    console.error("Failed to upload", err)
  }
}

/**
 * Run a function based on the argument provided.
 *
 */
const run = async () => {
  console.log("Running Image Compression CLI")

  try {
    switch (argv._[0]) {
      case "compress":
        compressImage(argv._[1])
        break
      default:
        console.log(help)
        break
    }
  } catch (err) {
    console.error(err)
  }
}

run()
```

Place an image named `example.jpg` (or whatever) in an `image` folder now and run `node index.js compress image/example.jpg`. You will now see we have a `image/example-compressed.jpg` file!

Running that same code again setting the `width` flag will also resize an image ie `node index.js compress image/example.jpg --width=200`. Incredible!

### 4. Batch compress all images in a file

This time we will make use of a basic Node fs function `readdirSync` to batch process a bunch of images.

The code below takes a folder as an argument, reads all the files within that folder and runs the `compressImage` function on each one!

The bottom of our updated code now looks like so:

```javascript
// Prev code omitted for brevity

/**
 * Compress multiple images
 *
 * @param {*} folder The folder path to batch compress
 */
const batchCompress = async folder => {
  try {
    fs.readdirSync(folder).forEach(file => {
      const filepath = cwd + "/" + folder + "/" + file
      compressImage(filepath)
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * Run a function based on the argument provided.
 *
 */
const run = async () => {
  console.log("Running Image Compression CLI")

  try {
    switch (argv._[0]) {
      case "compress":
        compressImage(argv._[1])
        break
      case "batch":
        batchCompress(argv._[1])
        break
      default:
        console.log(help)
        break
    }
  } catch (err) {
    console.error(err)
  }
}

run()
```

If we now place multiple files in our `image` folder, we could run `node index.js batch image` to batch process all the images! In fact, we can even run `node index.js batch image --width=200` to limit the width of all those images processed!

### 5. Final code

Our final code now looks like the following:

```javascript
const cwd = process.cwd()
const yp = require("yargs-parser")
const argv = yp(process.argv.slice(2))
const sharp = require("sharp")
const fs = require("fs")
const util = require("util")

const help = `
    Usage
    $ sharp <action> <option>

    Action
    ---
    compress path/to/file       Compress image
    --width=800, --height=null
    
    batch path/to/folder        Compress folder of images
    --width=800, --height=null

    Examples
    $ sharp compress path/to/file
    $ sharp compress path/to/file --width 200
`

/**
 * Compress an image.
 *
 * @param {*} file The path to the file.
 */
const compressImage = async file => {
  try {
    const outputArr = file.split(".")
    const output = outputArr[0] + "-compressed." + outputArr[1]
    let res
    if (argv.width) {
      res = await sharp(file)
        .resize(argv.width)
        .toFile(output)
    } else {
      res = await sharp(file).toFile(output)
    }

    const result = util.inspect(res, { depth: null })
    console.log(`Image compressed! ${result}`)
  } catch (err) {
    console.error("Failed to upload", err)
  }
}

/**
 * Compress multiple images
 *
 * @param {*} folder The folder path to batch compress
 */
const batchCompress = async folder => {
  try {
    fs.readdirSync(folder).forEach(file => {
      const filepath = cwd + "/" + folder + "/" + file
      compressImage(filepath)
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * Run a function based on the argument provided.
 *
 */
const run = async () => {
  console.log("Running Image Compression CLI")

  try {
    switch (argv._[0]) {
      case "compress":
        compressImage(argv._[1])
        break
      case "batch":
        batchCompress(argv._[1])
        break
      default:
        console.log(help)
        break
    }
  } catch (err) {
    console.error(err)
  }
}

run()
```

## Next steps

This is a basic intro in creating a small, useful image compression CLI tool. Sharp is incredibly powerful, so add more to this as you see fit! This doubles as an example of creating a very basic CLI tool, so you could even get rid of the sharp code and add whatever you see fit!

_**Depth** is a series that goes into more detail for projects than it's friendly counterpart series "Hello"._
