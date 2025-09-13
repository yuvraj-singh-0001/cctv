// src/pages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, RefreshCw } from "lucide-react";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/users");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete user. Status: ${res.status}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = async (id, oldName, oldEmail) => {
    const newName = prompt("Enter new name:", oldName);
    const newEmail = prompt("Enter new email:", oldEmail);
    if (!newName || !newEmail || (newName === oldName && newEmail === oldEmail)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail }),
      });
      if (!res.ok) throw new Error(`Failed to update user. Status: ${res.status}`);
      setUsers(users.map((u) => (u.id === id ? { ...u, name: newName, email: newEmail } : u)));
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center space-x-2">
        <RefreshCw className="animate-spin" size={28} style={{ color: "rgb(7,72,94)" }} />
        <span className="text-lg font-medium" style={{ color: "rgb(7,72,94)" }}>
          Loading users...
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-xl w-full max-w-6xl mx-auto"
      style={{ backgroundColor: "rgb(205,225,230)" }}
    >
      <h2
        className="text-2xl font-bold mb-6 border-b pb-2"
        style={{ color: "rgb(7,72,94)", borderColor: "rgb(7,72,94)" }}
      >
        User Management
      </h2>

      {users.length === 0 ? (
        <p className="text-center py-6" style={{ color: "rgb(7,72,94)" }}>
          No users found
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: "rgb(7,72,94)", color: "white" }}>
                <th className="px-6 py-3 text-left font-medium">ID</th>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  style={{
                    backgroundColor: index % 2 === 0 ? "white" : "rgb(205,225,230)",
                    color: "rgb(7,72,94)",
                  }}
                  className="hover:bg-blue-100"
                >
                  <td className="px-6 py-3">{u.id}</td>
                  <td className="px-6 py-3 font-medium">{u.name}</td>
                  <td className="px-6 py-3">{u.email}</td>
                  <td className="px-6 py-3 flex gap-3">
                    <button
                      className="flex items-center px-3 py-1 rounded-lg hover:opacity-80 transition"
                      style={{ backgroundColor: "rgb(7,72,94)", color: "white" }}
                      onClick={() => handleEdit(u.id, u.name, u.email)}
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </button>
                    <button
                      className="flex items-center px-3 py-1 rounded-lg hover:opacity-80 transition"
                      style={{ backgroundColor: "#ff4d4d", color: "white" }}
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

export default UserManagement;
