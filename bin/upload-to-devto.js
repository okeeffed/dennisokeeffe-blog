require("dotenv").config()
const fs = require("fs")
const axios = require("axios")
const argv = require("yargs-parser")(process.argv.slice(2))

const postArticle = (
  title,
  body_markdown,
  canonical_url,
  main_image,
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
        main_image,
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
  try {
    const [blogPostFilePath] = argv._

    const blogSrc = fs.readFileSync(blogPostFilePath, "utf-8")
    const blog = blogSrc.replace(
      /\!\[(.+)\]\((.+)\)/gim,
      "![$1]($2)\n<figcaption>$1</figcaption>"
    )

    // remove ad tags
    const blogWithoutAds = blog.replace(/<Ad.?\/>/g, "")

    let blogToUpload = blogWithoutAds
      .split("\n")
      .slice(6)
      .join("\n")
      .replace(
        /\.\.\/assets\/(.+)\)/g,
        "https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/$1?raw=true)"
      )
    const blogFilePathFromRoot = blogPostFilePath
      .replace(`${BASE_DIR}/`, "")
      .split(".")[0]
    const title = blog.split("\n")[1].replace("title: ", "")
    const canonicalUrl = `https://blog.dennisokeeffe.com/${blogFilePathFromRoot.replace(
      /content\//,
      ""
    )}/`

    const mainImage = `https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/${blogFilePathFromRoot.replace(
      /content\/blog\//g,
      ""
    )}-main-image.png?raw=true`

    const [tagMeta] = blog.match(/tags:(.+)/gi)
    const tags = tagMeta
      .slice(6)
      .split(",")
      .map(str => str.trim())

    console.log("GitHub Main Image URL path:", mainImage)

    blogToUpload += `\n\n_Originally posted on my [blog](${canonicalUrl}). Follow me on Twitter for more hidden gems [@dennisokeeffe92](https://twitter.com/dennisokeeffe92)._`

    try {
      console.log("Attempting to post...", title)

      const { data: devtoRes } = await postArticle(
        title,
        blogToUpload,
        canonicalUrl,
        mainImage,
        tags
      )
      console.log("Posted to DevTo!", devtoRes.url)
    } catch (err) {
      console.log(err)
      process.exit(1)
    }
  } catch (err) {
    console.log(err)
  }
}

main()
