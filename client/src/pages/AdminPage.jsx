import React, { useEffect } from "react";
import AdminNavbar from "../components/admin/AdminNavbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

function AdminDashboardPage() {

  return (
    <div className="admin-dashboard-page">
      <div className="d-flex">
        <AdminNavbar />
        <div style={{ flexGrow: 1 }}>
          <Container fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
