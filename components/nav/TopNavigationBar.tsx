import { Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import { useUser } from "../../firebase/useUser";

export default function TopNavigationBar() {
    return (
        <Navbar bg="light" expand="lg" fixed="top">
            <Container fluid>
                <Navbar.Brand href="/">Roorkee.org</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} href="/">Home</Nav.Link>
                        <Nav.Link as={Link} href="/posts">Posts</Nav.Link>
                        <Nav.Link as={Link} href="/news/1">News</Nav.Link>
                        <Nav.Link as={Link} href="/events">Events</Nav.Link>
                        <Nav.Link as={Link} href="/albums">Albums</Nav.Link>
                        <Nav.Link as={Link} href="/contact">Contact</Nav.Link>
                    </Nav>
                    <UserInfo />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

function UserInfo() {
    const { user } = useUser()
    if (user) {
        return (
            <Nav.Link as={Link} href="/myaccount">My Account</Nav.Link>
        )
    } else {
        return (
            <Nav.Link as={Link} href="/auth">Login</Nav.Link>
        )
    }
}
