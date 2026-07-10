import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// -----------------------------------------------------------------------------
// SMTP Transport
// -----------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS via STARTTLS
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// Verify SMTP connection once when the server starts
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Connection Failed");
    console.error(error);
  } else {
    console.log("✅ SMTP Server Ready");
  }
});

// -----------------------------------------------------------------------------
// Load HTML Template
// -----------------------------------------------------------------------------
const loadTemplate = () => {
  const templatePath = path.join(
    process.cwd(),
    "templates",
    "bookingConfirmationEmail.html"
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Email template not found: ${templatePath}`
    );
  }

  return fs.readFileSync(templatePath, "utf8");
};

// -----------------------------------------------------------------------------
// Replace Template Variables
// -----------------------------------------------------------------------------
const replace = (html, key, value) => {
  return html.replace(
    new RegExp(`{{${key}}}`, "g"),
    value ?? ""
  );
};

// -----------------------------------------------------------------------------
// Send Booking Confirmation Email
// -----------------------------------------------------------------------------
export const sendBookingConfirmationEmail = async ({
  booking,
  pdfPath,
}) => {
  try {
    console.log("\n========== SENDING EMAIL ==========");
    console.log("Customer:", booking.customerName);
    console.log("Email:", booking.email);
    console.log("Reference:", booking.bookingReference);

    let html = loadTemplate();

    const trackLink =
      `${process.env.CLIENT_URL}/track-booking?reference=${booking.bookingReference}`;

    const downloadLink =
      `${process.env.SERVER_URL}${pdfPath}`;

    html = replace(html, "customerName", booking.customerName);
    html = replace(html, "bookingReference", booking.bookingReference);
    html = replace(html, "bookingStatus", booking.bookingStatus);
    html = replace(html, "therapist", booking.therapist?.name);
    html = replace(html, "service", booking.service?.name);

    html = replace(
      html,
      "appointmentDate",
      booking.bookingDate
        ? new Date(booking.bookingDate).toLocaleDateString()
        : ""
    );

    html = replace(
      html,
      "appointmentTime",
      booking.time
    );

    html = replace(
      html,
      "amount",
      booking.totalAmount
    );

    html = replace(
      html,
      "trackLink",
      trackLink
    );

    html = replace(
      html,
      "downloadLink",
      downloadLink
    );

    const info = await transporter.sendMail({
      from: `"Zenith Spa" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: "Your Zenith Spa Appointment Has Been Confirmed",
      html,
    });

    console.log("✅ Email sent successfully");
    console.log("Message ID:", info.messageId);
    console.log("===============================\n");

    return info;
  } catch (error) {
    console.error("\n❌ EMAIL SEND FAILED");
    console.error(error);
    console.error("===============================\n");

    throw error;
  }
};