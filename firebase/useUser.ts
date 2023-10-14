import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import initFirebase from './initFirebase'
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
        return firebase
            .auth()
            .signOut()
            .then(() => {
                // Sign-out successful.
                router.push('/auth')
            })
            .catch((e) => {
                console.error(e)
            })
    }

    const updateUserPublicInfo = async (user: User) => {
        const userInfo ={ name: user.name, profilePic: user.profilePic || "", updateDate: (new Date()).getTime(), email: user.email };
        const dbUser = await getDocument({ path: `users`, pathSegments: [user.id] });
        if (dbUser) {
            await write({ path: `users`, existingDocId: user.id, data: userInfo });
        } else {
            await write({ path: `users`, newDocId: user.id, data: userInfo});
        }
    }

    useEffect(() => {
        const cancelAuthListener = firebase.auth().onAuthStateChanged((user) => {
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
