import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaCopy,
  FaMoneyBillWave,
  FaUpload,
  FaFileImage,
  FaHome,
  FaSearch,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "../api/axios";
import useBooking from "../hooks/useBooking";

const Payment = () => {
  const navigate = useNavigate();
  const { booking, loading } = useBooking();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_SIZE = 5 * 1024 * 1024;

  const processFile = (file) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only JPG, PNG, and WEBP files are supported.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadError("File size must not exceed 5MB.");
      return;
    }
    setUploadError("");
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleCopy = async () => {
    if (!booking?.paymentMethod?.accountDetails) return;
    try {
      await navigator.clipboard.writeText(booking.paymentMethod.accountDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setUploadError("Could not copy to clipboard.");
    }
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError("Please select a payment receipt to upload.");
      return;
    }
    setUploadError("");
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("paymentProof", selectedFile);

    try {
      await axios.patch(`/bookings/${booking._id}/payment`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress(pct);
        },
      });
      setSubmitted(true);
    } catch (err) {
      setUploadError(
        err?.response?.data?.message ||
          "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <p className="text-xs font-semibold tracking-wider uppercase text-stone-400 animate-pulse">
          Loading payment details…
        </p>
      </section>
    );
  }

  if (!booking) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <div className="rounded-2xl border border-stone-200/40 bg-white p-10 text-center max-w-sm mx-6 shadow-xs">
          <FaTimesCircle className="mx-auto mb-4 text-3xl text-red-400" />
          <h2 className="text-xl font-light tracking-tight text-stone-900">Booking not found</h2>
          <p className="mt-2 text-xs font-light text-stone-500 leading-5">
            Please return to the home page and try initiating your booking sequence again.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-stone-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-black"
          >
            Return Home
          </button>
        </div>
      </section>
    );
  }

  const payment = booking.paymentMethod;

  if (submitted) {
    return (
      <section className="min-h-screen bg-[#FAF9F6] antialiased pt-36 pb-24">
        <div className="mx-auto max-w-xl px-6">
          <div className="rounded-2xl border border-stone-200/40 bg-white p-8 text-center shadow-xs">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FaCheckCircle size={20} />
            </div>

            <h1 className="text-2xl font-light tracking-tight text-stone-900">
              Payment Submitted Successfully
            </h1>
            <p className="mt-3 text-xs font-light text-stone-500 leading-5 max-w-sm mx-auto">
              Thank you. We have received your payment receipt. Our concierge team is validating your allocation transfer, which typically takes 5–15 minutes.
            </p>

            <div className="my-6 space-y-3 rounded-xl border border-stone-200/40 bg-stone-50/50 p-5 text-left">
              <SuccessRow label="Booking Reference" value={booking.bookingReference || booking._id} />
              <SuccessRow label="Therapist" value={booking.therapist?.name} />
              <SuccessRow label="Service" value={booking.service?.name} />
              <SuccessRow label="Amount" value={`$${booking.totalAmount}`} />
              <SuccessRow label="Payment Method" value={payment?.name} />
              <div className="flex items-center justify-between pt-2 border-t border-stone-200/40">
                <span className="text-xs font-light text-stone-500">Payment Status</span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200/50">
                  Pending Verification
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200/80 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-stone-600 shadow-xs transition hover:bg-stone-50"
              >
                <FaHome size={11} />
                Return Home
              </button>
              <button
                onClick={() =>
                  navigate(
                    `/track-booking?ref=${encodeURIComponent(
                      booking.bookingReference || booking._id
                    )}`
                  )
                }
                className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-teal-700"
              >
                <FaSearch size={11} />
                Track Booking
              </button>
            </div>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#FAF9F6] text-stone-800 antialiased pt-36 pb-24">
      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}
        <div className="mb-14 text-center">
          <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Complete Payment
          </span>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-stone-900 sm:text-4xl">
            Secure Your Appointment
          </h1>
          <p className="mt-3 text-xs font-light leading-5 text-stone-500 max-w-sm mx-auto">
            Send payment and upload your system transmission receipt to confirm your booking.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* Booking Summary */}
            <div className="rounded-2xl border border-stone-200/40 bg-white p-6 shadow-xs">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-900">Booking Summary</h2>
              <div className="space-y-3.5">
                <SummaryRow label="Therapist" value={booking.therapist?.name} />
                <SummaryRow label="Service" value={booking.service?.name} />
                <SummaryRow
                  label="Booking Date"
                  value={
                    booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"
                  }
                />
                <SummaryRow label="Time" value={booking.time} />
                <SummaryRow
                  label="Booking Reference"
                  value={booking.bookingReference || booking._id}
                  mono
                />
              </div>
              <hr className="my-5 border-stone-100" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-900">Total</span>
                <span className="text-xl font-light text-teal-600">
                  ${booking.totalAmount}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-stone-100">
                <span className="text-xs font-light text-stone-500">Payment Status</span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200/50">
                  Awaiting Payment
                </span>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="rounded-2xl border border-stone-200/40 bg-white p-6 shadow-xs">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-900">
                <FaMoneyBillWave className="text-teal-600" size={13} />
                Payment Method
              </h2>

              <div className="flex items-center gap-4">
                {payment?.icon && (
                  <img
                    src={payment.icon}
                    alt={payment.name}
                    className="h-10 w-10 rounded-lg object-contain bg-stone-50 p-1 border border-stone-200/40"
                  />
                )}
                <div>
                  <h3 className="text-sm font-medium tracking-tight text-stone-900">{payment?.name}</h3>
                  {payment?.network && (
                    <p className="text-xs text-stone-400">{payment.network}</p>
                  )}
                </div>
              </div>

              {payment?.accountName && (
                <div className="mt-4 rounded-xl bg-stone-50/50 border border-stone-200/40 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    Account Name
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-stone-800">{payment.accountName}</p>
                </div>
              )}

              {payment?.accountDetails && (
                <div className="mt-3 rounded-xl bg-stone-50/50 border border-stone-200/40 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    Wallet / Address
                  </p>
                  <p className="mt-1.5 break-all font-mono text-xs font-medium text-stone-800 tracking-wide select-all">
                    {payment.accountDetails}
                  </p>
                  <button
                    onClick={handleCopy}
                    className={`mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                      copied
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-900 text-white hover:bg-black"
                    }`}
                  >
                    <FaCopy size={11} />
                    {copied ? "Copied!" : "Copy Address"}
                  </button>
                </div>
              )}

              {payment?.instructions && (
                <div className="mt-4 rounded-xl border-l-2 border-teal-500 bg-teal-50/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">Instructions</p>
                  <p className="mt-1 text-xs leading-5 text-teal-700 font-light">
                    {payment.instructions}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="rounded-2xl border border-stone-200/40 bg-white p-6 shadow-xs">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-900">
              <FaUpload className="text-teal-600" size={13} />
              Upload Payment Receipt
            </h2>
            <p className="mt-1 mb-6 text-xs font-light text-stone-500">
              Upload proof of payment to queue your service dispatch.
            </p>

            {!preview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center transition-all duration-200 ${
                  dragOver
                    ? "border-teal-500 bg-teal-50/30"
                    : "border-stone-200/80 bg-stone-50/30 hover:border-teal-400 hover:bg-teal-50/10"
                }`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-stone-50 border border-stone-200/40 text-stone-400">
                  <FaFileImage size={14} />
                </div>
                <p className="text-xs font-medium text-stone-700">
                  Drag & drop your receipt here
                </p>
                <p className="mt-0.5 text-[11px] text-stone-400">or click to browse local files</p>
                <div className="mt-4 flex gap-1.5">
                  {["JPG", "PNG", "WEBP"].map((ext) => (
                    <span
                      key={ext}
                      className="rounded-md border border-stone-200/60 bg-white px-2 py-0.5 text-[9px] font-medium text-stone-500"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-stone-400 font-light">Maximum parameters: 5MB</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-stone-200/40 bg-stone-50 p-2 shadow-2xs">
                  <img
                    src={preview}
                    alt="Receipt preview"
                    className="h-56 w-full rounded-lg object-cover"
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-stone-200/40 bg-stone-50/60 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-stone-800 truncate">
                      {selectedFile?.name}
                    </p>
                    <p className="text-[10px] text-stone-400 font-light mt-0.5">
                      {formatBytes(selectedFile?.size || 0)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                      setUploadError("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="ml-4 flex-shrink-0 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 shadow-2xs transition hover:bg-stone-50"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Progress Bar */}
            {uploading && (
              <div className="mt-5">
                <div className="mb-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  <span>Uploading engine elements…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-teal-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {uploadError && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3">
                <FaTimesCircle className="mt-0.5 flex-shrink-0 text-red-400" size={13} />
                <p className="text-xs text-red-600 font-light leading-5">{uploadError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading || !selectedFile}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition duration-200 hover:bg-teal-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin" size={11} />
                  Uploading Receipt…
                </>
              ) : (
                <>
                  <FaCheckCircle size={11} />
                  Submit Payment
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

const SummaryRow = ({ label, value, mono = false }) => (
  <div className="flex items-start justify-between gap-4 text-xs font-light">
    <span className="flex-shrink-0 text-stone-400">{label}</span>
    <span
      className={`text-right font-medium text-stone-800 ${
        mono ? "break-all font-mono text-[11px] tracking-wide" : ""
      }`}
    >
      {value || "—"}
    </span>
  </div>
);

const SuccessRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-stone-200/30 pb-2 last:border-0 last:pb-0 text-xs font-light">
    <span className="text-stone-400">{label}</span>
    <span className="font-medium text-stone-800">{value || "—"}</span>
  </div>
);

export default Payment;