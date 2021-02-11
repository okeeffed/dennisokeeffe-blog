const sharp = require("sharp")
const sizeOf = require("image-size")
const recursive = require("recursive-readdir")
const fs = require("fs")
const IMG_WIDTH = 1000

const sharpResize = async (uri, sizeMeta) =>
  new Promise((resolve, reject) => {
    // calculate new height based on fraction
    const fractionReduction = sizeMeta.width / IMG_WIDTH
    const newHeight = Math.round(sizeMeta.height / fractionReduction)

    // resize file
    sharp(`./image-src/${uri}`)
      .resize({
        width: IMG_WIDTH,
        height: newHeight,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toFile(`./content/assets/${uri.split(".")[0]}.png`)
      .then(info => resolve(info))
      .catch(err => reject(err))
  })

const main = async () => {
  const icons = await recursive("image-src")

  for (const icon of icons) {
    const pathArr = icon.split("/")
    const filename = pathArr[pathArr.length - 1]

    console.log("Resizing:", filename)
    // get size
    const sizeMeta = sizeOf(`${process.cwd()}/image-src/${filename}`)
    await sharpResize(filename, sizeMeta)
    fs.unlinkSync(icon)
  }
}

main()
