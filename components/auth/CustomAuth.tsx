import { useState, type JSX } from 'react';
import {
    signInWithPopup,
    GoogleAuthProvider,
    User as FirebaseUser
} from 'firebase/auth';
import { getFirebaseAuth } from '../../firebase/initFirebase';
import { setUserCookie } from '../../firebase/userCookies';
import { mapUserData } from '../../firebase/mapUserData';
import { useRouter } from 'next/router';
import { Button, Alert, Card } from '../ui/tw';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const CustomAuth = (): JSX.Element => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const auth = getFirebaseAuth();

    const handleAuthSuccess = (user: FirebaseUser) => {
        const userData = mapUserData(user);
        setUserCookie(userData);
        router.push('/');
    };

    const handleSocialSignIn = async () => {
        setError('');
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(auth, provider);
            handleAuthSuccess(result.user);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mx-auto" style={{ maxWidth: '500px' }}>
            <Card.Body>
                <h1 className="mb-3 text-center text-2xl font-semibold">Sign in to Roorkee.org</h1>
                <p className="mb-4 text-center text-slate-600">Use your Google account to continue.</p>

                {error && <Alert variant="danger">{error}</Alert>}

                <div className="grid gap-2">
                    <Button
                        variant="outline-danger"
                        onClick={handleSocialSignIn}
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                        Continue with Google
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CustomAuth;
