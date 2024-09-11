/* eslint-disable @typescript-eslint/no-unsafe-call */
//surveys/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Survey } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const prisma = new PrismaClient();
console.log('Database URL:', process.env.DATABASE_URL); // Be careful not to log sensitive information
console.log('Prisma Client initialized');

// Define a schema for input validation
const surveySchema = z.object({
  creator: z.string(),
  title: z.string(),
  description: z.string(),
  tokenReward: z.string(),
  endTime: z.string(),
  maxResponses: z.string(),
  minimumResponseTime: z.string(),
  tags: z.array(z.string()),
  imageUri: z.string().optional(),
  questions: z.array(z.object({
    text: z.string(),
    type: z.enum(['text', 'number', 'radio', 'checkbox', 'scale']),
    options: z.array(z.string()).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
  })),
});

export async function POST(request: NextRequest) {
  try {
    const surveyData = await request.json();

    // Validate input data
    const validatedData = surveySchema.parse(surveyData);

    const newSurvey = await prisma.survey.create({
      data: {
        creator: validatedData.creator,
        title: validatedData.title,
        description: validatedData.description,
        tokenReward: validatedData.tokenReward,
        endTime: new Date(validatedData.endTime),
        maxResponses: validatedData.maxResponses,
        minimumResponseTime: validatedData.minimumResponseTime,
        tags: validatedData.tags,
        imageUri: validatedData.imageUri || null,
        questions: {
          create: validatedData.questions.map((q) => ({
            text: q.text,
            type: q.type,
            options: q.options ? JSON.stringify(q.options) : null,
            min: q.min,
            max: q.max,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    // Generate a secure key
    const secretKey = randomBytes(32).toString('hex');
    
    // Encrypt the survey ID with the secret key
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    let encryptedSurveyId = cipher.update(newSurvey.id, 'utf8', 'hex');
    encryptedSurveyId += cipher.final('hex');
    
    // Store the encrypted survey ID and IV
    await prisma.surveyKey.create({
      data: {
        surveyId: newSurvey.id,
        encryptedSurveyId: encryptedSurveyId,
        iv: iv.toString('hex'),
      },
    });

    console.log('Created new survey:', newSurvey.id);
    
    return NextResponse.json({
      surveyId: newSurvey.id,
      accessKey: secretKey,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating survey:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to create survey', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}