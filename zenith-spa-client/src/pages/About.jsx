import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaLeaf,
  FaHeart,
  FaShieldAlt,
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
    <div className="bg-[#F8F6F2]">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-end overflow-hidden pb-24 pt-40">
        <img
          src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1800&q=80"
          alt="Zenith Spa luxury experience"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/50 to-stone-900/20" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-300 backdrop-blur-sm ring-1 ring-white/20">
              About Zenith Spa
            </span>
            <h1 className="mt-6 text-5xl font-light leading-[1.1] text-white md:text-7xl">
              Luxury Wellness,
              <br />
              <span className="font-semibold text-teal-300">Delivered to You.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-stone-300">
              We bring premium spa experiences directly to your home, hotel, office, or private event — allowing you to relax, recharge, and reconnect without leaving your comfort zone.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/booking" className="rounded-2xl bg-teal-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-teal-700 hover:shadow-lg">
                Book Appointment
              </Link>
              <Link to="/therapists" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                Meet Our Therapists <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section className="bg-stone-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-y divide-white/10 border-x border-white/10 lg:grid-cols-4 lg:divide-y-0">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-4xl font-black text-white md:text-5xl">{value}</span>
                <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-stone-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ─────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80"
              alt="Zenith Spa treatment"
              className="h-[600px] w-full rounded-[2.5rem] object-cover shadow-2xl"
            />
            <div className="absolute -bottom-8 -right-6 hidden rounded-3xl bg-white p-6 shadow-xl ring-1 ring-stone-100 md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
                  <FaStar className="text-amber-400" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-stone-900">4.9 / 5</p>
                  <p className="text-xs text-stone-400">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-600">Our Story</p>
            <h2 className="mt-5 text-4xl font-light text-stone-900 md:text-5xl">
              Wellness Designed
              <br />
              <span className="font-semibold">Around You.</span>
            </h2>
            <p className="mt-8 text-base leading-8 text-stone-600">
              Zenith Spa was created with a simple vision — to make luxury wellness accessible wherever life takes you.
            </p>
            <p className="mt-5 text-base leading-8 text-stone-600">
              Whether you are relaxing at home, staying in a hotel, preparing for an event, or simply taking time to care for yourself, our experienced therapists deliver personalized treatments tailored to your needs.
            </p>
            <p className="mt-5 text-base leading-8 text-stone-600">
              Every experience reflects our commitment to exceptional service, professional care, and the belief that true relaxation begins where you feel most comfortable.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Fully certified and vetted therapists",
                "Premium products and equipment",
                "Flexible scheduling, 7 days a week",
                "Tailored to your personal needs",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <FaCheckCircle className="flex-shrink-0 text-teal-500" size={14} />
                  <span className="text-sm text-stone-700">{point}</span>
                </div>
              ))}
            </div>

            <Link to="/booking" className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-stone-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-black hover:shadow-lg">
              Reserve Your Experience <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">What We Stand For</p>
            <h2 className="mt-4 text-3xl font-light text-stone-900 md:text-5xl">Our Values</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group rounded-3xl bg-[#F8F6F2] p-8 transition hover:-translate-y-1 hover:bg-teal-50 hover:shadow-md">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 transition group-hover:bg-teal-700 group-hover:text-white group-hover:ring-teal-700">
                  <Icon size={22} className="text-teal-600 transition group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">The Experience</p>
            <h2 className="mt-4 text-3xl font-light text-stone-900 md:text-4xl">A Glimpse Into Zenith Spa</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {TEAM_IMAGES.map((src, i) => (
              <div key={i} className={"overflow-hidden rounded-3xl shadow-sm " + (i === 1 ? "sm:mt-10" : "")}>
                <img
                  src={src}
                  alt={"Zenith Spa experience " + (i + 1)}
                  className="h-80 w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-stone-900 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Begin Your Journey</p>
          <h2 className="mt-4 text-3xl font-light text-white md:text-5xl">
            Ready to Experience
            <br />
            <span className="font-semibold text-teal-300">Luxury Wellness?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-8 text-stone-400">
            Book a session with one of our expert therapists and discover what true relaxation feels like.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/booking" className="rounded-2xl bg-teal-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-teal-700 hover:shadow-lg">
              Book Appointment
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

export default About;
