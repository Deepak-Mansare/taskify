import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
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
      if (!user.name || !user.email || !user.password || !user.confPassword) {
        toast.warn("All fields are required");
        return;
      }

      if (user.password !== user.confPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const result = await axios.post(
        "http://localhost:3000/user/register",
        user
      );
      if (result.status === 200 || result.status === 201) {
        toast.success(result.data.message);

        setUser({ name: "", email: "", password: "", confPassword: "" });
        navigate("/login");
      } else {
        toast.error("Registration failed");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
        <div className="card shadow-sm w-100" style={{ maxWidth: "450px" }}>
          <div className="card-header text-white text-center bg-success w-100">
            <h1 className="my-2">Register User</h1>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={user.name}
                  onChange={handleChange}
                />
              </div>

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
                  placeholder="Create a password"
                  value={user.password}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confPassword"
                  className="form-control"
                  placeholder="Confirm your password"
                  value={user.confPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="m-2">
                <button type="submit" className="btn btn-success form-control">
                  Register
                </button>
              </div>
            </form>
          </div>

          <div className="card-footer text-center">
            <div className="m-2">
              <small>
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none">
                  Login
                </Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
