import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaWhatsapp, FaPhone } from "react-icons/fa";

const HeroCard = () => {
  const navigate = useNavigate();
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  const handleTrack = () => {
    if (!reference.trim()) {
      setError("Please enter your booking reference.");
      return;
    }
    setError("");
    navigate(`/track-booking?ref=${reference.trim().toUpperCase()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleTrack(); }
  };

  return (
    <div className="w-[92vw] max-w-[340px] rounded-3xl border border-white/60 bg-white/85 p-5 shadow-2xl backdrop-blur-xl sm:w-[340px] sm:p-6">

      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
        Already Booked?
      </span>

      {/* Heading */}
      <h3 className="mt-3 text-base font-bold leading-snug text-gray-900 sm:text-lg">
        Track Your Booking
      </h3>

      {/* Description */}
      <p className="mt-1 text-xs leading-relaxed text-gray-500">
        Enter your booking reference to view your appointment status.
      </p>

      {/* Input */}
      <div className="mt-4">
        <div
          className={`flex items-center gap-2.5 rounded-2xl border bg-gray-50 px-4 py-3 transition focus-within:border-teal-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 ${
            error ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
        >
          <FaSearch className="flex-shrink-0 text-[11px] text-gray-400" />
          <input
            type="text"
            value={reference}
            onChange={(e) => { setReference(e.target.value); if (error) setError(""); }}
            onKeyDown={handleKeyDown}
            placeholder="ZS-20260705-000006"
            className="w-full bg-transparent text-sm font-medium text-gray-800 placeholder-gray-400 outline-none"
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
        )}
      </div>

      {/* Button */}
      <button
        onClick={handleTrack}
        className="mt-3 w-full rounded-2xl bg-teal-700 py-3 text-sm font-bold text-white transition hover:bg-teal-800 active:scale-[0.98]"
      >
        Track Booking
      </button>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-t border-gray-100 pt-3.5">
        <span className="text-xs text-gray-400">Need help?</span>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
        >
          <FaWhatsapp /> WhatsApp
        </a>
        <span className="select-none text-gray-200" aria-hidden="true">•</span>
        <a
          href="tel:+1234567890"
          className="flex items-center gap-1 text-xs font-semibold text-teal-700 transition hover:text-teal-800"
        >
          <FaPhone className="text-[10px]" /> Call Us
        </a>
      </div>

    </div>
  );
};

export default HeroCard;
