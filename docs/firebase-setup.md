# Firebase Setup

This guide will walk you through setting up a new Firebase project for the Roorkee.org Next.js application.

## 1. Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click "Add project" and follow the on-screen instructions to create a new project.

## 2. Set up Authentication

1.  In the Firebase Console, go to the "Authentication" section.
2.  Click "Get started".
3.  Enable the "Email/Password" sign-in method.

## 3. Set up Firestore

1.  In the Firebase Console, go to the "Firestore Database" section.
2.  Click "Create database".
3.  Choose "Start in test mode" for development purposes. You can change the security rules later for production.
4.  Select a location for your database.

## 4. Set up Realtime Database

1.  In the Firebase Console, go to the "Realtime Database" section.
2.  Click "Create Database".
3.  Choose a location for your database.
4.  Select "Start in test mode".

## 5. Set up Storage

1.  In the Firebase Console, go to the "Storage" section.
2.  Click "Get started".
3.  Follow the on-screen instructions to create a new storage bucket.

## 6. Get Firebase Configuration

1.  In the Firebase Console, go to your project's settings.
2.  In the "Your apps" card, click the web icon (`</>`) to create a new web app.
3.  Follow the on-screen instructions to register your app.
4.  After registering your app, you will be given a Firebase configuration object. Copy these values and add them to a `.env.local` file in the root of your project:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
