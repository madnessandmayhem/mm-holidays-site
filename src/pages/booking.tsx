import React, { FC, useLayoutEffect, useState } from "react"
import { graphql, Link } from "gatsby"
import styled from "styled-components"

import BookingForm, { FormState } from "../components/BookingForm"
import Layout from "../components/Layout"
import HeroImage from "../components/HeroImage"
import Button from "../components/Button"
import { ENABLE_BOOKING, MOBILE_WIDTH } from "../constants"
import HeadTags from "../components/HeadTags"
import { getImage } from "gatsby-plugin-image"
import RemarkText from "../components/RemarkText"

const PricingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;

  th,
  td {
    border: 1px solid #ddd;
    padding: 0.75em;
    text-align: center;
  }

  th {
    background-color: #f5f5f5;
    font-weight: 600;
  }

  td:first-child {
    font-weight: 600;
    text-align: left;
  }
`

interface Props {
  data: any
}

export const Head = ({ data }: Props) => {
  return (
    <HeadTags
      ogImageRelativeUrl={data.hero.childImageSharp.ogImage.src}
      path={data.markdownRemark.frontmatter.path}
      title="Book"
      seoDescription={data.markdownRemark.frontmatter.description}
    />
  )
}

const Booking: FC<Props> = ({ data }: Props) => {
  const [booked, setBooked] = useState(false)
  const [previousState, setPreviousState] = useState<FormState | null>(null)
  const [previewEnabled, setPreviewEnabled] = useState(false)
  useLayoutEffect(() => {
    setPreviewEnabled(
      new URLSearchParams(window.location.search).get("preview") !== null,
    )
  }, [])

  const showBookings = ENABLE_BOOKING || previewEnabled

  return (
    <Layout
      hero={
        <HeroImage
          imageAltText="A camper on the bungee run at the M+M party."
          image={getImage(data.hero)}
          title={booked ? "Thanks!" : "Book your place"}
        />
      }
      theme="light"
    >
      {booked && (
        <>
          <h2>Thank you for applying to M+M 2026!</h2>
          <p>
            We&apos;ve received your application. Please check your inbox for a
            confirmation email and{" "}
            <a href="mailto:bookings@madnessandmayhem.org.uk">contact us</a> if
            you do not receive one within the next 24 hours. Before contacting
            us, please also check your spam folder.
          </p>
          <p>
            <Button
              onClick={() => {
                setBooked(false)
              }}
            >
              Book another child
            </Button>
          </p>
        </>
      )}
      {booked === false && showBookings && (
        <div
          css={`
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            & > * {
              max-width: ${MOBILE_WIDTH}px;
            }
            & h2 {
              font-family: Raleway;
              font-weight: 700;
            }
          `}
        >
          <RemarkText innerHTML={data.markdownRemark.html} />
          <PricingTable>
            <thead>
              <tr>
                <th></th>
                <th>Max (9-11)</th>
                <th>Madness (12-14)</th>
                <th>Mayhem (15-18)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Week 1</td>
                <td>£320</td>
                <td>£320</td>
                <td>£320 (girls) / £255* (boys)</td>
              </tr>
              <tr>
                <td>Week 2</td>
                <td>£320</td>
                <td>£320</td>
                <td>£320 (girls) / £255* (boys)</td>
              </tr>
              <tr>
                <td>Week 3</td>
                <td>£299</td>
                <td colSpan={2}>£299 (Madness+, 12-16)</td>
              </tr>
            </tbody>
          </PricingTable>
          <p css="font-size: 1em; margin-bottom: 2em;">
            *On Weeks 1+2, Mayhem boys will be accommodated in bell tents. To
            reflect that the boys will be camping, the price is reduced to £255
            for Mayhem boys. Full details can be found{" "}
            <Link to="/mayhem">here</Link>.
          </p>
          <BookingForm
            onComplete={formState => {
              setPreviousState(formState)
              setBooked(true)
            }}
            initialState={
              previousState !== null
                ? {
                    title: previousState.title,
                    parentFirstName: previousState.parentFirstName,
                    parentLastName: previousState.parentLastName,
                    parentRelationshipToChild:
                      previousState.parentRelationshipToChild,
                    parentAddressLine1: previousState.parentAddressLine1,
                    parentAddressLine2: previousState.parentAddressLine2,
                    parentAddressCity: previousState.parentAddressCity,
                    parentAddressCounty: previousState.parentAddressCounty,
                    parentPostcode: previousState.parentPostcode,
                    parentEmail: previousState.parentEmail,
                  }
                : null
            }
          />
        </div>
      )}
      {showBookings === false && (
        <p style={{ marginBottom: "5em", marginTop: "1em" }}>
          Bookings will open in January!
        </p>
      )}
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    markdownRemark(fileAbsolutePath: { regex: "//booking/intro.md/" }) {
      frontmatter {
        description
        path
      }
      html
    }
    hero: file(relativePath: { eq: "bungee_run_2022.jpg" }) {
      childImageSharp {
        gatsbyImageData(layout: FULL_WIDTH, quality: 90, placeholder: BLURRED)
        ogImage: fixed(width: 1200, height: 630) {
          src
        }
      }
    }
  }
`

export default Booking
