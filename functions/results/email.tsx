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
      <p>
        Your application will now be processed and you will receive confirmation
        of a place (via email) from the Booking Secretary.
      </p>
      <p>Key details:</p>
      <ul>
        <li>Camper name: {camperFullName}</li>
        <li>Camper DOB: {camperDob}</li>
        <li>Week {week}</li>
        <li>Price: £{price}</li>
      </ul>
      <p>
        We are currently setting up a new bank account and will send you the
        payment details in the next couple of months. Once you have the details,
        you will need to pay the deposit of £40 (or the full fee if you prefer)
        within 2 weeks in order to keep your place(s). The full balance is due
        by 31st May 2026.
      </p>
      <p>
        We will continue to send important information via email, particularly
        near the holiday.
      </p>
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
