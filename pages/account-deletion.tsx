import Head from "next/head";
import { Container } from "react-bootstrap";

export default function AccountDeletion() {
    return (
        <Container>
            <Head>
                <title>Account Deletion Request.</title>
                <meta property="og:title" content="Account Deletion Request" key="title" />
                <meta name="robots" content="all" />
            </Head>

            <h1>Account Deletion Request</h1>
            <p>Last updated: April 21, 2026</p>
            <p>
                You can now delete your Roorkee.org account directly from your account settings,
                without contacting an administrator.
            </p>

            <h2>How to delete your account</h2>
            <ol>
                <li>Sign in to your account on Roorkee.org.</li>
                <li>Go to <a href="/myaccount">/myaccount</a> and open the Profile tab.</li>
                <li>In the Danger Zone section, click Delete My Account and follow the confirmation steps.</li>
            </ol>

            <p>
                If you cannot access your account, use <a href="/contact">/contact</a> for manual recovery help.
            </p>

            <h2>What will be deleted</h2>
            <ul>
                <li>Your account profile data.</li>
                <li>Account-linked personal information stored by the service.</li>
            </ul>

            <h2>What may be retained</h2>
            <ul>
                <li>Data we are required to retain for legal, security, or fraud-prevention reasons.</li>
                <li>Technical logs retained for a limited period as described in our privacy policy.</li>
            </ul>

            <h2>Processing time</h2>
            <p>
                Self-service deletions are processed immediately after confirmation.
            </p>
        </Container>
    );
}