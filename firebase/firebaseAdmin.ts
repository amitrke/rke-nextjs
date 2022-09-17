import { initializeApp, cert } from 'firebase-admin/app';
import { getApp } from 'firebase/app';

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY

const initApp = () => {
    const existingApp = getApp();
    if (existingApp) {
        return existingApp;
    }
    return initializeApp({
        credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // https://stackoverflow.com/a/41044630/1332513
            privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    });
}

export default initApp;


/*
export const verifyIdToken = (token) => {
    const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // https://stackoverflow.com/a/41044630/1332513
                privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
            }),
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        })
    }

    return admin
        .auth()
        .verifyIdToken(token)
        .catch((error) => {
            throw error
        })
}
*/