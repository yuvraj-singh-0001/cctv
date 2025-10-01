import React, { useEffect, useState } from "react";
import { Building2, Search } from "lucide-react";
import EditSupplierModal from "../masters/EditSupplierModal"; // <-- Import new modal

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
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setSuppliers(data.suppliers || []);
        } else {
          setSuppliers([]);
        }
      } catch {
        setSuppliers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  // search filter logic
  const filteredSuppliers = suppliers.filter((s) => {
    const name = s.name?.toLowerCase() || "";
    const contact = s.contactPerson?.toLowerCase() || "";
    const phone = s.phone?.toLowerCase() || "";
    const email = s.email?.toLowerCase() || "";
    const gst = s.gstNumber?.toLowerCase() || "";
    const pan = s.panNumber?.toLowerCase() || "";

    const term = searchTerm.toLowerCase();

    return (
      name.startsWith(term) ||
      contact.startsWith(term) ||
      phone.startsWith(term) ||
      email.startsWith(term) ||
      gst.startsWith(term) ||
      pan.startsWith(term)
    );
  });

  const handleEdit = (supplier) => {
    setEditSupplier(supplier);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?"))
      return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/master/supplier/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        setSuppliers(suppliers.filter((s) => s._id !== id));
      }
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
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Building2 size={28} style={{ color: "rgb(7,72,94)" }} />
        <h1 className="text-2xl font-bold" style={{ color: "rgb(7,72,94)" }}>
          Supplier List
        </h1>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 mb-6">
        <Search size={20} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-600"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading suppliers...
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No suppliers found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr style={{ backgroundColor: "#CDE1E6" }}>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Name
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Contact Person
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Phone
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Email
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  GST
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  PAN
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Status
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: "rgb(7,72,94)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((s) => (
                <tr key={s.supplierId || s._id} className="border-b">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3">{s.contactPerson}</td>
                  <td className="px-4 py-3">{s.phone}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.gstNumber}</td>
                  <td className="px-4 py-3">{s.panNumber}</td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3 flex gap-2">
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
