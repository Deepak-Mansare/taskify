import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleUpdate = () => {};

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      setUserName(decoded.name);
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:3000/task/getTasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks(res.data.tasks);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.log("Data not found", err);
        }
      }
    };
    fetchTasks();
  }, []);

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Welcome, {userName}</h2>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Controls */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <select className="form-select w-auto">
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Task List */}
        <div className="row">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="col-md-6 d-flex justify-content-center align-items-center min-vh-50"
            >
              <div className="card mb-2 shadow-sm h-100 w-100">
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <p className="text-muted">
                    Status: <strong>{task.status}</strong>
                  </p>
                  <p>{task.description}</p>
                  <button className="btn btn-sm btn-outline-primary me-2">
                    Update status
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
