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

  // ✅ सही और Clear Calculation (Product-wise Tax & Discount)
  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price || 0);
    const qty = parseFloat(item.quantity || 0);
    
    // Product-specific tax और discount (अगर available हो)
    const itemTaxPercent = item.tax_percentage || selectedOrder.tax || 0;
    const itemDiscountPercent = item.discount_percentage || selectedOrder.discount || 0;

    // Base amount
    const baseAmount = price * qty;
    
    // Discount calculation
    const discountAmount = (baseAmount * itemDiscountPercent) / 100;
    const amountAfterDiscount = baseAmount - discountAmount;
    
    // Tax calculation (discounted amount पर)
    const taxAmount = (amountAfterDiscount * itemTaxPercent) / 100;
    
    // Final total
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

  // ✅ Totals calculation
  const calculateTotals = () => {
    if (!selectedOrder?.items?.length)
      return { 
        subtotal: 0, 
        discountTotal: 0, 
        taxTotal: 0, 
        grandTotal: 0, 
        totalItems: 0 
      };

    let subtotal = 0,
      discountTotal = 0,
      taxTotal = 0,
      grandTotal = 0;

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
      totalItems: selectedOrder.items.reduce(
        (a, i) => a + (parseFloat(i.quantity) || 0),
        0
      ),
    };
  };

  if (!selectedOrder) return null;
  const totals = calculateTotals();

  // ✅ Optimized PDF Download for A4
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return alert("Invoice not found!");
    setIsGeneratingPDF(true);

    try {
      // Create a clone for PDF generation
      const invoiceClone = invoiceRef.current.cloneNode(true);
      
      // Apply A4 specific styles
      invoiceClone.style.width = "210mm";
      invoiceClone.style.minHeight = "297mm";
      invoiceClone.style.padding = "15mm";
      invoiceClone.style.fontSize = "12px";
      invoiceClone.style.background = "#ffffff";
      invoiceClone.style.position = "absolute";
      invoiceClone.style.left = "-9999px";
      invoiceClone.style.top = "0";
      
      // Reduce padding and margins for PDF
      const elementsToReduce = invoiceClone.querySelectorAll('*');
      elementsToReduce.forEach(el => {
        const style = window.getComputedStyle(el);
        if (parseFloat(style.padding) > 16) {
          el.style.padding = '8px';
        }
        if (parseFloat(style.margin) > 16) {
          el.style.margin = '8px';
        }
      });

      // Reduce font sizes for PDF
      const largeTexts = invoiceClone.querySelectorAll('h1, h2, h3, h4');
      largeTexts.forEach(el => {
        const currentSize = window.getComputedStyle(el).fontSize;
        el.style.fontSize = `calc(${currentSize} * 0.8)`;
      });

      document.body.appendChild(invoiceClone);

      const canvas = await html2canvas(invoiceClone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: invoiceClone.scrollWidth,
        height: invoiceClone.scrollHeight,
        windowWidth: invoiceClone.scrollWidth,
        windowHeight: invoiceClone.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit A4
      const imgWidth = pageWidth - 20; // 10mm margin on each side
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
          className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col"
          style={{ maxHeight: '90vh' }}
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

          {/* Invoice Body - Optimized for A4 */}
          <div className="overflow-y-auto p-4 sm:p-6 bg-gray-50" ref={invoiceRef}>
            {isLoading ? (
              <div className="flex items-center justify-center p-16">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4 print:p-0 print:shadow-none print:border-none">
                
                {/* Company Header - Compact */}
                <div className="text-center mb-4 print:mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 print:text-2xl">
                    CCTV Management Service
                  </h1>
                  <p className="text-gray-500 text-sm print:text-xs">
                    B-30, Sector 72, Noida, UP | GSTIN: 27AABCU9603R1ZX
                  </p>
                </div>

                {/* Customer & Company Details - Compact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm print:text-xs">
                  <div className="border border-gray-200 p-3 rounded-lg">
                    <h3 className="font-bold mb-1 border-b pb-1 text-base print:text-sm">Bill To:</h3>
                    <p className="font-semibold">{selectedOrder.customer_name || "Customer"}</p>
                    <p>{selectedOrder.customer_email}</p>
                    <p>{selectedOrder.customer_phone}</p>
                    <p className="text-xs text-gray-600">{selectedOrder.customer_address}</p>
                  </div>
                  <div className="border border-gray-200 p-3 rounded-lg">
                    <h3 className="font-bold mb-1 border-b pb-1 text-base print:text-sm">Company Details:</h3>
                    <p>CCTV Management Service</p>
                    <p>singhyuvraj8420@gmail.com</p>
                    <p>+91 86013 00910</p>
                    <p className="text-xs text-gray-600">PAN: AABCU9603R</p>
                  </div>
                </div>

                {/* Items Table - Compact */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm border border-gray-200 print:text-xs">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300">
                        <th className="p-1 sm:p-2 text-left">#</th>
                        <th className="p-1 sm:p-2 text-left">Product Name</th>
                        <th className="p-1 sm:p-2 text-right">Qty</th>
                        <th className="p-1 sm:p-2 text-right">Unit ₹</th>
                        <th className="p-1 sm:p-2 text-right">Base Amt</th>
                        <th className="p-1 sm:p-2 text-right">Disc</th>
                        <th className="p-1 sm:p-2 text-right">Tax</th>
                        <th className="p-1 sm:p-2 text-right">Total ₹</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items?.length ? (
                        selectedOrder.items.map((item, idx) => {
                          const calc = calculateItemTotal(item);
                          return (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-1 sm:p-2">{idx + 1}</td>
                              <td className="p-1 sm:p-2">
                                <div>
                                  <div className="font-semibold text-xs">
                                    {item.product?.product_name || "Product"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {calc.itemDiscountPercent > 0 && `Disc: ${calc.itemDiscountPercent}%`}
                                    {calc.itemDiscountPercent > 0 && calc.itemTaxPercent > 0 && ' • '}
                                    {calc.itemTaxPercent > 0 && `Tax: ${calc.itemTaxPercent}%`}
                                  </div>
                                </div>
                              </td>
                              <td className="p-1 sm:p-2 text-right">{item.quantity}</td>
                              <td className="p-1 sm:p-2 text-right">{formatCurrency(calc.unitPrice)}</td>
                              <td className="p-1 sm:p-2 text-right">{formatCurrency(calc.baseAmount)}</td>
                              <td className="p-1 sm:p-2 text-right text-red-600">
                                -{formatCurrency(calc.discountAmount)}
                              </td>
                              <td className="p-1 sm:p-2 text-right text-green-600">
                                +{formatCurrency(calc.taxAmount)}
                              </td>
                              <td className="p-1 sm:p-2 text-right font-semibold text-blue-700">
                                {formatCurrency(calc.finalTotal)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-4 text-gray-500">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Compact Calculation Breakdown */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 print:p-2">
                  <h4 className="font-bold text-sm mb-2 text-blue-800 border-b border-blue-300 pb-1">
                    Calculation Breakdown
                  </h4>
                  <div className="space-y-2 text-xs">
                    {selectedOrder.items?.map((item, idx) => {
                      const calc = calculateItemTotal(item);
                      return (
                        <div key={idx} className="pb-2 border-b border-blue-200 last:border-0">
                          <div className="font-semibold text-blue-700 text-xs">
                            {idx + 1}. {item.product?.product_name || "Product"} (Qty: {item.quantity})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                            <div>Base: {formatCurrency(calc.unitPrice)} × {item.quantity} = {formatCurrency(calc.baseAmount)}</div>
                            {calc.itemDiscountPercent > 0 && (
                              <div>Disc: {formatCurrency(calc.baseAmount)} × {calc.itemDiscountPercent}% = -{formatCurrency(calc.discountAmount)}</div>
                            )}
                            {calc.itemTaxPercent > 0 && (
                              <div>Tax: {formatCurrency(calc.baseAmount - calc.discountAmount)} × {calc.itemTaxPercent}% = +{formatCurrency(calc.taxAmount)}</div>
                            )}
                            <div className="font-semibold">Total: {formatCurrency(calc.finalTotal)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary & Terms - Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm print:text-xs">
                  <div className="border border-gray-200 p-3 rounded-lg">
                    <h3 className="font-semibold mb-2 border-b pb-1 text-base print:text-sm">Payment Terms</h3>
                    <p className="text-gray-600">• Payment due within 15 days</p>
                    <p className="text-gray-600">• Late fee of 1.5% per month</p>
                  </div>
                  <div className="border border-gray-200 p-3 rounded-lg">
                    <h4 className="font-bold mb-2 border-b pb-1 text-base print:text-sm">Invoice Summary</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal ({totals.totalItems} items):</span>
                        <span>{formatCurrency(totals.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Discount:</span>
                        <span className="text-red-600">-{formatCurrency(totals.discountTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Tax:</span>
                        <span className="text-green-600">+{formatCurrency(totals.taxTotal)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-bold text-base print:text-sm">
                        <span>Grand Total:</span>
                        <span className="text-blue-700">{formatCurrency(totals.grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Footer */}
                <div className="text-center text-xs text-gray-600 border-t pt-3 mt-4 print:pt-2 print:mt-2">
                  <p className="font-semibold text-gray-800">Thank you for your business!</p>
                  <p>For queries: support@CCTVManagement.in</p>
                  <p className="text-gray-400 mt-1">
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