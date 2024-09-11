/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"

import { decryptAnswers } from "@/lib/utils/encryption" // Make sure this import is correct
import { toast } from "@/components/ui/use-toast"

interface SurveyResponsesAccessProps {
  surveyId: string
}

interface DecryptedResponse {
  respondent: string
  answers: Record<string, any>
  completionTime: number
}

export const SurveyResponsesAccess: React.FC<SurveyResponsesAccessProps> = ({
  surveyId,
}) => {
  const [accessKey, setAccessKey] = useState("")
  const [responses, setResponses] = useState<DecryptedResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/surveys/${surveyId}/responses`, {
        headers: {
          "X-Access-Key": accessKey,
        },
      })

      if (!response.ok) {
        throw new Error(
          `Failed to fetch responses: ${response.status} ${response.statusText}`
        )
      }

      const rawData = await response.text()
      console.log("Raw response data:", rawData)

      let data
      try {
        data = JSON.parse(rawData)
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError)
        throw new Error("Invalid JSON response from server")
      }

      const decryptedResponses = data.map((response: any) => {
        console.log("Encrypted answers:", response.encryptedAnswers)
        console.log("Access key:", accessKey)
        const decryptedAnswersString = decryptAnswers(
          response.encryptedAnswers,
          accessKey
        )
        console.log("Decrypted answers string:", decryptedAnswersString)
        let answers
        try {
          answers = JSON.parse(decryptedAnswersString)
        } catch (error) {
          console.error("Error parsing decrypted answers:", error)
          answers = {} // or some default value
        }
        return {
          respondent: response.respondent,
          answers,
          completionTime: response.completionTime,
        }
      })

      setResponses(decryptedResponses)
      toast({
        title: "Success",
        description: "Responses fetched and decrypted successfully",
      })
    } catch (error) {
      console.error("Error fetching responses:", error)
      toast({
        title: "Error",
        description:
          "Failed to fetch or decrypt responses. Please check your access key.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadData = (format: "csv" | "json" | "excel") => {
    switch (format) {
      case "csv":
        const csv = convertToCSV(responses)
        const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        saveAs(csvBlob, "survey_responses.csv")
        break
      case "json":
        const jsonBlob = new Blob([JSON.stringify(responses, null, 2)], {
          type: "application/json",
        })
        saveAs(jsonBlob, "survey_responses.json")
        break
      case "excel":
        const ws = XLSX.utils.json_to_sheet(responses)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Responses")
        XLSX.writeFile(wb, "survey_responses.xlsx")
        break
    }
  }

  const convertToCSV = (data: DecryptedResponse[]) => {
    const headers = [
      "Respondent",
      "Completion Time",
      ...Object.keys(data[0]?.answers || {}),
    ]
    const csvRows = [headers.join(",")]

    for (const row of data) {
      const values = [
        row.respondent,
        row.completionTime.toString(),
        ...Object.values(row.answers).map(
          (value) => `"${value.toString().replace(/"/g, '""')}"`
        ),
      ]
      csvRows.push(values.join(","))
    }

    return csvRows.join("\n")
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          placeholder="Enter access key"
          className="border p-2 mr-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Access Responses"}
        </button>
      </form>

      {responses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Survey Responses</h2>
          <div className="mb-4">
            <button
              onClick={() => downloadData("csv")}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Download CSV
            </button>
            <button
              onClick={() => downloadData("json")}
              className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            >
              Download JSON
            </button>
            <button
              onClick={() => downloadData("excel")}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Download Excel
            </button>
          </div>
          <ul>
            {responses.map((response, index) => (
              <li key={index} className="mb-4 p-4 border rounded">
                <p>
                  <strong>Respondent:</strong> {response.respondent}
                </p>
                <p>
                  <strong>Completion Time:</strong> {response.completionTime}{" "}
                  seconds
                </p>
                <p>
                  <strong>Answers:</strong>
                </p>
                <ul>
                  {Object.entries(response.answers).map(
                    ([question, answer], i) => (
                      <li key={i}>
                        <strong>{question}:</strong> {JSON.stringify(answer)}
                      </li>
                    )
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
