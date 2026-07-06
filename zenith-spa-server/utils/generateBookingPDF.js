import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "uploads", "confirmations");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const drawSectionTitle = (doc, title) => {
  doc
    .moveDown()
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("#1e3a5f")
    .text(title);

  doc
    .moveTo(50, doc.y + 3)
    .lineTo(545, doc.y + 3)
    .strokeColor("#d4af37")
    .stroke();

  doc.moveDown();
};

const row = (doc, label, value) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#111827")
    .text(`${label}:`, {
      continued: true,
    });

  doc
    .font("Helvetica")
    .fillColor("#444")
    .text(` ${value || "-"}`);

  doc.moveDown(0.5);
};

export const generateBookingPDF = async (booking) => {
  const filename = `${booking.bookingReference}.pdf`;

  const filepath = path.join(OUTPUT_DIR, filename);

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  const stream = fs.createWriteStream(filepath);

  doc.pipe(stream);

  /*
  =====================================================
  HEADER
  =====================================================
  */

  doc
    .font("Helvetica-Bold")
    .fontSize(26)
    .fillColor("#1e3a5f")
    .text("ZENITH SPA", {
      align: "center",
    });

  doc.moveDown(0.3);

  doc
    .font("Helvetica")
    .fontSize(15)
    .fillColor("#666")
    .text("Luxury Mobile Spa Experience", {
      align: "center",
    });

  doc.moveDown();

  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor("#d4af37")
    .lineWidth(2)
    .stroke();

  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor("#1e3a5f")
    .text("BOOKING CONFIRMATION", {
      align: "center",
    });

  drawSectionTitle(doc, "Booking Information");

  row(doc, "Booking Reference", booking.bookingReference);
  row(doc, "Booking Status", booking.bookingStatus);
  row(doc, "Payment Status", booking.paymentStatus);

  drawSectionTitle(doc, "Customer");

  row(doc, "Name", booking.customerName);
  row(doc, "Email", booking.email);
  row(doc, "Phone", booking.phone);
  row(doc, "Address", booking.address);

  drawSectionTitle(doc, "Appointment");

  row(doc, "Therapist", booking.therapist?.name);
  row(doc, "Specialization", booking.therapist?.specialization);
  row(doc, "Service", booking.service?.name);
  row(doc, "Date", formatDate(booking.bookingDate));
  row(doc, "Time", booking.time);
  row(doc, "Amount", `$${booking.totalAmount}`);

  drawSectionTitle(doc, "Payment");

  row(doc, "Method", booking.paymentMethod?.name);

  /*
  =====================================================
  QR CODE
  =====================================================
  */

  const trackingUrl = `${process.env.CLIENT_URL}/track-booking?reference=${booking.bookingReference}`;

  const qrImage = await QRCode.toDataURL(trackingUrl);

  const qrBuffer = Buffer.from(
    qrImage.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );

  doc.moveDown();

  doc.image(qrBuffer, 210, doc.y, {
    width: 140,
  });

  doc.moveDown(8);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#555")
    .text("Scan this QR Code to track your booking.", {
      align: "center",
    });

  doc.moveDown(2);

  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor("#d4af37")
    .stroke();

  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#1e3a5f")
    .text("Thank you for choosing Zenith Spa.", {
      align: "center",
    });

  doc.moveDown(0.5);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#666")
    .text(
      "For enquiries, rescheduling or assistance, please contact our support team.",
      {
        align: "center",
      }
    );

  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#1e3a5f")
    .text("www.zenithspa.com", {
      align: "center",
    });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      resolve({
        filename,
        filepath,
        relativePath: `/uploads/confirmations/${filename}`,
      });
    });

    stream.on("error", reject);
  });
};