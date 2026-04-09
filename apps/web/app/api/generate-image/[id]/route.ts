import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'REPLICATE_API_TOKEN not configured' }, { status: 500 });
    }

    const replicate = new Replicate({ auth: token });
    const prediction = await replicate.predictions.get(id);

    return NextResponse.json({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    });
  } catch (err) {
    console.error('GenAI poll error:', err);
    return NextResponse.json({ error: 'Failed to check generation status' }, { status: 500 });
  }
}
