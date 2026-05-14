# API chat (`/api/chat`)

Route **serverless** pour Vercel : une fois déployée, renseignez son URL dans `js/portfolio-chat-config.js` (`apiUrl`).

## Variables d’environnement (Vercel → Settings → Environment Variables)

| Variable | Rôle |
|----------|------|
| `OPENAI_API_KEY` | Clé OpenAI. Tant qu’elle est absente ou du type `sk-xxxx…`, le serveur répond en **mode démo** (pas d’appel payant). |
| `CHAT_ALLOWED_ORIGIN` | Origine CORS autorisée, ex. `https://votrepseudo.github.io` (sans slash final). `*` possible en dev uniquement. |
| `OPENAI_MODEL` | Optionnel, défaut `gpt-4o-mini`. |
| `PORTFOLIO_CONTEXT` | Optionnel, texte sur vous injecté dans le prompt système. |
| `OPENAI_USE_MOCK` | Si `1`, force le mode démo même avec une clé. |

## Déploiement

1. Créez un projet Vercel à partir de ce dépôt (racine du portfolio).
2. Ajoutez les variables ci-dessus (vous pouvez commencer avec une clé factice `sk-xxxx` pour tester le flux).
3. Déployez. L’URL sera du type `https://<projet>.vercel.app/api/chat`.
4. Dans `js/portfolio-chat-config.js`, définissez `apiUrl: 'https://<projet>.vercel.app/api/chat'` (sans slash final).

GitHub Pages ne sert que le site statique ; la clé reste **uniquement** sur Vercel.

## Test local

```bash
npm i -g vercel
vercel dev
```

Copiez `api/.env.example` vers `.env.local` à la **racine** du dépôt pour charger les variables en local.
