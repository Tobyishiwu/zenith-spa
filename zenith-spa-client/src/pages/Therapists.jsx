import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import useTherapists from "../hooks/useTherapists";

const TherapistCard = ({ therapist }) => {
  const { _id, id, slug, name, specialization, image } = therapist || {};
  const targetId = _id || id || slug;
  const detailPath = `/therapists/${slug || targetId}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200/40 bg-white shadow-xs transition-all duration-400 hover:-translate-y-1 hover:shadow-xl">
      {/* Visual Focal Point: Clean, badge-free imagery */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <img
          src={image || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"}
          alt={name || "Therapist"}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Clean Minimalist Typography & Actions */}
      <div className="flex flex-col p-6">
        <div>
          <h3 className="text-xl font-normal tracking-tight text-stone-900 group-hover:text-teal-600 transition-colors duration-300">
            {name || "Specialist Practitioner"}
          </h3>
          {specialization && (
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-teal-600/90 mt-1">
              {specialization}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            to={detailPath}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:bg-black active:scale-98"
          >
            View Details
            <FaArrowRight className="text-[9px]" />
          </Link>
          <Link
            to={detailPath}
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-500 transition-all duration-200 hover:border-stone-300 hover:bg-stone-50"
          >
            Request Appointment
          </Link>
        </div>
      </div>
    </article>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-3xl bg-white border border-stone-200/40 shadow-xs">
    <div className="aspect-[4/5] bg-stone-100" />
    <div className="p-6 space-y-3">
      <div className="h-5 w-2/3 rounded bg-stone-100" />
      <div className="h-3 w-1/3 rounded bg-stone-100" />
      <div className="h-10 w-full rounded-xl bg-stone-100 mt-4" />
    </div>
  </div>
);

const Therapists = () => {
  const { therapists, loading } = useTherapists();
  const [search, setSearch] = useState("");

  const therapistList = Array.isArray(therapists) ? therapists : [];

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return therapistList;

    return therapistList.filter((t) => {
      const name = (t?.name || "").toLowerCase();
      const specialization = (t?.specialization || "").toLowerCase();
      return name.includes(keyword) || specialization.includes(keyword);
    });
  }, [therapistList, search]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 antialiased">
      
      {/* Simplified Hero Section heading directly into the visual directory */}
      <header className="mx-auto max-w-7xl px-6 pt-32 pb-12 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-stone-200/60 pb-8">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">
              Our Professional <span className="font-normal text-teal-600">Therapists</span>
            </h1>
          </div>

          <div className="relative w-full max-w-sm">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search therapists..."
              className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-xs text-stone-800 shadow-2xs outline-none transition placeholder-stone-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/10"
            />
          </div>
        </div>
      </header>

      {/* Main Roster Display */}
      <main className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-stone-200/40 shadow-xs">
              <FiSearch className="text-stone-300" />
            </div>
            <h3 className="mt-4 text-sm font-medium text-stone-800">No practitioners found</h3>
            <button
              onClick={() => setSearch("")}
              className="mt-4 rounded-xl border border-teal-600/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-600 transition hover:bg-teal-50/40"
            >
              Clear Filter
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((therapist) => (
              <TherapistCard
                key={therapist._id || therapist.slug || therapist.id}
                therapist={therapist}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Therapists;