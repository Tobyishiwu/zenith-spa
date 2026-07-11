import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaArrowRight, FaClock, FaTag, FaCheckCircle, FaHome, FaHotel, FaBriefcase, FaCompass, FaMapMarkerAlt, FaStar, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";
import useTherapists from "../hooks/useTherapists";

// ── PREMIUM LUXURY THERAPIST PROFILE CARD ────────────────────────
const TherapistCard = ({ therapist }) => {
  // Safe extraction of backend parameters
  const { _id, id, slug, name, specialization, image, experience } = therapist || {};
  const targetId = _id || id || slug;

  // Curated list of marketing venue tags requested by design guidelines
  const venueLabels = [
    { label: "Home", icon: <FaHome className="text-[10px]" /> },
    { label: "Hotel", icon: <FaHotel className="text-[10px]" /> },
    { label: "Office", icon: <FaBriefcase className="text-[10px]" /> },
    { label: "Vacation", icon: <FaCompass className="text-[10px]" /> },
    { label: "Private", icon: <FaMapMarkerAlt className="text-[10px]" /> },
  ];

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-stone-200/20 bg-white shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-stone-200/20">
      
      {/* Premium Media Wrapper Showcase */}
      <div className="relative h-80 overflow-hidden bg-stone-100">
        <img
          src={image || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"}
          alt={name || "Zenith Therapist"}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-102 opacity-95 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Superior Status Overlays */}
        <div className="absolute left-5 top-5 flex flex-col gap-1.5 items-start">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-[10px] font-semibold text-stone-700 shadow-sm uppercase tracking-wider">
            <FaCheckCircle className="text-teal-600 text-[10px]" /> Verified Professional
          </span>
          {experience && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-1.5 text-[10px] font-semibold text-white shadow-md uppercase tracking-wider">
              <FaStar className="text-[9px] text-amber-300" /> {experience} Experience
            </span>
          )}
        </div>

        <span className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 rounded-xl bg-stone-900/60 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-white shadow-sm">
          <FaGlobe className="text-[9px] text-teal-400" /> Executive Class
        </span>
      </div>

      {/* Information Profile Segment Block */}
      <div className="flex flex-grow flex-col justify-between p-8">
        <div>
          <h3 className="text-xl font-normal tracking-tight text-stone-900 group-hover:text-teal-600 transition-colors duration-300">
            {name || "Specialist Practitioner"}
          </h3>

          {specialization && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-600/90 mt-1 mb-4">
              {specialization}
            </p>
          )}

          {/* Marketing Venue Availability Badge Grid Row */}
          <div className="mb-5">
            <span className="block text-[9px] uppercase font-semibold tracking-wider text-stone-400 mb-2">Deployed Service Venues</span>
            <div className="flex flex-wrap gap-1">
              {venueLabels.map((v, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1 rounded-lg bg-stone-50/80 border border-stone-200/40 px-2 py-0.5 text-[9px] font-medium text-stone-500 shadow-2xs"
                  title={`${v.label} Availability Ready`}
                >
                  {v.icon}
                  <span>{v.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Direct Links Row Structure */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between gap-4">
          <Link
            to={`/booking?therapist=${targetId}`}
            className="inline-flex items-center justify-center rounded-xl border border-teal-600/30 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-teal-600 shadow-sm transition-all duration-200 hover:border-teal-500 hover:bg-teal-50/50 hover:text-teal-700 active:scale-98"
          >
            Request Appointment
          </Link>
          
          <Link
            to={`/therapists/${slug || targetId}`}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-400 transition-all hover:gap-2 hover:text-stone-600 py-2"
          >
            View Portfolio <FaArrowRight className="text-[9px]" />
          </Link>
        </div>
      </div>
    </article>
  );
};

// ── SKELETON PLACEHOLDER LOADING MODULE ──────────────────────────
const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-[2.5rem] bg-white border border-stone-200/20 shadow-sm">
    <div className="h-80 bg-stone-100" />
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 w-1/3 rounded bg-stone-100" />
        <div className="h-4 w-1/4 rounded bg-stone-100" />
      </div>
      <div className="h-6 w-2/3 rounded bg-stone-100" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-stone-100" />
        <div className="h-3 w-5/6 rounded bg-stone-100" />
      </div>
      <div className="h-12 w-full rounded-xl bg-stone-100 mt-4" />
    </div>
  </div>
);

// ── MAIN THERAPISTS PAGE CONTAINER ────────────────────────────────
const Therapists = () => {
  const { therapists, loading } = useTherapists();

  console.log("therapists =>", therapists);
  console.log("isArray =>", Array.isArray(therapists));
  const [search, setSearch] = useState("");

  const therapistList = Array.isArray(therapists) ? therapists : [];

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return therapistList;

    return therapistList.filter((t) => {
      const name = (t?.name || "").toLowerCase();
      const specialization = (t?.specialization || "").toLowerCase();

      return (
        name.includes(keyword) ||
        specialization.includes(keyword)
      );
    });
  }, [therapistList, search]);

  console.log("filtered =>", filtered);
  console.log("filtered is array =>", Array.isArray(filtered));

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 antialiased selection:bg-teal-50 selection:text-teal-800">
      
      {/* Luxury Hero Banner Section */}
      <section className="relative flex min-h-[65vh] items-center overflow-hidden bg-stone-950 pb-24 pt-36">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1800&q=80"
            alt="Zenith Spa Therapists"
            className="h-full w-full object-cover opacity-[0.22] scale-100 transition-transform duration-10000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-[#FAF9F6]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-300 backdrop-blur-md mb-6">
              <FaGlobe className="text-teal-400 text-[10px] animate-pulse" /> Certified Roster Directory
            </span>

            <h1 className="text-4xl font-extralight tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.15]">
              Meet Our Global <br />
              <span className="font-normal text-teal-400 font-serif italic tracking-normal">Wellness Experts</span>
            </h1>

            <p className="mt-6 text-sm sm:text-base leading-7 text-stone-300 max-w-xl font-light tracking-wide">
              Every therapist is professionally trained, thoroughly certified, and carefully selected to deliver a five-star spa experience wherever you choose.
            </p>
          </div>
        </div>
      </section>

      {/* Roster Controls & Curated Search Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row border-b border-stone-200/30 pb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 ring-1 ring-stone-200/50 mb-2">
              Practitioner Registry
            </span>
            <h2 className="text-xl font-light tracking-tight text-stone-900 sm:text-2xl">
              Filter Curated <span className="font-normal text-teal-600">Specialists</span>
            </h2>
          </div>

          <div className="relative w-full max-w-md">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by practitioner name or specialization..."
              className="w-full rounded-xl border border-stone-200/60 bg-white py-3 pl-10 pr-4 text-xs text-stone-800 shadow-sm outline-none transition placeholder-stone-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/10"
            />
          </div>
        </div>

        {/* Loading UI State Handler */}
        {loading && (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty Search Fallback State Handler */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-stone-200/40 shadow-sm">
              <FiSearch className="text-lg text-stone-300" />
            </div>

            <h3 className="mt-6 text-sm font-medium text-stone-800">
              No matching profiles found
            </h3>

            <p className="mt-2 text-xs text-stone-400 max-w-xs font-light">
              Try modifying your criteria parameters or clearing the filter field completely.
            </p>

            <button
              onClick={() => setSearch("")}
              className="mt-6 rounded-xl border border-teal-600/30 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-teal-600 shadow-sm transition hover:bg-teal-50/40"
            >
              Reset Search Parameters
            </button>
          </div>
        )}

        {/* Curated Grid Display Population Loop */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((therapist) => (
                <TherapistCard
                  key={therapist._id || therapist.slug || therapist.id}
                  therapist={therapist}
                />
              ))}
            </div>

            {search && (
              <p className="mt-12 text-center text-xs tracking-widest text-stone-400 uppercase font-medium">
                Retrieved <span className="font-semibold text-stone-600">{filtered.length}</span> verified result{filtered.length !== 1 ? "s" : ""} for "{search}"
              </p>
            )}
          </>
        )}
      </section>

      {/* CTA Conversion Upgrade Section */}
      <section className="bg-white border-t border-stone-200/40 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 ring-1 ring-stone-200/40 shadow-sm mb-6">
            Zenith Experience Orchestration
          </span>

          <h2 className="text-3xl font-light tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
            Find Your Absolute <span className="font-normal text-teal-600">Perfect Wellness Match</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-xs sm:text-sm leading-6 text-stone-500 font-light">
            Browse premium verified profiles, explore exclusive target treatment modalities, and request instant deployment directly to your exact venue location.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-xl border border-teal-600/30 bg-white px-7 py-4 text-xs font-semibold uppercase tracking-wider text-teal-600 shadow-sm transition-all duration-200 hover:border-teal-400 hover:bg-teal-50/40 hover:text-teal-700 active:scale-98"
            >
              Book Instant Appointment
              <FaArrowRight className="text-[9px] ml-1" />
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-400 transition-all hover:gap-2 hover:text-stone-700 py-4 px-2"
            >
              Browse Luxury Treatments
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Therapists;