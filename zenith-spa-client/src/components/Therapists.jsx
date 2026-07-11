import { imageUrl } from "../utils/imageUrl";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBriefcase,
  FaStar,
  FaCheckCircle,
  FaGlobe,
  FaSlidersH,
} from "react-icons/fa";

import useTherapists from "../hooks/useTherapists";

const fallback =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80";

const Therapists = () => {
  const { therapists, loading } = useTherapists();

  if (loading) {
    return (
      <section id="therapists" className="bg-[#FAF9F6] py-24 border-t border-stone-200/30">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-medium text-stone-500 tracking-wider uppercase">
            Loading tailored therapist network...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="therapists"
      className="bg-[#FAF9F6] py-24 border-t border-stone-200/30"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 ring-1 ring-stone-200/40 shadow-sm mb-4">
            <FaSlidersH className="text-teal-600/80 text-[9px]" /> Intelligent Matching System
          </span>

          <h2 className="text-3xl font-light tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Elite Vetted Experts. <span className="font-normal text-teal-600">Worldwide Network.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-stone-500">
            Our luxury mobile wellness platform is designed to recommend verified practitioners tailored specifically to your scheduling preferences and destination venue.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {therapists.map((therapist) => (
            <div
              key={therapist._id}
              className="group overflow-hidden rounded-[2rem] border border-stone-200/30 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/30"
            >
              {/* Image Container */}
              <Link
                to={`/therapists/${therapist.slug}`}
                className="relative block overflow-hidden bg-stone-50"
              >
                <img
                  src={imageUrl(therapist.image) || fallback}
                  alt={therapist.name}
                  onError={(e) => (e.target.src = fallback)}
                  className="h-[400px] w-full object-cover transition duration-700 group-hover:scale-102 opacity-95 group-hover:opacity-100"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-10">
                  <span className="rounded-xl border border-stone-200 bg-white/95 backdrop-blur-md px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-700 shadow-md">
                    View Credentials
                  </span>
                </div>

                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal-600 shadow-sm ring-1 ring-black/5">
                  <FaCheckCircle className="text-[10px]" />
                  <span>Verified Professional</span>
                </div>

                <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-xl bg-stone-900/70 backdrop-blur-md px-2.5 py-1.5 text-[11px] font-medium text-white shadow-sm">
                  <FaGlobe className="text-[10px] text-teal-400" />
                  <span>Mobile</span>
                </div>
              </Link>

              {/* Body Content */}
              <div className="p-8">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-medium tracking-tight text-stone-800 group-hover:text-stone-900 transition-colors">
                    {therapist.name}
                  </h3>

                  <div className="flex items-center gap-1 rounded-lg bg-stone-50 px-2 py-0.5 ring-1 ring-stone-200/30">
                    <FaStar className="text-amber-400 text-xs" />
                    <span className="text-xs font-semibold text-stone-700">
                      {therapist.rating}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600/90">
                  {therapist.specialization}
                </p>

                <p className="mt-4 line-clamp-3 text-xs leading-5 text-stone-500 font-normal">
                  {therapist.bio}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-400">
                    <FaBriefcase className="text-[11px]" />
                    <span className="text-stone-500">{therapist.experience} Yrs Experience</span>
                  </div>

                  <Link
                    to={`/booking?therapist=${therapist.slug}`}
                    className="inline-flex items-center justify-center rounded-xl border border-teal-600/30 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-teal-600 shadow-sm transition-all duration-200 hover:border-teal-400 hover:bg-teal-50/40 hover:text-teal-700 active:scale-98"
                  >
                    Smart Booking
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-16 text-center">
          <Link
            to="/therapists"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 transition-all hover:gap-3 hover:text-stone-800"
          >
            Explore Global Roster
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Therapists;