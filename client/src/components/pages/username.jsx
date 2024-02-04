import React from "react";
import "../styles/loginCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faMailBulk,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import {
  RegisterValidate,
  usernameValidate,
  usernameVerify,
} from "../../helper/validate";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/zusStore";
import { authenticate } from "../../helper/helper";

const Username = () => {
  const axiosConfig = axios.create({
    baseURL: "http://localhost:8080/api",
  });

  const navigate = useNavigate();

  const setUsername = useAuthStore((state) => state.setUsername);

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const toastID = toast.loading("connecting...", { duration: 2000 });
      try {
        const { status } = await authenticate(values.username);
        console.log("status", status);
        if (status === 200) {
          toast.dismiss(toastID);
          toast.error("username already exists!!!");
        } else {
          toast.dismiss(toastID);
          setUsername(values.username);
          navigate("/register");
        }
      } catch (error) {
        toast.error("Server not responding!!!");
      }
    },
  });

  return (
    <div className="home-container">
      <form className="form_container" onSubmit={formik.handleSubmit}>
        <div className="logo_container"></div>
        <div className="title_container">
          <p className="title">Register to your Account</p>
          <span className="subtitle">
            Get started with our app, just create an account and enjoy the
            experience.
          </span>
        </div>
        <br />
        <div className="input_container">
          <label className="input_label">Username</label>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <input
            {...formik.getFieldProps("username")}
            placeholder="username"
            title="Input title"
            type="text"
            className="input_field"
            id="username_field"
          />
        </div>

        <button title="Sign In" type="submit" className="sign-in_btn">
          <span>next</span>
        </button>

        <p className="note">Terms of use &amp; Conditions</p>
      </form>
    </div>
  );
};

export default Username;
