import React, { FC } from "react"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import styled, { keyframes } from "styled-components"

import Layout from "../components/Layout"
import HomepageFeature from "../components/HomepageFeature"
import PageGutter from "../components/PageGutter"
import ImageCrossfade from "../components/ImageCrossfade"
import {
  SMALLSCREEN_WIDTH,
  MOBILE_WIDTH,
  HERO_IMAGE_MAX_HEIGHT,
  HERO_IMAGE_MIN_HEIGHT,
  PRIMARY_COLOUR_DARK,
  ENABLE_BOOKING,
} from "../constants"
import HeroBookingPrompt from "../components/HeroBookingPrompt"
import FooterBookingPrompt from "../components/FooterBookingPrompt"

import instagram from "../images/instagram.svg"
import facebook from "../images/facebook.svg"
import HeadTags from "../components/HeadTags"
import { getImage } from "gatsby-plugin-image"
import RemarkText from "../components/RemarkText"

const HeroContainer = styled.div`
  position: relative;
`

const VIDEO_ID = "zIgs-m7_07Q"

const anim = keyframes`
  from {
    opacity : 0;
  transform: translateY(50%);
  }

  to {
    transform: translateY(0%);
    opacity:1;
  }
`

const HeroLabelContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
`

const Tagline = styled.h1`
  color: white;
  text-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.05em;
  @media (max-width: ${SMALLSCREEN_WIDTH}px) {
    font-size: 3rem;
  }
  opacity: 0.9;
  padding-bottom: 2em;
`

const PromoVideoContainer = styled.div`
  position: relative;
  overflow: hidden;
  max-width: 100%;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
  margin-bottom: 4em;
`

const PromoVideo = styled.iframe.attrs({ title: "Promo Video" })`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const HeroBookingNoticeContainer = styled.div`
  position: absolute;
  bottom: 1em;
  right: 1em;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  font-size: 0.8rem;
  width: 500px;
  background-color: white;
  color: #333;
  border-radius: 1em;
  border-width: 6px;
  border-color: white;
  border-style: none;
  @media (max-width: ${SMALLSCREEN_WIDTH}px) {
    display: none;
  }
  animation: ${anim} 0.5s cubic-bezier(0, 0, 0.06, 1.01);
  animation-delay: 0.3s;
  animation-fill-mode: both;
`

const BodyBookingNoticeContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  width: 100%;
  font-size: 0.9rem;
  & > * {
    width: 70%;
    @media (max-width: ${MOBILE_WIDTH}px) {
      width: 100%;
      max-width: 100%;
    }
  }
`

const BookingNoticeSection = styled.section`
  margin-top: 1em;
  @media (min-width: ${SMALLSCREEN_WIDTH}px) {
    display: none;
  }
`

interface Props {
  data: any
}

export const Head = ({ data }: Props) => {
  return (
    <HeadTags
      title={null}
      path="/"
      seoDescription={data.site.siteMetadata.seoDescription}
      ogImageRelativeUrl={data.ogImage.childImageSharp.fixed.src}
    />
  )
}

const IndexPage: FC<Props> = ({ data }: Props) => {
  return (
    <Layout
      showNav={true}
      theme="light"
      applyGutter={false}
      hero={
        <HeroContainer>
          <ImageCrossfade
            images={[
              getImage(data.hero1),
              getImage(data.hero2),
              getImage(data.hero3),
              getImage(data.hero4),
            ]}
            renderImage={image => {
              return (
                <GatsbyImage
                  image={image}
                  style={{
                    maxHeight: `${HERO_IMAGE_MAX_HEIGHT}px`,
                    minHeight: `${HERO_IMAGE_MIN_HEIGHT}px`,
                    height: "100%",
                  }}
                  imgStyle={{ objectPosition: "center" }}
                  alt="The M+M site and available activities."
                />
              )
            }}
          />
          <HeroLabelContainer>
            <div>
              <PageGutter>
                <Tagline>
                  <span css="text-transform: uppercase; font-size: 1.8em; letter-spacing: 0.05em;">
                    Get ready
                  </span>
                  <br />
                  <span css="font-size: 0.9em; font-family: Raleway; font-weight: bold;">
                    for the best week of the year
                  </span>
                </Tagline>
              </PageGutter>
            </div>
          </HeroLabelContainer>
          <HeroBookingNoticeContainer>
            <HeroBookingPrompt />
          </HeroBookingNoticeContainer>
        </HeroContainer>
      }
    >
      <BookingNoticeSection>
        <BodyBookingNoticeContainer>
          <PageGutter>
            <HeroBookingPrompt />
          </PageGutter>
        </BodyBookingNoticeContainer>
        <div css="padding: 0 6em;">
          <hr
            css={`
              border: none;
              height: 2px;
              width: 100%;
              background-color: ${PRIMARY_COLOUR_DARK};
              border-radius: 2px;
              margin-bottom: 2em;
            `}
          />
        </div>
      </BookingNoticeSection>
      <section>
        <PageGutter>
          <RemarkText innerHTML={data.intro.html} />
          <PromoVideoContainer>
            <PromoVideo
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${VIDEO_ID}?&autoplay=1&rel=0&mute=1&modestbranding=1&loop=1&playlist=${VIDEO_ID}&fs=1`}
              frameBorder="0"
              allow="fullscreen;"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </PromoVideoContainer>
        </PageGutter>
      </section>
      {data.allMarkdownRemark.edges.map((edge: any) => {
        const frontmatter = edge.node.frontmatter
        return (
          <HomepageFeature
            key={edge.node.id}
            image={getImage(frontmatter.image)}
            imageAltText={frontmatter.imageAltText}
            title={frontmatter.title}
            subtitle={frontmatter.subtitle}
            descriptionHtml={edge.node.html}
          />
        )
      })}
      {ENABLE_BOOKING && (
        <section>
          <FooterBookingPrompt />
        </section>
      )}
      <PageGutter>
        <section
          css={`
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            margin-bottom: 1rem;
          `}
        >
          <div
            css={`
              display: flex;
              flex-flow: column nowrap;
              align-items: flex-start;
            `}
          >
            <a
              css="color: currentColor;"
              href="https://www.instagram.com/mandmholidays/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CtaItem
                fontSize="1.5em"
                imgSrc={instagram}
                copy="Follow us on Instagram"
              />
            </a>
            <a
              css="color: currentColor;"
              href="https://www.facebook.com/Madnessandmayhemholidays/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CtaItem
                fontSize="1.5em"
                imgSrc={facebook}
                copy="Follow us on Facebook"
              />
            </a>
          </div>
        </section>
      </PageGutter>
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        seoDescription
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//home/sections//" } }
      sort: { fields: [frontmatter___order], order: ASC }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            subtitle
            order
            imageAltText
            image {
              childImageSharp {
                gatsbyImageData(
                  layout: FULL_WIDTH
                  quality: 90
                  placeholder: BLURRED
                )
              }
            }
          }
          html
        }
      }
    }
    onlineCopy1: markdownRemark(
      fileAbsolutePath: { regex: "//home/online1.md/" }
    ) {
      html
    }
    onlineCopy2: markdownRemark(
      fileAbsolutePath: { regex: "//home/online2.md/" }
    ) {
      html
    }
    hero1: file(relativePath: { eq: "_DSC1528.jpeg" }) {
      childImageSharp {
        gatsbyImageData(layout: FULL_WIDTH, quality: 90, placeholder: BLURRED)
      }
    }
    hero2: file(relativePath: { eq: "DSC06420.jpeg" }) {
      childImageSharp {
        gatsbyImageData(layout: FULL_WIDTH, quality: 90, placeholder: BLURRED)
      }
    }
    hero3: file(relativePath: { eq: "DSC05753.jpeg" }) {
      childImageSharp {
        gatsbyImageData(layout: FULL_WIDTH, quality: 90, placeholder: BLURRED)
      }
    }
    hero4: file(relativePath: { eq: "high_ropes.jpg" }) {
      childImageSharp {
        gatsbyImageData(layout: FULL_WIDTH, quality: 90, placeholder: BLURRED)
      }
    }
    onlineLogo: file(
      absolutePath: { regex: "madness_theme/mm_online_logo.png$/" }
    ) {
      childImageSharp {
        fixed(width: 500) {
          ...GatsbyImageSharpFixed_withWebp_tracedSVG
        }
      }
    }
    intro: markdownRemark(fileAbsolutePath: { regex: "/home/intro/" }) {
      html
    }
    mayhemTile: file(absolutePath: { regex: "/mayhem_tile.png$/" }) {
      childImageSharp {
        fluid(maxWidth: 400) {
          src
        }
      }
    }
    textboxBody: file(absolutePath: { regex: "/textbox_body.png$/" }) {
      childImageSharp {
        fixed(width: 800) {
          src
        }
      }
    }
    textboxHeader: file(absolutePath: { regex: "/online_textbox.png$/" }) {
      childImageSharp {
        fixed(width: 800) {
          src
        }
      }
    }
    ogImage: file(absolutePath: { regex: "/max_tug_of_war.jpg$/" }) {
      childImageSharp {
        fixed(width: 1200, height: 630) {
          src
        }
      }
    }
  }
`

interface CtaItemProps {
  imgSrc: string
  copy: string
  fontSize: string
}
// eslint-disable-next-line react/prop-types
const CtaItem: React.FC<CtaItemProps> = ({ imgSrc, copy, fontSize }) => {
  const imgSize = `calc(${fontSize} * 2.7)`
  return (
    <div
      css={`
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        color: currentColor;
      `}
    >
      <img
        style={{
          width: imgSize,
          paddingRight: `calc(${fontSize} * 0.8)`,
        }}
        src={imgSrc}
      />
      <div css="font-weight: 700;" style={{ fontSize }}>
        {copy}
      </div>
    </div>
  )
}

export default IndexPage
