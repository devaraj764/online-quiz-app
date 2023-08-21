import React from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

function AdminDashboardPage() {
  return (
    <div className="admin-page">
      <div className="d-flex">
        <AdminNavbar />
        <div style={{ flexGrow: 1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
