import { User } from "./types"

export const mapUserData = (user): User => {
    const { uid, email, xa, displayName, photoURL } = user
    return {
        id: uid,
        email,
        token: xa,
        name: displayName,
        profilePic: photoURL
    }
}