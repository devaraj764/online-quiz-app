import React, { useContext } from "react";
import { Button, Container, Image, Nav, Navbar } from "react-bootstrap";
import { AppContext } from "../../contexts";

function UserNavbar({ logout }) {
  const {user}= useContext(AppContext)
  return (
    <Navbar bg="light" variant="gray" expand="lg">
      <Container>
        <Navbar.Brand href="#" className="title">
          {/* <Image
            fluid
            className="profile-image"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
          />{" "} */}
          &nbsp; Hello {user?.fullName}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Button variant="danger" onClick={logout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default UserNavbar;
