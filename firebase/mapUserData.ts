import { User as FirebaseUser } from "firebase/auth"
import { User } from "./types"

type FirebaseUserWithToken = FirebaseUser & {
    xa?: string; // Firebase internal token property
}

export const mapUserData = (user: FirebaseUserWithToken | null): User | null => {
    if (!user) return null;
    const { uid, email, xa, displayName, photoURL } = user;
    return {
        id: uid,
        email: email || '',
        token: xa || '',
        name: displayName || '',
        profilePic: photoURL || ''
    };
}