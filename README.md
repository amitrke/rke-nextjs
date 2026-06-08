# Roorkee.org NextJS App

[![CodeFactor](https://www.codefactor.io/repository/github/amitrke/rke-nextjs/badge)](https://www.codefactor.io/repository/github/amitrke/rke-nextjs)


Roorkee is a town in North India; Roorkee.org is a website for people who have lived in this beautiful place at some point in their life.
The website provides ways for Residents of Roorkee to share posts and pictures of the Town.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v22 or later)
- [yarn](https://yarnpkg.com/getting-started/install)
- A Firebase project.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-github-username/rke-nextjs.git
    cd rke-nextjs
    ```

2.  **Install dependencies:**
    ```bash
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Firebase configuration:
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server:**
    ```bash
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ✨ Features

-   **User Authentication:** Secure user sign-up and login using Firebase Authentication.
-   **Create & Share Posts:** Users can create, edit, and delete their own posts with a rich text editor.
-   **Photo Albums:** Create and manage photo albums.
-   **User Profiles:** View and manage user profiles.
-   **Real-time Updates:** Real-time features using Firebase Realtime Database.
-   **File Uploads:** Upload images and other files to Firebase Storage.

## Project Structure

```
.
├── components/         # Reusable UI components
│   ├── auth/
│   ├── cloudFirestore/
│   ├── nav/
│   ├── realtimeDatabase/
│   ├── storage/
│   └── ui/
├── firebase/           # Firebase configuration and utility functions
├── pages/              # Next.js pages and API routes
│   ├── api/
│   └── ...
├── public/             # Static assets
├── service/            # Business logic and services
└── styles/             # Global styles and CSS modules
```

## 📚 Documentation

For more detailed documentation, please refer to the following files in the `docs` directory:

-   [**Architecture**](./docs/architecture.md): An overview of the project's architecture.
-   [**Deployment**](./docs/deployment.md): Instructions for deploying the application.
-   [**API Reference**](./docs/api-reference.md): A reference for the available API routes.
-   [**Contribution Guide**](./docs/contribution-guide.md): Guidelines for contributing to the project.
-   [**Firebase Setup**](./docs/firebase-setup.md): A guide to setting up a Firebase project for the application.

## 💻 Technology Stack

### Backend

-   **[Firebase](https://firebase.google.com/)**:
    -   Authentication
    -   Firestore (Database)
    -   Realtime Database
    -   Storage

### Frontend

-   **[Next.js](https://nextjs.org/)**: React framework for server-rendered applications.
-   **[React](https://reactjs.org/)**: JavaScript library for building user interfaces.
-   **[Bootstrap](https://getbootstrap.com/)**: CSS framework for responsive design.
-   **[React Bootstrap](https://react-bootstrap.github.io/)**: Bootstrap components built with React.
-   **[Font Awesome](https://fontawesome.com/)**: Vector icons and social logos.
-   **[Sass](https://sass-lang.com/)**: CSS with superpowers.

## Environments

1.  **Production:** https://www.roorkee.org (master branch)
2.  **Preview:** https://preview.roorkee.org (develop branch)

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you are a developer who would like to contribute to this project, feel free to go through the code, any help is appreciated (Code, Documentation, or content for the website.)

### Commit messages

Use icons along with commit messages https://gist.github.com/parmentf/035de27d6ed1dce0b36a

### Upgrade packages

See https://nextjs.org/docs/upgrading

```
npx @tailwindcss/upgrade
yarn add next@latest react@latest react-dom@latest eslint-config-next@latest
yarn upgrade -u
```
