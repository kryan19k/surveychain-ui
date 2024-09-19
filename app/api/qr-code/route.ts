/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const surveyId = searchParams.get('surveyId');

  if (!surveyId) {
    return NextResponse.json({ error: 'Survey ID is required' }, { status: 400 });
  }

  const surveyUrl = `https://surveychain-ui.vercel.app/surveys/${surveyId}`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(surveyUrl);
    return NextResponse.json({ qrCode: qrCodeDataUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}