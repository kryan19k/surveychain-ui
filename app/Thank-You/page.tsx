/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa"

export default function ThankYouPage() {
  const router = useRouter()
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    // Trigger confetti effect on component mount
    void confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [])

  const handleShareClick = (platform: string) => {
    // Implement sharing logic here
    console.log(`Shared on ${platform}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary text-primary-content flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">
          Thank You for Participating!
        </h1>
        <p className="text-xl mb-8">
          Your input is invaluable to our research.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary btn-lg mb-8"
          onClick={() => setShowStats(!showStats)}
        >
          {showStats ? "Hide" : "Show"} Survey Stats
        </motion.div>

        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Total Responses</div>
                <div className="stat-value">31K</div>
                <div className="stat-desc">Jan 1st - Feb 1st</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Avg. Completion Time</div>
                <div className="stat-value">4m 20s</div>
                <div className="stat-desc">↗︎ 400 (22%)</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Total Rewards</div>
                <div className="stat-value">1,200 DAG</div>
                <div className="stat-desc">↘︎ 90 (14%)</div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Share Your Experience</h2>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-circle btn-lg"
              onClick={() => handleShareClick("Twitter")}
            >
              <FaTwitter size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-circle btn-lg"
              onClick={() => handleShareClick("Facebook")}
            >
              <FaFacebook size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-circle btn-lg"
              onClick={() => handleShareClick("LinkedIn")}
            >
              <FaLinkedin size={24} />
            </motion.button>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-secondary btn-lg"
          onClick={() => router.push("/surveys")}
        >
          Back to Surveys
        </motion.div>
      </motion.div>
    </div>
  )
}
