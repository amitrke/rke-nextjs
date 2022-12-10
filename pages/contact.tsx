import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useUser } from "../firebase/useUser";

export default function Contact() {
    const [validated, setValidated] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { user } = useUser();

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
        setSubmitted(true);
    };

    const ContactForm = () => {
        return (
            <>
                <h1>Contact</h1>
                <Form validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control required type="text" placeholder="Enter your name" value={user?.name} />
                        <Form.Text className="text-muted">
                            Your Name.
                        </Form.Text>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
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
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email" value={user?.email} />
                        <Form.Text className="text-muted">
                            We&apos;ll never share your email with anyone else.
                        </Form.Text>
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTextArea">
                        <Form.Label>Message</Form.Label>
                        <Form.Control required as="textarea" rows={3} />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </>
        )
    }

    const ThanksView = () => {
        return (
            <>
            <p>Thanks for reaching out.</p>
            </>
        )
    }

    const PageContent = (props) => {
        if (submitted) return ThanksView();
        else return ContactForm();
    }

    return (
        <Container>
            <PageContent />
        </Container>
    )
}