require("dotenv").config()
const fs = require("fs")
const axios = require("axios")
const argv = require("yargs-parser")(process.argv.slice(2))
const { Octokit } = require("@octokit/rest")
const { Base64 } = require("js-base64")

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

/**
 * Matches markdown code blocks/
 * @example
 * ```rb
 * # Will match this
 * value = "assignment"
 * ```
 *
 * Won't match this
 *
 * ```md
 * # Will match this
 * Testing
 * ```
 */
const codeRegex = /^`{3}([a-z]*)\s([.\s\S]+?)`{3}/gm

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
})

const createGist = async (filename, content) => {
  const params = {
    files: {
      [filename]: {
        content,
      },
    },
    public: true,
  }

  const { data } = await octokit.gists.create(params)
  console.log(`Gist uploaded: ${data.html_url}`)
  return data
}

const BASE_DIR = "content/blog/"

const main = async () => {
  const [blogPostFilePath] = argv._
  const blogSrc = fs.readFileSync(blogPostFilePath, "utf-8")
  // remove ad tags
  const blog = blogSrc.replace(/<Ad.?\/>/g, "")

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
  const canonicalUrl = `https://blog.dennisokeeffe.com/${blogUrl.replace(
    /content\//,
    ""
  )}/`

  // filename by itself
  const blogFileName = blogUrl.replace("content/blog/", "")

  blogToUpload =
    `![Heading image](https://github.com/okeeffed/dennisokeeffe-blog/blob/master/content/assets/${blogFileName}-main-image.png?raw=true)\n\n` +
    blogToUpload
  blogToUpload += `\n\n_Originally posted on my [blog](${canonicalUrl})._`

  const [tagMeta] = blog.match(/tags:(.+)/gi)
  const tags = tagMeta
    .slice(6)
    .split(",")
    .map(str => str.trim())

  try {
    console.log("Attempting to post...", title)

    const matches = blog.match(codeRegex)

    if (matches) {
      for (const match of matches) {
        const codeBlockArr = match.split("\n")
        const fileExt = codeBlockArr.shift().slice(3)
        codeBlockArr.pop()
        const content = codeBlockArr.join("\n")

        const gistFileName = `${blogUrl}-${Math.floor(
          Math.random() * 10000
        )}.${fileExt}`.replace(/\//g, "-")
        console.log(gistFileName)
        console.log(content)
        const data = await createGist(gistFileName, content)
        const embed = `https://gist.github.com/okeeffed/${data.id}.js`
        blogToUpload = blogToUpload.replace(match, embed)
      }
    }

    const { data: mediumRes } = await postArticle(
      title,
      blogToUpload,
      canonicalUrl,
      tags
    )
    console.log("Posted to Medium!", mediumRes.data.url)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

main()
