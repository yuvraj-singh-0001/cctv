import React, { useEffect, useState } from "react";
import { Building2, Search } from "lucide-react";
import EditSupplierModal from "../masters/EditSupplierModal";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editSupplier, setEditSupplier] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/master/supplier/get-supplier",
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
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      (s.name?.toLowerCase().startsWith(term) || "") ||
      (s.contactPerson?.toLowerCase().startsWith(term) || "") ||
      (s.phone?.toLowerCase().startsWith(term) || "") ||
      (s.email?.toLowerCase().startsWith(term) || "") ||
      (s.gstNumber?.toLowerCase().startsWith(term) || "") ||
      (s.panNumber?.toLowerCase().startsWith(term) || "")
    );
  });

  const handleEdit = (supplier) => setEditSupplier(supplier);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?"))
      return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/master/supplier/delete/${id}`,
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

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Building2 size={28} className="text-[rgb(7,72,94)]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(7,72,94)]">
            Supplier List
          </h1>
        </div>
        <p className="text-gray-600 mt-1 sm:mt-0">
          Total suppliers: {suppliers.length}
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(7,72,94)] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Loading / Empty States */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading suppliers...</div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No suppliers found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          {/* Desktop Table */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[rgb(205,225,230)]">
              <tr>
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
                    className="px-3 py-3 text-left text-sm font-semibold text-[rgb(7,72,94)]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuppliers.map((s) => (
                <tr key={s.supplierId || s._id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">{s.name}</td>
                  <td className="px-3 py-3">{s.contactPerson}</td>
                  <td className="px-3 py-3">{s.phone}</td>
                  <td className="px-3 py-3">{s.email}</td>
                  <td className="px-3 py-3">{s.gstNumber}</td>
                  <td className="px-3 py-3">{s.panNumber}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        s.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 flex gap-2 flex-wrap">
                    <button
                      className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile / Tablet Card View */}
          <div className="lg:hidden mt-4 divide-y divide-gray-200">
            {filteredSuppliers.map((s) => (
              <div key={s._id} className="p-4 bg-white rounded-lg shadow mb-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      s.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium">Contact:</span> {s.contactPerson}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {s.phone}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {s.email}
                  </p>
                  <p>
                    <span className="font-medium">GST:</span> {s.gstNumber}
                  </p>
                  <p>
                    <span className="font-medium">PAN:</span> {s.panNumber}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
