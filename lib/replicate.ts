const REPLICATE_API_URL = 'https://api.replicate.com/v1';

export async function createPrediction(modelVersion: string, input: Record<string, unknown>) {
  const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: modelVersion,
      input,
    }),
  });

  return response.json();
}

export async function getPrediction(id: string) {
  const response = await fetch(`${REPLICATE_API_URL}/predictions/${id}`, {
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
    },
  });

  return response.json();
}

export async function waitForPrediction(
  id: string,
  maxAttempts = 60,
  interval = 2000
): Promise<{ status: string; output?: string[]; error?: string }> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const result = await getPrediction(id);

    if (result.status === 'succeeded' || result.status === 'failed') {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
    attempts++;
  }

  return { status: 'timeout', error: 'Délai dépassé' };
}
