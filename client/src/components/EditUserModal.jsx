import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
      setErrors({});
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      
      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      await onSave(user.id, updateData);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', email: '', password: '' });
      setErrors({});
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{backgroundColor: 'rgba(7,72,94,0.1)'}}>
                    <User size={20} style={{color: 'rgb(7,72,94)'}} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{color: 'rgb(7,72,94)'}}>
                      Edit User
                    </h2>
                    <p className="text-sm text-gray-500">Update user information</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                        errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                      }`}
                      style={{'--tw-ring-color': errors.name ? 'rgb(239, 68, 68)' : 'rgb(7,72,94)'}}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                      }`}
                      style={{'--tw-ring-color': errors.email ? 'rgb(239, 68, 68)' : 'rgb(7,72,94)'}}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'rgb(7,72,94)'}}>
                    New Password (Optional)
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                        errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                      }`}
                      style={{'--tw-ring-color': errors.password ? 'rgb(239, 68, 68)' : 'rgb(7,72,94)'}}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep the current password unchanged
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50"
                    style={{
                      backgroundColor: 'white',
                      color: 'rgb(7,72,94)',
                      border: '2px solid rgb(7,72,94)'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: 'rgb(7,72,94)',
                      color: 'white',
                      border: '2px solid rgb(7,72,94)'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditUserModal;
