import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { write } from "../firebase/firestore";
import { MessageType } from "../firebase/types";
import { useUser } from "../firebase/useUser";

export default function Contact() {
    const [validated, setValidated] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { user } = useUser();

    const [message, setMessage] = useState<MessageType>({
        fromUserId: user?.id, title: '', body: '', updateDate: (new Date()).getTime(), toUserId: '', state: 'unread', thread: ''
    })

    useEffect(() => {
        if (user && user.id) {
            setMessage({ ...message, fromUserId: user.id });
        }
    }, [user])

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        const doc = await write({ path: `messages`, data: message });
        //console.dir(message);
        setValidated(true);
        setSubmitted(true);
    };

    return (
        <Container>
            <h1>Contact</h1>
            <Form validated={validated} onSubmit={handleSubmit} className={submitted ? 'hidden' : undefined}>
                <Form.Group className="mb-3" controlId="formReason">
                    <Form.Label>Reason</Form.Label>
                    <Form.Select aria-label="Default select example">
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