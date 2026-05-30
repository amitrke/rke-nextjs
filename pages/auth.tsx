import Link from 'next/link';
import CustomAuth from '../components/auth/CustomAuth'

const Auth = () => {
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-5">
            <div className="mx-auto max-w-xl">
                <CustomAuth />
                <p className="mt-3 text-center"><Link href="/">Go Home</Link></p>
            </div>
        </div>
    )
}

Auth.noLayout = true;

export default Auth
