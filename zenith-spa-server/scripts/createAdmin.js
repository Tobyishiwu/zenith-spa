import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const existingOwner = await Admin.findOne({
      role: "owner",
    });

    if (existingOwner) {
      console.log("⚠️ Owner account already exists.");
      process.exit();
    }

    const admin = new Admin({
      name: "Zenith Spa Owner",
      email: "admin@zenithspa.com",
      password: "Admin@12345",
      role: "owner",
    });

    await admin.save();

    console.log("🎉 Owner account created successfully!");

    console.log("");

    console.log("Email: admin@zenithspa.com");

    console.log("Password: Admin@12345");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

createAdmin();