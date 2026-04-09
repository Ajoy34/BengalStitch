import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'REPLICATE_API_TOKEN not configured' }, { status: 500 });
    }

    const replicate = new Replicate({ auth: token });

    const prediction = await replicate.predictions.create({
      model: 'stability-ai/sdxl',
      input: {
        prompt: `${prompt}, high quality product design, transparent background, professional mockup design`,
        negative_prompt: 'blurry, low quality, watermark, text',
        width: 1024,
        height: 1024,
        num_outputs: 1,
      },
    });

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      output: prediction.output,
    });
  } catch (err) {
    console.error('GenAI error:', err);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
