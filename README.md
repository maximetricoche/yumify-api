# 🥦 Backend - Yumify API

L'API **Yumify** permet de gérer des recettes de cuisine. Elle permet à un utilisateur de créer, consulter, modifier et supprimer des recettes, ainsi que de gérer les ingrédients et les étapes associées.

### ➡️ [Frontend -Yumify](https://github.com/maximetricoche/yumify-client.git)

### ⚙️ Technologies utilisées

- **Node.js**
- **Express**
- **MySQL**
- **TypeScript**
- **Lorem Picsum**

## 🎯 Fonctionnalités

- ✅ CRUD pour les **recettes** (Créer, Lire, Mettre à jour, Supprimer).
- 🍽️ Gestion des **ingrédients** et des **étapes** de recettes.
- 🖼️ Ajout d'**images fictives** pour chaque recette (générées aléatoirement).

## 🚀 Installation et Exécution

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/ton_nom_utilisateur/yumify-backend.git
```

### 2️⃣ Accéder au dossier du projet

```bash
cd yumify-backend
```

### 3️⃣ Installer les dépendances

```bash
npm install
```

### 4️⃣ Configurer la base de données

```bash
npm run db:migrate
```

### 5️⃣ Lancer le serveur de développement

```bash
npm run dev
```

## 📌 Routes de l'API - 👉 http://localhost:3310

| Méthode  | Route              | Description                    |
| -------- | ------------------ | ------------------------------ |
| `GET`    | `/api/recipes`     | Récupérer toutes les recettes  |
| `GET`    | `/api/recipes/:id` | Récupérer une recette par ID   |
| `POST`   | `/api/recipes`     | Ajouter une nouvelle recette   |
| `PUT`    | `/api/recipes/:id` | Modifier une recette existante |
| `DELETE` | `/api/recipes/:id` | Supprimer une recette          |
