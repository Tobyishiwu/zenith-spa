import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "./models/Service.js";

dotenv.config();

const services = [
  {
    name: "Swedish Massage",
    description:
      "A calming full-body massage that eases muscle tension, improves circulation, and promotes deep relaxation through long, flowing strokes and gentle kneading.",
    duration: 60,
    price: 120,
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Deep Tissue Massage",
    description:
      "Designed to target chronic muscle tension and relieve deep-seated pain through firm therapeutic pressure.",
    duration: 90,
    price: 150,
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Hot Stone Therapy",
    description:
      "Heated basalt stones melt away stress while relaxing deep muscle tissue.",
    duration: 90,
    price: 170,
    image:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Aromatherapy Massage",
    description:
      "Relaxing massage using premium essential oils for complete wellbeing.",
    duration: 60,
    price: 135,
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Luxury Facial",
    description:
      "A luxury facial treatment tailored to your skin type.",
    duration: 60,
    price: 110,
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Body Scrub & Polish",
    description:
      "Full body exfoliation leaving your skin soft and glowing.",
    duration: 45,
    price: 100,
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Couples Spa Retreat",
    description:
      "A luxury spa experience designed for couples.",
    duration: 90,
    price: 250,
    image:
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Prenatal Massage",
    description:
      "Gentle massage designed to support mothers during pregnancy.",
    duration: 60,
    price: 125,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
  },
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");

    for (const item of services) {
      const existing = await Service.findOne({ name: item.name });

      if (existing) {
        existing.description = item.description;
        existing.duration = item.duration;
        existing.price = item.price;
        existing.image = item.image;
        existing.active = true;

        await existing.save();

        console.log(`🔄 Updated: ${existing.name}`);
        console.log(`   _id: ${existing._id}`);
      } else {
        const created = await Service.create({
          ...item,
          active: true,
        });

        console.log(`🆕 Created: ${created.name}`);
        console.log(`   _id: ${created._id}`);
      }
    }

    console.log("\n🎉 Service synchronization complete.");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedServices();