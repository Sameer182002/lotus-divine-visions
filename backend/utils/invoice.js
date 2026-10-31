import PDFDocument from "pdfkit";

/**
 * Generate a PDF invoice Buffer for a given Booking
 * @param {Object} booking
 * @returns {Promise<Buffer>}
 */
export function generateInvoicePdf(booking) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        info: {
          Title: `Tax Invoice - ${booking.bookingId}`,
          Author: "Hotel Lotus Divine, Amritsar",
          Subject: "Booking Invoice & Receipt",
        },
      });

      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      const primaryColor = "#1F160F"; // Deep Brown / Charcoal
      const goldColor = "#C19B6C"; // Lotus Divine Gold
      const taupeColor = "#6E655F"; // Subtitle Taupe
      const borderColor = "#E5DFD5"; // Light Divider
      const lightBg = "#FAF8F5"; // Card Light Background

      // ─── HEADER BAR ──────────────────────────────────────────
      doc.rect(40, 40, 515, 6).fill(goldColor);

      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor(primaryColor)
        .text("HOTEL LOTUS DIVINE", 40, 60, { characterSpacing: 1.5 });

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(taupeColor)
        .text("1804, Katra Ahluwalia, Amritsar Cantt, Punjab 143001 (Near Golden Temple)", 40, 84)
        .text("Front Desk: +91 84379 66966  |  Email: bookings@lotusdivinehotel.com", 40, 97);

      // Invoice Eyebrow / Label (Right Aligned)
      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .fillColor(goldColor)
        .text("TAX INVOICE", 380, 60, { width: 175, align: "right" });

      const invoiceNum = `INV-${booking.bookingId.replace(/[^a-zA-Z0-9]/g, "")}`;
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(taupeColor)
        .text(`Invoice No: ${invoiceNum}`, 380, 84, { width: 175, align: "right" })
        .text(
          `Date: ${new Date(booking.createdAt || Date.now()).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}`,
          380,
          97,
          { width: 175, align: "right" },
        );

      doc.moveTo(40, 118).lineTo(555, 118).strokeColor(borderColor).lineWidth(1).stroke();

      // ─── 2-COLUMN INFO BOX: GUEST DETAILS & RESERVATION DETAILS ─
      const boxY = 130;
      const boxHeight = 110;

      // Guest Details Box (Left)
      doc.roundedRect(40, boxY, 250, boxHeight, 4).fillAndStroke(lightBg, borderColor);
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(goldColor)
        .text("BILLED TO / GUEST DETAILS", 52, boxY + 12);

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor(primaryColor)
        .text(booking.guestName || "Guest", 52, boxY + 28);

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(taupeColor)
        .text(`Phone: ${booking.guestPhone || "N/A"}`, 52, boxY + 45)
        .text(`Email: ${booking.guestEmail || "N/A"}`, 52, boxY + 58)
        .text(
          `Total Guests: ${Array.isArray(booking.rooms) ? booking.rooms.reduce((s, r) => s + (r.guests || 1), 0) : 1}`,
          52,
          boxY + 71,
        );

      // Reservation Details Box (Right)
      doc.roundedRect(305, boxY, 250, boxHeight, 4).fillAndStroke(lightBg, borderColor);
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(goldColor)
        .text("STAY & PAYMENT SUMMARY", 317, boxY + 12);

      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      const nights = Math.max(
        1,
        Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000),
      );

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(taupeColor)
        .text(`Booking ID:`, 317, boxY + 28)
        .font("Helvetica-Bold")
        .fillColor(primaryColor)
        .text(booking.bookingId, 390, boxY + 28);

      doc
        .font("Helvetica")
        .fillColor(taupeColor)
        .text(`Check-In:`, 317, boxY + 43)
        .text(`${booking.checkIn} (from 12:00 PM)`, 390, boxY + 43);

      doc
        .text(`Check-Out:`, 317, boxY + 58)
        .text(`${booking.checkOut} (until 11:00 AM)`, 390, boxY + 58);

      doc
        .text(`Duration:`, 317, boxY + 73)
        .text(`${nights} Night${nights !== 1 ? "s" : ""}`, 390, boxY + 73);

      doc
        .text(`Payment:`, 317, boxY + 88)
        .font("Helvetica-Bold")
        .fillColor(booking.paymentStatus === "Paid" ? "#15803D" : goldColor)
        .text(
          `${booking.paymentStatus === "Paid" ? "PAID" : "PENDING"} (${booking.paymentMethod || "PayU"})`,
          390,
          boxY + 88,
        );

      // ─── ITEMIZED TABLE ──────────────────────────────────────
      const tableY = 260;
      doc.rect(40, tableY, 515, 24).fill(primaryColor);

      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#FFFFFF")
        .text("ITEM / ROOM DESCRIPTION", 50, tableY + 7)
        .text("QTY / GUESTS", 280, tableY + 7, { width: 70, align: "center" })
        .text("NIGHTS", 360, tableY + 7, { width: 50, align: "center" })
        .text("AMOUNT (INR)", 440, tableY + 7, { width: 105, align: "right" });

      let currentY = tableY + 24;

      // Calculate room rows
      const rooms = Array.isArray(booking.rooms) && booking.rooms.length > 0 ? booking.rooms : [{ roomId: "deluxe-room", guests: 2 }];
      const subtotalWithoutGst = Math.round(booking.total / 1.18);
      const gstAmount = booking.total - subtotalWithoutGst;

      rooms.forEach((r, idx) => {
        const rowBg = idx % 2 === 0 ? "#FFFFFF" : lightBg;
        doc.rect(40, currentY, 515, 28).fill(rowBg);

        const roomTitle =
          r.roomId && r.roomId.includes("family")
            ? "Family Suite — Premium Golden Temple View"
            : r.roomId && r.roomId.includes("super")
              ? "Super Deluxe Room — Luxury Amenities"
              : "Deluxe Room — King Bed & Ensuite Bath";

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor(primaryColor)
          .text(roomTitle, 50, currentY + 9);

        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor(taupeColor)
          .text(`1 Room (${r.guests} Guests)`, 280, currentY + 9, { width: 70, align: "center" })
          .text(String(nights), 360, currentY + 9, { width: 50, align: "center" })
          .fillColor(primaryColor)
          .text(`₹${Math.round(subtotalWithoutGst / rooms.length).toLocaleString("en-IN")}`, 440, currentY + 9, {
            width: 105,
            align: "right",
          });

        currentY += 28;
      });

      doc.moveTo(40, currentY).lineTo(555, currentY).strokeColor(borderColor).lineWidth(1).stroke();
      currentY += 10;

      // ─── TOTALS BREAKDOWN (RIGHT ALIGNED) ─────────────────────
      const totalsX = 330;
      const valX = 440;
      const valWidth = 105;

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(taupeColor)
        .text("Room Subtotal:", totalsX, currentY)
        .fillColor(primaryColor)
        .text(`₹${subtotalWithoutGst.toLocaleString("en-IN")}`, valX, currentY, { width: valWidth, align: "right" });

      currentY += 16;
      const cgst = Math.round(gstAmount / 2);
      const sgst = gstAmount - cgst;

      doc
        .font("Helvetica")
        .fillColor(taupeColor)
        .text("CGST (9.0%):", totalsX, currentY)
        .fillColor(primaryColor)
        .text(`₹${cgst.toLocaleString("en-IN")}`, valX, currentY, { width: valWidth, align: "right" });

      currentY += 16;
      doc
        .font("Helvetica")
        .fillColor(taupeColor)
        .text("SGST (9.0%):", totalsX, currentY)
        .fillColor(primaryColor)
        .text(`₹${sgst.toLocaleString("en-IN")}`, valX, currentY, { width: valWidth, align: "right" });

      currentY += 18;
      doc.rect(totalsX - 10, currentY, 235, 30).fill(lightBg);
      doc.rect(totalsX - 10, currentY, 235, 30).strokeColor(goldColor).lineWidth(1).stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(primaryColor)
        .text("GRAND TOTAL PAID:", totalsX, currentY + 9)
        .fontSize(12)
        .fillColor(goldColor)
        .text(`₹${booking.total.toLocaleString("en-IN")}`, valX, currentY + 8, { width: valWidth, align: "right" });

      currentY += 45;

      // ─── TRANSACTION DETAILS ─────────────────────────────────
      if (booking.payuTxnId || booking.payuMihpayid) {
        doc.roundedRect(40, currentY, 515, 32, 4).fillAndStroke(lightBg, borderColor);
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(goldColor)
          .text("PAYMENT GATEWAY REFERENCE", 50, currentY + 6);

        const refText = [
          booking.payuTxnId ? `PayU Txn ID: ${booking.payuTxnId}` : "",
          booking.payuMihpayid ? `Payment Ref: ${booking.payuMihpayid}` : "",
          booking.payuMode ? `Mode: ${booking.payuMode}` : "",
          `Status: SUCCESS`,
        ]
          .filter(Boolean)
          .join("  |  ");

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(taupeColor)
          .text(refText, 50, currentY + 18);

        currentY += 45;
      }

      // ─── FOOTER TERMS & CONDITIONS ────────────────────────────
      const footerY = 680;
      doc.moveTo(40, footerY).lineTo(555, footerY).strokeColor(borderColor).lineWidth(1).stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(goldColor)
        .text("HOTEL POLICIES & IMPORTANT INFORMATION", 40, footerY + 8);

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor(taupeColor)
        .text(
          "• Check-in: 12:00 PM  |  Check-out: 11:00 AM. Early check-in or late check-out is subject to room availability.",
          40,
          footerY + 20,
        )
        .text(
          "• Government-approved photo ID (Aadhaar, Passport, Voter ID, Driving License) is mandatory for all adult guests.",
          40,
          footerY + 30,
        )
        .text(
          "• Free luggage storage is available at the front desk before check-in and after check-out.",
          40,
          footerY + 40,
        )
        .text(
          "• This is a computer-generated tax invoice. No physical signature is required.",
          40,
          footerY + 50,
        );

      doc
        .font("Helvetica-Oblique")
        .fontSize(8)
        .fillColor(goldColor)
        .text("Thank you for choosing Hotel Lotus Divine — We look forward to your visit!", 40, footerY + 68, {
          align: "center",
          width: 515,
        });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
