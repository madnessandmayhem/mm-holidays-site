import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { google } from "googleapis"
import dotenv from "dotenv"
import * as Sentry from "@sentry/serverless"
import { renderCamperEmail, renderCampLeaderEmail } from "./results/email"
import { createColumns } from "./results/dataColumns"
import { appendRow } from "./results/sheets"
import type { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions"

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

export const handler: Handler = async (event, _context) => {
  console.log(event)
  try {
    const dsn = getEnv("SENTRY_DSN_BACKEND")
    Sentry.AWSLambda.init({ dsn })
    console.log(new Date().toISOString())
    console.log("handling event", event.body)
    return await handleLogic(event)
  } catch (err) {
    console.log("got error", err)
    Sentry.captureException(err)
    return {
      body: "Error submitting. Please try again.",
      statusCode: 500,
    }
  }
}

export const handleLogic = async (
  event: HandlerEvent,
): Promise<HandlerResponse> => {
  const emailClient = new EmailClient({
    region: "eu-west-2",
    awsAccessKey: getEnv("MM_AWS_ACCESS_KEY"),
    awsSecretAccessKey: getEnv("MM_AWS_SECRET_ACCESS_KEY"),
  })

  const GOOGLE_SPREADSHEET_ID = getEnv("GOOGLE_SPREADSHEET_ID")
  const GOOGLE_CLIENT_EMAIL = getEnv("GOOGLE_CLIENT_EMAIL")
  const GOOGLE_PRIVATE_KEY = JSON.parse(getEnv("GOOGLE_PRIVATE_KEY"))
  if (event.body === null) {
    throw new Error("Event had empty body")
  }
  const params: Params = JSON.parse(event.body)

  if (params.acceptRecordKeeping === false) {
    return {
      statusCode: 400,
      body: "You must accept record keeping",
    }
  }

  if (params.childConfirmation === false) {
    return {
      statusCode: 400,
      body: "The child confirmation box must be ticked",
    }
  }

  if (params.mobileConfirmation === false) {
    return {
      statusCode: 400,
      body: "The mobile phone declaration box must be ticked",
    }
  }

  if (params.parentConfirmation === false) {
    return {
      statusCode: 400,
      body: "The parent confirmation box must be ticked",
    }
  }

  const confirmationEmailAddress =
    params.parentEmail !== ""
      ? params.parentEmail
      : params.childEmail !== ""
      ? params.childEmail
      : null
  // tslint:disable-next-line strict-type-predicates
  if (confirmationEmailAddress == null) {
    return { statusCode: 400, body: "Please provide an email" }
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
      endColumn: "BF",
      startRow: 2,
    })
    await appendRow({
      sheetsClient,
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      row,
      tabName: "Bookings",
      startColumn: "B",
      endColumn: "BG",
      startRow: 2,
    })
  } catch (err) {
    console.log("failed to append row to google sheet")
    console.log(err)
    Sentry.captureException(err)
    return {
      statusCode: 500,
      body: "Could not store booking. Please contact bookings@madnessandmayhem.org.uk",
    }
  }
  const camperFullName = `${params.childFirstName} ${params.childLastName}`
  try {
    console.log("sending camper confirmation email!!!")
    const html = renderCamperEmail({
      week: params.campChoice,
      camperFullName,
      camperDob: `${params.childDobYear}-${params.childDobMonth}-${params.childDobDay}`,
    })
    await emailClient.sendEmail({
      subject: `(${camperFullName}) Thank you for applying for a place at M+M 2026`,
      html,
      toAddresses: [confirmationEmailAddress],
    })
  } catch (err) {
    // @ts-ignore
    console.log(err.message)
    // @ts-ignore
    console.log("failed to send camper confirmation email", err.message)
    Sentry.captureException(err)
  }

  try {
    console.log("sending camp leader notification email")
    const html = renderCampLeaderEmail(columns)
    await emailClient.sendEmail({
      subject: `(${camperFullName}) New submission from booking form`,
      toAddresses: [
        "bookings@madnessandmayhem.org.uk",
        `week${params.campChoice}@madnessandmayhem.org.uk`,
      ],
      html,
    })
  } catch (err) {
    console.log(err)
    console.log("failed to send camp leader notification email")
    Sentry.captureException(err)
  }
  console.log("emails sent successfully!")
  return {
    statusCode: 200,
    body: "",
  }
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

type SendEmailArgs = {
  toAddresses: Array<string>
  subject: string
  html: string
}

class EmailClient {
  private _sesClient: SESClient
  constructor(args: {
    region: string
    awsAccessKey: string
    awsSecretAccessKey: string
  }) {
    this._sesClient = new SESClient({
      region: args.region,
      credentials: {
        accessKeyId: args.awsAccessKey,
        secretAccessKey: args.awsSecretAccessKey,
      },
    })
  }

  async sendEmail(args: SendEmailArgs) {
    const { toAddresses, subject, html } = args
    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Body: {
          Text: { Data: html },
          Html: { Data: html },
        },
        Subject: { Data: subject },
      },
      Source: "M+M Bookings <bookings@madnessandmayhem.org.uk>",
    })

    await this._sesClient.send(command)
  }
}
