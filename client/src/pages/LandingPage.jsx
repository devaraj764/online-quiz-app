import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      <div className="login-tabs">
        <div className="login-tab" onClick={() => navigate("/user/login")}>
          <img src="/assets/profile.gif" alt="" className="login-tab-image" />
          <p className="sub-title">User Login</p>
        </div>
        <div className="login-tab" onClick={() => navigate("/admin/login")}>
          <img src="/assets/admin.gif" alt="" className="login-tab-image" />
          <p className="sub-title">Admin Login</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
