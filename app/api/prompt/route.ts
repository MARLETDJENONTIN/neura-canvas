import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt requis' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Tu es un expert en création de prompts pour générateurs d'images IA (Midjourney, DALL-E, Stable Diffusion).
Ta mission : transformer une description vague en un prompt détaillé et optimisé.

Règles :
- Ajoute des détails sur le style artistique, l'éclairage, la composition, les couleurs
- Utilise des termes techniques pertinents (depth of field, cinematic lighting, etc.)
- Garde le prompt en anglais (les générateurs comprennent mieux l'anglais)
- Sois concis mais évocateur (max 150 mots)
- Ne retourne QUE le prompt optimisé, aucun texte supplémentaire`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const optimizedPrompt = completion.choices[0]?.message?.content || prompt;

    return NextResponse.json({ optimizedPrompt });
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'optimisation du prompt' },
      { status: 500 }
    );
  }
}
