import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
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

  const fetchUsersAndTasks = async () => {
    try {
      const tasksRes = await axiosInstance.get("/task/getTasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasksRes.data.tasks);

      const usersRes = await axiosInstance.get("/user/getUsers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data.users);

      const adminsRes = await axiosInstance.get("/user/getAdmins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(adminsRes.data.admins);
    } catch {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchUsersAndTasks();
  }, []);

  const getTaskCounts = (userId) => {
    let userTasks = tasks.filter((task) => {
      const id = task.userId?._id || task.userId;
      return id === userId;
    });

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
    const confirm = prompt(
      "This user will be deleted, Are you sure? (Type... yes or no)"
    );
    if (confirm?.toLowerCase() === "yes") {
      try {
        await axiosInstance.delete(`/user/deleteUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("User deleted");
        fetchUsersAndTasks();
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  const handleUpdateUser = async (userId) => {
    const newName = prompt("Enter updated name:");
    const email = prompt("Enter updated email");
    if (!newName) return;

    try {
      await axiosInstance.put(
        `/user/updateUser/${userId}`,
        { name: newName, email: email },
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
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-success">Admin Panel</h3>
        <button className="btn btn-outline-success" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="mb-3">
        <label htmlFor="filterStatus" className="form-label">
          Filter by Task Status
        </label>
        <select
          id="filterStatus"
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-success">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Total</th>
              <th>Completed</th>
              <th>Pending</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const { total, completed, pending } = getTaskCounts(user._id);
                return (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{total}</td>
                    <td>{completed}</td>
                    <td>{pending}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleAssignClick(user)}
                      >
                        Assign task
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleUpdateUser(user._id)}
                      >
                        Edit user info
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete user
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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
