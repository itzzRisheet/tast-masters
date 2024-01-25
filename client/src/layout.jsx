import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import "./layout.css";

const Layout = () => {
  return (
    <div className="main-container">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
