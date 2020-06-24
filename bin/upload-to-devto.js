require("dotenv").config()
const fs = require("fs")
const axios = require("axios")
const argv = require("yargs-parser")(process.argv.slice(2))

const postArticle = (
  title,
  body_markdown,
  canonical_url,
  tags = ["100DaysOfCode", "tutorial"],
  published = false
) =>
  axios.post(
    `https://dev.to/api/articles`,
    {
      article: {
        title,
        body_markdown,
        canonical_url,
        tags,
        published,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.DEVTO_TOKEN,
      },
    }
  )

const BASE_DIR = "content/blog/"

const main = async () => {
  const [blogPostFilePath] = argv._
  const tags = argv.tags.split(",")

  const blog = fs.readFileSync(blogPostFilePath, "utf-8")
  let blogToUpload = blog
    .split("\n")
    .slice(6)
    .join("\n")
    .replace(
      /\.\.\/assets\/(.+)\)/g,
      "https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/$1?raw=true)"
    )
  const blogUrl = blogPostFilePath.replace(`${BASE_DIR}/`, "").split(".")[0]
  const title = blog.split("\n")[1].replace("title: ", "")
  const canonicalUrl = `https://blog.dennisokeeffe.com/blog/${blogUrl}/`

  blogToUpload += `\n\n_Originally posted on my [blog](${canonicalUrl}). Follow me on Twitter for more hidden gems [@dennisokeeffe92](https://twitter.com/dennisokeeffe92)._`

  try {
    console.log("Attempting to post...", title)

    const { data: devtoRes } = await postArticle(
      title,
      blogToUpload,
      canonicalUrl,
      tags
    )
    console.log("Posted to DevTo!", devtoRes.url)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

main()
