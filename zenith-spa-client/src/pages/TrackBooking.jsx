import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaDownload,
  FaSpa,
  FaUser,
  FaHome,
  FaArrowLeft,
  FaExclamationCircle,
} from "react-icons/fa";
import { getBookingByReference, downloadBookingConfirmation } from "../services/bookingApi";
import { imageUrl } from "../utils/imageUrl";

// ─── Status Maps ──────────────────────────────────────────────────────────────

const PAYMENT_STATUS_LABELS = {
  Pending: "Awaiting Payment",
  "Pending Verification": "Payment Under Review",
  Paid: "Payment Confirmed",
  Rejected: "Payment Rejected",
  Refunded: "Refunded",
};

const BOOKING_STATUS_LABELS = {
  Pending: "Booking Received",
  Confirmed: "Booking Confirmed",
  Completed: "Treatment Completed",
  Cancelled: "Booking Cancelled",
};

const PAYMENT_STATUS_COLORS = {
  Pending: "bg-orange-50 text-orange-700 ring-1 ring-orange-200/50",
  "Pending Verification": "bg-amber-50 text-amber-700 ring-1 ring-amber-200/50",
  Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50",
  Rejected: "bg-red-50 text-red-600 ring-1 ring-red-200/50",
  Refunded: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/50",
};

const BOOKING_STATUS_COLORS = {
  Pending: "bg-stone-100 text-stone-600 ring-1 ring-stone-200/40",
  Confirmed: "bg-teal-50 text-teal-700 ring-1 ring-teal-200/50",
  Completed: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/50",
  Cancelled: "bg-red-50 text-red-600 ring-1 ring-red-200/50",
};

// ─── Timeline Builder ─────────────────────────────────────────────────────────

const buildTimeline = (paymentStatus, bookingStatus) => {
  if (paymentStatus === "Rejected") {
    return [
      { key: "submitted", label: "Booking Submitted", description: "Your appointment request was received.", done: true },
      { key: "rejected", label: "Payment Rejected", description: "We couldn't verify your payment. Please get in touch with our team.", done: true, rejected: true },
    ];
  }

  if (bookingStatus === "Cancelled") {
    return [
      { key: "submitted", label: "Booking Submitted", description: "Your appointment request was received.", done: true },
      { key: "cancelled", label: "Booking Cancelled", description: "This booking has been cancelled.", done: true, rejected: true },
    ];
  }

  return [
    {
      key: "submitted",
      label: "Booking Submitted",
      description: "We've received your appointment request.",
      done: true,
    },
    {
      key: "review",
      label: "Payment Under Review",
      description: "Our team is checking your payment receipt right now.",
      done:
        paymentStatus === "Pending Verification" ||
        paymentStatus === "Paid" ||
        bookingStatus === "Confirmed" ||
        bookingStatus === "Completed",
    },
    {
      key: "confirmed",
      label: "Booking Confirmed",
      description: "Payment verified! Your appointment is officially locked in.",
      done:
        (paymentStatus === "Paid" && bookingStatus === "Confirmed") ||
        bookingStatus === "Completed",
    },
    {
      key: "completed",
      label: "Treatment Completed",
      description: "We hope you enjoyed your time at the spa.",
      done: bookingStatus === "Completed",
    },
  ];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = {
  date: (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—",
  currency: (n) =>
    typeof n === "number"
      ? "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 })
      : "—",
};

const fallbackAvatar =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80";

// ─── Component ────────────────────────────────────────────────────────────────

const TrackBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [reference, setReference] = useState(searchParams.get("ref") || "");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const lookup = useCallback(async (ref) => {
    const trimmed = ref.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setSearched(false);
    setBooking(null);
    setError("");

    try {
      const res = await getBookingByReference(trimmed);
      if (res.success && res.data) {
        setBooking(res.data);
      } else {
        setBooking(null);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setBooking(null);
      } else {
        setError("Something went wrong. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && ref.trim()) {
      lookup(ref.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    lookup(reference);
  };

  const handleDownload = async () => {
    if (!booking?._id) return;
    setDownloading(true);
    try {
      const blob = await downloadBookingConfirmation(booking._id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${booking.bookingReference || "confirmation"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("We couldn't generate the PDF right now. Please try again in a moment.");
    } finally {
      setDownloading(false);
    }
  };

  const timeline = booking
    ? buildTimeline(booking.paymentStatus, booking.bookingStatus)
    : [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 antialiased pt-36 pb-24">
      <div className="mx-auto max-w-4xl px-6">
        
        {/* Navigation Utilities */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-900 transition-colors"
          >
            <FaArrowLeft size={10} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-900 transition-colors"
          >
            <FaHome size={11} />
            Home
          </button>
        </div>

        {/* ── Title / Search ───────────────────────────────────────────────── */}
        <div className="mb-14 text-center">
          <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Zenith Spa
          </span>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-stone-900 sm:text-4xl">
            Track Your Appointment
          </h1>
          <p className="mt-3 text-xs font-light leading-5 text-stone-500 max-w-sm mx-auto">
            Enter your booking reference code to view live status updates, verify your details, or download your receipt.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. ZS-20250705-000001"
              className="flex-1 rounded-xl border border-stone-200/80 bg-white px-4 py-3 text-xs font-medium text-stone-800 placeholder-stone-400 outline-none transition focus:border-teal-500/80 shadow-2xs"
            />
            <button
              type="submit"
              disabled={loading || !reference.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-2xs transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaSearch className="text-[10px]" />
              {loading ? "Searching…" : "Find Booking"}
            </button>
          </form>

          {error && (
            <div className="mx-auto mt-4 flex max-w-xl items-start gap-2 rounded-xl border border-red-100 bg-red-50/40 px-4 py-2.5 text-left">
              <FaExclamationCircle className="mt-0.5 flex-shrink-0 text-red-400" size={12} />
              <p className="text-xs text-red-600 font-light leading-4">{error}</p>
            </div>
          )}
        </div>

        {/* ── Results Container ─────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-xs font-semibold tracking-wider uppercase text-stone-400 animate-pulse">
                Finding your booking...
              </p>
            </div>
          )}

          {/* Not Found */}
          {!loading && searched && !booking && !error && (
            <div className="rounded-2xl border border-stone-200/40 bg-white p-10 text-center shadow-2xs max-w-md mx-auto">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-stone-50 border border-stone-200/40 text-stone-400">
                <FaSearch size={14} />
              </div>
              <h3 className="text-base font-medium tracking-tight text-stone-900">
                Booking Not Found
              </h3>
              <p className="mt-2 text-xs font-light leading-5 text-stone-500">
                We couldn't find an appointment matching that reference code. Double-check your confirmation email or message and try searching again.
              </p>
            </div>
          )}

          {/* Core Results Block */}
          {!loading && booking && (
            <div className="space-y-6">

              {/* ── Overview Summary ─────────────────────────────────────── */}
              <div className="rounded-2xl border border-stone-200/40 bg-white shadow-2xs overflow-hidden">
                <div className="border-b border-stone-100 px-6 py-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                        Booking Reference
                      </p>
                      <h2 className="mt-0.5 font-mono text-lg font-medium text-stone-900 tracking-wide">
                        {booking.bookingReference}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${PAYMENT_STATUS_COLORS[booking.paymentStatus] || "bg-stone-100 text-stone-600"}`}>
                        {PAYMENT_STATUS_LABELS[booking.paymentStatus] || booking.paymentStatus}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${BOOKING_STATUS_COLORS[booking.bookingStatus] || "bg-stone-100 text-stone-600"}`}>
                        {BOOKING_STATUS_LABELS[booking.bookingStatus] || booking.bookingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid divide-y divide-stone-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 bg-stone-50/30">
                  <div className="px-6 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Guest</p>
                    <p className="mt-1 text-xs font-medium text-stone-800">{booking.customerName}</p>
                    <p className="text-xs font-light text-stone-400 mt-0.5">{booking.email}</p>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Total Paid</p>
                    <p className="mt-0.5 text-base font-light text-teal-600">{fmt.currency(booking.totalAmount)}</p>
                    <p className="text-xs font-light text-stone-400 mt-0.5">via {booking.paymentMethod?.name || "—"}</p>
                  </div>
                </div>
              </div>

              {/* ── Details Grid ────────────────────────────────────────────── */}
              <div className="grid gap-6 md:grid-cols-2">

                {/* Appointment Schedule */}
                <div className="rounded-2xl border border-stone-200/40 bg-white p-6 shadow-2xs">
                  <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-900">
                    <FaCalendarAlt className="text-teal-600" size={12} />
                    Appointment Details
                  </h3>
                  <div className="space-y-3">
                    <DataRow label="Date" value={fmt.date(booking.bookingDate)} />
                    <DataRow label="Time" value={booking.time} />
                    <DataRow label="Service" value={booking.service?.name} />
                    {booking.service?.duration && (
                      <DataRow label="Duration" value={`${booking.service.duration} mins`} />
                    )}
                    {booking.service?.price && (
                      <DataRow label="Price" value={fmt.currency(booking.service.price)} />
                    )}
                  </div>
                </div>

                {/* Assigned Therapist */}
                <div className="rounded-2xl border border-stone-200/40 bg-white p-6 shadow-2xs">
                  <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-900">
                    <FaSpa className="text-teal-600" size={12} />
                    Your Therapist
                  </h3>
                  {booking.therapist ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={imageUrl(booking.therapist.image) || fallbackAvatar}
                        alt={booking.therapist.name}
                        onError={(e) => { e.target.src = fallbackAvatar; }}
                        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover border border-stone-200/40 shadow-3xs"
                      />
                      <div>
                        <p className="text-sm font-medium text-stone-900">{booking.therapist.name}</p>
                        {booking.therapist.specialization && (
                          <p className="text-xs font-light text-teal-600 mt-0.5">{booking.therapist.specialization}</p>
                        )}
                        {booking.therapist.experience && (
                          <p className="text-[10px] font-light text-stone-400 mt-1 uppercase tracking-wider">
                            {booking.therapist.experience} years experience
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 py-4 text-stone-400">
                      <FaUser size={14} />
                      <p className="text-xs font-light">Therapist details are not currently assigned.</p>
                    </div>
                  )}
                </div>

              </div>

              {/* ── Progress Timeline ────────────────────────────────────── */}
              <div className="rounded-2xl border border-stone-200/40 bg-white p-6 shadow-2xs">
                <h3 className="mb-6 text-xs font-semibold uppercase tracking-wider text-stone-900">
                  Booking Progress
                </h3>
                <div className="space-y-0">
                  {timeline.map((step, i) => {
                    const isLast = i === timeline.length - 1;
                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all border ${
                              step.rejected
                                ? "bg-red-50 border-red-200 text-red-500"
                                : step.done
                                ? "bg-teal-50 border-teal-200 text-teal-600"
                                : "bg-stone-50 border-stone-200/60 text-stone-300"
                            }`}
                          >
                            {step.done ? <FaCheckCircle size={10} /> : <FaClock size={10} />}
                          </div>
                          {!isLast && (
                            <div
                              className={`w-px flex-1 my-1 ${
                                step.done ? "bg-teal-500/30" : "bg-stone-200/40"
                              }`}
                              style={{ minHeight: "2rem" }}
                            />
                          )}
                        </div>
                        <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                          <p className={`text-xs font-medium ${step.rejected ? "text-red-600" : step.done ? "text-stone-900" : "text-stone-400"}`}>
                            {step.label}
                          </p>
                          <p className="mt-0.5 text-[11px] font-light text-stone-400 leading-4">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── PDF Download Section ──────────────────────────────────────── */}
              {booking.confirmationPdf && (
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-teal-200/60 bg-teal-50/20 p-5 sm:flex-row shadow-3xs">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-900">
                      Confirmation Ready
                    </p>
                    <p className="mt-1 text-xs font-light text-teal-700 leading-4">
                      You can download a clean PDF copy of your confirmation document to save for your records.
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-2xs transition hover:bg-black active:scale-[0.99] disabled:opacity-50"
                  >
                    <FaDownload size={10} />
                    {downloading ? "Downloading…" : "Download PDF"}
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const DataRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5 last:border-0 last:pb-0 text-xs font-light">
    <span className="text-stone-400">{label}</span>
    <span className="font-medium text-stone-700 text-right">{value || "—"}</span>
  </div>
);

export default TrackBooking;