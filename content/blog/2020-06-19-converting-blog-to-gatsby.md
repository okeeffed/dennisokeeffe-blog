---
title: Converting the blog to its own subdomain
description: Challenges and process to get the blog converted over to Gatsby + Netlify CMS
date: "2020-06-19"
---

In an attempt to get back to writing more on things that interest me, I wanted to pull the blog over to a format that I could access readily via a CMS or simply through the code editor while I am writing markdown files.

To give context, the challenges that I needed to do:

1. Copy all existing posts into new repo.
2. Update markdown files to include metadata required for Gatsby template.
3. Update markdown files to remove the "h1" headings as it comes from metadata.
4. Setup `blog.dennisokeeffe.com` site on Netlify.

After deciding on Gatsby and Netlify CMS, I followed the steps outline on the [Gatsby site](https://www.gatsbyjs.org/tutorial/blog-netlify-cms-tutorial/). The decision for Netlify CMS came naturally as my [main webstite](https://docs.dennisokeeffe.com) and [notes website](https://docs.dennisokeeffe.com) are both currently being hosted on Netlify.

## Step 1: Copy all the existing posted into new repo

This was the simplest step. The only requirement was to copy across what I previously had from the old repo to the new.

The challenges that came from that was that the format of the markdown files I brought across looked like this:

```markdown
# Heading

Content
```

What I needed to do was update the content to look like so:

```markdown
---
title: Heading
date: "yyyy-mm-dd"
description: Optional description.
---

Context
```

As there were 100 blog posts to port, there a couple of things that I needed to automate this.

## Step 2: Update markdown files to include metadata required for Gatsby template

This is an oversimplified version, but I wrote a script to fetch all the markdown files for the blog, then have Nodejs' `fs` module read in the files, update them with the metadata, then place it back.

The following code itself I am hoping should be readable in their names to give concepts of what is being done:

```javascript
// npm package that can fetch all *.md files in context/blog
const recursive = require("recursive-readdir")
// takes snake case words like "blog-post-title" and convert it to "Blog Post Title"
const startCase = require("lodash.startcase")
const fs = require("fs")

const getAllBlogPosts = () => recursive("content/blog", ["!*.md"])

const getBlogPostContent = filepath => fs.readFileSync(filepath, "utf-8")

const writeBackMarkdownFile = (filepath, content) =>
  fs.writeFileSync(filepath, content, "utf-8")

// example date and description written here for brevity
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

/**
 * Fetch all the blog post markdowns, then iterate
 * through all the blog posts. Update the content
 * from that blog post and write it back to where it
 * was written.
 */
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
```

Once this was done, the markdown was now in the state like so:

```markdown
---
title: Heading
date: "yyyy-mm-dd"
description: Optional description.
---

# Heading

Context
```

To get rid of the `# Heading`, we needed to do another edit.

## Step 3: Update markdown files to remove the "h1" headings as it comes from metadata

This script was basically a cut-copy of the above script with a change to replace the `# Heading` line plus the previous blank line to get us where we needed to be:

```javascript
const recursive = require("recursive-readdir")
const startCase = require("lodash.startcase")
const fs = require("fs")

const getAllBlogPosts = () => recursive("content/blog", ["!*.md"])

const getBlogPostContent = filepath => fs.readFileSync(filepath, "utf-8")

const writeBackMarkdownFile = (filepath, content) =>
  fs.writeFileSync(filepath, content, "utf-8")

const removeHeading = content => content.replace(/\n#\s.+\n/, "")

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
    const contentUpdatedWithoutHeading = removeHeading(content)

    writeBackMarkdownFile(blogPostPath, contentUpdatedWithoutHeading)
    console.log(`Written: ${title}`)
  }

  console.log("Script complete")
}

main()
```

The only update above is the line to remove the heading with `removeHeading(content)`.

## Step 4: Setup blog.dennisokeeffe.com site on Netlify

This part required a few smaller stages. With some sites, I setup a `netlify.toml` file just to preset the expectations for when I add the Netlify site. That `toml` file looks like the following:

```toml
[Settings]
ID = "blog.dennisokeeffe.com"

[build]
  command = "yarn build"
  publish = "public"

# The following redirect is intended for use with most SPAs that handle
# routing internally.
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/blog-netlify-cms-tutorial/) can show you what is required to get things up and running with Netlify from there.

As for the domain itself, I have `dennisokeeffe.com` setup on AWS Route53, so there was a small requirement to jump onto Route53 and create an alias to point the `CNAME` to the correct place.

Once that was there, all cylinders were a go! You can see the website [here](https://blog.dennisokeeffe.com) if you are not already on the website.

The website is now also using continuous deployment with Netlify, so any changes I make through the code editor locally or through the Netlify CMS will trigger a new build to deploy.

Looking forward to writing some more posts from now on, including those that are not directly affilliated with code!
