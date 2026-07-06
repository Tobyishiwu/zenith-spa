import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaDownload,
  FaSpa,
  FaUser,
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
  Pending: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  "Pending Verification": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Rejected: "bg-red-50 text-red-600 ring-1 ring-red-200",
  Refunded: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
};

const BOOKING_STATUS_COLORS = {
  Pending: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  Confirmed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Completed: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Cancelled: "bg-red-50 text-red-600 ring-1 ring-red-200",
};

// ─── Timeline Builder ─────────────────────────────────────────────────────────

const buildTimeline = (paymentStatus, bookingStatus) => {
  if (paymentStatus === "Rejected") {
    return [
      { key: "submitted", label: "Booking Submitted", description: "Your booking request was received.", done: true },
      { key: "rejected", label: "Payment Rejected", description: "Your payment could not be verified. Please contact support.", done: true, rejected: true },
    ];
  }

  if (bookingStatus === "Cancelled") {
    return [
      { key: "submitted", label: "Booking Submitted", description: "Your booking request was received.", done: true },
      { key: "cancelled", label: "Booking Cancelled", description: "This booking has been cancelled.", done: true, rejected: true },
    ];
  }

  return [
    {
      key: "submitted",
      label: "Booking Submitted",
      description: "Your booking request has been received.",
      done: true,
    },
    {
      key: "review",
      label: "Payment Under Review",
      description: "Our team is verifying your payment receipt.",
      done:
        paymentStatus === "Pending Verification" ||
        paymentStatus === "Paid" ||
        bookingStatus === "Confirmed" ||
        bookingStatus === "Completed",
    },
    {
      key: "confirmed",
      label: "Booking Confirmed",
      description: "Payment verified. Your appointment is confirmed.",
      done:
        (paymentStatus === "Paid" && bookingStatus === "Confirmed") ||
        bookingStatus === "Completed",
    },
    {
      key: "completed",
      label: "Treatment Completed",
      description: "Your spa session has been completed. Thank you.",
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
  const [searchParams] = useSearchParams();

  const [reference, setReference] = useState(
    searchParams.get("ref") || ""
  );
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  // ── Core lookup — reused by both useEffect and form submit ────────────────

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
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  // ── Auto-lookup when ?ref= query param is present on mount ────────────────

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && ref.trim()) {
      lookup(ref.trim());
    }
    // Only run on mount — intentionally omitting searchParams from deps
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
      // PDF may not be ready yet — fail silently
    } finally {
      setDownloading(false);
    }
  };

  const timeline = booking
    ? buildTimeline(booking.paymentStatus, booking.bookingStatus)
    : [];

  return (
    <div className="min-h-screen bg-[#F8F6F2]">

      {/* ── Hero / Search ───────────────────────────────────────────────── */}
      <section className="bg-stone-900 pb-24 pt-40">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <span className="inline-block rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-300">
            Zenith Spa
          </span>
          <h1 className="mt-6 text-4xl font-light leading-tight text-white md:text-5xl">
            Track Your Booking
          </h1>
          <p className="mt-4 text-lg text-stone-400">
            Enter your booking reference to view your appointment status and
            download your confirmation.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. ZS-20250705-000001"
              className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm font-medium text-white placeholder-stone-500 outline-none transition focus:border-white/30 focus:bg-white/15"
            />
            <button
              type="submit"
              disabled={loading || !reference.trim()}
              className="flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSearch className="text-xs" />
              {loading ? "Searching..." : "Track Booking"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}
        </div>
      </section>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 pb-24">

        {/* Loading */}
        {loading && (
          <div className="mt-16 flex flex-col items-center justify-center gap-5 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-teal-600" />
            <p className="text-sm font-medium text-stone-500">
              Looking up your booking...
            </p>
          </div>
        )}

        {/* Not Found */}
        {!loading && searched && !booking && !error && (
          <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <FaSearch className="text-3xl text-stone-300" />
            </div>
            <h3 className="text-xl font-semibold text-stone-700">
              Booking Not Found
            </h3>
            <p className="max-w-sm text-sm text-stone-500">
              We could not find a booking matching that reference. Please check
              the reference and try again.
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && booking && (
          <div className="-mt-8 space-y-6">

            {/* ── Booking Summary ─────────────────────────────────────── */}
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-100">
              <div className="border-b border-stone-100 px-8 py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                      Booking Reference
                    </p>
                    <h2 className="mt-1 font-mono text-2xl font-bold text-stone-900">
                      {booking.bookingReference}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                        PAYMENT_STATUS_COLORS[booking.paymentStatus] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {PAYMENT_STATUS_LABELS[booking.paymentStatus] ||
                        booking.paymentStatus}
                    </span>
                    <span
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                        BOOKING_STATUS_COLORS[booking.bookingStatus] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {BOOKING_STATUS_LABELS[booking.bookingStatus] ||
                        booking.bookingStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-0 divide-y divide-stone-50 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="px-8 py-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                    Customer
                  </p>
                  <p className="mt-2 text-base font-semibold text-stone-800">
                    {booking.customerName}
                  </p>
                  <p className="mt-0.5 text-sm text-stone-500">{booking.email}</p>
                </div>
                <div className="px-8 py-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                    Total Amount
                  </p>
                  <p className="mt-2 text-2xl font-bold text-teal-700">
                    {fmt.currency(booking.totalAmount)}
                  </p>
                  <p className="mt-0.5 text-sm text-stone-500">
                    via {booking.paymentMethod?.name || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Two-column: Appointment + Therapist ─────────────────── */}
            <div className="grid gap-6 md:grid-cols-2">

              {/* Appointment */}
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
                <h3 className="mb-5 flex items-center gap-2.5 text-sm font-bold uppercase tracking-widest text-stone-400">
                  <FaCalendarAlt className="text-teal-500" />
                  Appointment
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-stone-400">Date</p>
                    <p className="mt-0.5 font-semibold text-stone-800">
                      {fmt.date(booking.bookingDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Time</p>
                    <p className="mt-0.5 font-semibold text-stone-800">
                      {booking.time || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Service</p>
                    <p className="mt-0.5 font-semibold text-stone-800">
                      {booking.service?.name || "—"}
                    </p>
                  </div>
                  {booking.service?.duration && (
                    <div>
                      <p className="text-xs text-stone-400">Duration</p>
                      <p className="mt-0.5 font-semibold text-stone-800">
                        {booking.service.duration} mins
                      </p>
                    </div>
                  )}
                  {booking.service?.price && (
                    <div>
                      <p className="text-xs text-stone-400">Price</p>
                      <p className="mt-0.5 font-semibold text-stone-800">
                        {fmt.currency(booking.service.price)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Therapist */}
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
                <h3 className="mb-5 flex items-center gap-2.5 text-sm font-bold uppercase tracking-widest text-stone-400">
                  <FaSpa className="text-teal-500" />
                  Your Therapist
                </h3>
                {booking.therapist ? (
                  <div className="flex items-center gap-5">
                    <img
                      src={imageUrl(booking.therapist.image) || fallbackAvatar}
                      alt={booking.therapist.name}
                      onError={(e) => { e.target.src = fallbackAvatar; }}
                      className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover shadow-sm"
                    />
                    <div>
                      <p className="text-lg font-bold text-stone-900">
                        {booking.therapist.name}
                      </p>
                      {booking.therapist.specialization && (
                        <p className="mt-0.5 text-sm text-teal-700">
                          {booking.therapist.specialization}
                        </p>
                      )}
                      {booking.therapist.experience && (
                        <p className="mt-1 text-xs text-stone-400">
                          {booking.therapist.experience} yrs experience
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-stone-400">
                    <FaUser className="text-3xl" />
                    <p className="text-sm">Therapist information unavailable.</p>
                  </div>
                )}
              </div>

            </div>

            {/* ── Timeline ────────────────────────────────────────────── */}
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-100">
              <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-stone-400">
                Booking Progress
              </h3>
              <div className="space-y-0">
                {timeline.map((step, i) => {
                  const isLast = i === timeline.length - 1;
                  return (
                    <div key={step.key} className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                            step.rejected
                              ? "bg-red-100 text-red-500"
                              : step.done
                              ? "bg-teal-600 text-white"
                              : "bg-stone-100 text-stone-300"
                          }`}
                        >
                          {step.done ? (
                            <FaCheckCircle className="text-sm" />
                          ) : (
                            <FaClock className="text-sm" />
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`mt-1 w-0.5 flex-1 ${
                              step.done ? "bg-teal-200" : "bg-stone-100"
                            }`}
                            style={{ minHeight: "2.5rem" }}
                          />
                        )}
                      </div>
                      <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                        <p
                          className={`text-sm font-semibold ${
                            step.rejected
                              ? "text-red-600"
                              : step.done
                              ? "text-stone-900"
                              : "text-stone-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-xs text-stone-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Download Confirmation ────────────────────────────────── */}
            {booking.confirmationPdf && (
              <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-teal-700 px-8 py-7 sm:flex-row">
                <div>
                  <p className="font-semibold text-white">
                    Your confirmation is ready.
                  </p>
                  <p className="mt-0.5 text-sm text-teal-200">
                    Download your PDF confirmation to keep for your records.
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex flex-shrink-0 items-center gap-2.5 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-teal-700 transition hover:bg-teal-50 disabled:opacity-60"
                >
                  <FaDownload />
                  {downloading ? "Downloading..." : "Download PDF"}
                </button>
              </div>
            )}

          </div>
        )}

      </section>
    </div>
  );
};

export default TrackBooking;
