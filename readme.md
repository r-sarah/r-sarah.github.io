# Portfolio — Sarah Ranganadane

Site vitrine statique (HTML, CSS, JavaScript) : accueil bilingue (FR/EN), fiches détail par projet sous `projects/`.

**Site en ligne :** [https://r-sarah.github.io/](https://r-sarah.github.io/)  
(déployé depuis ce dépôt `r-sarah.github.io`)

---

## Structure du dépôt

| Élément | Rôle |
|--------|------|
| `index.html` | Page d’accueil |
| `css/styles.css` | Styles partagés |
| `js/` | Scripts (navigation, thème, i18n accueil) |
| `projects/<slug>/` | Une page par projet (`index.html`, `i18n.js`, médias dans `images/` si besoin) |

Les liens sont **relatifs** : le site fonctionne en local comme sur GitHub Pages à la racine du domaine utilisateur.

---

## Développement local

1. Cloner le dépôt (ou ouvrir ce dossier).
2. Ouvrir `index.html` dans le navigateur, **ou** servir le dossier à la racine du site :

   ```bash
   npx --yes serve .
   ```

   Puis ouvrir l’URL affichée (souvent `http://localhost:3000`).

---

## Déploiement (GitHub Pages)

Ce dépôt inclut le workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

1. Sur GitHub : **Settings** → **Pages** → **Build and deployment**.
2. **Source** : **GitHub Actions** (requis pour ce workflow).
3. Pousser sur la branche **`main`** : le workflow publie le site automatiquement.

**Branche par défaut** : si ce n’est pas `main`, modifiez `branches: [main]` dans le workflow ou renommez la branche sur GitHub.

**Sans Actions** : vous pouvez à la place choisir **Deploy from a branch** → branche `main`, dossier **`/ (root)`** et supprimer ou désactiver le workflow pour éviter deux sources de déploiement.

---

## Ajouter ou modifier un projet

1. Créer `projects/<nom-du-projet>/` avec au minimum `index.html` et, si besoin, `i18n.js` (copier un dossier existant comme modèle).
2. Ajouter la carte sur l’accueil dans `index.html` (lien + image de couverture sous `projects/<nom-du-projet>/images/` si utilisée).
3. Vérifier les retours vers l’accueil : `../../index.html#…` depuis une page projet.

---

## Médias

Les pages référencent notamment `images/profil-photo.jpg` à la racine et des visuels sous chaque `projects/.../images/`. Ajoutez les fichiers au dépôt pour l’affichage en production ; pour de très gros fichiers, envisagez compression ou hébergement externe.

---

## Licence

Contenu et code : droits réservés sauf mention contraire. Adaptez cette section si vous publiez sous licence ouverte.
