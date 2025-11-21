import { google } from "googleapis"
import sendgrid from "@sendgrid/mail"
import dotenv from "dotenv"
import * as Sentry from "@sentry/serverless"
import { renderCamperEmail } from "./results/email"
import { createColumns } from "./results/dataColumns"
import { appendRow } from "./results/sheets"
import { APIGatewayEvent, Context, Callback } from "aws-lambda"

dotenv.config()

const getEnv = (name: string): string => {
  const val = process.env[name]
  if (val === undefined) {
    throw new Error(`Could not get envvar ${name}`)
  }
  return val
}

export interface Params {
  // section 1
  campChoice: "1" | "2" | "3"
  alternativeWeeks: string
  // section 2
  childFirstName: string
  childLastName: string
  childAddressLine1: string
  childAddressLine2: string
  childAddressCity: string
  childAddressCounty: string
  childPostcode: string
  childPhone: string
  childEmail: string
  childDobYear: string
  childDobMonth: string
  childDobDay: string
  gender: "Male" | "Female"
  youthGroup: string
  friendsWith: string
  // section 3
  title: string
  parentFirstName: string
  parentLastName: string
  parentRelationshipToChild: string
  parentAddressLine1: string
  parentAddressLine2: string
  parentAddressCity: string
  parentAddressCounty: string
  parentPostcode: string
  parentPhone: string
  parentEmail: string
  // section 4
  contactByEmail: boolean
  contactByPhone: boolean
  contactByPost: boolean
  acceptRecordKeeping: boolean
  // section 5
  generalPhotoPermission: boolean
  groupPhotoPermission: boolean
  idPhotoPermission: boolean
  // section 6
  heardSocialMedia: boolean
  heardMMWebsite: boolean
  heardBeenBefore: boolean
  heardFamilyMember: boolean
  heardChurch: boolean
  heardFriend: boolean
  heardOther: string
  // section 7
  paymentMethod: null | "Bank transfer" | "Cheque" | "Cash"
  paymentAmount: null | "Full" | "Deposit"
  // section 8
  dietaryNeeds: string
  medicalIssues: string
  behaviouralNeeds: string
  englishNotFirstLanguage: string
  additionalNeeds: string
  anythingElse: string
  // section 9
  childConfirmation: boolean
  mobileConfirmation: boolean
  // section 10
  parentConfirmation: boolean

  siblingDiscountNames: string
  wantBursary: boolean
}

export const handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  try {
    const dsn = getEnv("SENTRY_DSN_BACKEND")
    Sentry.AWSLambda.init({ dsn })
    console.log(new Date().toISOString())
    console.log("handling event", event.body)
    handleAsync(event, context, callback).catch(err => {
      console.log("got async error", err)
      Sentry.captureException(err)
      callback(null, {
        statusCode: 500,
        body: "Error submitting. Please try again.",
      })
    })
  } catch (err) {
    console.log("got top-level error", err)
    Sentry.captureException(err)
    callback(null, {
      statusCode: 500,
      body: "Error submitting. Please try again.",
    })
  }
}

export const handleAsync = async (
  event: APIGatewayEvent,
  // @ts-ignore
  context: Context,
  callback: Callback,
) => {
  const SENDGRID_API_KEY = getEnv("SENDGRID_API_KEY")
  // const CONFIRMATION_EMAIL_RECIPIENT = getEnv("CONFIRMATION_EMAIL_RECIPIENT")
  const GOOGLE_SPREADSHEET_ID = getEnv("GOOGLE_SPREADSHEET_ID")
  const GOOGLE_CLIENT_EMAIL = getEnv("GOOGLE_CLIENT_EMAIL")
  const GOOGLE_PRIVATE_KEY = JSON.parse(getEnv("GOOGLE_PRIVATE_KEY"))
  sendgrid.setApiKey(SENDGRID_API_KEY)
  if (event.body === null) {
    throw new Error("Event had empty body")
  }
  const params: Params = JSON.parse(event.body)

  if (params.acceptRecordKeeping === false) {
    callback(null, {
      statusCode: 400,
      body: "You must accept record keeping",
    })
    return
  }

  if (params.childConfirmation === false) {
    callback(null, {
      statusCode: 400,
      body: "The child confirmation box must be ticked",
    })
    return
  }

  if (params.mobileConfirmation === false) {
    callback(null, {
      statusCode: 400,
      body: "The mobile phone declaration box must be ticked",
    })
    return
  }

  if (params.parentConfirmation === false) {
    callback(null, {
      statusCode: 400,
      body: "The parent confirmation box must be ticked",
    })
    return
  }

  if (params.campChoice !== "3") {
    callback(null, {
      statusCode: 400,
      body: "Only Week 3 is currently available",
    })
  }

  const confirmationEmailAddress =
    params.parentEmail !== ""
      ? params.parentEmail
      : params.childEmail !== ""
      ? params.childEmail
      : null
  // tslint:disable-next-line strict-type-predicates
  if (confirmationEmailAddress == null) {
    callback(null, { statusCode: 400, body: "Please provide an email" })
    return
  }

  const columns = createColumns(params)

  try {
    console.log("appending row to google sheet")
    const sheetsClient = await getSheetsClient(
      GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY,
    )
    const row = columns.map(c => {
      if (["childHomePhone", "parentMobilePhone"].includes(c.id)) {
        // ensures it gets formatted as a string in sheets
        return `'${c.value}`
      }
      return c.value
    })
    console.log(row)
    await appendRow({
      sheetsClient,
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      row,
      tabName: "Raw Bookings",
      startColumn: "A",
      endColumn: "BE",
      startRow: 2,
    })
    await appendRow({
      sheetsClient,
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      row,
      tabName: "Bookings",
      startColumn: "B",
      endColumn: "BF",
      startRow: 2,
    })
  } catch (err) {
    console.log("failed to append row to google sheet")
    console.log(err)
    Sentry.captureException(err)
    callback(null, {
      statusCode: 500,
      body: "Could not store booking. Please contact bookings@madnessandmayhem.org.uk",
    })
    return
  }

  try {
    console.log("sending camper confirmation email")
    const html = renderCamperEmail(params.campChoice)
    const camperEmail = {
      to: {
        name: `${params.parentFirstName} ${params.parentLastName}`,
        email: confirmationEmailAddress,
      },
      from: { name: "M+M Bookings", email: "bookings@madnessandmayhem.org.uk" },
      subject: "Thank you for applying for a place at M+M 2025",
      text: html,
      html,
    }
    await sendgrid.send(camperEmail)
  } catch (err) {
    // @ts-ignore
    console.log(err.response.body)
    // @ts-ignore
    console.log("failed to send camper confirmation email", err.message)
    Sentry.captureException(err)
  }

  // try {
  //   console.log("sending camp leader notification email")
  //   const html = renderCampLeaderEmail(columns)
  //   const leaderEmail = {
  //     to: CONFIRMATION_EMAIL_RECIPIENT.split(","),
  //     from: { name: "M+M Bookings", email: "bookings@madnessandmayhem.org.uk" },
  //     subject: "New submission from booking form",
  //     text: html,
  //     html,
  //   }
  //   await sendgrid.send(leaderEmail)
  // } catch (err) {
  //   console.log(err)
  //   console.log("failed to send camp leader notification email")
  //   Sentry.captureException(err)
  // }
  console.log("emails sent successfully!")
  callback(null, {
    statusCode: 200,
    body: "",
  })
}

const getSheetsClient = async (
  googleClientEmail: string,
  googlePrivateKey: string,
) => {
  const jwtClient = new google.auth.JWT(
    googleClientEmail,
    undefined,
    googlePrivateKey,
    ["https://www.googleapis.com/auth/spreadsheets"],
  )
  //authenticate request
  await jwtClient.authorize()

  return google.sheets({ version: "v4", auth: jwtClient })
}
