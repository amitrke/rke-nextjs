import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import initFirebase, { getFirebaseAuth } from './initFirebase'
import {
    removeUserCookie,
    setUserCookie,
    getUserFromCookie,
} from './userCookies'
import { mapUserData } from './mapUserData'
import { User } from './types'
import { getDocument, write } from './firestore'

initFirebase()

const useUser = () => {
    const [user, setUser] = useState<User>()
    const router = useRouter()

    const logout = async () => {
        const auth = getFirebaseAuth();
        return signOut(auth)
            .then(() => {
                // Sign-out successful.
                router.push('/auth')
            })
            .catch((e) => {
                console.error(e)
            })
    }

    const SYNC_KEY = (userId: string) => `profileSync_${userId}`;
    const todayStr = () => new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    const updateUserPublicInfo = async (user: User) => {
        // Fast path: already synced today — no Firestore read or write needed.
        if (typeof window !== 'undefined') {
            if (localStorage.getItem(SYNC_KEY(user.id)) === todayStr()) return;
        }

        const dbUser = await getDocument<{ name?: string; profilePic?: string; updateDate?: number }>({ path: `users`, pathSegments: [user.id] });
        const ts = (new Date()).getTime();

        if (dbUser) {
            const patch: Record<string, unknown> = {
                updateDate: ts,
                email: user.email,
                id: user.id,
            };
            if (!dbUser.name && user.name) patch.name = user.name;
            if (!dbUser.profilePic && user.profilePic) patch.profilePic = user.profilePic;
            await write({ path: `users`, existingDocId: user.id, data: patch });
        } else {
            // First time – seed everything the provider gives us
            await write({
                path: `users`, newDocId: user.id, data: {
                    name: user.name || '',
                    profilePic: user.profilePic || '',
                    updateDate: ts,
                    email: user.email,
                    id: user.id,
                }
            });
        }

        // Mark as synced for today in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem(SYNC_KEY(user.id), todayStr());
        }
    }

    useEffect(() => {
        const auth = getFirebaseAuth();
        const cancelAuthListener = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userData = mapUserData(user)
                updateUserPublicInfo(userData);
                setUserCookie(userData)
                setUser(userData)
            } else {
                removeUserCookie()
            }
        })

        const userFromCookie = getUserFromCookie()

        if (userFromCookie) {
            setUser(userFromCookie)
        }

        return () => {
            cancelAuthListener()
        }
    }, [])

    return { user, logout }
}

export { useUser }
