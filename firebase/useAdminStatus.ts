import { useEffect, useState } from 'react';
import { useUser } from './useUser';
import { getDocument } from './firestore';

type AdminStatusResult = {
    isAdmin: boolean;
    loading: boolean;
};

export function useAdminStatus(): AdminStatusResult {
    const { user } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsAdmin(false);
            setLoading(false);
            return;
        }
        setLoading(true);
        getDocument({ path: 'admins', pathSegments: [user.id] })
            .then((doc) => {
                setIsAdmin(!!doc);
            })
            .catch(() => {
                setIsAdmin(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user]);

    return { isAdmin, loading };
}
