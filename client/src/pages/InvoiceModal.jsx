import React, { useEffect, useRef, useState } from "react";
import { Download, Printer, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoiceModal = ({ selectedOrder, onClose, onPrint, isLoading = false }) => {
  const modalRef = useRef();
  const invoiceRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => e.keyCode === 27 && onClose();
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const formatCurrency = (a) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(a || 0);

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price || 0);
    const qty = parseFloat(item.quantity || 0);
    const itemTaxPercent = item.tax_percentage || selectedOrder.tax || 0;
    const itemDiscountPercent = item.discount_percentage || selectedOrder.discount || 0;

    const baseAmount = price * qty;
    const discountAmount = (baseAmount * itemDiscountPercent) / 100;
    const amountAfterDiscount = baseAmount - discountAmount;
    const taxAmount = (amountAfterDiscount * itemTaxPercent) / 100;
    const finalTotal = amountAfterDiscount + taxAmount;

    return {
      baseAmount: parseFloat(baseAmount.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      finalTotal: parseFloat(finalTotal.toFixed(2)),
      itemTaxPercent,
      itemDiscountPercent,
      unitPrice: price
    };
  };

  const calculateTotals = () => {
    if (!selectedOrder?.items?.length)
      return { subtotal: 0, discountTotal: 0, taxTotal: 0, grandTotal: 0, totalItems: 0 };

    let subtotal = 0, discountTotal = 0, taxTotal = 0, grandTotal = 0;

    selectedOrder.items.forEach((item) => {
      const calc = calculateItemTotal(item);
      subtotal += calc.baseAmount;
      discountTotal += calc.discountAmount;
      taxTotal += calc.taxAmount;
      grandTotal += calc.finalTotal;
    });

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountTotal: parseFloat(discountTotal.toFixed(2)),
      taxTotal: parseFloat(taxTotal.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      totalItems: selectedOrder.items.reduce((a, i) => a + (parseFloat(i.quantity) || 0), 0),
    };
  };

  if (!selectedOrder) return null;
  const totals = calculateTotals();

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return alert("Invoice not found!");
    setIsGeneratingPDF(true);

    try {
      const invoiceClone = invoiceRef.current.cloneNode(true);
      invoiceClone.style.width = "210mm";
      invoiceClone.style.minHeight = "297mm";
      invoiceClone.style.padding = "15mm";
      invoiceClone.style.fontSize = "12px";
      invoiceClone.style.background = "#ffffff";
      invoiceClone.style.position = "absolute";
      invoiceClone.style.left = "-9999px";
      invoiceClone.style.top = "0";

      document.body.appendChild(invoiceClone);

      const canvas = await html2canvas(invoiceClone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight, undefined, "FAST");
      pdf.save(`Invoice-${selectedOrder?.order_number || "Draft"}.pdf`);
      document.body.removeChild(invoiceClone);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("PDF generation failed. Please try again.");
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
          className="bg-white rounded-2xl w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col"
          style={{ maxHeight: '90vh' }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <FileText size={26} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Tax Invoice</h2>
                <p className="text-blue-100 text-sm">
                  Order # {selectedOrder.order_number || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 disabled:opacity-50 text-sm"
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
                className="flex items-center gap-2 px-3 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all font-semibold text-sm"
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
          <div className="overflow-y-auto p-2 sm:p-4 bg-gray-50" ref={invoiceRef}>
            {isLoading ? (
              <div className="flex items-center justify-center p-16">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6 space-y-4 print:p-0 print:shadow-none print:border-none">

                {/* Company Header */}
                <div className="text-center mb-4 print:mb-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-blue-700 print:text-xl">
                    CCTV Management Service
                  </h1>
                  <p className="text-gray-500 text-xs sm:text-sm print:text-xs">
                    B-30, Sector 72, Noida, UP | GSTIN: 27AABCU9603R1ZX
                  </p>
                </div>

                {/* Customer & Company Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm print:text-xs">
                  <div className="border border-gray-200 p-2 rounded-lg">
                    <h3 className="font-bold mb-1 border-b pb-1 text-sm print:text-xs">Bill To:</h3>
                    <p className="font-semibold">{selectedOrder.customer_name || "Customer"}</p>
                    <p>{selectedOrder.customer_email}</p>
                    <p>{selectedOrder.customer_phone}</p>
                    <p className="text-xs text-gray-600">{selectedOrder.customer_address}</p>
                  </div>
                  <div className="border border-gray-200 p-2 rounded-lg">
                    <h3 className="font-bold mb-1 border-b pb-1 text-sm print:text-xs">Company Details:</h3>
                    <p>CCTV Management Service</p>
                    <p>singhyuvraj8420@gmail.com</p>
                    <p>+91 86013 00910</p>
                    <p className="text-xs text-gray-600">PAN: AABCU9603R</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm border border-gray-200 print:text-xs">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300">
                        <th className="p-1 sm:p-2 text-left">#</th>
                        <th className="p-1 sm:p-2 text-left">Product</th>
                        <th className="p-1 sm:p-2 text-right">Qty</th>
                        <th className="p-1 sm:p-2 text-right">Unit ₹</th>
                        <th className="p-1 sm:p-2 text-right">Total ₹</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items?.length ? (
                        selectedOrder.items.map((item, idx) => {
                          const calc = calculateItemTotal(item);
                          return (
                            <tr key={idx} className="hover:bg-gray-50 text-xs sm:text-sm">
                              <td className="p-1 sm:p-2">{idx + 1}</td>
                              <td className="p-1 sm:p-2 font-semibold">{item.product?.product_name || "Product"}</td>
                              <td className="p-1 sm:p-2 text-right">{item.quantity}</td>
                              <td className="p-1 sm:p-2 text-right">{formatCurrency(calc.unitPrice)}</td>
                              <td className="p-1 sm:p-2 text-right font-semibold text-blue-700">{formatCurrency(calc.finalTotal)}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-gray-500">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div className="border border-gray-200 p-2 rounded-lg">
                    <h3 className="font-semibold mb-1 border-b pb-1">Payment Terms</h3>
                    <p className="text-gray-600">• Payment due within 15 days</p>
                    <p className="text-gray-600">• Late fee of 1.5% per month</p>
                  </div>
                  <div className="border border-gray-200 p-2 rounded-lg">
                    <h4 className="font-bold mb-1 border-b pb-1">Invoice Summary</h4>
                    <div className="space-y-1 text-right">
                      <div className="flex justify-between"><span>Subtotal:</span> <span>{formatCurrency(totals.subtotal)}</span></div>
                      <div className="flex justify-between"><span>Discount:</span> <span className="text-red-600">-{formatCurrency(totals.discountTotal)}</span></div>
                      <div className="flex justify-between"><span>Tax:</span> <span className="text-green-600">+{formatCurrency(totals.taxTotal)}</span></div>
                      <div className="flex justify-between border-t pt-1 font-bold text-blue-700"> <span>Grand Total:</span> <span>{formatCurrency(totals.grandTotal)}</span></div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-600 border-t pt-3 mt-2 print:pt-2 print:mt-2">
                  <p className="font-semibold text-gray-800">Thank you for your business!</p>
                  <p>support@CCTVManagement.in</p>
                  <p className="text-gray-400 mt-1 text-[10px]">This invoice is computer-generated and does not require a signature.</p>
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
