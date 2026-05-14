/**
 * Chat portfolio — fichier safe pour dépôt PUBLIC (aucune clé API ici).
 *
 * Backend inclus dans ce repo : `api/chat.js` (déployé sur Vercel, voir `api/README.md`).
 *
 * Étapes :
 * 1) Projet Vercel → variables OPENAI_API_KEY (vraie clé ou sk-xxxx pour mode démo),
 *    CHAT_ALLOWED_ORIGIN = https://<vous>.github.io
 * 2) Déployer → copier l’URL https://<projet>.vercel.app/api/chat
 * 3) Renseigner apiUrl ci-dessous (sans slash final). Laisser '' = message hors ligne sur le site.
 *
 * Contrat POST (JSON) :
 *   { "message": string, "locale": "fr"|"en",
 *     "history": [ { "role":"user"|"assistant", "content": string }, ... ] }
 * Réponse : { "reply": string } ou mode démo { "reply": string, "demo": true }
 */
(function (w) {
  'use strict';
  w.PORTFOLIO_CHAT_CONFIG = {
    // Exemple après déploiement Vercel :
    // apiUrl: 'https://mon-projet.vercel.app/api/chat',
    apiUrl: '',
    maxHistoryMessages: 12
  };
})(window);
