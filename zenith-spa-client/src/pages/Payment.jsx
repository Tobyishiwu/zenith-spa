
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
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-4xl text-teal-700" />
          <p className="text-lg font-semibold text-gray-600">Loading payment details…</p>
        </div>
      </section>
    );
  }

  if (!booking) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <div className="rounded-3xl bg-white p-12 text-center shadow-xl">
          <FaTimesCircle className="mx-auto mb-4 text-5xl text-red-400" />
          <h2 className="text-2xl font-bold text-gray-800">Booking not found.</h2>
          <p className="mt-2 text-gray-500">Please return to the home page and try again.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-2xl bg-teal-700 px-8 py-3 font-bold text-white transition hover:bg-teal-800"
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
      <section className="min-h-screen bg-[#FAF9F6] pt-32 pb-24">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-3xl bg-white p-10 text-center shadow-2xl">

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <FaCheckCircle className="text-5xl text-green-500" />
            </div>

            <h1 className="text-3xl font-black text-gray-900">
              Payment Submitted Successfully
            </h1>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Thank you. We've received your payment receipt. Our team is reviewing it.
              Verification usually takes 5–15 minutes.
            </p>

            <div className="my-8 space-y-3 rounded-2xl bg-gray-50 p-6 text-left">
              <SuccessRow label="Booking Reference" value={booking.bookingReference || booking._id} />
              <SuccessRow label="Therapist" value={booking.therapist?.name} />
              <SuccessRow label="Service" value={booking.service?.name} />
              <SuccessRow label="Amount" value={`$${booking.totalAmount}`} />
              <SuccessRow label="Payment Method" value={payment?.name} />
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-500">Payment Status</span>
                <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
                  Pending Verification
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-teal-700 px-8 py-4 font-bold text-teal-700 transition hover:bg-teal-50"
              >
                <FaHome />
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
  className="flex items-center justify-center gap-2 rounded-2xl bg-teal-700 px-8 py-4 font-bold text-white shadow-lg transition hover:bg-teal-800 hover:shadow-xl"
>
  <FaSearch />
  Track Booking
</button>
            </div>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#FAF9F6] pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-semibold uppercase tracking-[4px] text-teal-700">
            Complete Payment
          </span>
          <h1 className="mt-4 text-4xl font-black text-gray-900 md:text-5xl">
            Secure Your Appointment
          </h1>
          <p className="mt-3 text-gray-500">
            Send payment and upload your receipt to confirm your booking.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* LEFT COLUMN */}
          <div className="space-y-8">

            {/* Booking Summary */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Booking Summary</h2>
              <div className="space-y-4">
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
              <hr className="my-6 border-gray-100" />
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-teal-700">
                  ${booking.totalAmount}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Payment Status</span>
                <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-700">
                  Awaiting Payment
                </span>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                <FaMoneyBillWave className="text-teal-600" />
                Payment Method
              </h2>

              <div className="flex items-center gap-5">
                {payment?.icon && (
                  <img
                    src={payment.icon}
                    alt={payment.name}
                    className="h-14 w-14 rounded-xl object-contain"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{payment?.name}</h3>
                  {payment?.network && (
                    <p className="text-sm text-gray-500">{payment.network}</p>
                  )}
                </div>
              </div>

              {payment?.accountName && (
                <div className="mt-6 rounded-2xl bg-gray-50 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Account Name
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">{payment.accountName}</p>
                </div>
              )}

              {payment?.accountDetails && (
                <div className="mt-4 rounded-2xl bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Wallet / Address
                  </p>
                  <p className="mt-2 break-all font-mono text-sm font-semibold text-gray-800">
                    {payment.accountDetails}
                  </p>
                  <button
                    onClick={handleCopy}
                    className={`mt-4 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      copied
                        ? "bg-green-600 text-white"
                        : "bg-teal-700 text-white hover:bg-teal-800"
                    }`}
                  >
                    <FaCopy />
                    {copied ? "Copied!" : "Copy Address"}
                  </button>
                </div>
              )}

              {payment?.instructions && (
                <div className="mt-6 rounded-2xl border-l-4 border-teal-600 bg-teal-50 p-5">
                  <p className="text-sm font-bold text-teal-800">Instructions</p>
                  <p className="mt-2 text-sm leading-relaxed text-teal-700">
                    {payment.instructions}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="rounded-3xl bg-white p-8 shadow-lg">

            <h2 className="mb-2 flex items-center gap-3 text-2xl font-bold text-gray-900">
              <FaUpload className="text-teal-600" />
              Upload Payment Receipt
            </h2>
            <p className="mb-8 text-sm text-gray-500">
              Upload proof of payment to confirm your booking.
            </p>

            {!preview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-8 py-16 text-center transition-all duration-200 ${
                  dragOver
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 bg-gray-50 hover:border-teal-400 hover:bg-teal-50/40"
                }`}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100">
                  <FaFileImage className="text-3xl text-teal-600" />
                </div>
                <p className="text-base font-semibold text-gray-700">
                  Drag & Drop your receipt here
                </p>
                <p className="mt-1 text-sm text-gray-400">or click to browse</p>
                <div className="mt-6 flex gap-2">
                  {["JPG", "PNG", "WEBP"].map((ext) => (
                    <span
                      key={ext}
                      className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-400">Maximum file size: 5MB</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                  <img
                    src={preview}
                    alt="Receipt preview"
                    className="h-72 w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 break-all">
                      {selectedFile?.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
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
                    className="ml-4 flex-shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-100"
                  >
                    Change Receipt
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
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs font-semibold text-gray-500">
                  <span>Uploading…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-teal-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {uploadError && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                <FaTimesCircle className="mt-0.5 flex-shrink-0 text-red-400" />
                <p className="text-sm text-red-600">{uploadError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading || !selectedFile}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-teal-700 py-5 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-teal-800 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading Receipt…
                </>
              ) : (
                <>
                  <FaCheckCircle />
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
  <div className="flex items-start justify-between gap-4">
    <span className="flex-shrink-0 text-sm text-gray-500">{label}</span>
    <span
      className={`text-right text-sm font-semibold text-gray-800 ${
        mono ? "break-all font-mono text-xs" : ""
      }`}
    >
      {value || "—"}
    </span>
  </div>
);

const SuccessRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value || "—"}</span>
  </div>
);

export default Payment;
