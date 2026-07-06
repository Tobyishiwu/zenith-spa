import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaArrowRight, FaClock, FaTag, FaMagic } from "react-icons/fa";
import { Link } from "react-router-dom";
import useServices from "../hooks/useServices";

const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-100">
    <div className="h-64 bg-stone-100" />
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 w-1/3 rounded-lg bg-stone-100" />
        <div className="h-4 w-1/4 rounded-lg bg-stone-100" />
      </div>
      <div className="h-5 w-2/3 rounded-lg bg-stone-100" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded-lg bg-stone-100" />
        <div className="h-3 w-5/6 rounded-lg bg-stone-100" />
      </div>
      <div className="h-10 w-full rounded-xl bg-stone-100 pt-2" />
    </div>
  </div>
);

const Services = () => {
  const { services, loading } = useServices();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(["All"]);
    if (Array.isArray(services)) {
      services.forEach((s) => {
        if (s && s.category) cats.add(s.category);
      });
    }
    return Array.from(cats);
  }, [services]);

  const filtered = useMemo(() => {
    if (!Array.isArray(services)) return [];
    let result = services;

    if (selectedCategory !== "All") {
      result = result.filter((s) => s && s.category === selectedCategory);
    }

    if (search.trim()) {
      const kw = search.toLowerCase();
      result = result.filter(
        (s) =>
          s &&
          ((s.name || "").toLowerCase().includes(kw) ||
            (s.description || "").toLowerCase().includes(kw) ||
            (s.category || "").toLowerCase().includes(kw))
      );
    }

    return result;
  }, [services, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-[#F8F6F2]">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[55vh] items-end overflow-hidden bg-stone-900 pb-20 pt-40">
        <img
          src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1800&q=80"
          alt="Zenith Spa Treatments"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <span className="inline-block rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-300 ring-1 ring-white/20">
            Our Menu
          </span>
          <h1 className="mt-5 text-4xl font-light leading-tight text-white md:text-6xl">
            Signature
            <br />
            <span className="font-semibold text-teal-300">Spa Treatments</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-stone-300">
            Explore our curated selection of luxury wellness services designed to bring deep relaxation, restoration, and balance directly to your doorstep.
          </p>
        </div>
      </section>

      {/* ── CONTROLS + GRID ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        {/* Filter & Search Bar Controls */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Categories Tab list */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 max-w-full justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition border ${
                  selectedCategory === cat
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Text Query Input */}
          <div className="relative w-full max-w-md">
            <FiSearch className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treatments..."
              className="w-full rounded-2xl border border-stone-200 bg-white py-3.5 pl-12 pr-5 text-sm text-stone-800 shadow-sm outline-none transition placeholder-stone-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        {/* Skeleton State UI Grid */}
        {loading && (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty Search Result Fallback UI state block */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <FiSearch className="text-3xl text-stone-300" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-stone-700">No treatments found</h3>
            <p className="mt-2 text-sm text-stone-400">
              Try adjusting your search query or selecting a different treatment category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-5 rounded-xl bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Services Main Loop Populated Content Dynamic Flex Grid */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((service) => (
                <div 
                  key={service._id} 
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-100 transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-64 overflow-hidden bg-stone-100">
                    <img
                      src={service.image || "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80"}
                      alt={service.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    {service.category && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-xl bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-stone-800 shadow-sm uppercase tracking-wider">
                        <FaMagic className="text-teal-500 text-[10px]" />
                        {service.category}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-grow flex-col justify-between p-6">
                    <div>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-xl font-bold text-stone-900 transition group-hover:text-teal-600">
                          {service.name}
                        </h3>
                        <span className="text-xl font-black text-stone-900 whitespace-nowrap">
                          ₦{(service.price || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-xs text-stone-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <FaClock className="text-stone-300" />
                          {service.duration || 60} mins
                        </span>
                        {service.targetArea && (
                          <span className="flex items-center gap-1.5">
                            <FaTag className="text-stone-300" />
                            {service.targetArea}
                          </span>
                        )}
                      </div>

                      <p className="mt-4 text-sm leading-6 text-stone-500 line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-50">
                      <Link
                        to={`/booking?service=${service._id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-50 group-hover:bg-teal-50 px-4 py-3 text-xs font-semibold text-stone-700 group-hover:text-teal-700 transition"
                      >
                        Book This Treatment <FaArrowRight className="text-[10px] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Metadata Contextual Count display string tag snippet */}
            {(search || selectedCategory !== "All") && (
              <p className="mt-8 text-center text-sm text-stone-400">
                Showing <span className="font-semibold text-stone-600">{filtered.length}</span> treatment{filtered.length !== 1 ? "s" : ""}
                {selectedCategory !== "All" && <> under <span className="font-semibold text-stone-600">{selectedCategory}</span></>}
                {search && <> matching <span className="font-semibold text-stone-600">"{search}"</span></>}
              </p>
            )}
          </>
        )}

      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-stone-900 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Tailored Indulgence</p>
          <h2 className="mt-4 text-3xl font-light text-white md:text-4xl">
            Not Sure What You Need?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-400">
            Connect with our expert consultants or look through our curated profiles to find a therapist specialized to map out your custom treatment path.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/therapists" className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-teal-700 hover:shadow-lg">
              Meet Our Experts <FaArrowRight className="text-xs" />
            </Link>
            <Link to="/contact" className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/20">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;