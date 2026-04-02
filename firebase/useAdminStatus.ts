import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from './initFirebase';

type AdminStatusResult = {
    isAdmin: boolean;
    loading: boolean;
};

export function useAdminStatus(): AdminStatusResult {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getFirebaseAuth();
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }
            try {
                const token = await firebaseUser.getIdToken();
                const res = await fetch('/api/checkAdmin', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setIsAdmin(!!data.isAdmin);
            } catch (err) {
                console.error('[useAdminStatus] Error checking admin status:', err);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        });
        return () => unsub();
    }, []);

    return { isAdmin, loading };
}
