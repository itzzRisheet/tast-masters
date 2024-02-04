import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "http://localhost:8080/api",
});

// authenticate function
export async function authenticate(username) {
  try {
    return await axiosConfig.post(
      "/username",
      { username },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return { error: error + " Username doesn't exist" };
  }
}
