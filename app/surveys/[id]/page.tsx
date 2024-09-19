/* eslint-disable @typescript-eslint/no-unsafe-call */
//surveys/[id]/page.tsx
/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  FiAward,
  FiClock,
  FiCopy,
  FiDownload,
  FiShare2,
  FiTag,
  FiUsers,
} from "react-icons/fi"
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share"

import { FADE_DOWN_ANIMATION_VARIANTS } from "@/config/design"
import { decryptAnswers } from "@/lib/utils/encryption"
import { getPrivateKey } from "@/lib/utils/keyManagement"
import { toast } from "@/components/ui/use-toast"
import { WalletAddress } from "@/components/blockchain/wallet-address"
import { WalletBalance } from "@/components/blockchain/wallet-balance"
import { WalletEnsName } from "@/components/blockchain/wallet-ens-name"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"
import { SurveyResponsesAccess } from "@/components/SurveyResponsesAccess"

interface Survey {
  id: string
  title: string
  description: string
  questions: Array<{
    text: string
    type: string
    options?: string[]
    min?: number
    max?: number
  }>
  tokenReward: string
  endTime: string
  maxResponses: string
  minimumResponseTime: string
  tags: string[]
  responses: Array<{
    respondent: string
    encryptedAnswers: string
  }>
}

export default function AdvancedSurveyView() {
  const params = useParams()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [decryptedResponses, setDecryptedResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState<string>("")

  useEffect(() => {
    const surveyId = params?.id as string
    if (surveyId) {
      void fetchSurvey(surveyId)
    }
  }, [params])

  const fetchSurvey = async (surveyId: string) => {
    try {
      setLoading(true)
      console.log("Fetching survey with ID:", surveyId)
      const response = await fetch(`/api/surveys/${surveyId}`)
      if (!response.ok) {
        console.error("Response not OK:", response.status, response.statusText)
        const errorText = await response.text()
        console.error("Error response body:", errorText)
        throw new Error(`Failed to fetch survey: ${response.statusText}`)
      }
      const data: Survey = await response.json()
      console.log("Fetched survey:", data)

      // Parse options for each question
      const parsedData = {
        ...data,
        questions: data.questions.map((q) => ({
          ...q,
          options: Array.isArray(q.options) ? q.options : undefined,
        })),
      }

      setSurvey(parsedData)
    } catch (error) {
      console.error("Error fetching survey:", error)
      toast({
        title: "Error fetching survey",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async () => {
    if (!survey) {
      toast({
        title: "Survey not loaded",
        description: "Please try again later.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/qr-code?surveyId=${survey.id}`)
      if (!response.ok) {
        throw new Error("Failed to generate QR code")
      }
      const data = await response.json()
      setQrCode(data.qrCode)
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopySuccess("Link copied to clipboard!")
        setTimeout(() => setCopySuccess(""), 3000)
      })
      .catch(() => {
        setCopySuccess("Failed to copy!")
        setTimeout(() => setCopySuccess(""), 3000)
      })
  }

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen bg-base-200 p-4">
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="container mx-auto min-h-screen bg-base-200 p-4">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Survey not found.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-h-screen bg-base-200 p-4">
      <motion.div
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={FADE_DOWN_ANIMATION_VARIANTS}
      >
        <IsWalletConnected>
          <motion.div
            className="card mb-8 bg-base-100 shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="card-body">
              <h2 className="card-title mb-4">Your Wallet</h2>
              <div className="flex flex-wrap items-center gap-4">
                <WalletAddress />
                <WalletBalance />
                <WalletEnsName />
              </div>
            </div>
          </motion.div>
        </IsWalletConnected>

        <IsWalletDisconnected>
          <div className="alert alert-warning mb-8 shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Please connect your wallet to view survey details.</span>
            </div>
          </div>
        </IsWalletDisconnected>

        <motion.div
          className="card bg-base-100 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-body">
            <h1 className="card-title text-3xl mb-4">{survey.title}</h1>
            <p className="mb-6 text-lg">{survey.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center">
                <FiAward className="mr-2 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">Token Reward</h2>
                  <p>{survey.tokenReward}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">End Time</h2>
                  <p>{new Date(survey.endTime).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiUsers className="mr-2 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">Max Responses</h2>
                  <p>{survey.maxResponses}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">
                    Minimum Response Time
                  </h2>
                  <p>{survey.minimumResponseTime} seconds</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <FiTag className="mr-2 text-primary" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {survey.tags.map((tag, index) => (
                  <span key={index} className="badge badge-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card bg-base-100 shadow-xl mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Share This Survey</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Social Media Buttons */}
              <div className="flex space-x-4 mb-4 md:mb-0">
                <FacebookShareButton url={shareUrl} title={survey.title}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={survey.title}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <LinkedinShareButton
                  url={shareUrl}
                  title={survey.title}
                  summary={survey.description}
                >
                  <LinkedinIcon size={40} round />
                </LinkedinShareButton>
                {/* Add more platforms as needed */}
              </div>

              {/* Copy Link */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="input input-bordered w-full max-w-xs"
                />
                <button onClick={copyToClipboard} className="btn btn-primary">
                  <FiCopy className="mr-2" /> Copy Link
                </button>
              </div>
            </div>
            {copySuccess && (
              <p className="text-green-500 mt-2">{copySuccess}</p>
            )}

            {/* QR Code Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FiShare2 className="mr-2 text-primary" />
                QR Code
              </h3>
              {qrCode ? (
                <div className="flex flex-col items-center">
                  <Image
                    src={qrCode}
                    alt="Survey QR Code"
                    width={200}
                    height={200}
                  />
                  <a
                    href={qrCode}
                    download={`survey-${survey.id}-qr-code.png`}
                    className="btn btn-primary mt-4 flex items-center"
                  >
                    <FiDownload className="mr-2" />
                    Download QR Code
                  </a>
                </div>
              ) : (
                <button onClick={generateQRCode} className="btn btn-primary">
                  Generate QR Code
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card bg-base-100 shadow-xl mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Questions</h2>
            {survey.questions.map((question, index) => (
              <div key={index} className="mb-6 p-4 bg-base-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{question.text}</h3>
                <p className="mb-2">Type: {question.type}</p>
                {question.options && Array.isArray(question.options) && (
                  <div>
                    <p className="font-semibold">Options:</p>
                    <ul className="list-disc list-inside">
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex}>{option}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {question.min !== undefined && question.max !== undefined && (
                  <p>
                    Scale: {question.min} - {question.max}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="card bg-base-100 shadow-xl mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Responses</h2>
            <SurveyResponsesAccess surveyId={survey.id} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
