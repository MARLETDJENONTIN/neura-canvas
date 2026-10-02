# NeuraCanvas 🎨

Générateur d'images IA propulsé par OpenAI + Replicate.

## Démarrage

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Déploiement sur Vercel

1. Pousse ce code sur GitHub
2. Va sur [vercel.com](https://vercel.com) et importe le repo
3. Ajoute les variables d'environnement :
   - `OPENAI_API_KEY`
   - `REPLICATE_API_TOKEN`
4. Déploie !

## Variables d'environnement

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Clé API OpenAI |
| `REPLICATE_API_TOKEN` | Token API Replicate |

## Stack

- **Frontend** : Next.js 14 + Tailwind CSS
- **Backend** : API Routes (Next.js)
- **LLM** : OpenAI GPT-4o-mini
- **Images** : Replicate (Stable Diffusion XL)
