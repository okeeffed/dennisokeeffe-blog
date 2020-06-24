require("dotenv").config()
const fs = require("fs")
const argv = require("yargs-parser")(process.argv.slice(2))
const fetch = require("node-fetch")
const axios = require("axios")
const sharp = require("sharp")
const path = require("path")
const mergeImages = require("merge-images")
const { Canvas, Image } = require("canvas")
const { default: Unsplash, toJson } = require("unsplash-js")
const unsplash = new Unsplash({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  secret: process.env.UNSPLASH_SECRET_KEY,
})

global.fetch = fetch

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
      .resize({ width: 800, height: 600 })
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

const main = async () => {
  try {
    console.log("Generating image...")
    // const [blogPath, ...images] = argv._
    const query = argv.query ? argv.query : "code"

    const image = await getUnsplashImage(query)
    const imageJson = await toJson(image)
    // console.log(imageJson)
    const bufferData = await downloadImage(imageJson.links.download_location)

    const uri = "./temp/test.png"
    writeImageToDisk(uri, bufferData)
    await sharpResize(uri)

    const b64Img = await mergeImages(
      [
        {
          src: "./temp/temp-sharp.png",
        },
        { src: "./icons/ts.png", x: 230, y: 250 },
        { src: "./icons/js.png", x: 350, y: 250 },
        { src: "./icons/db.png", x: 460, y: 250 },
      ],
      {
        Canvas: Canvas,
        Image: Image,
      }
    )
    writeImageToDisk(
      "./temp/final.png",
      b64Img.replace(/data:image\/png;base64/, "")
    )
  } catch (err) {
    console.error(err)
  }
}

main()
