import axios from "../axiosConfig";
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
      .get("/task/getTasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data.tasks))
      .catch(() => toast.error("Failed to fetch tasks"));

    axios
      .get("/user/getUsers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error("Failed to fetch users"));

    axios
      .get("/user/getAdmins", {
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
      await axios.delete(`/user/deleteUser/${userId}`, {
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
      {/* unchanged UI code */}
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
