import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types';

export const generateInvoicePDF = (order: Order) => {
  const doc = new jsPDF();
  
  // Colors and styling constants
  const primaryColor = [20, 58, 42]; // #143A2A (Dark Green)
  const secondaryColor = [194, 142, 99]; // #C28E63 (Gold/Bronze)
  const textColor = [60, 60, 60];
  
  // Format Date Helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  // Header - Company Name
  doc.setFontSize(28);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("BIHAR BITE", 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("Premium Fox Nuts & Healthy Snacks", 14, 32);

  // Header - Invoice Label
  doc.setFontSize(20);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("TAX INVOICE", 140, 25, { align: "left" });

  // Order & Invoice Info
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  doc.text(`Invoice No: INV-${order.id.replace('ORD-', '')}`, 140, 35);
  doc.text(`Order ID: #${order.id}`, 140, 41);
  doc.text(`Invoice Date: ${formatDate(order.date)}`, 140, 47);
  if (order.time) {
    doc.text(`Order Time: ${order.time}`, 140, 53);
  }

  // Draw Line
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 60, 196, 60);

  // Billing & Shipping Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("BILLED TO / SHIPPED TO:", 14, 70);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  
  doc.setFont("helvetica", "bold");
  doc.text(order.customerName, 14, 77);
  doc.setFont("helvetica", "normal");
  
  // Split address into multiple lines if needed
  const addressLines = doc.splitTextToSize(order.shippingAddress, 80);
  doc.text(addressLines, 14, 83);
  
  let currentY = 83 + (addressLines.length * 5);
  doc.text(`Phone: ${order.customerMobile || 'N/A'}`, 14, currentY);
  doc.text(`Email: ${order.customerEmail}`, 14, currentY + 5);

  // Delivery Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("DELIVERY & PAYMENT INFO:", 110, 70);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  
  doc.text(`Payment Method: ${order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}`, 110, 77);
  doc.text(`Payment Status: ${order.paymentStatus || 'Pending'}`, 110, 83);
  
  if (order.deliveryStartDate && order.deliveryEndDate) {
    doc.text(`Delivery Method: Pan-India Standard (10-12 days)`, 110, 93);
    doc.setFont("helvetica", "bold");
    doc.text(`Est. Delivery: ${formatDate(order.deliveryStartDate)} - ${formatDate(order.deliveryEndDate)}`, 110, 99);
  }

  // Table
  const tableStartY = Math.max(currentY + 15, 110);
  
  const tableData = order.items.map((item, index) => [
    index + 1,
    item.name,
    item.weight,
    item.quantity.toString(),
    `Rs ${item.price.toFixed(2)}`,
    `Rs 0.00`, // Discount
    `Rs 0.00`, // Tax
    `Rs ${(item.price * item.quantity).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [['S.No.', 'Product Name', 'Variant', 'Qty', 'Unit Price', 'Discount', 'Tax', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: 50
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      3: { cellWidth: 12, halign: 'center' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right', fontStyle: 'bold' }
    }
  });

  // Summary calculations
  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY + 10;
  const subtotal = order.subtotal || order.total;
  const shipping = order.shippingCharge !== undefined ? order.shippingCharge : (order.total - subtotal);
  
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  
  doc.text("Subtotal:", 140, finalY);
  doc.text(`Rs ${subtotal.toFixed(2)}`, 196, finalY, { align: "right" });
  
  doc.text("Discount:", 140, finalY + 6);
  doc.text(`Rs 0.00`, 196, finalY + 6, { align: "right" });
  
  doc.text("Shipping & Handling:", 140, finalY + 12);
  doc.text(`Rs ${shipping.toFixed(2)}`, 196, finalY + 12, { align: "right" });
  
  doc.text("Tax:", 140, finalY + 18);
  doc.text(`Rs 0.00`, 196, finalY + 18, { align: "right" });

  doc.setDrawColor(200, 200, 200);
  doc.line(140, finalY + 22, 196, finalY + 22);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Grand Total:", 140, finalY + 30);
  doc.text(`Rs ${order.total.toFixed(2)}`, 196, finalY + 30, { align: "right" });

  // Footer / Company Info
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Thank you for choosing Bihar Bite.", 14, pageHeight - 35);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Bihar Bite (A division of premium regional snacks)", 14, pageHeight - 28);
  doc.text("Contact: support@biharbite.com | +91 9876543210", 14, pageHeight - 24);
  doc.text("Website: www.biharbite.com | Instagram: @biharbite", 14, pageHeight - 20);
  
  doc.setFont("helvetica", "italic");
  doc.text("This is a computer-generated invoice and does not require a physical signature.", 14, pageHeight - 12);

  // Save the PDF
  doc.save(`Bihar-Bite-Invoice-${order.id}.pdf`);
};
