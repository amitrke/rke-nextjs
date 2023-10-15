import { FormEvent, useEffect, useState } from "react";
import { Button, Container, Form, FormSelect } from "react-bootstrap";
import { write } from "../firebase/firestore";
import { MessageType } from "../firebase/types";
import { useUser } from "../firebase/useUser";
import Head from "next/head";

export default function Contact() {
    const [validated, setValidated] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { user } = useUser();

    const [message, setMessage] = useState<MessageType>({
        fromUserId: user?.id, title: '', body: '', updateDate: (new Date()).getTime(), toUserId: '0', state: 'unread', thread: ''
    })

    useEffect(() => {
        if (user && user.id) {
            setMessage({ ...message, fromUserId: user.id });
        }
    }, [user])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as typeof event.target & {
            reason: { value: string };
        };
        const form = event.currentTarget;
        const reason = target.reason.value;
        setMessage({...message, title: reason});
        if (form.checkValidity() !== false) {
            setValidated(true);
            setSubmitted(true);
        }
        await write({ path: `messages`, data: message });
    };

    return (
        <Container>
            <Head>
                <title>Contact Us.</title>
                <meta property="og:title" content="Contact Us" key="title" />
            </Head>
            <h1>Contact</h1>
            <Form validated={validated} onSubmit={handleSubmit} className={(submitted || !user) ? 'hidden' : undefined}>
                <Form.Group className="mb-3" controlId="formReason">
                    <Form.Label>Reason</Form.Label>
                    <Form.Select name="reason" aria-label="Default select example">
                        <option value="General">General</option>
                        <option value="Adv">Post an advertisement</option>
                        <option value="Dev">Contribute to the website as a developer</option>
                        <option value="Defect">Report an issue with website</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                        Select the reason why you want to contact the website team.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formTextArea">
                    <Form.Label>Message</Form.Label>
                    <Form.Control required as="textarea" rows={3} defaultValue={message.body} onChange={(e) => { setMessage({ ...message, body: e.target.value }) }} />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <p className={submitted ? undefined : 'hidden'}>
                Thanks for reaching out!
            </p>
            <p className={user ? 'hidden' : undefined}>
                Please Login!
            </p>
        </Container>
    )
}