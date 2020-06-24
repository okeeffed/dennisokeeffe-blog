// Usage example: node bin/generate-heading-image.js --icons=ts,js,docker,redux,swift
require("dotenv").config()
const fs = require("fs")
const argv = require("yargs-parser")(process.argv.slice(2))
const fetch = require("node-fetch")
const axios = require("axios")
const sharp = require("sharp")
const mergeImages = require("merge-images")
const { Canvas, Image } = require("canvas")
const { default: Unsplash, toJson } = require("unsplash-js")
const unsplash = new Unsplash({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  secret: process.env.UNSPLASH_SECRET_KEY,
})

global.fetch = fetch

const IMG_WIDTH = 800
const IMG_HEIGHT = 600

// date helper
function formatDate() {
  var d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = "0" + month
  if (day.length < 2) day = "0" + day

  return [year, month, day].join("-")
}

const writeImageToDisk = (title, base64Data) =>
  fs.writeFileSync(title, base64Data, "base64")

const sharpResize = async uri =>
  new Promise((resolve, reject) => {
    sharp(uri)
      .resize({ width: IMG_WIDTH, height: IMG_HEIGHT })
      .gamma(1)
      .toFile("./temp/temp-sharp.png")
      .then(info => resolve(info))
      .catch(err => reject(err))
  })

// returns base64
const downloadImage = async url => {
  try {
    // Get image URL first
    const response = await axios.get(url, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    })

    // Fetch image from URL
    const img = await axios.get(response.data.url, {
      responseType: "arraybuffer",
    })

    // Download the image
    const imgData = await Buffer.from(img.data, "binary").toString("base64")
    return imgData
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const getUnsplashImage = query =>
  unsplash.photos.getRandomPhoto({
    query,
  })

// const calculateXDisplacement = (index, arrLen) => {
//   const iconWidth = 100
//   const iconSeperation = 20
//   const centerImgDisplacement = arrLen % 2 === 0 ?  :
// }

// Hack displacements for now.
// Can have up to 5 icons.
const displacements = [
  [],
  [350],
  [290, 410],
  [230, 350, 470],
  [170, 290, 410, 530],
  [110, 230, 350, 470, 590],
]

const combineAllImages = () => {
  const icons = argv.icons ? argv.icons.split(",") : []
  const displacement = displacements[icons.length]

  console.log("icons", icons)
  const iconsToMerge = icons.map((icon, index) => {
    return { src: `./icons/${icon}.png`, x: displacement[index], y: 250 }
  })

  console.log(iconsToMerge)
  return mergeImages(
    [
      {
        src: `./temp/temp-sharp.png`,
      },
      ...iconsToMerge,
    ],
    {
      Canvas: Canvas,
      Image: Image,
    }
  )
}

const main = async () => {
  try {
    console.log("Generating image...")
    // const [blogPath, ...images] = argv._
    const query = argv.query ? argv.query : "code"

    const image = await getUnsplashImage(query)
    const imageJson = await toJson(image)
    console.log(imageJson)

    const bufferData = await downloadImage(imageJson.links.download_location)

    const uri = "./temp/temp-unsplash.png"
    writeImageToDisk(uri, bufferData)
    await sharpResize(uri)

    const b64Img = await combineAllImages()
    writeImageToDisk(
      `./temp/${formatDate()}-final.png`,
      b64Img.replace(/data:image\/png;base64/, "")
    )
  } catch (err) {
    console.error(err)
  }
}

main()
