// src/pages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  Search,
  Users,
} from "lucide-react";
import EditUserModal from "../components/EditUserModal";
import AddUserModal from "../components/AddUserModal";
import API_BASE_URL from "../components/apiconfig/api-config";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users`);
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
      const res = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(`Failed to delete user. Status: ${res.status}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleEditSave = async (id, updateData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!res.ok)
        throw new Error(`Failed to update user. Status: ${res.status}`);
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, ...updateData } : u
        )
      );
      setEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error(`Failed to add user`);
      await fetchUsers();
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterOption === "All" ? true : user.role === filterOption;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <RefreshCw
            className="animate-spin"
            size={26}
            style={{ color: "rgb(7,72,94)" }}
          />
          <p
            className="font-medium text-lg"
            style={{ color: "rgb(7,72,94)" }}
          >
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3"
      >
        <div className="flex items-center gap-2">
          <Users
            size={26}
            style={{ color: "rgb(7,72,94)" }}
          />
          <h1
            className="text-2xl font-bold"
            style={{ color: "rgb(7,72,94)" }}
          >
            User Management
          </h1>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm transition-all text-white"
          style={{ backgroundColor: "rgb(7,72,94)" }}
        >
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </motion.div>

      {/* Controls Row */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"
      >
        <p className="text-gray-600 text-sm sm:text-base">
          Manage and organize users efficiently
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative w-full sm:w-52">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "rgb(7,72,94)" }}
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": "rgb(7,72,94)" }}
          >
            <option value="All">All</option>
            <option value="Admin">Admins</option>
            <option value="User">Users</option>
            <option value="Guest">Guests</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchUsers}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{ backgroundColor: "rgb(7,72,94)" }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* User Table / Cards */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Table Header */}
        <div
          className="px-6 py-3 border-b"
          style={{ backgroundColor: "hsla(192, 64%, 75%, 1.00)" }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: "rgba(3, 30, 39, 1)" }}
          >
            User List ({filteredUsers.length})
          </h2>
        </div>

        {/* No Users */}
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm sm:text-base">
            No users found.
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="block lg:hidden p-4 space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {user.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "Admin"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "User"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ID:</span> #{user.id}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="flex-1 px-3 py-2 text-xs text-white rounded-md transition-colors"
                      style={{ backgroundColor: "rgb(7,72,94)" }}
                    >
                      <Edit size={13} className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="flex-1 px-3 py-2 text-xs text-white rounded-md bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={13} className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr
                    style={{ backgroundColor: "rgb(205,225,230)" }}
                    className="text-sm uppercase text-left"
                  >
                    <th className="px-4 py-3 text-[13px] font-semibold text-[#07485E]">ID</th>
                    <th className="px-4 py-3 text-[13px] font-semibold text-[#07485E]">Name</th>
                    <th className="px-4 py-3 text-[13px] font-semibold text-[#07485E]">Email</th>
                    <th className="px-4 py-3 text-[13px] font-semibold text-[#07485E]">Role</th>
                    <th className="px-4 py-3 text-[13px] font-semibold text-[#07485E]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-700">#{user.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "Admin"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "User"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="px-3 py-1.5 text-xs rounded-md text-white"
                          style={{ backgroundColor: "rgb(7,72,94)" }}
                        >
                          <Edit size={13} className="inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          <Trash2 size={13} className="inline mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>

      {/* Modals */}
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={selectedUser}
        onSave={handleEditSave}
      />
      <AddUserModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddUser}
      />
    </div>
  );
}

export default UserManagement;
