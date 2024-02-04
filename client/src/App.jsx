import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/pages/home.jsx";
import Register from "./components/pages/register.jsx";
import Login from "./components/pages/login.jsx";
import Layout from "./layout.jsx";
import Username from "./components/pages/username.jsx";
import Dashboard from "./components/pages/Dashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/username",
        element: <Username />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dash",
        element: <Dashboard />,
      },
    ],
  },
]);
function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
