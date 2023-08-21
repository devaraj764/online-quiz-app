import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import UserNavbar from "../../components/user/UserNavbar";
import UserTests from "../../components/user/UserTests";
import MonthYearSelector from "../../components/common/MonthYearSelector";
import { useQuery } from "react-query";
import { getRegistrations } from "../../api/registration";
import { toast } from "react-toastify";

function UserDashboard({ logout }) {
  const [timestamps, setTimestamps] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  const { isLoading, refetch } = useQuery({
    queryKey: "/registration/get-registrations",
    enabled: timestamps !== null,
    queryFn: async () => await getRegistrations(timestamps),
    onSuccess: (data) => {
      setRegistrations(data.registrations);
    },
    onError: (error) => {
      toast.error(error.message, { autoClose: 500 });
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (timestamps !== null) {
      console.log("refetching");
      refetch();
    }
  }, [timestamps, refetch]);

  return (
    <div className="user-dashboard-page">
      <UserNavbar logout={logout} />
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center">
          <MonthYearSelector setTimestamps={setTimestamps} />
        </div>
        <UserTests registrations={registrations} isLoading={isLoading} />
      </Container>
    </div>
  );
}

export default UserDashboard;
