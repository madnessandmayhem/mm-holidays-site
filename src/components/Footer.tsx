import React, { FC } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Link from "gatsby-link"

import PageGutter from "./PageGutter"
import {
  FOOTER_BG,
  FOOTER_TEXT,
  MOBILE_WIDTH,
  ENABLE_BOOKING,
} from "../constants"
import { StaticImage } from "gatsby-plugin-image"

const links: Array<{ name: string; path: string }> = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
  { name: "About us", path: "/about" },
  { name: "Max", path: "/max" },
  { name: "Madness", path: "/madness" },
  { name: "Mayhem", path: "/mayhem" },
  { name: "Get involved", path: "/get-involved" },
  { name: "Bursaries", path: "/bursary" },
  { name: "Privacy policy", path: "/privacy" },
  { name: "Safeguarding", path: "/safeguarding" },
  ...(ENABLE_BOOKING ? [{ name: "Book", path: "/booking" }] : []),
]

interface Props {}

const Footer: FC<Props> = () => {
  const data = useStaticQuery(graphql`
    query Footer {
      site {
        buildTime
      }
    }
  `)
  return (
    <footer
      css={`
        background-color: ${FOOTER_BG};
        color: ${FOOTER_TEXT};
        padding: 2rem 0;
        text-align: left;
        & a {
          color: currentColor;
        }
      `}
    >
      <PageGutter>
        <div
          css={`
            display: grid;
            grid-template-columns: auto auto auto 1fr;
            grid-gap: 1em;
            grid-template-areas: "logo email bar links";
            @media (max-width: ${MOBILE_WIDTH}px) {
              grid-template-columns: auto 1fr;
              grid-template-areas:
                "logo email"
                "links links";
            }
            align-items: center;
          `}
        >
          <div
            css={`
              grid-area: logo;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 0.75em;
            `}
          >
            <Link
              to="/"
              css={`
                display: block;
                width: 6em;
                height: auto;
                opacity: 0.6;
              `}
            >
              <StaticImage
                src="../images/logo_black.png"
                alt="The M+M logo"
                placeholder="tracedSVG"
              />
            </Link>
            <a
              href="https://www.crnet.org.uk"
              target="_blank"
              rel="noopener noreferrer"
              css={`
                display: block;
                width: 6em;
                height: auto;
                opacity: 0.6;
              `}
            >
              <StaticImage
                src="../images/cci_logo.png"
                alt="Christian Residential Network logo"
                placeholder="tracedSVG"
              />
            </a>
          </div>
          <div
            css={`
              grid-area: email;
              align-self: start;
            `}
          >
            <p
              css={`
                display: block;
                font-weight: 700;
                margin: 0;
              `}
            >
              M+M Holidays
            </p>
            <a href="mailto:info@madnessandmayhem.org.uk">
              info@madnessandmayhem.org.uk
            </a>
          </div>
          <div
            aria-hidden={true}
            css={`
              grid-area: bar;
              width: 3px;
              border-radius: 6px;
              background-color: currentColor;
              align-self: stretch;
              margin: 1em;
              @media (max-width: ${MOBILE_WIDTH}px) {
                display: none;
              }
            `}
          />
          <div
            css={`
              grid-area: links;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
              grid-gap: 1em;
              align-items: center;
            `}
          >
            {links.map(l => (
              <div key={l.path}>
                <Link to={l.path}>{l.name}</Link>
              </div>
            ))}
          </div>
        </div>
        <div css="text-align: center; margin-top: 2em;">
          <div>
            &copy; M+M Holidays {new Date(data.site.buildTime).getFullYear()}
          </div>
          <div css="font-size: 0.8em; margin-top: 0.5em;">
            The Madness and Mayhem Trust CIO is a registered charity no. 1211419
            (England and Wales)
          </div>
        </div>
      </PageGutter>
    </footer>
  )
}

export default Footer
