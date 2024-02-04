import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import "./layout.css";
import { Toaster } from "react-hot-toast";
import { useLocalStorage } from "./store/zusStore";

const Layout = () => {
  return (
    <div className="">
      <Toaster position="top-center" />
      <Navbar />

      <Outlet />
    </div>
  );
};

export default Layout;
