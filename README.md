# YouTube Home Page - Masquer les vidéos à faible vue

Un userscript pour **YouTube** qui **masque automatiquement les vidéos ayant moins de 5000 vues sur la page d'accueil**, tout en restant compatible avec la **navigation SPA** (Single Page Application) de YouTube.

---

## ⚡ Fonctionnalités

- Masque les vidéos dont le nombre de vues est inférieur à **5000**.
- Fonctionne uniquement sur la **page d'accueil** (`/`).
- Compatible avec la navigation SPA de YouTube (pas besoin de rafraîchir la page).
- Se réapplique automatiquement lors du scroll ou du chargement de nouvelles vidéos.
- Ne touche pas aux autres pages (Abonnements, Recherche, Vidéos individuelles).

---

## 🛠️ Installation

1. Installer [Tampermonkey](https://www.tampermonkey.net/) ou [Greasemonkey](https://www.greasespot.net/) dans votre navigateur.
2. Créer un **nouveau script** dans l’extension.
3. Copier-coller le contenu du script dans l’éditeur.
4. Enregistrer et activer le script.
5. Rechargez YouTube pour tester.

---

## 🔧 Configuration

- Le seuil de vues est défini par la constante `MIN_VIEWS` dans le script :

```javascript
const MIN_VIEWS = 5000;
