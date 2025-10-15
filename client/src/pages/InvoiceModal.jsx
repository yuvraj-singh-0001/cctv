import React, { useEffect, useRef, useState } from "react";
import { Download, Printer, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoiceModal = ({ selectedOrder, onClose, onPrint, isLoading = false }) => {
  const modalRef = useRef();
  const invoiceRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // ESC close
  useEffect(() => {
    const handleEscape = (e) => e.keyCode === 27 && onClose();
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const formatCurrency = (a) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(a || 0);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  // ✅ Correct per-item calculation (discount & tax scale by quantity)
  const calculateItemTotal = (item, taxPercent, discountPercent) => {
    const price = parseFloat(item.price || 0);
    const qty = parseFloat(item.quantity || 0);

    const base = price * qty;
    const discountAmount = ((price * (discountPercent || 0)) / 100) * qty;
    const afterDiscount = base - discountAmount;
    const taxAmount = (afterDiscount * (taxPercent || 0)) / 100;
    const total = afterDiscount + taxAmount;

    return {
      base: parseFloat(base.toFixed(2)),
      disc: parseFloat(discountAmount.toFixed(2)),
      tax: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  };

  // ✅ Totals calculation (aggregated properly)
  const calculateTotals = () => {
    if (!selectedOrder?.items?.length)
      return { subtotal: 0, discountTotal: 0, taxTotal: 0, grandTotal: 0, totalItems: 0 };

    let subtotal = 0,
      discountTotal = 0,
      taxTotal = 0,
      grandTotal = 0;

    selectedOrder.items.forEach((item) => {
      const c = calculateItemTotal(item, selectedOrder.tax, selectedOrder.discount);
      subtotal += c.base;
      discountTotal += c.disc;
      taxTotal += c.tax;
      grandTotal += c.total;
    });

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountTotal: parseFloat(discountTotal.toFixed(2)),
      taxTotal: parseFloat(taxTotal.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      totalItems: selectedOrder.items.reduce(
        (a, i) => a + (parseFloat(i.quantity) || 0),
        0
      ),
    };
  };

  if (!selectedOrder) return null;
  const totals = calculateTotals();

  // ✅ PDF Download
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return alert("Invoice not found!");
    setIsGeneratingPDF(true);

    try {
      const invoiceClone = invoiceRef.current.cloneNode(true);
      invoiceClone.style.width = "210mm";
      invoiceClone.style.position = "absolute";
      invoiceClone.style.left = "-9999px";
      invoiceClone.style.top = "0";
      invoiceClone.style.background = "#ffffff";
      invoiceClone.style.padding = "0";
      document.body.appendChild(invoiceClone);

      const canvas = await html2canvas(invoiceClone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: invoiceClone.scrollWidth,
        windowHeight: invoiceClone.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let finalWidth = imgWidth;
      let finalHeight = imgHeight;

      if (finalHeight > pageHeight) {
        const scale = pageHeight / finalHeight;
        finalWidth = finalWidth * scale;
        finalHeight = finalHeight * scale;
      }

      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight, undefined, "FAST");
      pdf.save(`Invoice-${selectedOrder?.order_number || "Draft"}.pdf`);

      document.body.removeChild(invoiceClone);
    } catch (err) {
      console.error("PDF Generation Error:", err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col"
        >
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <div className="p-2 bg-white/20 rounded-xl">
                <FileText size={26} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Tax Invoice</h2>
                <p className="text-blue-100 text-sm">
                  Order # {selectedOrder.order_number || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 px-3 sm:px-5 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 disabled:opacity-50"
              >
                {isGeneratingPDF ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                {isGeneratingPDF ? "Generating..." : "PDF"}
              </button>
              <button
                onClick={onPrint}
                className="flex items-center gap-2 px-3 sm:px-5 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all font-semibold"
              >
                <Printer size={16} /> Print
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-transform hover:scale-110"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Invoice Body */}
          <div className="overflow-y-auto max-h-[85vh] p-6 bg-gray-50" ref={invoiceRef}>
            {isLoading ? (
              <div className="flex items-center justify-center p-16">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col min-h-[75vh]">
                {/* Company Name */}
                <div className="text-center mb-6">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700">
                    CCTV Management Service
                  </h1>
                  <p className="text-gray-500">B-30, Sector 72, Noida, UP</p>
                  <p className="text-gray-500">GSTIN: 27AABCU9603R1ZX</p>
                </div>

                {/* Unified Bordered Section */}
                <div className="bg-white rounded-xl shadow-md border border-gray-300 p-6 space-y-6">
                  {/* Bill To & Company Details */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-bold mb-2 text-lg border-b pb-1">Bill To:</h3>
                      <p className="font-semibold">{selectedOrder.customer_name || "Customer"}</p>
                      <p>{selectedOrder.customer_email}</p>
                      <p>{selectedOrder.customer_phone}</p>
                      <p>{selectedOrder.customer_address}</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2 text-lg border-b pb-1">Company Details:</h3>
                      <p>CCTV Management Service</p>
                      <p>singhyuvraj8420@gmail.com</p>
                      <p>+91 86013 00910</p>
                      <p>PAN: AABCU9603R</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm sm:text-base border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                          <th className="p-2 text-left">#</th>
                          <th className="p-2 text-left">Product Name</th>
                          <th className="p-2 text-right">Qty</th>
                          <th className="p-2 text-right">Unit ₹</th>
                          <th className="p-2 text-right">Discount ₹</th>
                          <th className="p-2 text-right">Tax ₹</th>
                          <th className="p-2 text-right">Total ₹</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedOrder.items?.length ? (
                          selectedOrder.items.map((item, idx) => {
                            const c = calculateItemTotal(
                              item,
                              selectedOrder.tax,
                              selectedOrder.discount
                            );
                            return (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="p-2">{idx + 1}</td>
                                <td className="p-2">
                                  {item.product?.product_name || "Product"}
                                </td>
                                <td className="p-2 text-right">{item.quantity}</td>
                                <td className="p-2 text-right">
                                  {formatCurrency(item.price)}
                                </td>
                                <td className="p-2 text-right text-red-600">
                                  -{formatCurrency(c.disc)}
                                </td>
                                <td className="p-2 text-right text-green-600">
                                  +{formatCurrency(c.tax)}
                                </td>
                                <td className="p-2 text-right font-semibold text-blue-700">
                                  {formatCurrency(c.total)}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-6 text-gray-500">
                              No items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Payment Terms & Invoice Summary */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 border-b pb-1">
                        Payment Terms
                      </h3>
                      <p className="text-gray-600 text-sm">• Payment due within 15 days</p>
                      <p className="text-gray-600 text-sm">
                        • Late fee of 1.5% per month applies
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold border-b pb-1 mb-2">
                        Invoice Summary
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span className="text-red-600">
                            -{formatCurrency(totals.discountTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span className="text-green-600">
                            +{formatCurrency(totals.taxTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-bold">
                          <span>Total:</span>
                          <span>{formatCurrency(totals.grandTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-2 py-40 text-center text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">
                    Thank you for your business!
                  </p>
                  <p>For queries: support@CCTV Management.in</p>
                  <p className="text-xs text-gray-400 mt-2">
                    This invoice is computer-generated and does not require a signature.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InvoiceModal;
