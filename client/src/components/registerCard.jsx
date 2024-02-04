import React from "react";
import "./styles/loginCard.css";
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
import { RegisterValidate } from "../helper/validate";
import { useAuthStore } from "../store/zusStore";
import { useNavigate } from "react-router-dom";

const RegisterCard = () => {
  const axiosConfig = axios.create({
    baseURL: "http://localhost:8080/api",
  });

  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: username,
      email: "",
      password: "",
    },
    validate: RegisterValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const toastID = toast.loading("creating...");
      await axiosConfig
        .post("/register", values)
        .then(async (res) => {
          toast.dismiss(toastID);
          toast.success(res.data);
          await axiosConfig
            .post("/login", {
              username: values.username,
              password: values.password,
            })
            .then((res) => {
              const { data } = res;
              localStorage.setItem("token", data.token);
            });
          navigate("/dash");
        })
        .catch((err) => {
          console.log(err);
          toast.dismiss(toastID);
          toast.error(err.response.data.msg);
        });
    },
  });

  return (
    <form className="form_container" onSubmit={formik.handleSubmit}>
      <div className="logo_container"></div>
      <div className="title_container">
        <p className="title">
          Welcome <strong>{username}</strong>
        </p>
        <span className="subtitle">
          Get started with our app, just create an account and enjoy the
          experience.
        </span>
      </div>
      <br />

      <div className="input_container">
        <label className="input_label">Email</label>
        <FontAwesomeIcon icon={faEnvelope} className="icon" />
        <input
          {...formik.getFieldProps("email")}
          placeholder="name@mail.com"
          title="Input title"
          type="text"
          className="input_field"
          id="email_field"
        />
      </div>
      <div className="input_container">
        <label className="input_label">Password</label>
        <FontAwesomeIcon icon={faLock} className="icon" />
        <input
          {...formik.getFieldProps("password")}
          placeholder="Password"
          title="Inpit title"
          type="password"
          className="input_field"
          id="password_field"
        />
      </div>
      <button title="Sign In" type="submit" className="sign-in_btn">
        <span>Sign up</span>
      </button>

      {/* <div className="separator">
        <hr className="line" />
        <span>Or</span>
        <hr className="line" />
      </div> */}
      {/* <button title="Sign In" type="submit" className="sign-in_ggl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="20"
          height="20"
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
        <span>Sign In with Google</span>
      </button>
      <button title="Sign In" type="submit" className="sign-in_apl">
        <FontAwesomeIcon icon={faApple} size="xl" />
        <span>Sign In with Apple</span>
      </button> */}
      <p className="note">Terms of use &amp; Conditions</p>
    </form>
  );
};

export default RegisterCard;
