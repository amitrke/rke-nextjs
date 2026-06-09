import { initializeApp, cert, App, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { Firestore } from 'firebase-admin/firestore';

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY

const initApp = (): App => {
    try{
        const existingApp = getApp();
        if (existingApp) {
            return existingApp;
        }
    } catch {
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
}

export const verifyIdToken = async (token: string) => {
    const app = initApp();
    return getAuth(app).verifyIdToken(token);
}

export const getIsAdmin = async (userId: string): Promise<boolean> => {
    const app = initApp();
    const db = getFirestore(app);
    const doc = await db.doc(`admins/${userId}`).get();
    return doc.exists;
}

export default initApp;

export const getAdminFirestore = (): Firestore => {
    const app = initApp();
    return getFirestore(app);
};

export const adminGetDocument = async <T>(path: string, docId: string): Promise<T | undefined> => {
    const docSnap = await getAdminFirestore().doc(`${path}/${docId}`).get();
    if (docSnap.exists) {
        return docSnap.data() as T;
    }
    return undefined;
};
