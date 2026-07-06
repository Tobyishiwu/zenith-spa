import express from "express";
import adminAuth from "../middleware/adminAuth.js";

import { loginAdmin } from "../controllers/adminController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { getBookings } from "../controllers/bookingController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Admin Login
router.post("/login", loginAdmin);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

// Dashboard Statistics
router.get("/dashboard", adminAuth, getDashboardStats);
router.get("/bookings", adminAuth, getBookings);

// Logged-in Admin Profile
router.get("/profile", adminAuth, (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
});

export default router;
