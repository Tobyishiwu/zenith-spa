import { Link, useParams } from "react-router-dom";
import {
  FaStar,
  FaBriefcase,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import useTherapist from "../hooks/useTherapist";
import { imageUrl } from "../utils/imageUrl";

const fallback =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80";

const TherapistDetails = () => {
  const { slug } = useParams();
  const { therapist, loading } = useTherapist(slug);

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <p className="text-xs font-semibold tracking-wider uppercase text-stone-400 animate-pulse">
          Loading profile...
        </p>
      </section>
    );
  }

  if (!therapist) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <div className="text-center max-w-sm px-6">
          <h2 className="text-2xl font-light tracking-tight text-stone-900">Therapist Not Found</h2>
          <p className="mt-2 text-xs font-light text-stone-500 leading-5">
            The wellness professional you are looking for is currently unavailable or does not exist.
          </p>
          <Link
            to="/therapists"
            className="mt-6 inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-stone-600 shadow-xs transition hover:bg-stone-50"
          >
            Back to Therapists
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FAF9F6] text-stone-800 antialiased pb-24 pt-36">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-start lg:gap-16">

        {/* ── IMAGE WRAPPER (CLEAN TECH TECH AESTHETIC) ── */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-stone-200/40 bg-white p-3 shadow-xs">
            <img
              src={imageUrl(therapist.image) || fallback}
              alt={therapist.name}
              onError={(e) => { e.target.src = fallback; }}
              className="h-[560px] w-full rounded-xl object-cover"
            />
          </div>
          <div className="absolute left-7 top-7 inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-stone-200/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-teal-700 shadow-xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" /> Available Today
          </div>
        </div>

        {/* ── DETAILS PANEL ── */}
        <div className="lg:pt-3">
          <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Zenith Spa Therapist
          </span>

          <h1 className="mt-4 text-3xl font-light tracking-tight text-stone-900 sm:text-4xl">{therapist.name}</h1>
          <p className="mt-2 text-sm font-medium text-teal-600">{therapist.specialization}</p>

          {/* Metrics Container */}
          <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-stone-200/40 py-4 text-xs font-light text-stone-500">
            {therapist.rating && (
              <div className="flex items-center gap-1.5">
                <FaStar className="text-amber-400" size={13} />
                <span className="font-semibold text-stone-800">{therapist.rating}</span>
                {therapist.reviews && (
                  <span className="text-stone-400">({therapist.reviews} reviews)</span>
                )}
              </div>
            )}
            {therapist.experience && (
              <div className="flex items-center gap-1.5 border-l border-stone-200/60 pl-6">
                <FaBriefcase className="text-stone-400" size={13} />
                <span><strong className="font-medium text-stone-800">{therapist.experience}</strong> Years Experience</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 border-l border-stone-200/60 pl-6 text-emerald-600 font-medium">
              <FaCheckCircle size={13} />
              <span>Active Now</span>
            </div>
          </div>

          {therapist.bio && (
            <p className="mt-6 text-xs font-light leading-6 tracking-wide text-stone-500">{therapist.bio}</p>
          )}

          {/* Highlights Card */}
          <div className="mt-8 rounded-2xl border border-stone-200/40 bg-white p-6 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Why Choose {therapist.name.split(" ")[0]}?
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Certified professional therapist",
                "Luxury home spa treatments",
                "Flexible appointment scheduling",
                "Trusted by hundreds of clients",
              ].map((point) => (
                <div key={point} className="flex gap-2.5 items-start">
                  <FaCheckCircle className="mt-0.5 flex-shrink-0 text-teal-600" size={12} />
                  <span className="text-xs font-light tracking-wide text-stone-600">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action Call */}
          <div className="mt-8 pt-2">
            <Link
              to={`/booking?therapist=${therapist.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition duration-200 hover:bg-teal-700 active:scale-98"
            >
              Book {therapist.name.split(" ")[0]}
              <FaArrowRight className="text-[9px]" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TherapistDetails;