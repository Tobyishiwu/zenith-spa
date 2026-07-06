import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getServices);
router.post("/", auth, upload.single("image"), createService);
router.put("/:id", auth, upload.single("image"), updateService);
router.delete("/:id", auth, deleteService);

export default router;