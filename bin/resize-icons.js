const sharp = require("sharp")
const recursive = require("recursive-readdir")
const fs = require("fs")
const IMG_WIDTH = 100
const IMG_HEIGHT = 100

const sharpResize = async uri =>
  new Promise((resolve, reject) => {
    sharp(`./icon-src/${uri}`)
      .resize({
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toFile(`./icons/${uri.split(".")[0]}.png`)
      .then(info => resolve(info))
      .catch(err => reject(err))
  })

const main = async () => {
  const icons = await recursive("icon-src")

  for (const icon of icons) {
    const pathArr = icon.split("/")
    const filename = pathArr[pathArr.length - 1]

    console.log("Resizing:", filename)
    await sharpResize(filename)
    fs.unlinkSync(icon)
  }
}

main()
