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

    const updateUserPublicInfo = async (user: User) => {
        const dbUser = await getDocument({ path: `users`, pathSegments: [user.id] });
        const existingName = (dbUser as { name?: string } | null)?.name || '';
        const userInfo = {
            name: user.name || existingName,
            profilePic: user.profilePic || (dbUser as { profilePic?: string } | null)?.profilePic || "",
            updateDate: (new Date()).getTime(),
            email: user.email,
            id: user.id
        };
        if (dbUser) {
            await write({ path: `users`, existingDocId: user.id, data: userInfo });
        } else {
            await write({ path: `users`, newDocId: user.id, data: userInfo});
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
