import { Link } from "react-router-dom";
import { FaArrowRight, FaHome, FaHotel, FaBriefcase, FaCompass, FaMapMarkerAlt, FaSlidersH } from "react-icons/fa";

const BookingCTA = () => {
  const venues = [
    { label: "Home", icon: <FaHome className="text-xs" /> },
    { label: "Hotel", icon: <FaHotel className="text-xs" /> },
    { label: "Office", icon: <FaBriefcase className="text-xs" /> },
    { label: "Vacation Rental", icon: <FaCompass className="text-xs" /> },
    { label: "Private Venue", icon: <FaMapMarkerAlt className="text-xs" /> },
  ];

  return (
    <section className="py-24 bg-[#FAF9F6]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[2.5rem] border border-stone-200/30 bg-white px-8 py-16 shadow-sm sm:px-12 sm:py-20 lg:flex lg:items-center lg:justify-between lg:gap-12">
          
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 ring-1 ring-stone-200/40 shadow-sm mb-6">
              <FaSlidersH className="text-teal-600/80 text-[9px]" /> Smart Booking Experience
            </span>

            <h2 className="text-3xl font-light tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Luxury Mobile Wellness. <span className="font-normal text-teal-600">Wherever You Are.</span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-stone-500">
              Our intelligent platform is designed to recommend verified practitioners right to your location. Select your destination venue and experience a pristine therapeutic session tailored precisely to your environment.
            </p>

            <div className="mt-8">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block mb-3">
                Available Destinations:
              </span>
              <div className="flex flex-wrap gap-2">
                {venues.map((venue, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-xl bg-stone-50 px-3.5 py-2 text-xs font-medium text-stone-600 ring-1 ring-stone-200/30 shadow-none transition-all duration-200"
                  >
                    <span className="text-teal-600/80">{venue.icon}</span>
                    <span>{venue.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions — View Therapists is now the major/primary button */}
          <div className="mt-10 lg:mt-0 flex flex-col gap-3 flex-shrink-0">
            <Link
              to="/therapists"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-stone-900 px-7 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-black active:scale-98"
            >
              View Therapists
              <FaArrowRight className="text-[10px]" />
            </Link>

            <Link
              to="/therapists"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-7 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500 transition-all duration-200 hover:border-stone-300 hover:bg-stone-50"
            >
              Book Appointment
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BookingCTA;