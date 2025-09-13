// src/pages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, RefreshCw, Users, Plus, Search, Filter } from "lucide-react";

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen p-4 flex justify-center items-center"
      >
        <div className="flex items-center space-x-2">
          <RefreshCw className="animate-spin" size={28} style={{ color: "rgb(7,72,94)" }} />
          <span className="text-lg font-medium" style={{ color: "rgb(7,72,94)" }}>
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
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl font-bold truncate" 
          style={{color: 'rgb(7,72,94)'}}
        >
          User Management Dashboard
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 sm:gap-3"
        >
          <button 
            className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all hover:shadow-md flex items-center gap-2 text-sm sm:text-base"
            style={{
              backgroundColor: 'rgb(7,72,94)',
              color: 'white'
            }}
          >
            <Plus size={16} />
            Add User
          </button>
          <button 
            onClick={fetchUsers}
            className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all hover:shadow-md flex items-center gap-2 text-sm sm:text-base"
            style={{
              backgroundColor: 'white',
              color: 'rgb(7,72,94)',
              border: '2px solid rgb(7,72,94)'
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </motion.div>
      </div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="ml-2 outline-none text-sm flex-1"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all" style={{color: 'rgb(7,72,94)'}}>
          <Filter size={16} />
          Filter
        </button>
      </motion.div>

      {/* Users Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center" style={{backgroundColor: '#CDE1E6'}}>
          <div className="flex items-center gap-2">
            <Users size={20} style={{color: 'rgb(7,72,94)'}} />
            <h2 className="text-lg font-semibold" style={{color: 'rgb(7,72,94)'}}>
              Users ({users.length})
            </h2>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg mb-2">No users found</p>
            <p className="text-gray-400 text-sm">Add your first user to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{backgroundColor: 'rgb(7,72,94)'}}>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => {
                  const variants = {
                    hidden: { opacity: 0, x: -20 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.05 }
                    }
                  };

                  return (
                    <motion.tr 
                      key={user.id}
                      variants={variants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ backgroundColor: 'rgba(7,72,94,0.05)' }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{user.id}
                      </td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{backgroundColor: 'rgb(7,72,94)'}}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 sm:hidden">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user.id, user.name, user.email)}
                            className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors hover:opacity-80"
                            style={{ backgroundColor: 'rgb(7,72,94)', color: 'white' }}
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
        )}
      </motion.div>
    </motion.div>
  );
}

export default UserManagement;
