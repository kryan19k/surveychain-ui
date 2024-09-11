import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { surveyid: string } }
) {
  try {
    const surveyId = params.surveyid;
    console.log('Fetching key for survey ID:', surveyId);

    const surveyKey = await prisma.surveyKey.findUnique({
      where: { surveyId: surveyId },
    });

    if (!surveyKey) {
      console.log('Survey key not found for ID:', surveyId);
      return NextResponse.json({ error: 'Survey key not found' }, { status: 404 });
    }

    console.log('Survey key found:', surveyKey.encryptedSurveyId);
    return NextResponse.json({ accessKey: surveyKey.encryptedSurveyId });
  } catch (error) {
    console.error('Error fetching survey key:', error);
    return NextResponse.json({ error: 'Failed to fetch survey key' }, { status: 500 });
  }
}