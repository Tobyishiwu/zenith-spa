import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaLeaf,
  FaHeart,
  FaShieldAlt,
  FaGlobe,
} from "react-icons/fa";

const STATS = [
  { value: "500+", label: "Happy Clients" },
  { value: "4.9", label: "Average Rating" },
  { value: "20+", label: "Expert Therapists" },
  { value: "10+", label: "Signature Treatments" },
];

const VALUES = [
  {
    icon: FaLeaf,
    title: "Premium Quality",
    description: "We use only the finest products and techniques, curated to deliver results that exceed expectations every single time.",
  },
  {
    icon: FaHeart,
    title: "Client First",
    description: "Every session is tailored to you. Your comfort, preferences, and wellbeing guide everything we do.",
  },
  {
    icon: FaShieldAlt,
    title: "Trusted Professionals",
    description: "All Zenith therapists are fully certified, background-checked, and trained to the highest standards of luxury service.",
  },
];

const TEAM_IMAGES = [
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
];

const About = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 antialiased selection:bg-teal-50 selection:text-teal-800">

      {/* ── LUXURY HERO SECTION ───────────────────────────────────── */}
      <section className="relative flex min-h-[75vh] items-center overflow-hidden bg-stone-950 pb-28 pt-40">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1800&q=80"
            alt="Zenith Spa luxury experience"
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
              Luxury Wellness,
              <br />
              <span className="font-normal text-teal-400 font-serif italic tracking-normal">Delivered to You.</span>
            </h1>
            <p className="mt-8 text-sm sm:text-base leading-7 text-stone-300 max-w-2xl font-light tracking-wide">
              We bring premium spa experiences directly to your home, hotel, office, or private event — allowing you to relax, recharge, and reconnect without leaving your comfort zone.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link 
                to="/booking" 
                className="inline-flex items-center justify-center rounded-xl border border-teal-600/30 bg-white px-7 py-4 text-xs font-semibold uppercase tracking-wider text-teal-600 shadow-sm transition-all duration-200 hover:border-teal-400 hover:bg-teal-50/40 hover:text-teal-700 active:scale-98"
              >
                Book Appointment
              </Link>
              <Link 
                to="/therapists" 
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
              >
                Meet Our Therapists <FaArrowRight className="text-[9px]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS DISPLAY SECTION ─────────────────────────────────── */}
      <section className="relative z-20 mx-auto max-w-7xl px-6 -mt-16 lg:px-8">
        <div className="rounded-[2.5rem] bg-white border border-stone-200/40 p-2 shadow-xl shadow-stone-200/20">
          <div className="grid grid-cols-2 divide-x divide-y divide-stone-100 border-stone-100 lg:grid-cols-4 lg:divide-y-0">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center py-10 text-center first:border-t-0 last:border-b-0">
                <span className="text-3xl font-light text-stone-900 md:text-4xl tracking-tight">{value}</span>
                <span className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-stone-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY STORYTELLING SECTION ────────────────────────── */}
      <section className="py-28">
        <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem] border border-stone-200/20 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80"
                alt="Zenith Spa treatment"
                className="h-[600px] w-full object-cover transition-transform duration-700 ease-out hover:scale-102"
              />
            </div>
            <div className="absolute -bottom-8 -right-6 hidden rounded-[2rem] border border-stone-200/30 bg-white p-6 shadow-xl shadow-stone-200/20 md:block">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-50 text-teal-600 ring-1 ring-stone-200/30">
                  <FaStar className="text-amber-400" size={18} />
                </div>
                <div>
                  <p className="text-2xl font-normal tracking-tight text-stone-900">4.9 / 5</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 ring-1 ring-stone-200/50 mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl font-light tracking-tight text-stone-900 sm:text-4xl md:text-5xl leading-[1.2]">
              Wellness Designed
              <br />
              <span className="font-normal text-teal-600 font-serif italic tracking-normal">Around You.</span>
            </h2>
            <p className="mt-6 text-sm leading-6.5 text-stone-500 font-light tracking-wide">
              Zenith Spa was created with a simple vision — to make luxury wellness accessible wherever life takes you.
            </p>
            <p className="mt-4 text-sm leading-6.5 text-stone-500 font-light tracking-wide">
              Whether you are relaxing at home, staying in a hotel, preparing for an event, or simply taking time to care for yourself, our experienced therapists deliver personalized treatments tailored to your needs.
            </p>
            <p className="mt-4 text-sm leading-6.5 text-stone-500 font-light tracking-wide">
              Every experience reflects our commitment to exceptional service, professional care, and the belief that true relaxation begins where you feel most comfortable.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Fully certified and vetted therapists",
                "Premium products and equipment",
                "Flexible scheduling, 7 days a week",
                "Tailored to your personal needs",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-xl bg-white border border-stone-200/20 p-3.5 shadow-2xs">
                  <FaCheckCircle className="flex-shrink-0 text-teal-500" size={12} />
                  <span className="text-xs font-normal text-stone-600">{point}</span>
                </div>
              ))}
            </div>

            <Link 
              to="/booking" 
              className="mt-10 inline-flex items-center justify-center rounded-xl border border-teal-600/30 bg-white px-7 py-4 text-xs font-semibold uppercase tracking-wider text-teal-600 shadow-sm transition-all duration-200 hover:border-teal-400 hover:bg-teal-50/40 hover:text-teal-700 active:scale-98"
            >
              Reserve Your Experience <FaArrowRight className="text-[9px] ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── VALUES PRINCIPLES SECTION ─────────────────────────────── */}
      <section className="bg-white border-y border-stone-200/40 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 ring-1 ring-stone-200/50 mb-3">
              What We Stand For
            </span>
            <h2 className="text-2xl font-light tracking-tight text-stone-900 sm:text-3xl md:text-4xl">Our Essential Core Values</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group rounded-[2.5rem] border border-stone-200/20 bg-white p-8 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-stone-200/20">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-50 shadow-xs ring-1 ring-stone-200/30 transition duration-300 group-hover:bg-teal-600 group-hover:text-white group-hover:ring-teal-600">
                  <Icon size={20} className="text-teal-600 transition duration-300 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-normal tracking-tight text-stone-900 group-hover:text-teal-600 transition-colors duration-300">{title}</h3>
                <p className="mt-3 text-xs leading-5.5 text-stone-500 font-light tracking-wide">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE GALLERY VISUAL SECTION ─────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 ring-1 ring-stone-200/40 shadow-sm mb-3">
              The Aesthetic
            </span>
            <h2 className="text-2xl font-light tracking-tight text-stone-900 sm:text-3xl">A Glimpse Into Zenith Spa</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {TEAM_IMAGES.map((src, i) => (
              <div key={i} className={"overflow-hidden rounded-[2.5rem] border border-stone-200/20 bg-white shadow-sm " + (i === 1 ? "sm:mt-8" : "")}>
                <img
                  src={src}
                  alt={"Zenith Spa experience " + (i + 1)}
                  className="h-80 w-full object-cover transition-transform duration-700 ease-out hover:scale-103"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA COMMENCE TRAVEL ACCENT SECTION ────────────────────── */}
      <section className="bg-stone-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-teal-900/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-300 backdrop-blur-sm mb-6">
            Begin Your Journey
          </span>
          <h2 className="text-3xl font-extralight tracking-tight text-white sm:text-4xl md:text-5xl leading-[1.2]">
            Ready to Experience <br />
            <span className="font-normal text-teal-400 font-serif italic tracking-normal">Luxury Wellness?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-xs sm:text-sm leading-6 text-stone-400 font-light tracking-wide">
            Book a session with one of our expert therapists and discover what true relaxation feels like.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/booking" 
              className="inline-flex items-center justify-center rounded-xl border border-teal-500 bg-teal-600 px-7 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 transition-all duration-200 hover:bg-teal-500 active:scale-98"
            >
              Book Appointment
            </Link>
            <Link 
              to="/services" 
              className="inline-flex items-center gap-1 border border-white/10 bg-white/5 px-7 py-4 text-xs font-semibold uppercase tracking-wider text-stone-300 rounded-xl transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              Browse Treatments
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;