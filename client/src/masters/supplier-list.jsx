import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API_BASE_URL from "../components/apiconfig/api-config";
import {
  Building2,
  Search,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import EditSupplierModal from "../masters/EditSupplierModal";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editSupplier, setEditSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/master/supplier/get-supplier`,
        { credentials: "include" }
      );
      const data = await res.json();
      setSuppliers(res.ok ? data.suppliers || [] : []);
    } catch {
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      s.contactPerson?.toLowerCase().includes(term) ||
      s.phone?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.gstNumber?.toLowerCase().includes(term) ||
      s.panNumber?.toLowerCase().includes(term)
    );
  });

  const handleEdit = (supplier) => setEditSupplier(supplier);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/master/supplier/delete/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (res.ok) setSuppliers(suppliers.filter((s) => s._id !== id));
    } catch {}
  };

  const handleUpdate = (updatedSupplier) => {
    setSuppliers(
      suppliers.map((s) =>
        s._id === updatedSupplier._id ? updatedSupplier : s
      )
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-gray-200 border-t-4 rounded-full animate-spin mx-auto"
            style={{ borderTopColor: "rgb(7,72,94)" }}
          ></div>
          <p className="mt-4" style={{ color: "rgb(7,72,94)" }}>
            Loading suppliers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header and Search Section in Single Row */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
      >
        <p className="text-gray-700 font-medium">Manage all your suppliers</p>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search
              size={20}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search suppliers by name, contact, phone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
              style={{ "--tw-ring-color": "rgb(7,72,94)" }}
            />
          </div>
          
          <button
            onClick={fetchSuppliers}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
            style={{ backgroundColor: "rgb(7,72,94)", color: "white" }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* No Results */}
      {filteredSuppliers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div
            className="px-6 py-4 border-b"
            style={{ backgroundColor: "#CDE1E6" }}
          >
            <h2
              className="text-lg font-semibold"
              style={{ color: "rgb(7,72,94)" }}
            >
              Supplier Results
            </h2>
          </div>
          <div className="p-12 text-center text-gray-500">
            No suppliers found.
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div
            className="px-6 py-4 border-b"
            style={{ backgroundColor: "#CDE1E6" }}
          >
            <h2
              className="text-lg font-semibold"
              style={{ color: "rgb(7,72,94)" }}
            >
              Supplier List ({filteredSuppliers.length})
            </h2>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-1 gap-4 p-4">
              {filteredSuppliers.map((s) => (
                <div
                  key={s._id}
                  className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {s.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        s.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Contact:</span>{" "}
                      {s.contactPerson}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {s.phone}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      <span className="break-words">{s.email}</span>
                    </p>
                    <p>
                      <span className="font-medium">GST:</span>{" "}
                      {s.gstNumber || "—"}
                    </p>
                    <p>
                      <span className="font-medium">PAN:</span>{" "}
                      {s.panNumber || "—"}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="px-3 py-2 bg-[#07485E] hover:bg-[#063646] text-white rounded text-xs flex-1 transition-colors duration-150"
                      onClick={() => handleEdit(s)}
                    >
                      <Edit size={14} className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      className="px-3 py-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white rounded text-xs flex-1 transition-colors duration-150"
                      onClick={() => handleDelete(s._id)}
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
                  {[
                    "Name",
                    "Contact Person",
                    "Phone",
                    "Email",
                    "GST",
                    "PAN",
                    "Status",
                    "Actions",
                  ].map((col) => (
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
                {filteredSuppliers.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-sm font-medium text-gray-900">
                      {s.name}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      {s.contactPerson}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      {s.phone}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 truncate max-w-56">
                      {s.email}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      {s.gstNumber}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      {s.panNumber}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          s.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 flex gap-2">
                      <button
                        className="px-2 py-1 bg-[#07485E] hover:bg-[#163646] text-white rounded text-xs transition-colors duration-150"
                        onClick={() => handleEdit(s)}
                      >
                        <Edit size={14} className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-[#DC2626] hover:bg-[#f91c1c] text-white rounded text-xs transition-colors duration-150"
                        onClick={() => handleDelete(s._id)}
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
        </div>
      )}

      {/* Edit Modal */}
      {editSupplier && (
        <EditSupplierModal
          supplier={editSupplier}
          onClose={() => setEditSupplier(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default SupplierList;