import React, { FC } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { Column } from "./dataColumns"

interface CamperEmailProps {
  week: "1" | "2" | "3"
  camperFullName: string
  camperDob: string
  gender: "Male" | "Female"
}

type CampType = "Max" | "Madness" | "Madness+" | "Mayhem" | "Ineligible"

const getSchoolYear = (dob: Date, yearOfCamp: number): number => {
  let birthYear = dob.getFullYear()
  if (dob.getMonth() < 8) {
    birthYear -= 1
  }
  const schoolYear = yearOfCamp - birthYear - 6
  return schoolYear
}

const getCampFromSchoolYearAndWeek = (
  week: "1" | "2" | "3",
  schoolYear: number,
): CampType => {
  if (week === "3") {
    if (schoolYear >= 4 && schoolYear <= 6) {
      return "Max"
    } else if (schoolYear >= 7 && schoolYear <= 11) {
      return "Madness+"
    } else {
      return "Ineligible"
    }
  }

  if (schoolYear >= 4 && schoolYear <= 6) {
    return "Max"
  } else if (schoolYear >= 7 && schoolYear <= 9) {
    return "Madness"
  } else if (schoolYear >= 10 && schoolYear <= 13) {
    return "Mayhem"
  } else {
    return "Ineligible"
  }
}

const getPrice = (
  week: "1" | "2" | "3",
  camp: CampType | null,
  gender: "Male" | "Female",
): number => {
  if (camp === null || camp === "Ineligible") {
    return 320
  }
  if (week === "3") return 299
  if (camp === "Mayhem" && gender === "Male") return 255
  return 320
}

const CamperEmail: FC<CamperEmailProps> = ({
  week,
  camperFullName,
  camperDob,
  gender,
}) => {
  const [year, month, day] = camperDob.split("-").map(Number)
  const dob = new Date(year, month - 1, day)
  const schoolYear = getSchoolYear(dob, 2026)
  const camp = getCampFromSchoolYearAndWeek(week, schoolYear)
  const price = getPrice(week, camp, gender)
  return (
    <body>
      <p>We&apos;re delighted you have applied to come to M+M 2026.</p>
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
