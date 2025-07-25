# Deployment

This document describes the deployment process for the Roorkee.org Next.js application.

## Environments

-   **Production**: `https://www.roorkee.org`
    -   **Branch**: `master`
-   **Preview**: `https://preview.roorkee.org`
    -   **Branch**: `develop`

## Hosting Provider

The application is hosted on [Vercel](https://vercel.com/).

## Deployment Process

Vercel is configured to automatically deploy the application when changes are pushed to the `master` and `develop` branches.

1.  **Push to `develop`**: When code is pushed to the `develop` branch, Vercel will build and deploy a new preview version of the site. This allows for testing and verification before deploying to production.
2.  **Merge to `master`**: Once the changes on `develop` have been approved, the branch is merged into `master`.
3.  **Push to `master`**: When the `master` branch is updated, Vercel will build and deploy the new version to the production environment.

## Environment Variables

The following environment variables need to be configured in Vercel for both the production and preview environments:

-   `NEXT_PUBLIC_FIREBASE_API_KEY`
-   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
-   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
-   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
-   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
-   `NEXT_PUBLIC_FIREBASE_APP_ID`
