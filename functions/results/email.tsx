import React, { FC } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { Column } from "./dataColumns"

interface CamperEmailProps {
  week: "1" | "2" | "3"
}

const CamperEmail: FC<CamperEmailProps> = ({ week }) => {
  return (
    <body>
      <p>
        We&apos;re delighted you have applied to come to M+M Week 2025 (week{" "}
        {week}).
      </p>
      <p>
        Your application will now be processed and you will receive confirmation
        of a place (via email) from the Booking Secretary.
      </p>
      <p>
        We are currently setting up a new bank account and will send you the
        payment details in the next couple of months. Once you have the details,
        you will need to pay the deposit of £40 (or the full fee if you prefer)
        within 2 weeks in order to keep your place(s). The full balance is due
        by 31st May 2025.
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

export const renderCamperEmail = (week: "1" | "2" | "3") =>
  renderToStaticMarkup(<CamperEmail week={week} />)
export const renderCampLeaderEmail = (columns: Array<Column>) =>
  renderToStaticMarkup(<CampLeaderEmail columns={columns} />)
