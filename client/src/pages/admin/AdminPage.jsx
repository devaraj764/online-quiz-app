import { useContext, useEffect } from "react";
import { AppContext } from "../../contexts";
import PageNotFound from "../PageNotFound";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function AdminPage() {
  const { user } = useContext(AppContext);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname === "/admin" || pathname === "/admin/") {
      navigate("/admin/dashboard");
    }
    return;
    // eslint-disable-next-line
  }, [user]);

  return user && user.role !== "admin" ? (
    <PageNotFound message={"Unauthorized"} />
  ) : (
    <Outlet />
  );
}

export default AdminPage;
