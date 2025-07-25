# Architecture

This document outlines the architecture of the Roorkee.org Next.js application.

## Frontend

The frontend is a [Next.js](https://nextjs.org/) application. Next.js is a React framework that provides features like server-side rendering and static site generation.

-   **Pages**: The `pages` directory contains the application's routes. For example, `pages/index.tsx` is the home page, and `pages/posts/[id].tsx` is a dynamic route for displaying a single post.
-   **Components**: The `components` directory contains reusable UI components that are used throughout the application.
-   **Styling**: The application uses a combination of global CSS (`styles/globals.css`), CSS Modules (`styles/Home.module.css`), and Sass (`styles/main.scss`). [Bootstrap](https://getbootstrap.com/) is used as the primary CSS framework.

## Backend

The backend is powered by [Firebase](https://firebase.google.com/).

-   **Authentication**: Firebase Authentication is used to manage user sign-up and login.
-   **Database**:
    -   [Firestore](https://firebase.google.com/docs/firestore) is the primary database for storing data like posts, user profiles, and albums.
    -   [Realtime Database](https://firebase.google.com/docs/database) is used for features that require real-time data synchronization, such as the counter.
-   **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage) is used to store user-uploaded files like images.

## Deployment

The application is deployed on [Vercel](https://vercel.com/). The `master` branch is deployed to production, and the `develop` branch is deployed to a preview environment.
