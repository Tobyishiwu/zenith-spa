import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import TherapistCard from "../components/TherapistCard";
import useTherapists from "../hooks/useTherapists";

const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-100">
    <div className="h-72 bg-stone-100" />
    <div className="p-6 space-y-3">
      <div className="h-4 w-2/3 rounded-lg bg-stone-100" />
      <div className="h-3 w-1/2 rounded-lg bg-stone-100" />
      <div className="h-3 w-1/3 rounded-lg bg-stone-100" />
    </div>
  </div>
);

const Therapists = () => {
  const { therapists, loading } = useTherapists();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return therapists;
    const kw = search.toLowerCase();
    return therapists.filter(
      (t) =>
        (t.name || "").toLowerCase().includes(kw) ||
        (t.specialization || "").toLowerCase().includes(kw)
    );
  }, [therapists, search]);

  return (
    <div className="min-h-screen bg-[#F8F6F2]">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[55vh] items-end overflow-hidden bg-stone-900 pb-20 pt-40">
        <img
          src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1800&q=80"
          alt="Zenith Spa Therapists"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <span className="inline-block rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-300 ring-1 ring-white/20">
            Our Therapists
          </span>
          <h1 className="mt-5 text-4xl font-light leading-tight text-white md:text-6xl">
            Meet Our
            <br />
            <span className="font-semibold text-teal-300">Wellness Experts</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-stone-300">
            Every therapist is professionally trained and carefully selected to deliver a five-star spa experience wherever you are.
          </p>
        </div>
      </section>

      {/* ── SEARCH + GRID ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        {/* Search */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-xl">
            <FiSearch className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialization..."
              className="w-full rounded-2xl border border-stone-200 bg-white py-4 pl-12 pr-5 text-sm text-stone-800 shadow-sm outline-none transition placeholder-stone-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <FiSearch className="text-3xl text-stone-300" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-stone-700">No therapists found</h3>
            <p className="mt-2 text-sm text-stone-400">
              Try a different name or specialization.
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((therapist) => (
                <TherapistCard key={therapist._id} therapist={therapist} />
              ))}
            </div>

            {search && (
              <p className="mt-8 text-center text-sm text-stone-400">
                Showing <span className="font-semibold text-stone-600">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""} for{" "}
                <span className="font-semibold text-stone-600">{`"${search}"`}</span>
              </p>
            )}
          </>
        )}

      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-stone-900 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Ready to Begin?</p>
          <h2 className="mt-4 text-3xl font-light text-white md:text-4xl">
            {"Find Your Perfect Therapist"}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-400">
            Browse profiles, read specializations, and book the therapist that fits your needs.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/booking" className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-teal-700 hover:shadow-lg">
              Book Appointment <FaArrowRight className="text-xs" />
            </Link>
            <Link to="/services" className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/20">
              Browse Treatments
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Therapists;
