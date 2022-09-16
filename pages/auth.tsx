import Link from 'next/link';
import FirebaseAuth from '../components/auth/FirebaseAuth'

const Auth = () => {
    return (
        <div>
            <div>
                <FirebaseAuth />
                <p><Link href="/">Go Home</Link></p>
            </div>
        </div>
    )
}

Auth.noLayout = true;

export default Auth
