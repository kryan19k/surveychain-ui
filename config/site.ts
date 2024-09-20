// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Site
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
interface SiteConfig {
  name: string
  title: string
  emoji: string
  description: string
  localeDefault: string
  links: {
    docs: string
    discord: string
    twitter: string
    github: string
  }
}

export const SITE_CANONICAL = "https://surveychain.xyz"

export const siteConfig: SiteConfig = {
  name: "Sentiment",
  title: "Sentiment - Decentralized Surveys",
  emoji: "⚡",
  description:
    "Take Control of Your Data",
  localeDefault: "en",
  links: {
    docs: "",
    discord: "",
    twitter: "",
    github: "",
  },
}

export const DEPLOY_URL =
  ""
