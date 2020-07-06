// Usage example: node bin/generate-heading-image.js path/to/file --icons=ts,js,docker,redux,swift --query=search
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
const openSans = require("./open-sans")

global.fetch = fetch

const IMG_WIDTH = 1000
const IMG_HEIGHT = 420

const writeImageToDisk = (title, base64Data) =>
  fs.writeFileSync(title, base64Data, "base64")

const generateText = text => {
  const generateTextBlock = (textBlock, index) => `<text x="10" y="${70 *
    index}" font-size="58" fill="#fff" font-family="Open Sans" font-weight="700">
    ${textBlock}
  </text>`

  const textArr = text.split(" ")
  let finalTextSvg = ""
  let textBlock = ""
  let start = true
  let index = 1

  while (textArr.length > 0) {
    const newText = textArr.shift()
    if (`${textBlock} ${newText}`.length > 26) {
      finalTextSvg += generateTextBlock(textBlock, index)
      start = true
      textBlock = ""
      index++
    }

    if (start) {
      textBlock += newText
      start = false
    } else {
      textBlock += ` ${newText}`
    }
  }

  if (textBlock.length) {
    finalTextSvg += generateTextBlock(textBlock, index)
  }

  return finalTextSvg
}

const sharpResize = async uri =>
  new Promise((resolve, reject) => {
    const textedSVG = Buffer.from(
      `<svg>
      <style>${openSans}</style>
     <rect x="0" y="0" width="700" height="260" fill="none" />
     ${generateText(getBlogPostTitle())}
   </svg>`
    )

    sharp(uri)
      .resize({ width: IMG_WIDTH, height: IMG_HEIGHT })
      .modulate({
        brightness: 0.7, // increase lightness by a factor of 2
      })
      .blur(5)
      .composite([{ input: textedSVG, top: 20, left: 20 }])
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

const combineAllImages = () => {
  const icons = argv.icons ? argv.icons.split(",") : []

  console.log("icons", icons)
  const iconsToMerge = icons.map((icon, index) => {
    let displacement = index * 100 + index * 20

    if (displacement === 0) displacement = 20

    return { src: `./icons/${icon}.png`, x: displacement, y: IMG_HEIGHT - 120 }
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

const getBlogPostTitle = () => {
  const [blogPath] = argv._
  let blog = fs.readFileSync(blogPath, "utf-8")
  return blog.match(/title\:(.+)/g)[0].substr(7)
}

const getBlogName = blogPath => {
  const pathArr = blogPath.split("/")
  const blogFile = pathArr[pathArr.length - 1]
  return blogFile.split(".")[0]
}

const addAuthorToBlogPost = (blogPath, imageMetadata) => {
  // get blog
  let blog = fs.readFileSync(blogPath, "utf-8")
  const photoCredit = `_Image credit: [${imageMetadata.user.name}](${imageMetadata.user.links.html})_`

  if (/_Image credit/.test(blog)) {
    blog = blog.replace(/_Image credit.+/, photoCredit)
  } else {
    blog += `\n${photoCredit}`
  }

  fs.writeFileSync(blogPath, blog, "utf-8")
}

const main = async () => {
  try {
    const [blogPath] = argv._
    console.log("Generating image for:", blogPath)

    const query = argv.query ? argv.query : "code"

    const image = await getUnsplashImage(query)
    const imageMetadata = await toJson(image)
    console.log(imageMetadata)

    const bufferData = await downloadImage(
      imageMetadata.links.download_location
    )

    const uri = "./temp/temp-unsplash.png"
    writeImageToDisk(uri, bufferData)
    await sharpResize(uri)

    const blogName = getBlogName(blogPath)
    const b64Img = await combineAllImages()
    writeImageToDisk(
      `./content/assets/${blogName}-main-image.png`,
      b64Img.replace(/data:image\/png;base64/, "")
    )

    addAuthorToBlogPost(blogPath, imageMetadata)
  } catch (err) {
    console.error(err)
  }
}

main()
