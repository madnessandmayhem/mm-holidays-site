import React, { FC } from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import HeroImage from "../components/HeroImage"
import HeadTags from "../components/HeadTags"
import { getImage } from "gatsby-plugin-image"
import RemarkText from "../components/RemarkText"

interface Props {
  data: any
}

export const Head = ({ data }: Props) => {
  const frontmatter = data.markdownRemark.frontmatter
  const title = frontmatter.title
  const description = frontmatter.description
  return (
    <HeadTags
      title={title}
      seoDescription={description}
      path={frontmatter.path}
      ogImageRelativeUrl={frontmatter.hero?.childImageSharp?.ogImage?.src}
    ></HeadTags>
  )
}

const Template: FC<Props> = ({ data }: Props) => {
  const frontmatter = data.markdownRemark.frontmatter
  const title = frontmatter.title
  const hasHero = frontmatter.hero != null

  return (
    <Layout
      hero={
        hasHero ? (
          <HeroImage
            imageAltText={frontmatter.heroAltText}
            image={getImage(frontmatter.hero)}
            title={title}
          />
        ) : null
      }
      theme={hasHero ? frontmatter.theme : null}
    >
      <section>
        {hasHero === false && <h1>{title}</h1>}
        <RemarkText innerHTML={data.markdownRemark.html} />
      </section>
    </Layout>
  )
}

export default Template

export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
        description
        hero {
          childImageSharp {
            gatsbyImageData(
              layout: FULL_WIDTH
              quality: 90
              placeholder: BLURRED
            )
            ogImage: fixed(width: 1200, height: 630) {
              src
            }
          }
        }
        heroAltText
        theme
      }
    }
  }
`
