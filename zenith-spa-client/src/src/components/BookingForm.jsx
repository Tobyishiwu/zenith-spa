import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";
import axios from "../api/axios";
import { services } from "../data/services";
import usePaymentMethods from "../hooks/usePaymentMethods";

// ─── Constants ────────────────────────────────────────────────────────────────

const fallback =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmpty = (value) =>
  value === undefined || value === null || String(value).trim() === "";

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * BookingForm supports three entry scenarios:
 *
 * 1. No therapist, no preselectedService  → user picks both
 * 2. therapist provided                   → therapist card shown, user picks service
 * 3. preselectedService provided          → service preselected, user picks therapist
 *
 * The `therapist` prop is a full MongoDB document (has ._id).
 * The `preselectedService` prop is a static service object from services.js (has .slug).
 *
 * The booking payload always sends therapist._id and service.slug to the backend.
 * The backend's createBooking looks up the service by slug to get the price.
 */
const BookingForm = ({ therapist, preselectedService }) => {
  const navigate = useNavigate();
  const { paymentMethods } = usePaymentMethods();

  const [formData, setFormData] = useState({
    // If a service was preselected via URL param, prefill its slug
    service: preselectedService?.slug || "",
    customerName: "",
    email: "",
    phone: "",
    address: "",
    bookingDate: "",
    time: "",
    paymentMethod: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Helpers ────────────────────────────────────────────────────────────────

  const inputClass = (field) =>
    `w-full rounded-2xl border px-5 py-4 text-sm text-gray-800 outline-none transition focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
    }`;

  const labelClass =
    "mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700";

  const availabilityLabel =
    therapist?.availability === true || therapist?.availability === "true"
      ? "Available Today"
      : therapist?.availability === false ||
        therapist?.availability === "false"
      ? "Unavailable"
      : therapist?.availability || null;

  const availabilityColor =
    therapist?.availability === false || therapist?.availability === "false"
      ? "bg-red-50 text-red-600"
      : "bg-green-50 text-green-700";

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePaymentSelect = (id) => {
    setFormData((prev) => ({ ...prev, paymentMethod: id }));
    if (errors.paymentMethod)
      setErrors((prev) => ({ ...prev, paymentMethod: "" }));
  };

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = () => {
    const newErrors = {};

    const required = [
      "service",
      "customerName",
      "email",
      "phone",
      "address",
      "bookingDate",
      "time",
      "paymentMethod",
    ];

    required.forEach((field) => {
      if (isEmpty(formData[field])) {
        newErrors[field] = "This field is required.";
      }
    });

    if (formData.email && !EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    return newErrors;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/bookings", {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        therapist: therapist?._id,
        service: formData.service,
        paymentMethod: formData.paymentMethod,
        bookingDate: formData.bookingDate,
        time: formData.time,
      });

      if (response.data.success) {
        navigate(`/payment/${response.data.data._id}`);
      }
    } catch (err) {
      setErrors({
        submit:
          err?.response?.data?.message || "Booking failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 pb-16">

      {/* ── Scenario 2: Therapist already selected — show summary card ──── */}
      {therapist && (
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50 opacity-60" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center">

            <div className="relative flex-shrink-0">
              <img
                src={therapist.image || fallback}
                alt={therapist.name}
                className="h-32 w-32 rounded-2xl object-cover shadow-md md:h-40 md:w-40"
              />
              <span className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 shadow">
                <FaCheckCircle className="text-green-500" />
                Selected
              </span>
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                Your Therapist
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {therapist.name}
              </h2>
              <p className="text-base font-medium text-teal-700">
                {therapist.specialization}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {therapist.experience && (
                  <span className="rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-800">
                    {therapist.experience} Yrs Experience
                  </span>
                )}
                {therapist.rating && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
                    <FaStar className="text-amber-400" />
                    {therapist.rating}
                  </span>
                )}
                {availabilityLabel && (
                  <span className={`rounded-full px-4 py-1.5 text-sm font-medium ${availabilityColor}`}>
                    {availabilityLabel}
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Scenario 3: Service already selected — show service summary card */}
      {preselectedService && (
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-teal-50 opacity-70" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center">

            <img
              src={preselectedService.image}
              alt={preselectedService.name}
              className="h-28 w-28 rounded-2xl object-cover shadow-md md:h-36 md:w-36"
            />

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                Selected Treatment
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {preselectedService.name}
              </h2>
              {preselectedService.subtitle && (
                <p className="mt-0.5 text-sm text-teal-700">
                  {preselectedService.subtitle}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700">
                  <FaClock className="text-xs" />
                  {preselectedService.duration}
                </span>
                <span className="rounded-full bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-800">
                  From ${preselectedService.startingPrice}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Booking Form ─────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-white p-6 shadow-xl md:p-10">

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Booking Details</h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill in your details to schedule your session.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-6 md:grid-cols-2">

            {/* ── Service selector
                  Hidden when a preselectedService is provided (Scenario 3).
                  Shown when no service is preselected (Scenarios 1 & 2). ── */}
            {!preselectedService && (
              <div className="md:col-span-2">
                <label className={labelClass}>Treatment / Service</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass("service")}
                >
                  <option value="">Choose a treatment…</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.slug}>
                      {s.name} — ${s.startingPrice} · {s.duration}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="mt-1 text-xs text-red-500">{errors.service}</p>
                )}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className={labelClass}>
                <FaUser className="text-teal-500" />
                Full Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Jane Smith"
                disabled={loading}
                className={inputClass("customerName")}
              />
              {errors.customerName && (
                <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>
                <FaEnvelope className="text-teal-500" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                disabled={loading}
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>
                <FaPhone className="text-teal-500" />
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555 000 0000"
                disabled={loading}
                className={inputClass("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Booking Date */}
            <div>
              <label className={labelClass}>
                <FaCalendarAlt className="text-teal-500" />
                Booking Date
              </label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                disabled={loading}
                className={inputClass("bookingDate")}
              />
              {errors.bookingDate && (
                <p className="mt-1 text-xs text-red-500">{errors.bookingDate}</p>
              )}
            </div>

            {/* Preferred Time */}
            <div>
              <label className={labelClass}>
                <FaClock className="text-teal-500" />
                Preferred Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                disabled={loading}
                className={inputClass("time")}
              />
              {errors.time && (
                <p className="mt-1 text-xs text-red-500">{errors.time}</p>
              )}
            </div>

            {/* Service Address */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                <FaMapMarkerAlt className="text-teal-500" />
                Service Address
              </label>
              <textarea
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter the address where the session will take place…"
                disabled={loading}
                className={`${inputClass("address")} resize-none`}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Payment Methods */}
            <div className="md:col-span-2">
              <label className="mb-4 block text-sm font-semibold text-gray-700">
                Payment Method
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                {paymentMethods.map((method) => {
                  const selected = formData.paymentMethod === method._id;
                  return (
                    <button
                      key={method._id}
                      type="button"
                      disabled={loading}
                      onClick={() => handlePaymentSelect(method._id)}
                      className={`relative w-full cursor-pointer rounded-2xl border-2 p-5 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                        selected
                          ? "border-teal-600 bg-teal-50 shadow-md"
                          : "border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/40"
                      }`}
                    >
                      {selected && (
                        <span className="absolute right-4 top-4 text-teal-600">
                          <FaCheckCircle />
                        </span>
                      )}
                      <div className="flex items-center gap-4">
                        {method.icon && (
                          <img
                            src={method.icon}
                            alt={method.name}
                            className="h-12 w-12 flex-shrink-0 rounded-xl object-contain"
                          />
                        )}
                        <div>
                          <h4 className={`font-bold ${selected ? "text-teal-800" : "text-gray-800"}`}>
                            {method.name}
                          </h4>
                          {method.accountName && (
                            <p className="mt-0.5 text-sm text-gray-500">
                              {method.accountName}
                            </p>
                          )}
                          {method.accountDetails && (
                            <p className="mt-0.5 text-xs text-gray-400">
                              {method.accountDetails}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.paymentMethod && (
                <p className="mt-2 text-xs text-red-500">{errors.paymentMethod}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Additional Notes{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                rows={4}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any preferences, allergies, or special requests…"
                disabled={loading}
                className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>

          </div>

          {/* Submit error */}
          {errors.submit && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {errors.submit}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-10 w-full rounded-2xl bg-teal-700 py-5 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-teal-800 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Booking…" : "Continue to Payment"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default BookingForm;
