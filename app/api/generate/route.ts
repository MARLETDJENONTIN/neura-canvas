import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt requis' },
        { status: 400 }
      );
    }

    // Créer la prédiction
    const createResponse = await fetch(
      'https://api.replicate.com/v1/predictions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c7127de7dfea535525255b1aa35c5565e08b',
          input: {
            prompt: prompt,
            width: 1024,
            height: 1024,
            num_outputs: 1,
            guidance_scale: 7.5,
            num_inference_steps: 30,
          },
        }),
      }
    );

    const prediction = await createResponse.json();

    if (prediction.error) {
      return NextResponse.json(
        { error: prediction.error },
        { status: 500 }
      );
    }

    // Attendre le résultat (polling)
    let result = prediction;
    const maxAttempts = 60;
    let attempts = 0;

    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        }
      );
      
      result = await statusResponse.json();
      attempts++;
    }

    if (result.status === 'failed') {
      return NextResponse.json(
        { error: 'La génération a échoué' },
        { status: 500 }
      );
    }

    const imageUrl = result.output?.[0];

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Aucune image générée' },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Erreur Replicate:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'image' },
      { status: 500 }
    );
  }
}
