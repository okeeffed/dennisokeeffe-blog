import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"

const RelatedArticles = ({ posts }) => {
  return (
    <div>
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        return (
          <div key={node.fields.slug}>
            <div>
              <Link
                style={{ boxShadow: `none` }}
                to={`blog${node.fields.slug}`}
              >
                {title}
              </Link>
            </div>
            <small>{node.frontmatter.date}</small>
            <p
              dangerouslySetInnerHTML={{
                __html: node.frontmatter.description || node.excerpt,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export const relatedArticlesQuery = graphql`
  query {
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            tags
          }
        }
      }
    }
  }
`

export default props => {
  const related = []

  return (
    <StaticQuery
      query={relatedArticlesQuery}
      render={data => {
        const {
          allMdx: { edges },
        } = data

        // iterate through article vertex
        for (const vertex of edges) {
          // handle base case
          if (related.length >= props.limit) {
            continue
          }

          // abstract tags
          const {
            frontmatter: { tags },
          } = vertex.node

          // handle case where there are no tags or prop tags
          if (!tags || !props.tags) {
            continue
          }

          const formattedTags = tags.split(",")

          // ensure tags match and article is not the same as current
          if (
            props.tags.some(item => formattedTags.includes(item)) &&
            props.title !== vertex.node.frontmatter.title
          ) {
            related.push(vertex)
          }
        }

        // render posts
        return (
          <>
            <h3
              style={{
                fontFamily: `Montserrat, sans-serif`,
                marginTop: 0,
              }}
            >
              Related Articles
            </h3>
            <RelatedArticles posts={related} />
          </>
        )
      }}
    />
  )
}
