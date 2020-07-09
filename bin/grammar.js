// @see https://github.com/stewartmcgown/grammarly-api
const { Grammarly } = require("@stewartmcgown/grammarly-api")
const chalk = require("chalk")
const argv = require("yargs-parser")(process.argv.slice(2))
const fs = require("fs")
var showdown = require("showdown")
const htmlToText = require("html-to-text")

const warning = text => chalk.yellow(chalk.bold(text))
const error = text => chalk.bgRed(chalk.bold(text))

let alertCounter = 1
const highlightAlerts = (text, alerts) => {
  alerts.map(alert => {
    const {
      highlightBegin,
      highlightEnd,
      categoryHuman,
      title,
      minicardTitle,
    } = alert
    const beginSliceIndex = highlightBegin - 20 > 0 ? highlightBegin - 20 : 0
    const endSliceIndex =
      highlightEnd + 20 < text.length ? highlightEnd + 20 : text.length

    const preSlice = text.slice(beginSliceIndex, highlightBegin)
    const postSlice = text.slice(highlightEnd, endSliceIndex)
    const slice = text.slice(highlightBegin, highlightEnd)
    const hasTitle = title || minicardTitle

    const log = `
${error(
  `ALERT ${alertCounter}: ${categoryHuman}`
)} (${highlightBegin}:${highlightEnd})
${hasTitle ? warning("[ACTION]:") : ""} ${title ? title : ""} ${
      minicardTitle ? minicardTitle : ""
    }

...${preSlice}${chalk.red(slice)}${postSlice}...
    `
    console.log(log)
    alertCounter += 1
  })
}

const chunkArr = arr => {
  let chunk = 10
  let chunkedArr = []
  for (let i = 0, j = arr.length; i < j; i += chunk) {
    chunkedArr.push(arr.slice(i, i + chunk))
  }

  return chunkedArr
}

const main = async () => {
  const [blogPostFilePath] = argv._
  const blog = fs
    .readFileSync(blogPostFilePath, "utf-8")
    .replace(/<.+>[\s\S]+<\/.+>/gm, "")
    .replace(/\[(.+)\]/gi, "")
    .replace(/\[(.+)\]\((.+)\)/gi, "")
    .replace(/>/gi, "")
    .replace(/…/gi, "")

  const blogArr = blog.split("\n")
  const blogTextArr = blogArr.map((line, index) => {
    if (index > 4) {
      return line.trim()
    }

    if (line.includes("description:")) {
      return line.replace("description:", "").trim()
    }

    if (line.includes("title:")) {
      return line.replace("title:", "").trim()
    }

    return "\n"
  })

  const chunkedArr = chunkArr(blogTextArr)
  const converter = new showdown.Converter()
  const free = new Grammarly()
  const allAlerts = []

  for (const piece of chunkedArr) {
    let currentChunk
    try {
      currentChunk = piece.join("\n")
      const html = converter.makeHtml(currentChunk)
      const text = htmlToText.fromString(html)

      const results = await free.analyse(text)
      highlightAlerts(text, results.alerts)

      allAlerts.push(results.alerts)
    } catch (err) {
      console.log(err)
      console.log(currentChunk)
    }
  }

  const hasAlerts = allAlerts.length !== 0
  if (!hasAlerts) {
    const msg = `No alerts found for file ${blogPostFilePath}`
    console.log(chalk.green(msg))
  } else {
    console.log(chalk.bgRed(`Total alerts found: ${allAlerts.length}`))
  }

  process.exit()
}

main()
