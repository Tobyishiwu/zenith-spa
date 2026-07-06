import React, { useState, useEffect, useCallback } from "react";
import { FaTimes, FaCamera, FaSync } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "../../api/axios";
import { imageUrl } from "../../utils/imageUrl";

export default function TherapistModal({ open, therapist, onClose, onRefresh }) {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState(0);
  const [bio, setBio] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(therapist);

  useEffect(() => {
    if (open) {
      if (therapist) {
        setName(therapist.name || "");
        setSpecialization(therapist.specialization || "");
        setExperience(therapist.experience ?? 0);
        setBio(therapist.bio || "");
        setFeatured(Boolean(therapist.featured));
        // imageUrl() resolves relative paths so the preview loads correctly
        setImagePreview(imageUrl(therapist.image) || "");
        setImageFile(null);
      } else {
        setName("");
        setSpecialization("");
        setExperience(0);
        setBio("");
        setFeatured(false);
        setImagePreview("");
        setImageFile(null);
      }
    }
  }, [open, therapist]);

  const handleModalClose = useCallback(() => {
    if (isSubmitting) return;
    setName("");
    setSpecialization("");
    setExperience(0);
    setBio("");
    setFeatured(false);
    setImagePreview("");
    setImageFile(null);
    onClose();
  }, [onClose, isSubmitting]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open && !isSubmitting) handleModalClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isSubmitting, handleModalClose]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Full Name is required.");
    if (!specialization.trim()) return toast.error("Specialization is required.");
    if (experience < 0) return toast.error("Experience must be 0 or greater.");
    if (!bio.trim()) return toast.error("Bio description is required.");

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("specialization", specialization.trim());
    formData.append("experience", experience);
    formData.append("bio", bio.trim());
    formData.append("featured", featured);
    if (imageFile) formData.append("image", imageFile);

    try {
      const token = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };
      // Do NOT set Content-Type manually — browser sets multipart boundary automatically

      let response;
      if (isEditMode) {
        const { data } = await axios.put(`/therapists/${therapist._id}`, formData, { headers });
        response = data;
      } else {
        const { data } = await axios.post("/therapists", formData, { headers });
        response = data;
      }

      if (response && response.success) {
        toast.success(
          isEditMode
            ? "Therapist updated successfully."
            : "Therapist created successfully."
        );
        onRefresh();
        handleModalClose();
      } else {
        toast.error(response?.message || "Operation failed.");
      }
    } catch (error) {
      console.error("TherapistModal submit error:", error);
      toast.error(error.response?.data?.message || error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
        onClick={handleModalClose}
      />
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 relative z-10 overflow-hidden my-auto max-h-[90vh] flex flex-col">

        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditMode ? "Edit Therapist" : "Add Therapist"}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {isEditMode ? "Update therapist information." : "Add a new therapist to Zenith Spa."}
            </p>
          </div>
          <button
            onClick={handleModalClose}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-40"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm text-slate-600">

          <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div className="relative w-24 h-24 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-300 flex flex-col items-center gap-1">
                  <FaCamera size={24} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">No Image</span>
                </div>
              )}
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <label className="block text-sm font-semibold text-slate-800">Therapist Image</label>
              <span className="block text-xs text-slate-400 mb-2">Select a high-resolution portrait image.</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-black file:cursor-pointer disabled:opacity-60 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g. Alexander Mercer"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all bg-white font-medium text-slate-800 placeholder-slate-300 disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g. Deep Tissue, Aromatherapy"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all bg-white font-medium text-slate-800 placeholder-slate-300 disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience (Years)</label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all bg-white font-semibold text-slate-800 disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured Status</label>
              <div className="flex items-center h-[46px]">
                <button
                  type="button"
                  onClick={() => setFeatured((prev) => !prev)}
                  disabled={isSubmitting}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${featured ? "bg-slate-900" : "bg-slate-200"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${featured ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
                <span className="ml-3 font-semibold text-slate-700">
                  {featured ? "Yes, Feature on Homepage" : "No, Standard Listing"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Bio</label>
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isSubmitting}
              placeholder="Describe the therapist's experience, credentials and approach..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all bg-white font-medium text-slate-800 placeholder-slate-300 resize-none disabled:opacity-60"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white shrink-0">
            <button
              type="button"
              onClick={handleModalClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-all active:scale-95 text-xs disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-xs disabled:opacity-75"
            >
              {isSubmitting && <FaSync className="animate-spin text-xs" />}
              {isSubmitting ? "Saving..." : isEditMode ? "Update Therapist" : "Create Therapist"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
