import Therapist from "../models/Therapist.js";
import slugify from "slugify";

//
// GET ALL THERAPISTS
//
export const getTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: therapists,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch therapists.",
    });
  }
};

//
// GET THERAPIST BY SLUG
//
export const getTherapistBySlug = async (req, res) => {
  try {
    const therapist = await Therapist.findOne({
      slug: req.params.slug,
    });

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: therapist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch therapist.",
    });
  }
};

//
// CREATE THERAPIST
//
export const createTherapist = async (req, res) => {
  try {
    const {
      name,
      specialization,
      experience,
      bio,
      featured,
      availability,
    } = req.body;

    if (!name || !specialization || !experience || !bio) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const therapist = await Therapist.create({
      name,
      slug: slugify(name, {
        lower: true,
        strict: true,
      }),

      specialization,

      experience,

      bio,

      featured:
        featured === true ||
        featured === "true",

      availability:
        availability === undefined
          ? true
          : availability === true ||
            availability === "true",

      image: req.file
        ? `/uploads/therapists/${req.file.filename}`
        : "",

      rating: 5,

      reviews: 0,
    });

    res.status(201).json({
      success: true,
      message: "Therapist created successfully.",
      data: therapist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// UPDATE THERAPIST
//
export const updateTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found.",
      });
    }

    therapist.name = req.body.name || therapist.name;

    therapist.slug = slugify(
      therapist.name,
      {
        lower: true,
        strict: true,
      }
    );

    therapist.specialization =
      req.body.specialization ||
      therapist.specialization;

    therapist.experience =
      req.body.experience ||
      therapist.experience;

    therapist.bio =
      req.body.bio ||
      therapist.bio;

    therapist.featured =
      req.body.featured === undefined
        ? therapist.featured
        : req.body.featured === true ||
          req.body.featured === "true";

    therapist.availability =
      req.body.availability === undefined
        ? therapist.availability
        : req.body.availability === true ||
          req.body.availability === "true";

    // Replace image only if a new one was uploaded
    if (req.file) {
      therapist.image = `/uploads/therapists/${req.file.filename}`;
    }

    await therapist.save();

    res.status(200).json({
      success: true,
      message: "Therapist updated successfully.",
      data: therapist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// DELETE THERAPIST
//
export const deleteTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findByIdAndDelete(
      req.params.id
    );

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Therapist deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete therapist.",
    });
  }
};