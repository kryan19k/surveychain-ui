/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client"

import React, { useEffect, useState } from "react"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"

import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"

const PDFViewer: React.FC = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    setPdfUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/SentimentTokenomics.pdf`)
  }, [])

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Sentiment Tokenomics PDF</h1>
      <div
        className="bg-white p-4 rounded-lg shadow-lg"
        style={{ width: "100%", height: "calc(100vh - 200px)" }}
      >
        <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
          {pdfUrl && (
            <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
          )}
        </Worker>
      </div>
    </div>
  )
}

export default PDFViewer
