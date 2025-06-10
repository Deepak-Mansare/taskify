import { useState, useEffect } from "react";
import axios from "../axiosConfig";
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

  // Fetch users, admins, and tasks from backend
  const fetchUsersAndTasks = async () => {
    try {
      const tasksRes = await axios.get("/task/getTasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasksRes.data.tasks);

      const usersRes = await axios.get("/user/getUsers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data.users);

      const adminsRes = await axios.get("/user/getAdmins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(adminsRes.data.admins);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchUsersAndTasks();
  }, []);

  // Calculate task counts by status for a user
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

  // Show Assign Task modal for selected user
  const handleAssignClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Delete user by ID
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/user/deleteUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted");
      fetchUsersAndTasks();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Update user name by ID
  const handleUpdateUser = async (userId) => {
    const newName = prompt("Enter updated name:");
    if (!newName) return;

    try {
      await axios.put(
        `/user/updateUser/${userId}`,
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

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  // Filter users based on task status filter
  const filteredUsers = users.filter((user) => {
    const taskCounts = getTaskCounts(user._id);
    if (filterStatus === "Completed" && taskCounts.completed === 0)
      return false;
    if (filterStatus === "Pending" && taskCounts.pending === 0) return false;
    return true;
  });

  return (
    <div className="container py-5">
      {/* Your UI for users, admins, filters, etc. */}

      {/* Example: Filter status selection */}
      <div className="mb-4">
        <label htmlFor="filterStatus" className="form-label">
          Filter Tasks by Status:
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

      {/* User list (simplified example) */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Total Tasks</th>
            <th>Completed</th>
            <th>Pending</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => {
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
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleAssignClick(user)}
                  >
                    Assign Task
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleUpdateUser(user._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Assign Task Modal */}
      {showModal && (
        <AssignTaskModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Logout Button */}
      <button className="btn btn-secondary mt-4" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Admin;
