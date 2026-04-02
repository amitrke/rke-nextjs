import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from './initFirebase';
import { getDocument } from './firestore';

type AdminStatusResult = {
    isAdmin: boolean;
    loading: boolean;
};

export function useAdminStatus(): AdminStatusResult {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true); // stays true until auth resolves

    useEffect(() => {
        const auth = getFirebaseAuth();
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }
            try {
                const doc = await getDocument({ path: 'admins', pathSegments: [firebaseUser.uid] });
                setIsAdmin(!!doc);
            } catch {
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        });
        return () => unsub();
    }, []);

    return { isAdmin, loading };
}
