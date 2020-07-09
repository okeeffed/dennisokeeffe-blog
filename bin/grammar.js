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

const main = async () => {
  const [blogPostFilePath] = argv._
  const blog = fs.readFileSync(blogPostFilePath, "utf-8")

  const converter = new showdown.Converter()
  const html = converter.makeHtml(blog)
  const text = htmlToText.fromString(html)

  const free = new Grammarly()
  const results = await free.analyse(text)
  console.log(results)
  highlightAlerts(blog, results.alerts)

  const hasAlerts = results.alerts.length !== 0
  if (!hasAlerts) {
    const msg = `No alerts found for file ${blogPostFilePath}`
    console.log(chalk.green(msg))
  }
  process.exit()
}

main()
