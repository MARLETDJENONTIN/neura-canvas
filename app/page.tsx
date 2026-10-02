'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'generate'>('prompt');

  const optimizePrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setOptimizedPrompt(data.optimizedPrompt);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  const generateImage = async () => {
    const finalPrompt = optimizedPrompt || prompt;
    if (!finalPrompt.trim()) return;
    setLoading(true);
    setImageUrl('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt }),
      });
      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            NeuraCanvas
          </h1>
          <p className="text-slate-400">
            Générateur d'images IA — décrivez votre idée, l'IA crée
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'prompt'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            1. Optimiser le prompt
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'generate'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            2. Générer l'image
          </button>
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
          {/* Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Décrivez votre idée
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Un chat astronaute flottant dans l'espace avec des nébuleuses colorées..."
              className="w-full h-32 bg-slate-900 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Optimize Button */}
          <button
            onClick={optimizePrompt}
            disabled={loading || !prompt.trim()}
            className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Optimisation...' : 'Optimiser le prompt avec l\'IA'}
          </button>

          {/* Optimized Prompt */}
          {optimizedPrompt && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Prompt optimisé
              </label>
              <div className="bg-slate-900 border border-slate-600 rounded-xl p-4 text-slate-200">
                {optimizedPrompt}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateImage}
            disabled={loading || (!prompt.trim() && !optimizedPrompt.trim())}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Génération en cours...' : 'Générer l\'image'}
          </button>

          {/* Loading */}
          {loading && (
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {/* Result */}
          {imageUrl && !loading && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Résultat
              </label>
              <div className="rounded-xl overflow-hidden border border-slate-600">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Image générée"
                  className="w-full h-auto"
                />
              </div>
              <a
                href={imageUrl}
                download="neura-canvas-image.png"
                className="mt-3 inline-block px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
              >
                Télécharger l'image
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          Propulsé par OpenAI + Replicate
        </div>
      </div>
    </main>
  );
}
