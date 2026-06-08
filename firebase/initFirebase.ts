import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getPerformance, FirebasePerformance } from "firebase/performance";
import { getDatabase, Database } from "firebase/database";
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check";

const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;
let performance: FirebasePerformance | null = null;
let database: Database;
let appcheck: AppCheck | null = null;

export default function initFirebase(): FirebaseApp {
    console.log("initFirebase() called");

    if (!getApps().length) {
        app = initializeApp(clientCredentials);
        auth = getAuth(app);
        firestore = getFirestore(app);
        storage = getStorage(app);
        database = getDatabase(app);

        // Check that `window` is in scope for the analytics module!
        if (typeof window !== 'undefined') {
            // Enable analytics. https://firebase.google.com/docs/analytics/get-started
            if ('measurementId' in clientCredentials) {
                analytics = getAnalytics(app);
                performance = getPerformance(app);
            }

            // Only initialize App Check in production environments
            if (process.env.NODE_ENV === 'production') {
                
                console.log("Checking App Check...");
                console.log("Site Key exists?", !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

                appcheck = initializeAppCheck(app, {
                    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
                    isTokenAutoRefreshEnabled: true,
                });

                console.log("App Check initialized!");
            } else {
                console.log('App Check is not enabled in development environments.');
            }
        }
    } else {
        console.log("initFirebase() else block")
        app = getApp();
        auth = getAuth(app);
        firestore = getFirestore(app);
        storage = getStorage(app);
        database = getDatabase(app);
        
        // If we are in production and appcheck is not initialized, check if we need to initialize it
        // This handles the case where Firebase was initialized elsewhere but appcheck wasn't 
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && !appcheck) {
            console.log("Initializing App Check for existing Firebase app in production");
            try {
                appcheck = initializeAppCheck(app, {
                    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
                    isTokenAutoRefreshEnabled: true,
                });
                console.log("App Check initialized for existing app!");
            } catch (error) {
                console.error("Failed to initialize App Check for existing app:", error);
            }
        }
    }

    return app;
}

export function initApp(): FirebaseApp {
    if (!getApps().length) {
        return initializeApp(clientCredentials);
    }
    return getApp();
}

// Export initialized instances for easy access
export function getFirebaseAuth(): Auth {
    if (!auth) {
        initFirebase();
    }
    return auth;
}

export function getFirebaseFirestore(): Firestore {
    if (!firestore) {
        initFirebase();
    }
    return firestore;
}

export function getFirebaseStorage(): FirebaseStorage {
    if (!storage) {
        initFirebase();
    }
    return storage;
}

export function getFirebaseDatabase(): Database {
    if (!database) {
        initFirebase();
    }
    return database;
}

export function getFirebaseAnalytics(): Analytics | null {
    return analytics;
}

export function getFirebasePerformance(): FirebasePerformance | null {
    return performance;
}

export function getFirebaseAppCheck(): AppCheck | null {
    return appcheck;
}