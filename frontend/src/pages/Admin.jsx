import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AssignTaskModal from "../components/AssignTaskModal";

function Admin() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsersAndTasks = () => {
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
  };

  useEffect(() => {
    fetchUsersAndTasks();
  }, []);

  const getTaskCounts = (userId) => {
    let userTasks = tasks.filter((task) => task.userId === userId);

    if (filterStatus === "Completed") {
      userTasks = userTasks.filter(
        (task) => task.status?.trim().toLowerCase() === "completed"
      );
    } else if (filterStatus === "Pending") {
      userTasks = userTasks.filter(
        (task) => task.status?.trim().toLowerCase() !== "completed"
      );
    }

    const total = userTasks.length;
    const completed = userTasks.filter(
      (task) => task.status?.trim().toLowerCase() === "completed"
    ).length;
    const pending = total - completed;

    return { total, completed, pending };
  };

  const handleAssignClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/user/deleteUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted");
      fetchUsersAndTasks();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdateUser = async (userId) => {
    const newName = prompt("Enter updated name:");
    if (!newName) return;

    try {
      await axios.put(
        `http://localhost:3000/user/updateUser/${userId}`,
        { name: newName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("User updated");
      fetchUsersAndTasks();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  const filteredUsers = users.filter((user) => {
    const taskCounts = getTaskCounts(user._id);
    if (filterStatus === "Completed" && taskCounts.completed === 0)
      return false;
    if (filterStatus === "Pending" && taskCounts.pending === 0) return false;
    return true;
  });

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold">Admin Panel</h2>

      {/* Cards */}
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
              <h5 className="card-title">Task Count</h5>
              <p className="display-6 text-info">
                {
                  tasks.filter((task) => {
                    const status = task.status?.trim().toLowerCase();
                    if (filterStatus === "Completed")
                      return status === "completed";
                    if (filterStatus === "Pending")
                      return status !== "completed";
                    return true;
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Logout */}
      <div className="d-flex justify-content-end mb-4 align-items-center">
        <select
          className="form-select w-auto me-3"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* User Table */}
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
                  <th>Pending</th>
                  <th>Completed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
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
                          <button
                            onClick={() => handleUpdateUser(user._id)}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="btn btn-sm btn-danger me-2"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleAssignClick(user)}
                            className="btn btn-sm btn-success"
                          >
                            Assign Task
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No users match the filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <AssignTaskModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Admin;
