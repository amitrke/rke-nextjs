import { useState, FormEvent, type JSX } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    User as FirebaseUser
} from 'firebase/auth';
import { getFirebaseAuth } from '../../firebase/initFirebase';
import { setUserCookie } from '../../firebase/userCookies';
import { mapUserData } from '../../firebase/mapUserData';
import { useRouter } from 'next/router';
import { Button, Form, Alert, Card, Tabs, Tab } from '../ui/tw';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const CustomAuth = (): JSX.Element => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('signin');
    const router = useRouter();
    const auth = getFirebaseAuth();

    const handleAuthSuccess = (user: FirebaseUser) => {
        const userData = mapUserData(user);
        setUserCookie(userData);
        router.push('/');
    };

    const handleEmailSignIn = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            handleAuthSuccess(userCredential.user);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name if provided
            if (displayName && userCredential.user) {
                await updateProfile(userCredential.user, {
                    displayName: displayName
                });
            }

            handleAuthSuccess(userCredential.user);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
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
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k || 'signin')}
                    className="mb-3"
                >
                    <Tab eventKey="signin" title="Sign In">
                        <Form onSubmit={handleEmailSignIn}>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form.Group className="mb-3" controlId="signinEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="signinPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </Form>
                    </Tab>

                    <Tab eventKey="signup" title="Sign Up">
                        <Form onSubmit={handleEmailSignUp}>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form.Group className="mb-3" controlId="signupName">
                                <Form.Label>Display Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="signupEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="signupPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password (min 6 characters)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100"
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Sign Up'}
                            </Button>
                        </Form>
                    </Tab>
                </Tabs>

                <hr className="my-4" />

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
