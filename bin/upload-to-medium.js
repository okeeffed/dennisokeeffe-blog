require("dotenv").config()
const fs = require("fs")
const axios = require("axios")
const argv = require("yargs-parser")(process.argv.slice(2))

const postArticle = (
  title,
  content,
  canonicalUrl,
  tags = ["developer", "utility", "software", "javascript", "100DaysOfCode"],
  publishStatus = "draft",
  contentFormat = "markdown"
) =>
  axios.post(
    `https://api.medium.com/v1/users/${process.env.MEDIUM_ID}/posts`,
    {
      title,
      content,
      tags,
      canonicalUrl,
      contentFormat,
      publishStatus,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MEDIUM_TOKEN}`,
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
  const canonicalUrl = `https://blog.dennisokeeffe.com/${blogUrl}/`

  blogToUpload += `\n\n_Originally posted on my [blog](${canonicalUrl}). Follow me on Twitter for more hidden gems [@dennisokeeffe92](https://twitter.com/dennisokeeffe92)._`

  try {
    console.log("Attempting to post...", title)
    // SKIPPING FOR NOW UNTIL I CAN FIND THE AUTHOR ID
    const { data: mediumRes } = await postArticle(
      title,
      blogToUpload,
      canonicalUrl
    )
    console.log("Posted to Medium!", mediumRes.data.url)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

main()
