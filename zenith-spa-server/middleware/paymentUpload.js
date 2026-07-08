import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

// Store payment proof images permanently in Cloudinary under the "payments" folder.
// req.file.path will contain the full Cloudinary HTTPS URL — no local disk used.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "payments",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto" }],
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;
  const ext = allowed.test(file.originalname.split(".").pop().toLowerCase());
  const mime = allowed.test(file.mimetype.split("/")[1]);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG and WEBP images are allowed."));
  }
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
