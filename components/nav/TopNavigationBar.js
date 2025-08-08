import { Container, Nav, Navbar } from "react-bootstrap";
import { useUser } from "../../firebase/useUser";

export default function TopNavigationBar() {
    

    return (
        <Navbar bg="light" expand="lg" fixed="top">
            <Container fluid>
                <Navbar.Brand href="/">Roorkee.org</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/albums">Albums</Nav.Link>
                    <Nav.Link href="/events">Events</Nav.Link>
                </Nav>
                <UserInfo/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

function UserInfo() {
    const { user } = useUser()
    if (user) {
        return (
            <Nav.Link href="/myaccount">MyAccount</Nav.Link>
        )
    } else {
        return (
            <Nav.Link href="/auth">Login</Nav.Link>
        )
    }
}