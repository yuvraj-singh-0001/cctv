// src/pages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, RefreshCw, Users, Plus, Search } from "lucide-react";
import EditUserModal from "../components/EditUserModal";
import AddUserModal from "../components/AddUserModal";
import  API_BASE_URL  from "../components/apiconfig/api-config";


function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 👉 states for search & filter
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

  // 👉 Combine search + filter
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header Section */}
      <div className="mb-4 sm:mb-6 flex flex-row justify-between items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-bold truncate"
            style={{ color: "rgb(7,72,94)" }}
          >
            User Management Dashboard
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 sm:gap-3 shrink-0"
        >
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all hover:shadow-md flex items-center gap-2 text-sm sm:text-base"
            style={{
              backgroundColor: "rgb(7,72,94)",
              color: "white",
            }}
          >
            <Plus size={16} />
            Add User
          </button>
        </motion.div>
      </div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-col sm:flex-row gap-3"
      >
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="ml-2 outline-none text-sm flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center">
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm hover:shadow-md transition-all outline-none"
            style={{ color: "rgb(7,72,94)" }}
          >
            <option value="All">All Users</option>
            <option value="Admin">Admins</option>
            <option value="User">Users</option>
            <option value="Guest">Guests</option>
          </select>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Table Header */}
        <div
          className="px-4 sm:px-6 py-3 sm:py-4 border-b"
          style={{ backgroundColor: "#CDE1E6" }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Users size={20} style={{ color: "rgb(7,72,94)" }} />
              <h2
                className="text-base sm:text-lg font-semibold truncate"
                style={{ color: "rgba(40, 41, 41, 1)" }}
                title={`Users (${filteredUsers.length})`}
              >
                Users ({filteredUsers.length})
              </h2>
            </div>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-all hover:shadow-sm text-sm sm:text-[13px]"
              style={{
                backgroundColor: "white",
                color: "rgb(7,72,94)",
                border: "1.5px solid rgb(7,72,94)",
              }}
            >
              <RefreshCw size={16} />
              <span className="hidden xs:inline">Refresh</span>
            </button>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg mb-2">No users found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <>
            {/* Mobile/Tablet Card View */}
            <div className="block lg:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3"
                          style={{ backgroundColor: "rgb(7,72,94)" }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{user.name}</div>
                          <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors hover:opacity-90"
                          style={{ backgroundColor: "rgb(7,72,94)", color: "white" }}
                        >
                          <Edit size={12} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          <Trash2 size={12} className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: '14rem' }} />
                  <col style={{ width: '42%' }} />
                  <col style={{ width: '32%' }} />
                  <col style={{ width: '12rem' }} />
                </colgroup>
                <thead>
                  <tr
                    className="border-b"
                    style={{ backgroundColor: "rgb(7,72,94)" }}
                  >
                    <th className="px-3 py-3 pr-8 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 py-3 pl-8 pr-6 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider w-44">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => {
                    const variants = {
                      hidden: { opacity: 0, x: -20 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { delay: index * 0.05 },
                      },
                    };

                    return (
                      <motion.tr
                        key={user.id}
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ backgroundColor: "rgba(7,72,94,0.05)" }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-2 pr-8 text-sm font-medium text-gray-900 align-middle whitespace-nowrap">
                          #{user.id}
                        </td>
                        <td className="px-3 py-2 pl-8 pr-6 align-middle">
                          <div className="flex items-center min-w-0 gap-5">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div
                                className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                style={{ backgroundColor: "rgb(7,72,94)" }}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 whitespace-normal break-words" title={user.name}>
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500 lg:hidden truncate" title={user.email}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500 align-middle">
                          <div className="truncate max-w-[360px] xl:max-w-[520px]" title={user.email}>{user.email}</div>
                        </td>
                        <td className="px-3 py-2 text-sm font-medium align-middle">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleEditClick(user)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors hover:opacity-80"
                              style={{ backgroundColor: "rgb(7,72,94)", color: "white" }}
                            >
                              <Edit size={12} className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                              <Trash2 size={12} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
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
    </motion.div>
  );
}

export default UserManagement;
