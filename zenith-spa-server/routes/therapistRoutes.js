import express from "express";

import auth from "../middleware/auth.js";
import uploadTherapist from "../middleware/uploadTherapist.js";

import {
  getTherapists,
  getTherapistBySlug,
  createTherapist,
  updateTherapist,
  deleteTherapist,
} from "../controllers/therapistController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Get all therapists
router.get("/", getTherapists);

// Get therapist by slug
router.get("/:slug", getTherapistBySlug);

/*
|--------------------------------------------------------------------------
| Protected Admin Routes
|--------------------------------------------------------------------------
*/

// Create therapist
router.post(
  "/",
  auth,
  uploadTherapist.single("image"),
  createTherapist
);

// Update therapist
router.put(
  "/:id",
  auth,
  uploadTherapist.single("image"),
  updateTherapist
);

// Delete therapist
router.delete(
  "/:id",
  auth,
  deleteTherapist
);

export default router;