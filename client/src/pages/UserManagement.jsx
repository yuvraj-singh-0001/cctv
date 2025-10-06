// src/pages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, RefreshCw, Users, Plus, Search } from "lucide-react";
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
          u.id === id
            ? { ...u, name: updateData.name, email: updateData.email }
            : u
        )
      );
      setEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error editing user:", error);
      throw error;
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Failed to add user. Status: ${res.status}`
        );
      }

      await fetchUsers();
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen p-4 flex justify-center items-center"
      >
        <div className="flex items-center space-x-2">
          <RefreshCw
            className="animate-spin"
            size={28}
            style={{ color: "rgb(7,72,94)" }}
          />
          <span
            className="text-lg font-medium"
            style={{ color: "rgb(7,72,94)" }}
          >
            Loading users...
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Row - Title and Add User Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <h1
          className="text-2xl font-bold"
          style={{ color: "rgb(7,72,94)" }}
        >
          User Management
        </h1>
        
        <button
          onClick={() => setAddModalOpen(true)}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
          style={{ backgroundColor: "rgb(7,72,94)", color: "white" }}
        >
          <Plus size={18} />
          Add User
        </button>
      </motion.div>

      {/* Second Row - Description, Search and Refresh */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2"
      >
        <p className="text-gray-700 font-medium">Manage all your users</p>
        
        <div className="flex items-center gap-2">
          {/* Compact Search Bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm transition-colors"
              style={{ "--tw-ring-color": "rgb(7,72,94)" }}
            />
          </div>
          
          {/* Compact Filter Dropdown */}
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent transition-colors"
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
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg text-sm"
            style={{ backgroundColor: "rgb(7,72,94)", color: "white" }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Table Header */}
        <div
          className="px-6 py-4 border-b"
          style={{ backgroundColor: "#CDE1E6" }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: "rgb(7,72,94)" }}
          >
            User List ({filteredUsers.length})
          </h2>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              <div className="grid grid-cols-1 gap-4 p-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
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
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        <span className="break-words">{user.email}</span>
                      </p>
                      <p>
                        <span className="font-medium">ID:</span> #{user.id}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="px-3 py-2 bg-[#07485E] hover:bg-[#063646] text-white rounded text-xs flex-1 transition-colors duration-150"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit size={14} className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        className="px-3 py-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white rounded text-xs flex-1 transition-colors duration-150"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 size={14} className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {["ID", "Name", "Email", "Role", "Actions"].map((col) => (
                      <th
                        key={col}
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: "rgb(7,72,94)" }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-sm font-medium text-gray-900">
                        #{user.id}
                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-3 py-3">
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
                      <td className="px-3 py-3 flex gap-2">
                        <button
                          className="px-2 py-1 bg-[#07485E] hover:bg-[#163646] text-white rounded text-xs transition-colors duration-150"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit size={14} className="inline mr-1" />
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-[#DC2626] hover:bg-[#f91c1c] text-white rounded text-xs transition-colors duration-150"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={14} className="inline mr-1" />
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

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={editModalOpen}
        onClose={handleModalClose}
        user={selectedUser}
        onSave={handleEditSave}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={addModalOpen}
        onClose={handleAddModalClose}
        onSave={handleAddUser}
      />
    </div>
  );
}

export default UserManagement;