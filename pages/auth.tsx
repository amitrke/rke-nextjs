import FirebaseAuth from '../components/auth/FirebaseAuth'

const Auth = () => {
    return (
        <div>
            <div>
                <FirebaseAuth />
                <p><a href="/">Go Home</a></p>
            </div>
        </div>
    )
}

Auth.noLayout = true;

export default Auth
