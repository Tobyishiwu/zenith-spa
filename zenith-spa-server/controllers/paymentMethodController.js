import PaymentMethod from "../models/PaymentMethod.js";

// GET all payment methods
export const getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: paymentMethods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE payment method
export const createPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.create({
      name: req.body.name,
      accountName: req.body.accountName,
      accountDetails: req.body.accountDetails,
      qrCode: req.body.qrCode || "",
      icon: req.body.icon || "",
      active: req.body.active,
    });

    res.status(201).json({
      success: true,
      data: paymentMethod,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE payment method
export const updatePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        accountName: req.body.accountName,
        accountDetails: req.body.accountDetails,
        qrCode: req.body.qrCode,
        icon: req.body.icon,
        active: req.body.active,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found",
      });
    }

    res.json({
      success: true,
      data: paymentMethod,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE payment method
export const deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found",
      });
    }

    res.json({
      success: true,
      message: "Payment method deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};