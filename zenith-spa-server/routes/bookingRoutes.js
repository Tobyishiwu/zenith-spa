import express from "express";
import auth from "../middleware/auth.js";
import paymentUpload from "../middleware/paymentUpload.js";
import {
  getBookings,
  getBookingById,
  getBookingByReference,
  createBooking,
  updateBooking,
  uploadPaymentProof,
  approvePayment,
  rejectPayment,
  deleteBooking,
    downloadBookingConfirmation,

} from "../controllers/bookingController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CUSTOMER ROUTES
|--------------------------------------------------------------------------
*/

router.post("/", createBooking);

// IMPORTANT: Keep this BEFORE "/:id"
router.get("/reference/:reference", getBookingByReference);

router.get("/:id", getBookingById);

router.patch(
  "/:id/payment",
  paymentUpload.single("paymentProof"),
  uploadPaymentProof
);

router.get("/:id/confirmation", downloadBookingConfirmation);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

router.get("/", auth, getBookings);

router.put("/:id", auth, updateBooking);

router.patch("/:id/approve-payment", auth, approvePayment);

router.patch("/:id/reject-payment", auth, rejectPayment);

router.delete("/:id", auth, deleteBooking);

export default router;
