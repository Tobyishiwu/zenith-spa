import { imageUrl } from "../utils/imageUrl";
import { useState, useEffect } from "react";
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
import useServices from "../hooks/useServices";
import usePaymentMethods from "../hooks/usePaymentMethods";

const fallback =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmpty = (value) =>
  value === undefined || value === null || String(value).trim() === "";

const BookingForm = ({ therapist, preselectedService }) => {
  const navigate = useNavigate();

  // useServices fetches from MongoDB — needed for real ObjectIds sent to backend
  const { services: dbServices } = useServices();
  const { paymentMethods } = usePaymentMethods();

  // Therapist list — only fetched when no therapist is preselected
  const [therapists, setTherapists] = useState([]);
  const [therapistsLoading, setTherapistsLoading] = useState(false);

  const [formData, setFormData] = useState({
    service: "",
    therapistId: therapist?._id || "",
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

  // When dbServices loads, find and preselect the matching MongoDB _id
  // for the service that arrived via URL slug
  useEffect(() => {
    if (preselectedService && dbServices && dbServices.length > 0) {
      const match = dbServices.find(
        (s) =>
          s.slug === preselectedService.slug ||
          s.name === preselectedService.name
      );
      if (match) {
        setFormData((prev) => ({ ...prev, service: match._id }));
      }
    }
  }, [preselectedService, dbServices]);

  // Fetch therapists when no therapist is preselected (Scenarios 1 and 3)
  useEffect(() => {
    if (!therapist) {
      setTherapistsLoading(true);
      axios
        .get("/therapists")
        .then((res) => {
          const data = res.data;
          setTherapists(
            data.data || data.therapists || []
          );
        })
        .catch(() => setTherapists([]))
        .finally(() => setTherapistsLoading(false));
    }
  }, [therapist]);

  // ── Helpers ──────────────────────────────────────────────────────────────

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

  // ── Handlers ─────────────────────────────────────────────────────────────

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

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    const newErrors = {};

    // therapistId only required in form when no therapist was passed as prop
    const requiredFields = [
      "service",
      "customerName",
      "email",
      "phone",
      "address",
      "bookingDate",
      "time",
      "paymentMethod",
    ];

    if (!therapist) requiredFields.push("therapistId");

    requiredFields.forEach((field) => {
      if (isEmpty(formData[field]))
        newErrors[field] = "This field is required.";
    });

    if (formData.email && !EMAIL_REGEX.test(formData.email))
      newErrors.email = "Enter a valid email address.";

    return newErrors;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

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
        // Use preselected therapist prop _id, or the one chosen in dropdown
        therapist: therapist?._id || formData.therapistId,
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 pb-16">

      {/* Therapist card — shown when therapist is preselected via prop */}
      {therapist && (
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50 opacity-60" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative flex-shrink-0">
              <img
src={imageUrl(therapist.image) || fallback}
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

      {/* Service summary card — shown when service arrived via URL param */}
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

      {/* Main form */}
      <div className="rounded-3xl bg-white p-6 shadow-xl md:p-10">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Booking Details</h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill in your details to schedule your session.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-6 md:grid-cols-2">

            {/* Therapist selector — only shown when no therapist prop */}
            {!therapist && (
              <div className="md:col-span-2">
                <label className={labelClass}>
                  <FaUser className="text-teal-500" />
                  Select Therapist
                </label>
                <select
                  name="therapistId"
                  value={formData.therapistId}
                  onChange={handleChange}
                  disabled={loading || therapistsLoading}
                  className={inputClass("therapistId")}
                >
                  <option value="">
                    {therapistsLoading ? "Loading therapists..." : "Choose a therapist..."}
                  </option>
                  {therapists.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                      {t.specialization ? ` — ${t.specialization}` : ""}
                    </option>
                  ))}
                </select>
                {errors.therapistId && (
                  <p className="mt-1 text-xs text-red-500">{errors.therapistId}</p>
                )}
              </div>
            )}

            {/* Service dropdown — hidden when service preselected via URL */}
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
                  <option value="">Choose a treatment...</option>
                  {dbServices && dbServices.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                      {s.price ? ` — $${s.price}` : ""}
                      {s.duration ? ` · ${s.duration} mins` : ""}
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

            {/* Address */}
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
                placeholder="Enter the address where the session will take place..."
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

            {/* Notes */}
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
                placeholder="Any preferences, allergies, or special requests..."
                disabled={loading}
                className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>

          </div>

          {errors.submit && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-10 w-full rounded-2xl bg-teal-700 py-5 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-teal-800 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Booking..." : "Continue to Payment"}
          </button>

        </form>
      </div>

    </div>
  );
};

export default BookingForm;
