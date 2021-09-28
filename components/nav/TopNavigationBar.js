import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useUser } from "../../firebase/useUser";

export default function TopNavigationBar() {
    

    return (
        <Navbar bg="light" expand="lg" fixed="top">
            <Container fluid>
                <Navbar.Brand href="#home">Roorkee.org</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="me-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">Link</Nav.Link>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <UserInfo/>
            </Container>
        </Navbar>
    )
}

function UserInfo() {
    const { user, logout } = useUser()
    if (user) {
        return (
            <Nav.Link onClick={() => logout()}>Logout</Nav.Link>
        )
    } else {
        return (
            <Nav.Link href="/auth">Login</Nav.Link>
        )
    }
}