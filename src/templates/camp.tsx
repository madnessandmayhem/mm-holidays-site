import React, { FC } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { getImage } from "gatsby-plugin-image"

import Layout from "../components/Layout"
import CampDatesCTA from "../components/CampDatesCTA"
import PageGutter from "../components/PageGutter"
import HeroImage from "../components/HeroImage"
import { SMALLSCREEN_WIDTH } from "../constants"
import HeadTags from "../components/HeadTags"
import RemarkText from "../components/RemarkText"

const HeroCampDates = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
  padding-top: 7rem;
  padding-bottom: 1rem;
  font-size: 1.6rem;
  @media (max-width: ${SMALLSCREEN_WIDTH}px) {
    display: none;
  }
`

const BodyCampDates = styled.section`
  margin: 1em 0;
  font-size: 1.4rem;
  @media (min-width: ${SMALLSCREEN_WIDTH}px) {
    display: none;
  }
`

interface Props {
  data: any
}

export const Head = ({ data }: Props) => {
  const meta = data.markdownRemark.frontmatter
  return (
    <HeadTags
      ogImageRelativeUrl={meta.hero.childImageSharp.ogImage.src}
      path={meta.path}
      title={meta.title}
      seoDescription={meta.description}
    />
  )
}

const Camp: FC<Props> = ({ data }: Props) => {
  const meta = data.markdownRemark.frontmatter
  return (
    <Layout
      theme="light"
      hero={
        <HeroImage
          image={getImage(meta.hero)}
          title={meta.title}
          subtitle={`Age ${meta.ages}`}
          imageAltText={meta.heroAltText}
        >
          <HeroCampDates>
            <PageGutter>
              <CampDatesCTA
                shadows={true}
                campName={meta.title}
                price={meta.price}
                shouldShowWeek3={meta.shouldShowWeek3}
              />
            </PageGutter>
          </HeroCampDates>
        </HeroImage>
      }
    >
      <BodyCampDates>
        <CampDatesCTA
          shadows={false}
          campName={meta.title}
          price={meta.price}
        />
      </BodyCampDates>
      <RemarkText innerHTML={data.markdownRemark.html} />
    </Layout>
  )
}

export default Camp

export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        price
        title
        description
        ages
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
        shouldShowWeek3
      }
    }
  }
`
