import React, { useEffect, useState } from "react";
import { Building2, User, Phone, Mail, MapPin, CreditCard, Landmark } from "lucide-react";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/master", {
          credentials: "include",
        });
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

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-6">
        <Building2 size={28} style={{ color: "rgb(7,72,94)" }} />
        <h1 className="text-2xl font-bold" style={{ color: "rgb(7,72,94)" }}>
          Supplier List
        </h1>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading suppliers...</div>
      ) : suppliers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No suppliers found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr style={{ backgroundColor: "#CDE1E6" }}>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: "rgb(7,72,94)" }}>Name</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: "rgb(7,72,94)" }}>Contact Person</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: "rgb(7,72,94)" }}>Phone</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: "rgb(7,72,94)" }}>Email</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: "rgb(7,72,94)" }}>GST</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: "rgb(7,72,94)" }}>PAN</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: "rgb(7,72,94)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.supplierId || s._id} className="border-b">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3">{s.contactPerson}</td>
                  <td className="px-4 py-3">{s.phone}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.gstNumber}</td>
                  <td className="px-4 py-3">{s.panNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SupplierList;