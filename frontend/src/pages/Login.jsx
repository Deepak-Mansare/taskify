import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { toast } from "react-toastify";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user.email || !user.password) {
        toast.warn("Both email and password are required");
        return;
      }

      const result = await axios.post("/user/login", user, {
        withCredentials: true,
      });

      if (result.status === 200 || result.status === 201) {
        toast.success(result.data.message);
        localStorage.setItem("token", result.data.token);
        setUser({ email: "", password: "" });
        navigate("/dashboard");
      } else {
        toast.error(result.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <div className="card shadow-sm w-100" style={{ maxWidth: "450px" }}>
        <div className="card-header text-white text-center bg-success w-100">
          <h1 className="my-2">Login User</h1>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={user.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={user.password}
                onChange={handleChange}
              />
            </div>

            <div className="m-2">
              <button type="submit" className="btn btn-success form-control">
                Login
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer text-center">
          <div className="m-2">
            <small>
              New User?{" "}
              <Link to="/register" className="text-decoration-none">
                Register
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
