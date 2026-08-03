import styled from "styled-components"
import { Link } from "gatsby"
import { ComponentType } from "react"

import {
  PRIMARY_COLOUR,
  PRIMARY_COLOUR_DARK,
  PRIMARY_COLOUR_LIGHT,
} from "../constants"

interface Props {
  fontSize?: string
  paddingHorizontal?: string
  children: React.ReactNode
}

// @ts-ignore
const BookingNoticeLink: ComponentType<Props> = styled(Link).attrs({
  to: "/booking",
})`
  display: inline-block;
  padding: 0.8em ${({ paddingHorizontal = "1em" }: Props) => paddingHorizontal};
  background-color: ${PRIMARY_COLOUR};
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  min-width: 6em;
  color: ${PRIMARY_COLOUR_DARK};
  text-decoration: none;
  font-weight: bold;
  transition: background-color 400ms, color 400ms, box-shadow 200ms;
  font-size: ${({ fontSize = "1.2em" }: Props) => fontSize};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 0.5em;
  &:hover {
    background-color: ${PRIMARY_COLOUR_LIGHT};
  }
  &:active {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
`

export default BookingNoticeLink
