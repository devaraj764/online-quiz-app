import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts";

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    console.log(user);
    if (user) navigate("/login");
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="landing-page">
      <div className="login-tabs">
        <div className="login-tab" onClick={() => navigate("/login")}>
          <img src="/assets/profile.gif" alt="" className="login-tab-image" />
          <p className="sub-title">User Login</p>
        </div>
        <div className="login-tab" onClick={() => navigate("/login")}>
          <img src="/assets/admin.gif" alt="" className="login-tab-image" />
          <p className="sub-title">Admin Login</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
