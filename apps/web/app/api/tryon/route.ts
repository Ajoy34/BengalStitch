import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const personImage = formData.get('person_image') as File | null;
    const garmentUrl = formData.get('garment_url') as string;
    const category = (formData.get('category') as string) || 'tops';

    if (!personImage || !garmentUrl) {
      return NextResponse.json({ error: 'person_image and garment_url are required' }, { status: 400 });
    }

    if (personImage.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 });
    }

    const bytes = await personImage.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const personDataUri = `data:${personImage.type};base64,${base64}`;

    const prediction = await replicate.predictions.create({
      model: 'fashn-ai/fashn-vton',
      input: {
        model_image: personDataUri,
        garment_image: garmentUrl,
        category,
      },
    });

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
    });
  } catch (err) {
    console.error('Try-on error:', err);
    return NextResponse.json(
      { error: 'Failed to start virtual try-on. Please try again.' },
      { status: 500 }
    );
  }
}
