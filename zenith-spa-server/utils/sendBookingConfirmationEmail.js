import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const loadTemplate = () => {
  const templatePath = path.join(
    process.cwd(),
    "templates",
    "bookingConfirmationEmail.html"
  );

  return fs.readFileSync(templatePath, "utf8");
};

const replace = (html, key, value) => {
  return html.replace(
    new RegExp(`{{${key}}}`, "g"),
    value ?? ""
  );
};

export const sendBookingConfirmationEmail = async ({
  booking,
  pdfPath,
}) => {
  let html = loadTemplate();

  const trackLink =
    `${process.env.CLIENT_URL}/track-booking?reference=` +
    booking.bookingReference;

  const downloadLink =
    `${process.env.SERVER_URL}${pdfPath}`;

  html = replace(
    html,
    "customerName",
    booking.customerName
  );

  html = replace(
    html,
    "bookingReference",
    booking.bookingReference
  );

  html = replace(
    html,
    "bookingStatus",
    booking.bookingStatus
  );

  html = replace(
    html,
    "therapist",
    booking.therapist.name
  );

  html = replace(
    html,
    "service",
    booking.service.name
  );

  html = replace(
    html,
    "appointmentDate",
    new Date(
      booking.bookingDate
    ).toLocaleDateString()
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

  await transporter.sendMail({
    from: `"Zenith Spa" <${process.env.EMAIL_USER}>`,

    to: booking.email,

    subject:
      "Your Zenith Spa Appointment Has Been Confirmed",

    html,
  });

  console.log(
    "✅ Confirmation email sent."
  );
};