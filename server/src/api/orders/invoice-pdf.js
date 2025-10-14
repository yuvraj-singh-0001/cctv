const PDFDocument = require("pdfkit");
const SalesOrder = require("../../models/SalesOrder");

const generateInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await SalesOrder.findById(id).populate("items.product", "productName price");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order.order_number}.pdf`
    );

    // Create a PDF document
    const doc = new PDFDocument({ margin: 40 });

    // Stream PDF to response
    doc.pipe(res);

    // Company Info
    doc
      .fontSize(18)
      .fillColor("#07485E")
      .text("INVOICE", { align: "right" })
      .moveDown();

    doc
      .fontSize(14)
      .fillColor("black")
      .text("Your Company Name")
      .text("123 Business Street, City, India")
      .text("Phone: +91 9876543210")
      .text("Email: company@email.com")
      .moveDown(2);

    // Customer Info
    doc
      .fontSize(12)
      .fillColor("#07485E")
      .text("Bill To:", { underline: true })
      .moveDown(0.3)
      .fillColor("black")
      .text(`${order.customer_name}`)
      .text(`${order.customer_phone}`)
      .text(`${order.customer_email || ""}`)
      .text(`${order.customer_address}`)
      .moveDown();

    // Order Info
    doc
      .fontSize(12)
      .fillColor("#07485E")
      .text("Order Details", { underline: true })
      .moveDown(0.3)
      .fillColor("black")
      .text(`Order Number: ${order.order_number}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`)
      .text(`Payment Status: ${order.payment_status}`)
      .text(`Order Status: ${order.order_status}`)
      .moveDown(1);

    // Items Table Header
    doc
      .fontSize(12)
      .fillColor("#07485E")
      .text("Product", 50)
      .text("Qty", 250)
      .text("Price", 300)
      .text("Total", 400)
      .moveDown(0.5)
      .fillColor("black");

    // Items List
    order.items.forEach((item) => {
      doc
        .fontSize(11)
        .text(item.product?.productName || "N/A", 50)
        .text(item.quantity, 250)
        .text(`₹${item.price}`, 300)
        .text(`₹${item.total}`, 400)
        .moveDown(0.3);
    });

    doc.moveDown(1);
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();

    // Totals
    const y = doc.y + 10;
    doc
      .fontSize(12)
      .text("Subtotal:", 350, y)
      .text(`₹${order.subtotal}`, 450, y)
      .moveDown(0.3);

    if (order.tax > 0) {
      doc.text("Tax:", 350).text(`₹${order.tax}`, 450);
    }
    if (order.discount > 0) {
      doc.text("Discount:", 350).text(`₹${order.discount}`, 450);
    }

    doc
      .moveDown(0.3)
      .font("Helvetica-Bold")
      .text("Grand Total:", 350)
      .text(`₹${order.grand_total}`, 450)
      .font("Helvetica")
      .moveDown(2);

    // Footer
    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Thank you for your business!", { align: "center" })
      .moveDown(0.5)
      .text("This is a computer-generated invoice.", { align: "center" });

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error("Error generating invoice PDF:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice PDF.",
      error: err.message,
    });
  }
};

module.exports = { generateInvoicePDF };
