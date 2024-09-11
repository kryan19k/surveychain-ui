/* eslint-disable @typescript-eslint/no-unsafe-call */
// In /app/api/surveys/[surveyId]/responses/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { encryptAnswers, decryptAnswers } from '@/lib/utils/encryption';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { surveyid: string } }
) {
  const accessKey = request.headers.get('X-Access-Key');
  
  if (!accessKey) {
    return NextResponse.json({ error: 'Access key is required' }, { status: 401 });
  }

  try {
    const surveyKey = await prisma.surveyKey.findUnique({
      where: { surveyId: params.surveyid },
    });

    if (!surveyKey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    // Verify the access key matches the stored key
    if (accessKey !== surveyKey.encryptedSurveyId) {
      console.log('Access key mismatch:', { provided: accessKey, stored: surveyKey.encryptedSurveyId });
      return NextResponse.json({ error: 'Invalid access key' }, { status: 403 });
    }

    // Fetch responses for the survey
    const responses = await prisma.response.findMany({
      where: { surveyId: params.surveyid },
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    return NextResponse.json({ error: 'Failed to fetch survey responses' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { surveyid: string } }
) {
  try {
    const { respondent, answers, completionTime } = await request.json();
    const surveyId = params.surveyid;

    console.log('Received survey response:', { surveyId, respondent, completionTime });

    // Check if the survey exists and is still open
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: { responses: true },
    });

    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    if (new Date(survey.endTime) < new Date()) {
      return NextResponse.json({ error: 'Survey has ended' }, { status: 400 });
    }

    if (survey.responses.length >= parseInt(survey.maxResponses)) {
      return NextResponse.json({ error: 'Maximum responses reached' }, { status: 400 });
    }

    // Check if the user has already responded
    const existingResponse = await prisma.response.findFirst({
      where: { surveyId, respondent },
    });

    if (existingResponse) {
      return NextResponse.json({ error: 'You have already responded to this survey' }, { status: 400 });
    }

    // Fetch the survey key
    const surveyKey = await prisma.surveyKey.findUnique({
      where: { surveyId: surveyId },
    });

    if (!surveyKey) {
      return NextResponse.json({ error: 'Survey key not found' }, { status: 404 });
    }

    // Encrypt the answers
    const encryptedAnswers = encryptAnswers(answers, surveyKey.encryptedSurveyId);

    const newResponse = await prisma.response.create({
      data: {
        surveyId,
        respondent,
        encryptedAnswers,
        completionTime,
      },
    });

    console.log('Created new response:', newResponse.id);

    return NextResponse.json(newResponse, { status: 201 });
  } catch (error) {
    console.error('Error submitting survey response:', error);
    return NextResponse.json({ error: 'Failed to submit survey response' }, { status: 500 });
  }
}