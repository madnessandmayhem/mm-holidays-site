const { createProxyMiddleware } = require("http-proxy-middleware")
const dotenv = require("dotenv")
dotenv.config()

const getEnv = name => {
  const value = process.env[name]
  if (value == null) {
    throw new Error(`Could not find envvar with name '${name}'`)
  }
  return value
}

// undefined | string
const GA_ID = process.env["GOOGLE_ANALYTICS_ID"]

module.exports = {
  siteMetadata: {
    title: "M+M Holidays",
    seoDescription:
      "M+M is an action-packed holiday week for young people aged 9 to 18. It’s seven days of fun, friends and exploring big ideas from the Christian faith.",
    baseUrl: getEnv("DEPLOY_URL"),
    campWeeks: [
      {
        week: "1",
        shortDates: "Sat 25th July – Sat 1st August 2026",
      },
      {
        week: "2",
        shortDates: "Sat 1st – Sat 8th August 2026",
      },
      {
        week: "3",
        shortDates: "Sat 8th – Sat 15th August 2026",
      },
    ],
  },
  developMiddleware: app => {
    app.use(
      "/.netlify/functions/",
      createProxyMiddleware({
        target: "http://localhost:9000",
        pathRewrite: {
          "/.netlify/functions/": "",
        },
      }),
    )
  },
  plugins: [
    "gatsby-plugin-typescript",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    "gatsby-plugin-netlify",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "M+M Holidays",
        start_url: "/",
        background_color: "#fff",
        theme_color: "#fff",
        display: "browser",
        icon: "src/images/logo_black_square.png",
      },
    },
    ...(GA_ID != null
      ? [
          {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
              trackingId: GA_ID,
              anonymize: true,
              respectDNT: true,
            },
          },
        ]
      : []),
    "gatsby-plugin-styled-components",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/content`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          "gatsby-remark-external-links",
          "gatsby-remark-copy-linked-files",
        ],
      },
    },
    "gatsby-plugin-catch-links",
  ],
}
