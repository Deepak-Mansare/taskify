import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function Admin() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3000/task/getTasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data.tasks))
      .catch(() => toast.error("Failed to fetch tasks"));

    axios
      .get("http://localhost:3000/user/getUsers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error("Failed to fetch users"));

    axios
      .get("http://localhost:3000/user/getAdmins", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAdmins(res.data.admins))
      .catch(() => toast.error("Failed to fetch admins"));
  }, []);

  // Helper function: counts tasks by userId and status
  const getTaskCounts = (userId) => {
    const userTasks = tasks.filter((task) => task.userId === userId);
    const total = userTasks.length;
    const completed = userTasks.filter(
      (task) => task.status?.trim().toLowerCase() === "completed"
    ).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold">Admin Panel</h2>

      {/* Summary Cards */}
      <div className="row g-4 mb-5 text-center">
        <div className="col-md-4">
          <div className="card border-0 shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="display-6 text-primary">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Admins</h5>
              <p className="display-6 text-success">{admins.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Tasks Pending</h5>
              <p className="display-6 text-info">
                {
                  tasks.filter(
                    (task) => task.status?.trim().toLowerCase() !== "completed"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow">
        <div className="card-body">
          <h5 className="card-title mb-4 fw-semibold">User List</h5>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Total Tasks</th>
                  <th>Pending Tasks</th>
                  <th>Completed Tasks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => {
                    const { total, pending, completed } = getTaskCounts(
                      user._id
                    );
                    return (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{total}</td>
                        <td>{pending}</td>
                        <td>{completed}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
