import { Link } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaStar, FaGlobe, FaSlidersH, FaMapMarkerAlt, FaHome, FaHotel, FaBriefcase, FaCompass } from "react-icons/fa";
import Stats from "./Stats";
import HeroCard from "./HeroCard";

const Hero = () => {
  const locations = [
    { label: "Home", icon: <FaHome className="text-xs" /> },
    { label: "Hotel", icon: <FaHotel className="text-xs" /> },
    { label: "Office", icon: <FaBriefcase className="text-xs" /> },
    { label: "Vacation Rental", icon: <FaCompass className="text-xs" /> },
    { label: "Luxury Private Venue", icon: <FaMapMarkerAlt className="text-xs" /> },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F8F6F2] pt-24 pb-16 sm:pt-28 lg:pt-36 lg:pb-24">

      {/* Ambient gradients */}
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-teal-100/40 blur-3xl lg:h-96 lg:w-96" />
      <div className="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-stone-200/50 blur-3xl lg:h-[500px] lg:w-[500px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* ── DESKTOP layout: two-column grid ─────────────────────── */}
        <div className="lg:grid lg:min-h-[80vh] lg:grid-cols-2 lg:items-center lg:gap-16">

          {/* LEFT — Content */}
          <div className="flex flex-col justify-center">

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600 ring-1 ring-stone-200 shadow-sm sm:px-5 sm:py-2">
              <span>✨</span> Intelligent Therapist Matching
            </span>

            <h1 className="mt-6 text-4xl font-light leading-[1.1] tracking-tight text-stone-900 sm:mt-8 sm:text-5xl lg:text-6xl xl:text-7xl">
              Worldwide Luxury
              <br />
              Wellness,
              <br />
              <span className="font-semibold text-teal-600">Tailored To You.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-stone-600 sm:mt-6 sm:text-base sm:leading-8">
              Zenith Spa is a worldwide mobile wellness platform designed to recommend trusted professional therapists tailored to your precise personal profile. Experience world-class treatments delivered wherever you choose to unwind.
            </p>

            {/* Location Selector Pills */}
            <div className="mt-6 sm:mt-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-3">
                Choose your preferred location:
              </span>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-xl bg-white border border-stone-200/80 px-3.5 py-2 text-xs font-medium text-stone-700 shadow-sm transition-all hover:border-stone-300 hover:bg-stone-50"
                  >
                    {loc.icon}
                    <span>{loc.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust metrics */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs font-medium text-stone-600 border-t border-stone-200/60 pt-6 sm:mt-8 sm:gap-x-6">
              <div className="flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-lg ring-1 ring-stone-200/40">
                <FaStar className="text-amber-400" />
                <span className="font-semibold text-stone-800">4.9 / 5</span>
                <span className="text-stone-400">Global Rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaGlobe className="text-teal-600 text-xs" />
                <span>Worldwide Network</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaCheckCircle className="text-teal-600 text-xs" />
                <span>Vetted Professionals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaSlidersH className="text-teal-600 text-xs" />
                <span>Smart Booking Experience</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                to="/booking"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-stone-900 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black hover:shadow-md sm:py-4"
              >
                Book Appointment
                <FaArrowRight className="text-xs opacity-70 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-7 py-3.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 sm:py-4"
              >
                Explore Services
              </Link>
            </div>

            {/* Stats — desktop only, shown below CTAs */}
            <div className="mt-10 hidden border-t border-stone-200/60 pt-8 lg:block">
              <Stats />
            </div>
          </div>

          {/* RIGHT — Image + card */}
          <div className="relative mt-12 flex justify-center lg:mt-0">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none">

              {/* Decorative backdrop */}
              <div className="absolute -inset-3 rounded-[48px] bg-stone-200/40 opacity-60 blur-lg" />

              {/* Hero image */}
              <img
                src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Spa Wellness Session"
                className="relative h-[300px] w-full rounded-3xl object-cover shadow-md ring-1 ring-stone-200/50 sm:h-[380px] lg:h-[620px] lg:rounded-[40px] xl:h-[680px]"
              />

              {/* HeroCard — overlaps bottom of image on all sizes */}
              <div className="relative mt-[-2rem] flex justify-center lg:absolute lg:bottom-[-1.5rem] lg:left-[-1rem] lg:mt-0 lg:justify-start xl:left-[-2rem]">
                <HeroCard />
              </div>
            </div>
          </div>

          {/* Stats — mobile only, shown after image+card */}
          <div className="mt-10 border-t border-stone-200/60 pt-8 lg:hidden">
            <Stats />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;