import React, { useState } from "react";
import AdminTests from "./AdminTests";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import AdminCreateTest from "../../components/admin/AdminCreateTest";
import { MdAdd, MdLogout } from "react-icons/md";

function AdminDashboardPage({ logout }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  return (
    <>
      <Navbar bg="light" variant="gray" expand="lg">
        <Container>
          <Navbar.Brand href="#" className="heading">
            Hello Admin
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Button
                variant="primary"
                className="ms-3"
                size="sm"
                onClick={() => setShow(true)}
              >
                <MdAdd size={"20"} /> &nbsp; Create New Test
              </Button>
            </Nav>
            <Nav>
              <Button
                variant="danger"
                className="ms-3"
                size="sm"
                onClick={logout}
              >
                <MdLogout size={"20"} /> &nbsp; Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <AdminTests />
      </Container>
      <AdminCreateTest show={show} handleClose={handleClose} />
    </>
  );
}

export default AdminDashboardPage;
