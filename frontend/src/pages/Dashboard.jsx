import { useEffect, useState } from "react";
import axios from "axios"; // axiosConfig should have local baseURL set
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // fixed import from jwt-decode package

function Dashboard() {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      // Add Authorization header with token for protected routes
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/task/getTasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Failed to fetch tasks:", err);
      }
    }
  };

  // Decode token and set user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || decoded.email || "User");
        setUserRole(decoded.role || "user");
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleUpdate = async (taskId) => {
    const newStatus = prompt("Enter new status (e.g., Completed, Pending):");
    if (!newStatus) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/task/updateTask/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task status updated");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update task status");
      console.error(error);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/task/deleteTask/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "All") return true;
    if (filterStatus === "Completed")
      return task.status?.toLowerCase() === "completed";
    if (filterStatus === "Pending")
      return task.status?.toLowerCase() !== "completed";
    return true;
  });

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Welcome, {userName}</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="d-flex justify-content-start align-items-center mb-4">
        <select
          className="form-select w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="row">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="col-md-6 mb-3 d-flex justify-content-center align-items-center min-vh-50"
            >
              <div className="card shadow-sm h-100 w-100 mx-2">
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <p className="text-muted">
                    Status: <strong>{task.status}</strong>
                  </p>
                  <p>{task.description}</p>
                  {task.userId && (
                    <p className="text-secondary">
                      Assigned to:{" "}
                      <strong>
                        {task.userId.name || task.userId.email || "Unknown"}
                      </strong>
                    </p>
                  )}
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleUpdate(task._id)}
                  >
                    Update status
                  </button>
                  {userRole === "admin" && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No tasks found.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
