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
  return (
    <body>
      <p>We&apos;re delighted you have applied to come to M+M 2026.</p>
      <p>Key details:</p>
      <ul>
        <li>Camper name: {camperFullName}</li>
        <li>Camper DOB: {camperDob}</li>
        <li>Week {week}</li>
      </ul>
      <p>
        Your application will now be processed and you will receive confirmation
        of a place (via email) from the Booking Secretary.
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
