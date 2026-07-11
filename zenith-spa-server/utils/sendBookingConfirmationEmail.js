import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    throw new Error(`Email template not found: ${templatePath}`);
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

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: booking.email,
      subject: "Your Zenith Spa Appointment Has Been Confirmed",
      html,
    });

    console.log("✅ Email sent successfully");
    console.log(response);
    console.log("===============================\n");

    return response;
  } catch (error) {
    console.error("\n❌ EMAIL SEND FAILED");
    console.error(error);
    console.error("===============================\n");

    throw error;
  }
};