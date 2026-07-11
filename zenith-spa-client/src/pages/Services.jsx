import { useMemo, useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import { FaArrowRight, FaClock, FaTag, FaHome, FaHotel, FaBriefcase, FaCompass, FaMapMarkerAlt, FaStar, FaGlobe, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { services } from "../data/services";

const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-[2rem] bg-white border border-stone-200/20 shadow-sm">
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

const Services = () => {
  const loading = false;
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

  const getCustomPrice = (name) => {
    const lowerName = (name || "").toLowerCase();
    if (lowerName.includes("swedish")) return 25;
    if (lowerName.includes("deep tissue")) return 35;
    if (lowerName.includes("erotic")) return 45;
    if (lowerName.includes("facial")) return 40;
    if (lowerName.includes("scrub") || lowerName.includes("polish")) return 30;
    if (lowerName.includes("hot stone")) return 55;
    if (lowerName.includes("couples")) return 75;
    if (lowerName.includes("prenatal")) return 40;
    return 25;
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(services)) return [];
    let result = [...services];

    const hasErotic = result.some((s) => s && (s.name || "").toLowerCase().includes("erotic"));
    if (!hasErotic && selectedCategory === "All" && !search.trim()) {
      result.push({
        _id: "erotic-massage-luxury-id",
        id: "erotic-massage-luxury",
        slug: "erotic-massage",
        name: "Erotic Massage",
        subtitle: "Sensual Somatic Rejuvenation",
        category: "Massage",
        description: "A premium, deeply relaxing somatic experience designed to release deep-seated tension, enhance body awareness, and restore intimate energy flow inside a sanctuary of absolute discretion.",
        duration: "60 – 90 Minutes",
        startingPrice: 45,
        featured: true,
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
      });
    }

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

    return result.sort((a, b) => {
      const aErotic = (a.name || "").toLowerCase().includes("erotic");
      const bErotic = (b.name || "").toLowerCase().includes("erotic");
      if (aErotic && !bErotic) return -1;
      if (!aErotic && bErotic) return 1;
      return 0;
    });
  }, [services, selectedCategory, search]);

  const venues = [
    { label: "Home", icon: <FaHome />, desc: "Transform your living space into a private personal oasis of tranquility." },
    { label: "Hotel", icon: <FaHotel />, desc: "Elevate your travel experience with custom room service wellness therapies." },
    { label: "Office", icon: <FaBriefcase />, desc: "Decompress between high-stakes corporate meetings with expert target relief." },
    { label: "Vacation Rental", icon: <FaCompass />, desc: "Integrate premium global relaxation directly into your luxury getaway destination." },
    { label: "Private Venue", icon: <FaMapMarkerAlt />, desc: "Allow Zenith to arrange an exclusive standalone sanctuary tailored entirely for you." },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 antialiased selection:bg-teal-50 selection:text-teal-800">

      {/* ── LUXURY HERO SECTION ───────────────────────────────────── */}
      <section className="relative flex min-h-[75vh] items-center overflow-hidden bg-stone-950 pb-28 pt-40">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1800&q=80"
            alt="Zenith Spa Treatments"
            className="h-full w-full object-cover opacity-[0.18] scale-100 transition-transform duration-10000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-[#FAF9F6]" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-300 backdrop-blur-md mb-8">
              <FaGlobe className="text-teal-400 text-[10px] animate-pulse" /> Worldwide Mobile Platform
            </span>
            <h1 className="text-4xl font-extralight tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
              Luxury Wellness Experiences <br />
              <span className="font-normal text-teal-400 font-serif italic tracking-normal">Wherever You Are</span>
            </h1>
            <p className="mt-8 text-sm sm:text-base leading-7 text-stone-300 max-w-2xl font-light tracking-wide">
              Zenith Spa intelligently connects clients with trusted therapists worldwide for luxury wellness experiences at home, hotels, offices, vacation rentals or private venues.
            </p>
          </div>
        </div>
      </section>

      {/* ── FLEXIBLE DESTINATION SECTION ────────────────────────── */}
      <section className="relative z-20 mx-auto max-w-7xl px-6 -mt-16 lg:px-8">
        <div className="rounded-[2.5rem] bg-white border border-stone-200/40 p-10 lg:p-12 shadow-xl shadow-stone-200/20">
          <div className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 ring-1 ring-stone-200/50 mb-3">
              <FaMapMarkerAlt className="text-teal-600/80 text-[9px]" /> Adaptive Venue Deployment
            </span>
            <h2 className="text-2xl font-light tracking-tight text-stone-900 sm:text-3xl">
              Choose Where You Want <span className="font-normal text-teal-600">Your Session</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {venues.map((venue, idx) => (
              <div
                key={idx}
                className="group flex flex-col justify-between rounded-2xl border border-stone-100 bg-white p-6 shadow-none transition-all duration-300 hover:border-teal-600/20 hover:bg-stone-50/30 hover:shadow-lg hover:shadow-stone-100"
              >
                <div>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-stone-50 text-stone-700 ring-1 ring-stone-200/30 transition-all duration-300 group-hover:bg-white group-hover:text-teal-600 group-hover:shadow-sm">
                    {venue.icon}
                  </div>
                  <h3 className="mt-5 text-sm font-medium tracking-tight text-stone-900">
                    {venue.label}
                  </h3>
                  <p className="mt-2.5 text-[11px] leading-5 text-stone-500 font-light">
                    {venue.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTELLIGENT MATCHING SYSTEM SUMMARY ───────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-4 lg:px-8">
        <div className="rounded-[2rem] border border-stone-200/30 bg-gradient-to-br from-white to-stone-50/40 p-8 sm:p-10 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 ring-1 ring-stone-200/40 shadow-sm mb-4">
              <FiSliders className="text-teal-600 text-[10px]" /> Seamless Orchestration
            </span>
            <h3 className="text-2xl font-light tracking-tight text-stone-900 sm:text-3xl">
              Intelligent Therapist <span className="font-normal text-teal-600">Matching</span>
            </h3>
            <p className="mt-3 text-xs sm:text-sm leading-6 text-stone-500 font-light">
              Our intelligent matching platform is designed to recommend therapists based on your booking preferences, treatment type, availability and intended service location.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-4 border border-stone-200/30 text-xs text-stone-500 shadow-sm max-w-xs flex-shrink-0">
            <FaShieldAlt className="text-teal-600 text-base flex-shrink-0" />
            <span className="font-light leading-relaxed">System matches location availability instantly without faking metrics.</span>
          </div>
        </div>
      </section>

      {/* ── CONTROLS & CURATED FILTER MENU ────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row border-b border-stone-200/30 pb-8">
          <div className="flex flex-wrap gap-2 overflow-x-auto max-w-full justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-5 py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-stone-900 text-white shadow-md shadow-stone-900/10"
                    : "bg-white text-stone-400 border border-stone-200/40 hover:bg-stone-50 hover:text-stone-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-xs">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treatment menu..."
              className="w-full rounded-xl border border-stone-200/60 bg-white py-3 pl-10 pr-4 text-xs text-stone-800 shadow-sm outline-none transition placeholder-stone-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/10"
            />
          </div>
        </div>

        {/* Loading UI State Container */}
        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty Filter Screen Grid Result Handler */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-stone-200/40 shadow-sm">
              <FiSearch className="text-lg text-stone-300" />
            </div>
            <h3 className="mt-6 text-sm font-medium text-stone-800">No therapeutic options match criteria</h3>
            <p className="mt-2 text-xs text-stone-400 max-w-xs font-light">
              Try adjusting your query string or choosing another menu category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-6 rounded-xl border border-teal-600/30 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-teal-600 shadow-sm transition hover:bg-teal-50/40"
            >
              Reset Menu Parameters
            </button>
          </div>
        )}

        {/* Premium Luxury Grid Layout Output Container */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((service) => {
                const isErotic = (service.name || "").toLowerCase().includes("erotic");
                const dynamicPrice = getCustomPrice(service.name);

                return (
                  <article 
                    key={service._id || service.id} 
                    className="group flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-stone-200/20 bg-white shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-stone-200/20"
                  >
                    {/* Large Image Showcase Container Block */}
                    <div className="relative h-80 overflow-hidden bg-stone-100">
                      <img
                        src={service.image || "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80"}
                        alt={service.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-102 opacity-95 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Context Badges Top Bar Stack */}
                      <div className="absolute left-5 top-5 flex flex-col gap-1.5 items-start">
                        {service.category && (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-[10px] font-semibold text-stone-700 shadow-sm uppercase tracking-wider">
                            <FaTag className="text-teal-600 text-[9px]" />
                            {service.category}
                          </span>
                        )}
                        {(service.featured || isErotic) && (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-1.5 text-[10px] font-semibold text-white shadow-md uppercase tracking-wider">
                            <FaStar className="text-[9px] text-amber-300 animate-spin-slow" />
                            Featured Experience
                          </span>
                        )}
                      </div>

                      <span className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 rounded-xl bg-stone-900/60 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-white shadow-sm">
                        <FaGlobe className="text-[9px] text-teal-400" /> Global Roster
                      </span>
                    </div>

                    {/* Information Content Segment Block */}
                    <div className="flex flex-grow flex-col justify-between p-8">
                      <div>
                        <h3 className="text-xl font-normal tracking-tight text-stone-900 group-hover:text-teal-600 transition-colors duration-300">
                          {service.name}
                        </h3>

                        {service.subtitle && (
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-600/90 mt-1 mb-4">
                            {service.subtitle}
                          </p>
                        )}

                        <div className="mb-5 flex flex-wrap items-center gap-4 text-xs font-medium text-stone-500">
                          <span className="flex items-center gap-1.5 rounded-lg bg-stone-50 px-2.5 py-1 ring-1 ring-stone-200/30">
                            <FaClock className="text-stone-300 text-[10px]" />
                            <span className="text-stone-600 text-[11px]">{service.duration || "60 mins"}</span>
                          </span>
                          <span className="text-stone-200">|</span>
                          <div>
                            <span className="text-[10px] uppercase font-medium tracking-wider text-stone-400 mr-1.5">Starting From</span>
                            <span className="text-sm font-medium text-stone-900">${dynamicPrice}</span>
                          </div>
                        </div>

                        <p className="text-xs leading-5.5 text-stone-500 font-light tracking-wide line-clamp-3">
                          {service.description}
                        </p>
                      </div>

                      {/* Explicit Interactive CTA Foot Row links */}
                      <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between gap-4">
                        <Link
                          to={`/booking?service=${service._id || service.id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-teal-600/30 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-teal-600 shadow-sm transition-all duration-200 hover:border-teal-500 hover:bg-teal-50/50 hover:text-teal-700 active:scale-98"
                        >
                          Book Now
                        </Link>
                        
                        <Link
                          to="/services"
                          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-400 transition-all hover:gap-2 hover:text-stone-600 py-2"
                        >
                          Learn More <FaArrowRight className="text-[9px]" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination / Total Counter Status Display Area */}
            {(search || selectedCategory !== "All") && (
              <p className="mt-12 text-center text-xs tracking-widest text-stone-400 uppercase font-medium">
                Retrieved <span className="font-semibold text-stone-600">{filtered.length}</span> curated treatment option{filtered.length !== 1 ? "s" : ""}
              </p>
            )}
          </>
        )}
      </section>

      {/* ── CTA LUXURY ANYWHERE UPGRADE SECTION ───────────────────── */}
      <section className="bg-white border-t border-stone-200/40 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 ring-1 ring-stone-200/40 shadow-sm mb-6">
            Zenith Worldwide Experience Concierge
          </span>
          <h2 className="text-3xl font-light tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
            Ready To Experience <span className="font-normal text-teal-600">Luxury Wellness Anywhere?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-xs sm:text-sm leading-6 text-stone-500 font-light">
            Book trusted therapists for your preferred location and enjoy a personalized wellness experience.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Link 
              to="/booking" 
              className="inline-flex items-center justify-center rounded-xl border border-teal-600/30 bg-white px-7 py-4 text-xs font-semibold uppercase tracking-wider text-teal-600 shadow-sm transition-all duration-200 hover:border-teal-400 hover:bg-teal-50/40 hover:text-teal-700 active:scale-98"
            >
              Book Your Experience
            </Link>
            <Link 
              to="/therapists" 
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-400 transition-all hover:gap-2 hover:text-stone-700 py-4 px-2"
            >
              Meet Our Therapists <FaArrowRight className="text-[9px]" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;