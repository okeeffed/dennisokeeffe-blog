const fs = require("fs")
const recursive = require("recursive-readdir")

// Regex that should match any line that begins with ## and then starts with a letter or number
// until the end of the line.
const matchMarkdownHeadingLevelTwo = /(^##\s[a-zA-Z0-9].+$)/gm

function replaceAd(markdown) {
  return markdown.replace(matchMarkdownHeadingLevelTwo, "<Ad />\n\n$1")
}

const getAllBlogPosts = () => recursive("content/blog", ["!*.md"])

const getBlogPostContent = filepath => fs.readFileSync(filepath, "utf-8")

const writeBackMarkdownFile = (filepath, content) =>
  fs.writeFileSync(filepath, content, "utf-8")

const main = async () => {
  console.log("Script running...")

  const blogPosts = await getAllBlogPosts()
  for (const blogPostPath of blogPosts) {
    const content = getBlogPostContent(blogPostPath)
    const contentUpdatedWithoutHeading = replaceAd(content)

    writeBackMarkdownFile(blogPostPath, contentUpdatedWithoutHeading)
    console.log(`Written: ${blogPostPath}`)
  }

  console.log("Script complete")
}

main()

module.exports = {
  replaceAd,
}
