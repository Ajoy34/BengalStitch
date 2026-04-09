import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prediction = await replicate.predictions.get(id);

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    });
  } catch (err) {
    console.error('Poll error:', err);
    return NextResponse.json({ error: 'Failed to check try-on status' }, { status: 500 });
  }
}
