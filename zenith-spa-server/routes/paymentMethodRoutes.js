import express from "express";
import auth from "../middleware/auth.js";
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/paymentMethodController.js";

const router = express.Router();

router.get("/", getPaymentMethods);
router.post("/", auth, createPaymentMethod);
router.put("/:id", auth, updatePaymentMethod);
router.delete("/:id", auth, deletePaymentMethod);

export default router;