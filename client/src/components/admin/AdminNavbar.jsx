import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FaHome, FaUser } from "react-icons/fa";
import {
  AiOutlineFileDone,
  AiOutlineHome,
  AiOutlineUser,
} from "react-icons/ai";
import { LiaEyeSolid } from "react-icons/lia";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminNavbar = ({ defaultSelected }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split("/")[2];

  return (
    <SideNav
      onSelect={(selected) => {
        // Add your code here
        navigate(`./${selected}`);
      }}
      className="side-navbar"
    >
      <SideNav.Toggle />
      <SideNav.Nav defaultSelected={currentPath}>
        <NavItem eventKey="dashboard">
          <NavIcon>
            <AiOutlineHome style={{ fontSize: "1.75em" }} />
          </NavIcon>
          <NavText className="sub-title">Dashboard</NavText>
        </NavItem>
        <NavItem eventKey="profile">
          <NavIcon>
            <AiOutlineUser style={{ fontSize: "1.75em" }} />
          </NavIcon>
          <NavText className="sub-title">Profile</NavText>
        </NavItem>
        <NavItem eventKey="tests">
          <NavIcon>
            <AiOutlineFileDone style={{ fontSize: "1.75em" }} />
          </NavIcon>
          <NavText className="sub-title">Tests</NavText>
        </NavItem>
        <NavItem eventKey="spectates">
          <NavIcon>
            <LiaEyeSolid style={{ fontSize: "1.75em" }} />
          </NavIcon>
          <NavText className="sub-title">Spectates</NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
};

export default AdminNavbar;
