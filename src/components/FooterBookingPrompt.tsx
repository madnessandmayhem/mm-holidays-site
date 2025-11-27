import React, { FC } from "react"
import styled from "styled-components"
import { useStaticQuery, graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import BookButton from "./BookButton"
import { SMALLSCREEN_WIDTH, MOBILE_WIDTH } from "../constants"
import PageGutter from "./PageGutter"

const IMAGE_HEIGHT = 500

const ImageContainer = styled.div`
  position: relative;
  height: ${IMAGE_HEIGHT}px;
  overflow: hidden;
`

// @ts-ignore
const Img = styled(GatsbyImage)`
  height: ${IMAGE_HEIGHT}px;
  width: 100%;
  object-position: center;
`

interface Props {}

const FooterBookingPrompt: FC<Props> = () => {
  const data = useStaticQuery(graphql`
    {
      bg: file(relativePath: { eq: "DSC00218.JPG" }) {
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH, quality: 90, placeholder: BLURRED)
        }
      }
    }
  `)

  return (
    <div css="position: relative;">
      <ImageContainer>
        <Img
          // @ts-ignore
          image={getImage(data.bg)}
          alt="Campers smiling on a swing"
        />
      </ImageContainer>
      <div
        css={`
          position: absolute;
          top: 0;
          left: 50%;
          padding-left: 10%;
          right: 0;
          bottom: 0;
          text-align: center;
          color: white;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.4) 30%
          );
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          @media (max-width: ${SMALLSCREEN_WIDTH}px) {
            left: 40%;
          }
          @media (max-width: ${MOBILE_WIDTH}px) {
            left: 0%;
            padding-left: 0;
            justify-content: flex-end;
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0) 40%,
              rgba(0, 0, 0, 0.7) 100%
            );
            font-size: 0.8em;
          }
        `}
      >
        <PageGutter>
          <div
            css={`
              display: grid;
              grid-template-columns: 1fr;
              grid-template-areas: "title" "button" "subtitle";
              align-items: center;
              padding-bottom: 1em;
              @media (max-width: ${MOBILE_WIDTH}px) {
                grid-template-columns: 1fr auto;
                grid-template-areas:
                  "title button"
                  "subtitle subtitle";
                text-align: left;
                grid-column-gap: 1em;
              }

              & a {
                font-weight: 700;
              }
            `}
          >
            <h2
              css={`
                letter-spacing: 0.7px;
                font-size: 2em;
                grid-area: title;
                margin: 0;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
              `}
            >
              Bookings for 2026 are now open!
            </h2>
            <div
              css={`
                text-align: center;
                width: 100%;
                margin: 1em 0;
                grid-area: button;
              `}
            >
              <BookButton fontSize="1.3em">Book now</BookButton>
            </div>
            <p
              css={`
                grid-area: subtitle;
                margin: 0;
                font-size: 1.4em;
                & a {
                  color: currentColor;
                }
              `}
            >
              Got questions? You can read more about <Link to="/max/">Max</Link>
              , <Link to="/madness/">Madness</Link> and{" "}
              <Link to="/mayhem/">Mayhem</Link>, or{" "}
              <Link to="/contact/">get in touch</Link> with us.
            </p>
          </div>
        </PageGutter>
      </div>
    </div>
  )
}

export default FooterBookingPrompt
