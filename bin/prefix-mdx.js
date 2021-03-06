const recursive = require("recursive-readdir")
const startCase = require("lodash.startcase")
const fs = require("fs")

const getAllBlogPosts = () => recursive("content/blog", ["!*.md"])

const getBlogPostContent = filepath => fs.readFileSync(filepath, "utf-8")

const writeBackMarkdownFile = (filepath, content) =>
  fs.writeFileSync(filepath, content, "utf-8")

const addMdxMetaDataToContent = (title, content) => `
---
title: ${title}
date: "2019-10-22"
description: TODO
---

${content}
`

const getFilePathWithoutExt = filepath => filepath.split(".")[0]
const getFilePathWithoutFolderPaths = filepath => {
  const pathArr = filepath.split("/")
  // final arr elemment will be filename
  return pathArr[pathArr.length - 1]
}

const getStartCaseTitleFromPath = filepath =>
  startCase(getFilePathWithoutFolderPaths(getFilePathWithoutExt(filepath)))

const main = async () => {
  console.log("Script running...")

  const blogPosts = await getAllBlogPosts()
  for (const blogPostPath of blogPosts) {
    const title = getStartCaseTitleFromPath(blogPostPath)
    const content = getBlogPostContent(blogPostPath)
    const contentUpdatedWithMetadata = addMdxMetaDataToContent(title, content)

    writeBackMarkdownFile(blogPostPath, contentUpdatedWithMetadata)
    console.log(`Written: ${title}`)
  }

  console.log("Script complete")
}

main()
