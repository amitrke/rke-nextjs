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

    const updateUserPublicInfo = async(user: User) => {
        const dbUser = await getDocument({ path: `users`, pathSegments: [user.id] });
        if (dbUser) return;
        await write({ path: `users`, newDocId: user.id, data: {name: user.name, profilePic: user.profilePic || "", updateDate: (new Date()).getTime()} });
    }

    useEffect(() => {
        // Firebase updates the id token every hour, this
        // makes sure the react state and the cookie are
        // both kept up to date
        const cancelAuthListener = firebase.auth().onIdTokenChanged((user) => {
            if (user) {
                const userData = mapUserData(user)
                updateUserPublicInfo(userData);
                setUserCookie(userData)
                setUser(userData)
            } else {
                removeUserCookie()
                //setUser({})
            }
        })

        const userFromCookie = getUserFromCookie()
        // if (!userFromCookie) {
        //     router.push('/')
        //     return
        // }
        if (userFromCookie){
            setUser(userFromCookie)
        }
        
        return () => {
            cancelAuthListener()
        }
    }, [])

    return { user, logout }
}

export { useUser }
