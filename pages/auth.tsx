import Link from 'next/link';
import CustomAuth from '../components/auth/CustomAuth'

const Auth = () => {
    return (
        <div className="container py-5">
            <div>
                <CustomAuth />
                <p className="text-center mt-3"><Link href="/">Go Home</Link></p>
            </div>
        </div>
    )
}

Auth.noLayout = true;

export default Auth
