import { useCallback, useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from 'firebase/auth';
import { getFirebaseAuth } from '../../firebase/initFirebase';

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: Record<string, unknown>) => void;
                    prompt: (listener?: (notification: Record<string, unknown>) => void) => void;
                    cancel: () => void;
                };
            };
        };
    }
}

const DISMISS_UNTIL_KEY = 'googleOneTapDismissUntil';
const SHOWN_THIS_SESSION_KEY = 'googleOneTapShownSession';
const DISMISS_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;

function setDismissCooldown(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DISMISS_UNTIL_KEY, String(Date.now() + DISMISS_COOLDOWN_MS));
}

function isDismissedInCooldown(): boolean {
    if (typeof window === 'undefined') return true;
    const value = localStorage.getItem(DISMISS_UNTIL_KEY);
    if (!value) return false;
    const ts = Number(value);
    return Number.isFinite(ts) && ts > Date.now();
}

export default function GoogleOneTapSignIn() {
    const router = useRouter();
    const [isSignedIn, setIsSignedIn] = useState<boolean | undefined>(undefined);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    useEffect(() => {
        const unsub = onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
            setIsSignedIn(Boolean(firebaseUser));
        });
        return () => unsub();
    }, []);

    const shouldShow = useCallback(() => {
        if (typeof window === 'undefined') return false;
        if (!clientId) return false;
        if (isSignedIn !== false) return false;
        if (router.pathname === '/auth') return false;
        if (isDismissedInCooldown()) return false;
        if (sessionStorage.getItem(SHOWN_THIS_SESSION_KEY) === '1') return false;
        return true;
    }, [clientId, isSignedIn, router.pathname]);

    const initializeOneTap = useCallback(() => {
        if (!shouldShow()) return;
        if (!window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
            client_id: clientId,
            auto_select: false,
            cancel_on_tap_outside: true,
            context: 'signin',
            callback: async (response: { credential?: string }) => {
                if (!response?.credential) return;
                try {
                    const credential = GoogleAuthProvider.credential(response.credential);
                    await signInWithCredential(getFirebaseAuth(), credential);
                    window.google?.accounts?.id?.cancel();
                } catch (e) {
                    console.error('Google One Tap sign-in failed', e);
                    setDismissCooldown();
                }
            },
        });

        sessionStorage.setItem(SHOWN_THIS_SESSION_KEY, '1');
        window.google.accounts.id.prompt((notification: Record<string, unknown>) => {
            const isDismissedMoment = notification && typeof notification['isDismissedMoment'] === 'function'
                ? Boolean((notification['isDismissedMoment'] as () => boolean)())
                : false;
            const isNotDisplayed = notification && typeof notification['isNotDisplayed'] === 'function'
                ? Boolean((notification['isNotDisplayed'] as () => boolean)())
                : false;

            if (isDismissedMoment || isNotDisplayed) {
                setDismissCooldown();
            }
        });
    }, [clientId, shouldShow]);

    useEffect(() => {
        if (!shouldShow()) return;
        if (window.google?.accounts?.id) {
            initializeOneTap();
        }
    }, [initializeOneTap, shouldShow]);

    if (!clientId) return null;

    return (
        <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
            onLoad={initializeOneTap}
        />
    );
}
