import { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import initFirebase from '../../firebase/initFirebase';
import { setUserCookie } from '../../firebase/userCookies';
import { mapUserData } from '../../firebase/mapUserData';

initFirebase(); // initialize firebase

const firebaseAuthConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true,
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl: '/',
    credentialHelper: 'none',
    callbacks: {
        signInSuccessWithAuthResult: ({ user }) => {
            if (user) {
                const userData = mapUserData(user);
                setUserCookie(userData);
            }
            return true;
        },
    },
};

const FirebaseAuth = (): JSX.Element => {
    const [renderAuth, setRenderAuth] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setRenderAuth(true);
        }
    }, []);
    return (
        <div>
            {renderAuth ? (
                <StyledFirebaseAuth
                    uiConfig={firebaseAuthConfig}
                    firebaseAuth={firebase.auth()}
                />
            ) : null}
        </div>
    );
};

export default FirebaseAuth;
