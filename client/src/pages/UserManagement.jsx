// src/pages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, RefreshCw } from "lucide-react";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/users"); // correct backend route
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setUsers(data.users); // backend returns { success: true, users: [...] }
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

  // ✅ Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete user. Status: ${res.status}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // ✅ Edit User
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

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <RefreshCw className="animate-spin text-blue-600" size={28} />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-blue-900">User Management</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b hover:bg-blue-50"
                >
                  <td className="px-4 py-2">{u.id}</td>
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 flex gap-3">
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => handleEdit(u.id, u.name, u.email)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 size={18} />
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
