import { useState, useEffect, useRef } from "react";
import { FiAlertTriangle, FiXCircle } from "react-icons/fi";

const RejectModal = ({ open, onCancel, onConfirm, loading }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (open) {
      setReason("");
      setError("");
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a reason before rejecting.");
      return;
    }
    onConfirm(reason.trim());
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center gap-3 border-b p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <FiAlertTriangle className="text-lg text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Reject Payment</h3>
            <p className="text-sm text-gray-500">This action will notify the customer.</p>
          </div>
        </div>

        <div className="p-6">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Reason for Rejection <span className="text-red-500">*</span>
          </label>
          <textarea
            ref={textareaRef}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
            rows={5}
            placeholder={"Examples:\n\u2022 Payment proof is blurry.\n\u2022 Incorrect amount transferred.\n\u2022 Receipt does not match booking.\n\u2022 Duplicate payment receipt."}
            className={
              "w-full resize-none rounded-xl border px-4 py-3 text-sm text-gray-800 outline-none transition focus:ring-2 " +
              (error
                ? "border-red-400 bg-red-50 focus:ring-red-200"
                : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:ring-slate-200")
            }
          />
          {error && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
              <FiXCircle /> {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
          >
            <FiXCircle />
            {loading ? "Rejecting..." : "Reject Payment"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RejectModal;
