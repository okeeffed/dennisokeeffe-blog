/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import styled from "styled-components"

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <Container>
            <p>
              A personal blog on all things of interest. Written by{" "}
              <strong>{author}</strong>,{` `}
              <a href={`https://twitter.com/${social.twitter}`}>
                Follow me on Twitter
              </a>
            </p>
          </Container>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    # avatar: file(absolutePath: { regex: "/gatsby-icon.png/" }) {
    #  childImageSharp {
    #    fixed(width: 50, height: 50) {
    #      ...GatsbyImageSharpFixed
    #    }
    #  }
    #}
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

const Container = styled.div`
  display: flex;
`

export default Bio
