"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaChartPie,
  FaCoins,
  FaExchangeAlt,
  FaFilePdf,
  FaHandshake,
  FaLock,
  FaPiggyBank,
  FaRocket,
  FaUsers,
} from "react-icons/fa"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const TokenomicsPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 text-white">
      <main className="grow container mx-auto px-4 py-20">
        <motion.h1
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sentiment Tokenomics
        </motion.h1>

        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/tokenomics"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "flex items-center space-x-2"
            )}
          >
            <FaFilePdf />
            <span>View Full Tokenomics PDF</span>
          </Link>
        </motion.div>

        <Introduction />
        <Roles />
        <RevenueStreams />
        <TokenPurpose />
        <AugmentedBondingCurves />
        <DataValue />
        <TokenDistribution />
      </main>
    </div>
  )
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <motion.section
    className="mb-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-3xl font-bold mb-6">{title}</h2>
    {children}
  </motion.section>
)

const Introduction: React.FC = () => (
  <Section title="Introduction">
    <p className="mb-4">
      Sentiment is a curation market where users produce and curate data sets
      for buyers. We provide the framework for this two-sided marketplace,
      acting as market-makers.
    </p>
    <p>
      $SENT is staked to create surveys and questions, functioning as a
      &quot;skin-in-the-game&quot; signal that indicates the potential value of
      a data set. The staking process taps into the &quot;wisdom of the
      crowd&quot; while distributing capital risk.
    </p>
  </Section>
)

const Roles: React.FC = () => (
  <Section title="The Roles">
    <ul className="list-disc list-inside space-y-2">
      <li>GiveSentiment, Inc. (GS)</li>
      <li>Users (survey respondents)</li>
      <li>Stakers (campaign owners, campaign generators)</li>
      <li>Companies/institutions/governments (data buyers)</li>
      <li>Nodes running our application (cloud provider)</li>
    </ul>
  </Section>
)

const RevenueStreams: React.FC = () => (
  <Section title="Revenue Streams">
    <ol className="list-decimal list-inside space-y-2">
      <li>Platform access fees from third parties</li>
      <li>Data set purchases by third parties</li>
      <li>Direct payments for creating and promoting surveys</li>
      <li>Node hosting revenue</li>
    </ol>
  </Section>
)

const TokenPurpose: React.FC = () => (
  <Section title="Purpose of the $SENT Token">
    <ul className="list-disc list-inside space-y-2">
      <li>Staking for survey creation and collaboration</li>
      <li>Signaling potential value of data sets</li>
      <li>Incentivizing quality survey design</li>
      <li>Enabling revenue sharing among participants</li>
      <li>Facilitating an autobuy mechanism for liquidity</li>
    </ul>
  </Section>
)

const AugmentedBondingCurves: React.FC = () => (
  <Section title="Augmented Bonding Curves">
    <p className="mb-4">
      We implement augmented bonding curves for staking and survey generation.
      These curves describe the relationship between price and supply, including
      a funding pool, token lock-up mechanism, and inter-system feedback loops.
    </p>
    <p>
      Key features include diminishing returns for later stakers, incentives for
      survey improvement, and natural price discovery mechanisms.
    </p>
  </Section>
)

const DataValue: React.FC = () => (
  <Section title="Data Value and Privacy">
    <p className="mb-4">
      Data is encrypted and scarce, with users retaining ownership. The value of
      data increases with quantity and novelty, following Metcalfe&apos;s Law.
    </p>
    <p>
      Privacy and data sovereignty are crucial to our business model and
      tokenomics, reinforcing the scarcity and value of the data.
    </p>
  </Section>
)

const TokenDistribution: React.FC = () => (
  <Section title="Token Distribution">
    <p className="mb-4">Total Supply: 100 million tokens</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {distributionData.map((item, index) => (
        <DistributionCard key={item.title} {...item} index={index} />
      ))}
    </div>
  </Section>
)

interface DistributionCardProps {
  icon: React.ReactNode
  title: string
  percentage: string
  description: string
  index: number
}

const DistributionCard: React.FC<DistributionCardProps> = ({
  icon,
  title,
  percentage,
  description,
  index,
}) => (
  <motion.div
    className="card bg-base-100 shadow-xl overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="card-body">
      <div className="text-4xl text-primary mb-4">{icon}</div>
      <h3 className="card-title text-2xl mb-2">{title}</h3>
      <p className="text-xl font-bold mb-2">{percentage}</p>
      <p>{description}</p>
    </div>
  </motion.div>
)

const distributionData = [
  {
    icon: <FaUsers />,
    title: "Community and Network Growth",
    percentage: "50%",
    description:
      "Allocated for rewards, token sale/TGE, user incentives, and ecosystem development grants.",
  },
  {
    icon: <FaHandshake />,
    title: "Team and Advisors",
    percentage: "10%",
    description:
      "Reserved for the project team and advisors with a vesting period to align long-term interests.",
  },
  {
    icon: <FaRocket />,
    title: "Early Investors",
    percentage: "15%",
    description:
      "For initial backers who provide funding and resources for the project's development.",
  },
  {
    icon: <FaPiggyBank />,
    title: "Reserve",
    percentage: "20%",
    description:
      "Held by the protocol for unforeseen expenses, future funding rounds, or strategic investments.",
  },
  {
    icon: <FaHandshake />,
    title: "Partnerships and Collaborations",
    percentage: "5%",
    description:
      "To build relationships with other projects and platforms, enhancing network effects.",
  },
]

export default TokenomicsPage
