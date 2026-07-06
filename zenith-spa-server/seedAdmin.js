import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

await connectDB();

const seedAdmin = async () => {
  try {
    const exists = await User.findOne({ email: "admin@zenithspa.com" });

    if (exists) {
      console.log("Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    await User.create({
      name: "Admin",
      email: "admin@zenithspa.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();