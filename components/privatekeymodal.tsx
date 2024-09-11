/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import React from "react"
import { motion } from "framer-motion"
import { FiCopy, FiDownload } from "react-icons/fi"

import { toast } from "@/components/ui/use-toast"

interface AccessKeyModalProps {
  isOpen: boolean
  onClose: () => void
  surveyId: string
  accessKey: string
}

export const AccessKeyModal: React.FC<AccessKeyModalProps> = ({
  isOpen,
  onClose,
  surveyId,
  accessKey,
}) => {
  if (!isOpen) return null

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "The access key has been copied to your clipboard.",
      })
    })
  }

  const downloadAccessKey = () => {
    const element = document.createElement("a")
    const file = new Blob(
      [`Survey ID: ${surveyId}\nAccess Key: ${accessKey}`],
      { type: "text/plain" }
    )
    element.href = URL.createObjectURL(file)
    element.download = `survey_${surveyId}_access_key.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4">
          Survey Created Successfully!
        </h2>
        <p className="mb-4">
          Please save your access key. You&apos;ll need it to view survey
          responses later.
        </p>

        <div className="bg-gray-100 p-3 rounded mb-4">
          <p className="font-mono break-all">{accessKey}</p>
        </div>

        <div className="flex justify-between mb-6">
          <button
            onClick={() => copyToClipboard(accessKey)}
            className="btn btn-primary flex items-center"
          >
            <FiCopy className="mr-2" /> Copy Key
          </button>
          <button
            onClick={downloadAccessKey}
            className="btn btn-secondary flex items-center"
          >
            <FiDownload className="mr-2" /> Download Key
          </button>
        </div>

        <div className="text-center">
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
