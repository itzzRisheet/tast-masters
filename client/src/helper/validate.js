import axios from "axios";
import { toast } from "react-hot-toast";

const axiosConfig = axios.create({
  baseURL: "http://localhost:8080/api",
});

// validate login page username
export async function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username Required...");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("username can not includes spaces");
  }
  return error;
}

export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);
  return errors;
}
// Validate password
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}
function passwordVerify(errors = {}, values) {
  const specialChar = /[`!@#$%^&*()_+-=\[\]{}';:"\\|,.<>\/?~]/;
  const numbers = /\d/;
  if (!values.password) {
    errors.password = toast.error("Password Required!!!");
  } else if (values.password[0] === "" || values.password[0] === " ") {
    errors.password = toast.error("Please Enter password!!!");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Please cannot include spaces!!!");
  } else if (values.password.length < 6) {
    errors.password = toast.error("Password must be at least 6 characters");
  } else if (!specialChar.test(values.password)) {
    errors.password = toast.error(
      "Password must have at least one Special characters... "
    );
  } else if (!numbers.test(values.password)) {
    errors.password = toast.error(
      "Password must have at least one numbers... "
    );
  }
  return errors;
}

// Validate Register Form
export async function RegisterValidate(values) {
  const errors = emailVerify({}, values);
  passwordVerify(errors, values);

  return errors;
}
function emailVerify(error = {}, values) {
  const mail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!values.email) {
    error.email = toast.error("Email Required...!!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Enter valid Email...!!");
  } else if (!mail.test(values.email)) {
    error.email = toast.error("Invalid Email...!!");
  }
  return error;
}

export function emailValidate(email) {
  const mail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (email.includes(" ")) {
    return false;
  } else if (!mail.test(email)) {
    return false;
  }
  return true;
}
