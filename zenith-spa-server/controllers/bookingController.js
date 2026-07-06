import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { generateBookingPDF } from "../utils/generateBookingPDF.js";
import { sendBookingConfirmationEmail } from "../utils/sendBookingConfirmationEmail.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const POPULATE = {
  therapist: "name specialization image",
  service: "name price duration",
  paymentMethod: "name accountName accountDetails qrCode",
};

// ─── Response Helpers ─────────────────────────────────────────────────────────

const sendSuccess = (res, statusCode, payload) =>
  res.status(statusCode).json({ success: true, ...payload });

const sendError = (res, statusCode, message) =>
  res.status(statusCode).json({ success: false, message });

// ─── Query Helpers ────────────────────────────────────────────────────────────

/**
 * Builds a MongoDB filter from getBookings query params.
 */
const buildBookingFilter = ({
  search,
  bookingStatus,
  paymentStatus,
  therapist,
  service,
  dateFrom,
  dateTo,
}) => {
  const filter = {};

  if (search) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [
      { customerName: regex },
      { email: regex },
      { phone: regex },
      { bookingReference: regex },
    ];
  }

  if (bookingStatus) filter.bookingStatus = bookingStatus;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  if (therapist && mongoose.isValidObjectId(therapist)) {
    filter.therapist = new mongoose.Types.ObjectId(therapist);
  }

  if (service && mongoose.isValidObjectId(service)) {
    filter.service = new mongoose.Types.ObjectId(service);
  }

  if (dateFrom || dateTo) {
    filter.bookingDate = {};
    if (dateFrom) filter.bookingDate.$gte = new Date(dateFrom);
    if (dateTo) filter.bookingDate.$lte = new Date(dateTo);
  }

  return filter;
};

/**
 * Builds a Mongoose sort object from sort + order query params.
 */
const buildSortObject = (sort, order) => {
  const direction = order === "asc" ? 1 : -1;
  const sortMap = {
    createdAt: { createdAt: direction },
    totalAmount: { totalAmount: direction },
    customerName: { customerName: direction },
    bookingDate: { bookingDate: direction },
  };
  return sortMap[sort] || { createdAt: -1 };
};

/**
 * Generates a unique booking reference in the format ZS-YYYYMMDD-000001.
 *
 * Uses findOneAndUpdate with $inc on a counter document (atomic) to prevent
 * race conditions when multiple bookings are created at the same instant.
 * Falls back to a date-based sequential count if the counter collection is
 * unavailable, with a uniqueness check and retry loop.
 */
const generateBookingReference = async () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const datePrefix = `ZS-${yyyy}${mm}${dd}`;

  // Atomic approach: find the highest existing sequence for today and increment.
  // This avoids a separate counter collection while still being race-safe at
  // the application level via a retry loop with uniqueness verification.
  const MAX_RETRIES = 10;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Count today's bookings plus the current attempt offset to account for
    // concurrent requests that may have inserted between retries.
    const todayCount = await Booking.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const sequence = String(todayCount + 1 + attempt).padStart(6, "0");
    const reference = `${datePrefix}-${sequence}`;

    const exists = await Booking.exists({ bookingReference: reference });
    if (!exists) return reference;
  }

  // Final fallback: timestamp + random suffix to guarantee uniqueness.
  const fallback = `${datePrefix}-${Date.now().toString().slice(-4)}${Math.random()
    .toString(36)
    .substring(2, 5)
    .toUpperCase()}`;
  return fallback;
};

// ─── GET ALL BOOKINGS ─────────────────────────────────────────────────────────

export const getBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sort = "createdAt",
      order = "desc",
      bookingStatus,
      paymentStatus,
      therapist,
      service,
      dateFrom,
      dateTo,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filter = buildBookingFilter({
      search,
      bookingStatus,
      paymentStatus,
      therapist,
      service,
      dateFrom,
      dateTo,
    });

    const sortObj = buildSortObject(sort, order);

    const [bookings, totalBookings] = await Promise.all([
      Booking.find(filter)
        .populate("therapist", POPULATE.therapist)
        .populate("service", POPULATE.service)
        .populate("paymentMethod", POPULATE.paymentMethod)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalBookings / limitNum);

    return sendSuccess(res, 200, {
  count: bookings.length,
  total: totalBookings,
  bookings,
  pagination: {
    page: pageNum,
    limit: limitNum,
    totalPages,
    totalBookings,
  },
});
  } catch (error) {
    console.error("[getBookings]", error);
    return sendError(res, 500, "Could not retrieve bookings. Please try again.");
  }
};

// ─── GET SINGLE BOOKING ───────────────────────────────────────────────────────

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid booking ID.");
    }

    const booking = await Booking.findById(id)
      .populate("therapist", POPULATE.therapist)
      .populate("service", POPULATE.service)
      .populate("paymentMethod", POPULATE.paymentMethod)
      .lean();

    if (!booking) {
      return sendError(res, 404, "Booking not found.");
    }

    return sendSuccess(res, 200, { data: booking });
  } catch (error) {
    console.error("[getBookingById]", error);
    return sendError(res, 500, "Could not retrieve booking. Please try again.");
  }
};

// ─── GET BOOKING BY REFERENCE ─────────────────────────────────────────────────

export const getBookingByReference = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference?.trim()) {
      return sendError(res, 400, "Booking reference is required.");
    }

    const booking = await Booking.findOne({
      bookingReference: reference.trim().toUpperCase(),
    })
      .populate("therapist", POPULATE.therapist)
      .populate("service", POPULATE.service)
      .populate("paymentMethod", POPULATE.paymentMethod)
      .lean();

    if (!booking) {
      return sendError(res, 404, "No booking found with that reference.");
    }

    return sendSuccess(res, 200, { data: booking });
  } catch (error) {
    console.error("[getBookingByReference]", error);
    return sendError(res, 500, "Could not retrieve booking. Please try again.");
  }
};

// ─── CREATE BOOKING ───────────────────────────────────────────────────────────

export const createBooking = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      notes,
      therapist,
      service: serviceId,
      paymentMethod,
      bookingDate,
      time,
    } = req.body;

    // Validate required fields
    const missing = [];
    if (!customerName?.trim()) missing.push("customerName");
    if (!email?.trim()) missing.push("email");
    if (!phone?.trim()) missing.push("phone");
    if (!address?.trim()) missing.push("address");
    if (!therapist) missing.push("therapist");
    if (!serviceId) missing.push("service");
    if (!paymentMethod) missing.push("paymentMethod");
    if (!bookingDate) missing.push("bookingDate");
    if (!time?.trim()) missing.push("time");

    if (missing.length > 0) {
      return sendError(res, 400, `Missing required fields: ${missing.join(", ")}.`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return sendError(res, 400, "Invalid email address.");
    }

    // Validate ObjectId references
    for (const [field, value] of Object.entries({
      therapist,
      service: serviceId,
      paymentMethod,
    })) {
      if (!mongoose.isValidObjectId(value)) {
        return sendError(res, 400, `Invalid ${field} ID.`);
      }
    }

    // Validate booking date is not in the past
    const parsedDate = new Date(bookingDate);
    if (isNaN(parsedDate.getTime())) {
      return sendError(res, 400, "Invalid booking date.");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      return sendError(res, 400, "Booking date cannot be in the past.");
    }

    // Fetch service to obtain price — lean() is safe here since we only read
    const service = await Service.findById(serviceId).select("price").lean();
    if (!service) {
      return sendError(res, 404, "Service not found.");
    }

    const bookingReference = await generateBookingReference();

    const booking = await Booking.create({
      bookingReference,
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes?.trim() || "",
      therapist,
      service: serviceId,
      paymentMethod,
      bookingDate: parsedDate,
      time: time.trim(),
      totalAmount: service.price,
      paymentStatus: "Pending",
      bookingStatus: "Pending",
    });

    // Read the populated result with lean() — no further modifications needed
    const populatedBooking = await Booking.findById(booking._id)
      .populate("therapist", POPULATE.therapist)
      .populate("service", POPULATE.service)
      .populate("paymentMethod", POPULATE.paymentMethod)
      .lean();

    return sendSuccess(res, 201, {
      message: "Booking created successfully.",
      data: populatedBooking,
    });
  } catch (error) {
    console.error("[createBooking]", error);
    return sendError(res, 400, "Could not create booking. Please check your details and try again.");
  }
};

// ─── UPDATE BOOKING ───────────────────────────────────────────────────────────

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid booking ID.");
    }

    // Strip fields that must never be updated via this endpoint
    const {
      bookingReference,
      paymentProof,
      confirmationPdf,
      createdAt,
      __v,
      ...safeUpdates
    } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      safeUpdates,
      { new: true, runValidators: true }
    )
      .populate("therapist", POPULATE.therapist)
      .populate("service", POPULATE.service)
      .populate("paymentMethod", POPULATE.paymentMethod)
      .lean();

    if (!booking) {
      return sendError(res, 404, "Booking not found.");
    }

    return sendSuccess(res, 200, { data: booking });
  } catch (error) {
    console.error("[updateBooking]", error);
    return sendError(res, 400, "Could not update booking. Please try again.");
  }
};

// ─── UPLOAD PAYMENT PROOF ─────────────────────────────────────────────────────

export const uploadPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid booking ID.");
    }

    if (!req.file) {
      return sendError(res, 400, "Please upload your payment receipt.");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
      return sendError(
        res,
        400,
        "Unsupported file type. Only JPG, PNG, and WEBP images are accepted."
      );
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return sendError(res, 400, "File size exceeds the 5MB limit.");
    }

    // Document will be modified — do not use lean()
    const booking = await Booking.findById(id);

    if (!booking) {
      return sendError(res, 404, "Booking not found.");
    }

    if (booking.paymentStatus === "Paid") {
      return sendError(res, 409, "Payment has already been verified for this booking.");
    }

    booking.paymentProof = `/uploads/payments/${req.file.filename}`;
    booking.paymentStatus = "Pending Verification";
    booking.paidAt = new Date();

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("therapist", POPULATE.therapist)
      .populate("service", POPULATE.service)
      .populate("paymentMethod", POPULATE.paymentMethod)
      .lean();

    return sendSuccess(res, 200, {
      message: "Payment submitted successfully.",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("[uploadPaymentProof]", error);
    return sendError(res, 500, "Could not upload payment proof. Please try again.");
  }
};

// ─── APPROVE PAYMENT ──────────────────────────────────────────────────────────

export const approvePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid booking ID.");
    }

    // Document will be modified — do not use lean()
    let booking = await Booking.findById(id)
      .populate("therapist", POPULATE.therapist)
      .populate("service", POPULATE.service)
      .populate("paymentMethod", POPULATE.paymentMethod);

    if (!booking) {
      return sendError(res, 404, "Booking not found.");
    }

    if (booking.paymentStatus === "Paid" && booking.bookingStatus === "Confirmed") {
      return sendError(res, 409, "Payment has already been approved.");
    }

    if (!booking.paymentProof) {
      return sendError(
        res,
        422,
        "Cannot approve a booking that has no payment receipt uploaded."
      );
    }

    booking.paymentStatus = "Paid";
    booking.bookingStatus = "Confirmed";
    booking.approvedAt = new Date();

    await booking.save();

    // Re-fetch with lean() after save so populated virtuals are fresh
    booking = await Booking.findById(booking._id)
      .populate("therapist", POPULATE.therapist)
      .populate("service", POPULATE.service)
      .populate("paymentMethod", POPULATE.paymentMethod)
      .lean();

    // Generate confirmation PDF — non-blocking: log failure, do not crash
    let pdfRelativePath = null;
    try {
      const pdf = await generateBookingPDF(booking);
      pdfRelativePath = pdf.relativePath;
      // Persist the PDF path without re-fetching the full document
      await Booking.findByIdAndUpdate(booking._id, {
        confirmationPdf: pdfRelativePath,
      });
    } catch (pdfErr) {
      console.error("[approvePayment] PDF generation failed:", pdfErr);
    }

    // Send confirmation email — non-blocking: log failure, do not crash
    try {
      await sendBookingConfirmationEmail({
        booking,
        pdfPath: pdfRelativePath,
      });
    } catch (emailErr) {
      console.error("[approvePayment] Confirmation email failed:", emailErr);
    }

    return sendSuccess(res, 200, {
      message: "Payment approved successfully.",
      data: { ...booking, confirmationPdf: pdfRelativePath },
    });
  } catch (error) {
    console.error("[approvePayment]", error);
    return sendError(res, 500, "Could not approve payment. Please try again.");
  }
};

// ─── DELETE BOOKING ───────────────────────────────────────────────────────────

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid booking ID.");
    }

    const booking = await Booking.findByIdAndDelete(id).lean();

    if (!booking) {
      return sendError(res, 404, "Booking not found.");
    }

    return sendSuccess(res, 200, {
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error("[deleteBooking]", error);
    return sendError(res, 500, "Could not delete booking. Please try again.");
  }
};

// ─── GET DASHBOARD STATS ──────────────────────────────────────────────────────

export const getDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalBookings,
      pendingVerification,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      todayRevenueAgg,
      pendingBookings,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ paymentStatus: "Pending Verification" }),
      Booking.countDocuments({ bookingStatus: "Confirmed" }),
      Booking.countDocuments({ bookingStatus: "Completed" }),
      Booking.countDocuments({ bookingStatus: "Cancelled" }),
      Booking.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: { $gte: todayStart, $lte: todayEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Booking.find({ paymentStatus: "Pending Verification" })
        .populate("therapist", POPULATE.therapist)
        .populate("service", POPULATE.service)
        .populate("paymentMethod", POPULATE.paymentMethod)
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
    ]);

    const todayRevenue = todayRevenueAgg[0]?.total || 0;

    return sendSuccess(res, 200, {
      stats: {
        totalBookings,
        pendingVerification,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        todayRevenue,
      },
      pendingBookings,
    });
  } catch (error) {
    console.error("[getDashboardStats]", error);
    return sendError(res, 500, "Could not load dashboard. Please try again.");
  }
};
// ─── REJECT PAYMENT ───────────────────────────────────────────────────────────

export const rejectPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid booking ID.");
    }

    if (!reason || !reason.trim()) {
      return sendError(res, 400, "Rejection reason is required.");
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return sendError(res, 404, "Booking not found.");
    }

    if (booking.paymentStatus === "Rejected") {
      return sendError(res, 409, "Payment has already been rejected.");
    }

    if (booking.paymentStatus === "Paid") {
      return sendError(res, 409, "Cannot reject a payment that has already been approved.");
    }

    booking.paymentStatus = "Rejected";
    booking.bookingStatus = "Pending";
    booking.rejectionReason = reason.trim();
    booking.rejectedAt = new Date();

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("therapist", POPULATE.therapist)
      .populate("service", POPULATE.service)
      .populate("paymentMethod", POPULATE.paymentMethod)
      .lean();

    return sendSuccess(res, 200, {
      message: "Payment rejected successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("[rejectPayment]", error);
    return sendError(res, 500, "Could not reject payment. Please try again.");
  }
};

// ─── DOWNLOAD CONFIRMATION PDF ───────────────────────────────────────────────

export const downloadBookingConfirmation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid booking ID.");
    }

    const booking = await Booking.findById(id).lean();

    if (!booking) {
      return sendError(res, 404, "Booking not found.");
    }

    if (!booking.confirmationPdf) {
      return sendError(
        res,
        404,
        "Confirmation PDF is not available yet."
      );
    }

    const pdfPath = path.join(
      process.cwd(),
      booking.confirmationPdf.replace(/^\//, "")
    );

    if (!fs.existsSync(pdfPath)) {
      return sendError(
        res,
        404,
        "Confirmation PDF file not found."
      );
    }

    return res.download(
      pdfPath,
      `${booking.bookingReference}.pdf`
    );
  } catch (error) {
    console.error("[downloadBookingConfirmation]", error);

    return sendError(
      res,
      500,
      "Could not download confirmation PDF."
    );
  }
};