import React, { FC } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { Column } from "./dataColumns"

interface CamperEmailProps {
  week: "1" | "2" | "3"
  camperFullName: string
  camperDob: string
}

const CamperEmail: FC<CamperEmailProps> = ({
  week,
  camperFullName,
  camperDob,
}) => {
  const price = week === "3" ? 299 : 320
  return (
    <body>
      <p>
        We&apos;re delighted you have applied to come to M+M Week 2026. (week{" "}
        {week}).
      </p>
      <p>Key details:</p>
      <ul>
        <li>Camper name: {camperFullName}</li>
        <li>Camper DOB: {camperDob}</li>
        <li>Week {week}</li>
        <li>Full price: £{price}</li>
      </ul>
      <p>
        Your application will now be processed and you will receive confirmation
        of a place (via email) from the Booking Secretary.
      </p>
      <p>
        Upon receipt of confirmation of a place, you will need to pay the
        deposit of £40 (or the full fee) within 2 weeks in order to keep the
        place. Please make payment to:
        <br />
        Madness and Mayhem Trust CIO
        <br />
        Sort code: 40-16-15
        <br />
        Account number: 64396200
        <br />
        Reference: your child&apos;s name and the week they are attending (eg, J
        Webster 3)
        <br />
        The full balance is due by 31st May 2026.
      </p>
      <p>
        We will continue to send important information via email. Therefore,
        please regularly check your emails including your spam folder.
      </p>
      <p>We look forward to welcoming your child to M+M.</p>
    </body>
  )
}

interface CampLeaderEmailProps {
  columns: Array<Column>
}

const CampLeaderEmail: FC<CampLeaderEmailProps> = ({
  columns,
}: CampLeaderEmailProps) => {
  return (
    <body>
      {columns.map(column => (
        <>
          <p>
            <strong>{column.name}</strong>
            <br />
            {column.value}
          </p>
          <br />
        </>
      ))}
    </body>
  )
}

export const renderCamperEmail = (props: CamperEmailProps) =>
  renderToStaticMarkup(<CamperEmail {...props} />)

export const renderCampLeaderEmail = (columns: Array<Column>) =>
  renderToStaticMarkup(<CampLeaderEmail columns={columns} />)
