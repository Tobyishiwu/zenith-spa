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
import { services as dbServices } from "../data/services";
import usePaymentMethods from "../hooks/usePaymentMethods";

const fallback =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmpty = (value) =>
  value === undefined || value === null || String(value).trim() === "";

const BookingForm = ({ therapist, preselectedService }) => {
  const navigate = useNavigate();
  const { paymentMethods } = usePaymentMethods();

const safePaymentMethods = Array.isArray(paymentMethods)
  ? paymentMethods
  : [];

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

  useEffect(() => {
    if (preselectedService && dbServices && dbServices.length > 0) {
      const match = dbServices.find(
        (s) => s.slug === preselectedService.slug || s.name === preselectedService.name
      );
      if (match) setFormData((prev) => ({ ...prev, service: match._id }));
    }
  }, [preselectedService, dbServices]);

  useEffect(() => {
    if (!therapist) {
      setTherapistsLoading(true);
      axios
        .get("/therapists")
        .then((res) => setTherapists(res.data?.data || res.data?.therapists || []))
        .catch(() => setTherapists([]))
        .finally(() => setTherapistsLoading(false));
    }
  }, [therapist]);

  const inputClass = (field) =>
    `w-full rounded-2xl border px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
    }`;

  const labelClass = "mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700";

  const availabilityLabel =
    therapist?.availability === true || therapist?.availability === "true"
      ? "Available Today"
      : therapist?.availability === false || therapist?.availability === "false"
      ? "Unavailable"
      : therapist?.availability || null;

  const availabilityColor =
    therapist?.availability === false || therapist?.availability === "false"
      ? "bg-red-50 text-red-600"
      : "bg-green-50 text-green-700";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePaymentSelect = (id) => {
    setFormData((prev) => ({ ...prev, paymentMethod: id }));
    if (errors.paymentMethod) setErrors((prev) => ({ ...prev, paymentMethod: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "service", "customerName", "email", "phone",
      "address", "bookingDate", "time", "paymentMethod",
    ];
    if (!therapist) requiredFields.push("therapistId");
    requiredFields.forEach((field) => {
      if (isEmpty(formData[field])) newErrors[field] = "This field is required.";
    });
    if (formData.email && !EMAIL_REGEX.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    return newErrors;
  };

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
        therapist: therapist?._id || formData.therapistId,
        service: formData.service,
        paymentMethod: formData.paymentMethod,
        bookingDate: formData.bookingDate,
        time: formData.time,
      });
      if (response.data.success) navigate(`/payment/${response.data.data._id}`);
    } catch (err) {
      setErrors({ submit: err?.response?.data?.message || "Booking failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-10">

      {/* -- Therapist card ------------------------------------------- */}
      {therapist && (
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-lg sm:rounded-3xl sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50 opacity-60" />
          <div className="relative flex flex-row items-center gap-4 sm:gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={imageUrl(therapist.image) || fallback}
                alt={therapist.name}
                className="h-20 w-20 rounded-2xl object-cover shadow-md sm:h-28 sm:w-28 md:h-36 md:w-36"
              />
              <span className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 shadow sm:px-3 sm:py-1 sm:text-xs">
                <FaCheckCircle className="text-green-500" />
                Selected
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-600 sm:text-xs">
                Your Therapist
              </p>
              <h2 className="mt-0.5 truncate text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
                {therapist.name}
              </h2>
              <p className="truncate text-sm font-medium text-teal-700">{therapist.specialization}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {therapist.experience && (
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
                    {therapist.experience} Yrs Exp
                  </span>
                )}
                {therapist.rating && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    <FaStar className="text-amber-400" size={10} />
                    {therapist.rating}
                  </span>
                )}
                {availabilityLabel && (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${availabilityColor}`}>
                    {availabilityLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -- Service summary card ------------------------------------- */}
      {preselectedService && (
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-lg sm:rounded-3xl sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-teal-50 opacity-70" />
          <div className="relative flex flex-row items-center gap-4 sm:gap-5">
            <img
              src={preselectedService.image}
              alt={preselectedService.name}
              className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover shadow-md sm:h-28 sm:w-28 md:h-32 md:w-32"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-600 sm:text-xs">
                Selected Treatment
              </p>
              <h2 className="mt-0.5 truncate text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                {preselectedService.name}
              </h2>
              {preselectedService.subtitle && (
                <p className="truncate text-xs text-teal-700 sm:text-sm">{preselectedService.subtitle}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  <FaClock size={10} />
                  {preselectedService.duration}
                </span>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                  From ${preselectedService.startingPrice}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -- Main form ----------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-lg sm:rounded-3xl sm:p-6 md:p-10">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">Booking Details</h3>
          <p className="mt-1 text-sm text-gray-500">Fill in your details to schedule your session.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Therapist selector */}
            {!therapist && (
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  <FaUser className="text-teal-500" size={12} />
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
                      {t.name}{t.specialization ? ` — ${t.specialization}` : ""}
                    </option>
                  ))}
                </select>
                {errors.therapistId && <p className="mt-1 text-xs text-red-500">{errors.therapistId}</p>}
              </div>
            )}

            {/* Service dropdown */}
            {!preselectedService && (
              <div className="sm:col-span-2">
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
                      {s.name}{s.price ? ` — $${s.price}` : ""}{s.duration ? ` · ${s.duration} mins` : ""}
                    </option>
                  ))}
                </select>
                {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service}</p>}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className={labelClass}>
                <FaUser className="text-teal-500" size={12} /> Full Name
              </label>
              <input type="text" name="customerName" value={formData.customerName}
                onChange={handleChange} placeholder="Jane Smith" disabled={loading}
                className={inputClass("customerName")}
              />
              {errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>
                <FaEnvelope className="text-teal-500" size={12} /> Email Address
              </label>
              <input type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="jane@example.com" disabled={loading}
                className={inputClass("email")}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>
                <FaPhone className="text-teal-500" size={12} /> Phone Number
              </label>
              <input type="text" name="phone" value={formData.phone}
                onChange={handleChange} placeholder="+1 555 000 0000" disabled={loading}
                className={inputClass("phone")}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Booking Date */}
            <div>
              <label className={labelClass}>
                <FaCalendarAlt className="text-teal-500" size={12} /> Booking Date
              </label>
              <input type="date" name="bookingDate" value={formData.bookingDate}
                onChange={handleChange} min={new Date().toISOString().split("T")[0]}
                disabled={loading} className={inputClass("bookingDate")}
              />
              {errors.bookingDate && <p className="mt-1 text-xs text-red-500">{errors.bookingDate}</p>}
            </div>

            {/* Preferred Time */}
            <div>
              <label className={labelClass}>
                <FaClock className="text-teal-500" size={12} /> Preferred Time
              </label>
              <input type="time" name="time" value={formData.time}
                onChange={handleChange} disabled={loading} className={inputClass("time")}
              />
              {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className={labelClass}>
                <FaMapMarkerAlt className="text-teal-500" size={12} /> Service Address
              </label>
              <textarea rows={3} name="address" value={formData.address}
                onChange={handleChange}
                placeholder="Enter the address where the session will take place..."
                disabled={loading} className={`${inputClass("address")} resize-none`}
              />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
            </div>

            {/* Payment Methods */}
            <div className="sm:col-span-2">
              <label className="mb-3 block text-sm font-semibold text-gray-700">Payment Method</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {safePaymentMethods.map((method) => {
                  const selected = formData.paymentMethod === method._id;
                  return (
                    <button
                      key={method._id}
                      type="button"
                      disabled={loading}
                      onClick={() => handlePaymentSelect(method._id)}
                      className={`relative w-full cursor-pointer rounded-2xl border-2 p-4 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                        selected
                          ? "border-teal-600 bg-teal-50 shadow-md"
                          : "border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/40"
                      }`}
                    >
                      {selected && (
                        <span className="absolute right-3 top-3 text-teal-600">
                          <FaCheckCircle size={14} />
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        {method.icon && (
                          <img src={method.icon} alt={method.name}
                            className="h-10 w-10 flex-shrink-0 rounded-xl object-contain"
                          />
                        )}
                        <div className="min-w-0">
                          <h4 className={`truncate text-sm font-bold ${selected ? "text-teal-800" : "text-gray-800"}`}>
                            {method.name}
                          </h4>
                          {method.accountName && (
                            <p className="truncate text-xs text-gray-500">{method.accountName}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.paymentMethod && <p className="mt-2 text-xs text-red-500">{errors.paymentMethod}</p>}
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Additional Notes <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea rows={4} name="notes" value={formData.notes} onChange={handleChange}
                placeholder="Any preferences, allergies, or special requests..."
                disabled={loading}
                className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 disabled:opacity-60"
              />
            </div>

          </div>

          {errors.submit && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">
              {errors.submit}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="mt-8 w-full rounded-2xl bg-teal-700 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-teal-800 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Booking..." : "Continue to Payment"}
          </button>

        </form>
      </div>

    </div>
  );
};

export default BookingForm;


