// @see https://github.com/stewartmcgown/grammarly-api
const { Grammarly } = require("@stewartmcgown/grammarly-api")
const chalk = require("chalk")
const argv = require("yargs-parser")(process.argv.slice(2))
const fs = require("fs")
var showdown = require("showdown")
const htmlToText = require("html-to-text")

const example = `When we have shuffled off this mortal coil,
Must give us pause - their's the respect
That makes calamity of so long life.`

const warning = text => chalk.yellow(chalk.bold(text))
const error = text => chalk.bgRed(chalk.bold(text))

const highlightAlerts = (text, alerts) => {
  alerts.map((alert, index) => {
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
  `ALERT ${index + 1}: ${categoryHuman}`
)} (${highlightBegin}:${highlightEnd})
${hasTitle ? warning("[ACTION]:") : ""} ${title ? title : ""} ${
      minicardTitle ? minicardTitle : ""
    }

...${preSlice}${chalk.red(slice)}${postSlice}...
    `
    console.log(log)
  })
}

// const alerts = [
//   {
//     title: "Possibly confused <i>there</i> and <i>their</i>",
//     minicardTitle: "Replace the word",
//     highlightBegin: 65,
//     highlightEnd: 72,
//     categoryHuman: "Commonly Confused Words",
//   },
//   {
//     categoryHuman: "Incorrect Phrasing",
//     highlightBegin: 108,
//     highlightEnd: 110,
//   },
// ]
const chunkArr = arr => {
  let chunk = 5
  let chunkedArr = []
  for (let i = 0, j = arr.length; i < j; i += chunk) {
    chunkedArr.push(arr.slice(i, i + chunk))
  }

  return chunkedArr
}

const main = async () => {
  const [blogPostFilePath] = argv._
  const blog = fs.readFileSync(blogPostFilePath, "utf-8")
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
    const currentChunk = piece.join(" ")
    const html = converter.makeHtml(currentChunk)
    const text = htmlToText
      .fromString(html)
      .replace(/\[(.+)\]/gi, "")
      .replace(/\[(.+)\]\((.+)\)/gi, "")
      .replace(/>/gi, "")
      .replace(/…/gi, "")

    const results = await free.analyse(text)
    highlightAlerts(text, results.alerts)

    allAlerts.push(results.alerts)
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
