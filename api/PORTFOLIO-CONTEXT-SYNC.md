# Synchronisation portfolio ↔ chat (`api/portfolio-context.txt`)

Ce fichier aide à décider si une modification du site doit aussi mettre à jour le contexte du chatbot (lu par `api/chat.js` sur Vercel).

Le chat **ne lit pas** `index.html` ni les pages `projects/`. Il répond uniquement à partir de :

- `api/portfolio-context.txt` (défaut, versionné sur Git)
- ou `PORTFOLIO_CONTEXT` sur Vercel **si définie** (remplace le fichier)

Après toute modification du contexte : **commit + push** → attendre le redeploy Vercel.

---

## Toujours mettre à jour `portfolio-context.txt`

| Zone modifiée | Section(s) du contexte |
|---------------|-------------------------|
| À propos, bio, accroche | IDENTITÉ, À PROPOS |
| Parcours, école, diplômes, dates | PARCOURS SCOLAIRE ET PROFESSIONNEL, DIPLÔMES ET CERTIFICATIONS |
| Alternance, poste, entreprise, rythme | PARCOURS, EXPÉRIENCE PROFESSIONNELLE ET TERRAIN |
| Âge, ville, contact | IDENTITÉ, CONTACT |
| Compétences / soft skills (cartes site) | COMPÉTENCES TECHNIQUES, SOFT SKILLS |
| Projets (titre, résumé, techno, lien) | PROJETS MIS EN AVANT |
| Certifications | DIPLÔMES ET CERTIFICATIONS |
| Texte des puces du chat (`chat.s1`… dans i18n) | Optionnel : seulement si la question suggérée change de sens |

---

## Pas besoin de mettre à jour le contexte

| Modification | Pourquoi |
|--------------|----------|
| CSS, couleurs, polices, animations | Le chat ne décrit pas le design |
| Images, photos, icônes sans changer les faits | Visuel uniquement |
| Corrections orthographe sans changer le sens | Pas d'impact sur les faits |
| `?v=` cache-bust scripts/CSS | Technique |
| Rate limit, clés API, Vercel, Upstash | Hors contenu portfolio |
| Pages projet : mise en page seule | OK sans contexte |
| i18n EN : traduction fidèle du même contenu FR | Mettre à jour seulement si le **fait** change en FR dans le contexte (le prompt répond FR ou EN selon la langue du site) |

---

## Cas limites

| Situation | Action |
|-----------|--------|
| Nouveau projet ajouté au site | Ajouter une ligne dans PROJETS MIS EN AVANT |
| Projet retiré ou renommé | Retirer / renommer dans PROJETS |
| Détail technique long sur une page projet | Résumer 1–2 phrases dans PROJETS (pas tout copier) |
| `PORTFOLIO_CONTEXT` définie sur Vercel | Modifier la variable **ou** la supprimer pour revenir au fichier Git |
| Doute : un recruteur pourrait poser la question au chat | **Mettre à jour** le contexte |

---

## Checklist rapide avant commit portfolio

- [ ] Les faits visibles sur le site = les faits dans `portfolio-context.txt`
- [ ] Pas de clé API ni secret dans le contexte
- [ ] Push Git effectué
- [ ] Déploiement Vercel OK (pour l'API chat)
- [ ] Test : une question sur ce qui vient de changer (ex. « Parlez-moi de [projet X] »)

---

## Fichiers liés (ne pas confondre)

| Fichier | Rôle |
|---------|------|
| `api/portfolio-context.txt` | **Données** pour l'IA |
| `api/chat.js` | Logique API (prompt, limites) — pas le CV |
| `js/i18n-home.js` | Textes **interface** chat (boutons, erreurs) |
| `js/portfolio-chat-config.js` | URL API publique uniquement |
| `index.html` + `projects/*` | Site visiteur — **pas** lu par le chat automatiquement |

---

## Mémoire Cursor

Lors d'une modification du portfolio, indiquer à l'agent : **« Suis `api/PORTFOLIO-CONTEXT-SYNC.md` »**.

