import React, { FC } from "react"
import styled from "styled-components"
import { graphql, useStaticQuery } from "gatsby"

import BookButton from "./BookButton"
import { MOBILE_WIDTH, ENABLE_BOOKING, TINY_WIDTH } from "../constants"

const HeroDetailsContent = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
`

const HeroDetailsRow = styled.div<{ shadows: boolean }>`
  margin: 0.4em 0;
  padding: 0;
  font-size: inherit;
  font-weight: 600;
  text-shadow: ${props =>
    props.shadows ? "0 0 30px rgba(0, 0, 0, 0.5)" : "none"};
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
  justify-content: space-between;
  @media (max-width: ${TINY_WIDTH}px) {
    flex-flow: column nowrap;
  }
`

const BookButtonContainer = styled.div`
  font-size: 0.8em;
`

const CampName = styled.div`
  margin-right: 1em;
  text-transform: uppercase;
  font-size: 0.7em;
  opacity: 0.9;
  letter-spacing: 0.1em;
  flex: 0 0 auto;
`

const CampDate = styled.div`
  @media (max-width: ${MOBILE_WIDTH}px) {
    font-size: 0.7em;
  }
`

const PriceText = styled.div`
  font-size: 0.8em;
  font-weight: 500;
`

interface Props {
  campName: string
  shadows: boolean
  price: string
  shouldShowWeek3: boolean
}

const CampDatesCTA: FC<Props> = ({
  campName,
  shadows,
  price,
  shouldShowWeek3,
}: Props) => {
  const data = useStaticQuery(graphql`
    query CampDatesCTA {
      site {
        siteMetadata {
          campWeeks {
            week
            shortDates
          }
        }
      }
    }
  `)
  return (
    <HeroDetailsContent>
      <div>
        {data.site.siteMetadata.campWeeks
          .filter((week: any) => {
            if (!shouldShowWeek3) {
              return week.week !== "3"
            }
            return true
          })
          .map((week: any) => {
            return (
              <HeroDetailsRow key={week.week} shadows={shadows}>
                <CampName>
                  {campName} {week.week}:
                </CampName>
                <CampDate>{week.shortDates}</CampDate>
              </HeroDetailsRow>
            )
          })}
      </div>
      {ENABLE_BOOKING && (
        <>
          <div
            aria-hidden={true}
            css={`
              background-color: currentColor;
              width: 0.15em;
              margin: 0 1.5em;
              align-self: stretch;
              border-radius: 0.1em;
            `}
          />
          <BookButtonContainer>
            <BookButton paddingHorizontal="0.3em">
              <div>Book now</div>
              <PriceText>{price}</PriceText>
            </BookButton>
          </BookButtonContainer>
        </>
      )}
    </HeroDetailsContent>
  )
}

export default CampDatesCTA
