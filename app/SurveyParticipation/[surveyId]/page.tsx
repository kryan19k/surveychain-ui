/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Controller, useForm } from "react-hook-form"
import { useAccount } from "wagmi"
import * as z from "zod"

import { encryptAnswers } from "@/lib/utils/encryption"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { WalletAddress } from "@/components/blockchain/wallet-address"
import { WalletBalance } from "@/components/blockchain/wallet-balance"

interface Survey {
  id: string
  title: string
  description: string
  imageUri?: string
  questions: Array<{
    text: string
    type: "text" | "number" | "radio" | "checkbox" | "scale"
    options?: Array<string | number> | string
    min?: number
    max?: number
  }>
  tokenReward: string
  endTime: string
  maxResponses: string
  minimumResponseTime: string
  tags: string[]
  totalParticipants: number
  averageCompletionTime: number
}

export default function SurveyParticipationPage() {
  const params = useParams()
  const surveyId = params.surveyId as string
  const router = useRouter()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userRewards, setUserRewards] = useState("0")
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)

  const schema = z.object({
    answers: z.array(z.union([z.string(), z.number(), z.array(z.string())])),
  })

  type FormData = z.infer<typeof schema>

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { answers: [] },
  })

  useEffect(() => {
    const fetchSurvey = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/surveys/${surveyId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch survey: ${response.statusText}`)
        }
        const data: Survey = await response.json()
        setSurvey(data)
        setStartTime(Date.now())
      } catch (error) {
        console.error("Error fetching survey:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (surveyId) {
      void fetchSurvey()
    }
  }, [surveyId])

  const onSubmit = async (data: FormData) => {
    if (!address || !survey || startTime === null) {
      toast({
        title: "Error",
        description:
          "Please connect your wallet and select a survey to submit.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const completionTime = (Date.now() - startTime) / 1000 // in seconds
      console.log("Submitting survey response")
      const response = await fetch(`/api/surveys/${surveyId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          respondent: address,
          answers: data.answers,
          completionTime,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Survey submission response:", response.status, errorData)
        throw new Error(errorData.error || "Failed to submit survey")
      }

      console.log("Survey response submitted successfully")
      toast({
        title: "Success!",
        description: "Your survey response has been submitted.",
      })

      reset()
      void router.push("/thank-you")
    } catch (error) {
      console.error("Error submitting survey:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit survey. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = (
    question: Survey["questions"][number],
    index: number
  ) => {
    // Parse options if they're stored as a string
    const options = Array.isArray(question.options)
      ? question.options
      : question.options
      ? JSON.parse(question.options as string)
      : []

    switch (question.type) {
      case "text":
        return (
          <Controller
            name={`answers.${index}`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full"
                placeholder="Enter your answer"
              />
            )}
          />
        )
      case "number":
        return (
          <Controller
            name={`answers.${index}`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                className="w-full"
                placeholder="Enter a number"
              />
            )}
          />
        )
      case "radio":
        return (
          <Controller
            name={`answers.${index}`}
            control={control}
            render={({ field }) => (
              <div className="form-control">
                {options.map(
                  (option: any, optionIndex: React.Key | null | undefined) => (
                    <label key={optionIndex} className="label cursor-pointer">
                      <span className="label-text">{String(option)}</span>
                      <input
                        type="radio"
                        className="radio-primary radio"
                        value={String(option)}
                        checked={field.value === String(option)}
                        onChange={() => field.onChange(String(option))}
                      />
                    </label>
                  )
                )}
              </div>
            )}
          />
        )
      case "checkbox":
        return (
          <Controller
            name={`answers.${index}`}
            control={control}
            render={({ field }) => (
              <div className="form-control">
                {options.map(
                  (option: any, optionIndex: React.Key | null | undefined) => (
                    <label key={optionIndex} className="label cursor-pointer">
                      <span className="label-text">{String(option)}</span>
                      <Checkbox
                        checked={(field.value as string[])?.includes(
                          String(option)
                        )}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [
                                ...((field.value as string[]) || []),
                                String(option),
                              ]
                            : ((field.value as string[]) || []).filter(
                                (item) => item !== String(option)
                              )
                          field.onChange(updatedValue)
                        }}
                      />
                    </label>
                  )
                )}
              </div>
            )}
          />
        )
      case "scale":
        return (
          <Controller
            name={`answers.${index}`}
            control={control}
            render={({ field }) => (
              <div className="form-control">
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  value={field.value as number}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  className="range range-primary"
                />
                <div className="flex justify-between px-2 text-xs">
                  <span>{question.min}</span>
                  <span>{question.max}</span>
                </div>
              </div>
            )}
          />
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return <div>Loading survey...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!survey) {
    return <div>Survey not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="card mb-6 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <WalletAddress />
            <WalletBalance />
            <div className="text-sm">Reward Balance: {userRewards} DAG</div>
          </div>
        </div>
      </div>

      <div className="card mb-6 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{survey.title}</h2>
          <p>{survey.description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card mb-6 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  {survey.questions[currentQuestion].text}
                </h2>
                {renderQuestion(
                  survey.questions[currentQuestion],
                  currentQuestion
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between">
          <Button
            className="btn btn-outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          {currentQuestion < survey.questions.length - 1 ? (
            <Button
              className="btn btn-primary"
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(survey.questions.length - 1, prev + 1)
                )
              }
            >
              Next
            </Button>
          ) : (
            <Button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </Button>
          )}
        </div>

        <div className="mt-6">
          <progress
            className="progress progress-primary w-full"
            value={((currentQuestion + 1) / survey.questions.length) * 100}
            max="100"
          ></progress>
          <p className="mt-2 text-center">
            Question {currentQuestion + 1} of {survey.questions.length}
          </p>
        </div>
      </form>
    </div>
  )
}
