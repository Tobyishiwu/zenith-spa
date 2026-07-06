import React, { useState, useEffect } from "react";
import { FaExclamationTriangle, FaTimes, FaSync } from "react-icons/fa";
import { toast } from "react-hot-toast";

// Integration: Using existing API service named exports exactly as required
import { deleteTherapist } from "../services/adminApi";

export default function DeleteTherapistModal({ open, therapist, onClose, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Keyboard Event Handler for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isDeleting, onClose]);

  if (!open || !therapist) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteTherapist(therapist._id);
      if (response && response.success) {
        toast.success("Therapist deleted successfully.");
        onDeleted();
        onClose();
      } else {
        toast.error(response?.message || "Failed to delete therapist.");
      }
    } catch (error) {
      console.error("Therapist Deletion Error:", error);
      const backendErrorMessage = error.response?.data?.message || error.message;
      toast.error(backendErrorMessage || "An unexpected network or server error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackdropClick = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay Backdrop Layout */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" 
        onClick={handleBackdropClick}
      />

      {/* Main Centered Dialog Body View container */}
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-xl border border-slate-100 relative z-10 overflow-hidden my-auto flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Delete Therapist
          </h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-40"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Modal Body Contents */}
        <div className="p-6 space-y-6 text-center">
          <div className="mx-auto w-14 h-14 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
            <FaExclamationTriangle />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-slate-600 font-medium">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900">{therapist.name}</span>?
            </p>
            <p className="text-xs text-slate-400">
This action cannot be undone. The therapist will be permanently removed from Zenith Spa.            </p>
          </div>
        </div>

        {/* Modal Actions Footer Segment */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-all active:scale-95 text-xs disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-xs disabled:opacity-75 shadow-rose-100"
          >
            {isDeleting && <FaSync className="animate-spin text-xs" />}
            {isDeleting ? "Deleting Therapist..." : "Delete Therapist"}
          </button>
        </div>
      </div>
    </div>
  );
}