"use client"

import React, { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const PDFViewer: React.FC = () => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Sentiment Tokenomics PDF</h1>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <Document
          file="/SentimentTokenomics.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      <p className="mt-4">
        Page {pageNumber} of {numPages}
      </p>
      <div className="flex space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber >= (numPages || 0)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default PDFViewer
