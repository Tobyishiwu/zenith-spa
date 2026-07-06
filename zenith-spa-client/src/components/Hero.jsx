import { Link } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaStar } from "react-icons/fa";
import Stats from "./Stats";
import HeroCard from "./HeroCard";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#F8F6F2] pt-36 pb-24">
      {/* Soft Clean Ambient Gradients */}
      <div className="absolute -left-24 top-24 h-96 w-96 rounded-full bg-teal-100/40 blur-3xl" />
      <div className="absolute -right-24 bottom-12 h-[500px] w-[500px] rounded-full bg-stone-200/50 blur-3xl" />

      <div className="relative mx-auto grid min-h-[80vh] max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        
        {/* LEFT COLUMN: CONTENT */}
        <div className="flex flex-col justify-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600 ring-1 ring-stone-200 shadow-sm">
              ✨ Premium Mobile Spa Services
            </span>
          </div>

          <h1 className="mt-8 text-5xl font-light leading-[1.1] tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
            Wellness
            <br />
            Delivered
            <br />
            <span className="font-semibold text-teal-600">To Your Doorstep.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-stone-500">
            Experience world-class spa treatments, premium therapeutic massages, and deep somatic rejuvenation delivered safely directly to your home, hotel room, or workspace.
          </p>

          {/* Social Proof & Trust Metrics */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-stone-500">
            <div className="flex items-center gap-2">
              <FaStar className="text-amber-400 text-sm" />
              <span className="tracking-wide">4.9/5 Luxury Rating</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-teal-600" />
              <span>Certified Therapists</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-teal-600" />
              <span>Available Daily</span>
            </div>
          </div>

          {/* Clean Interactive Call To Actions */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/booking"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-stone-900 px-7 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-black hover:shadow-md"
            >
              Book Appointment
              <FaArrowRight className="text-xs opacity-70 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-7 py-4 text-sm font-semibold text-stone-700 shadow-sm transition duration-200 hover:bg-stone-50 hover:border-stone-300"
            >
              Explore Services
            </Link>
          </div>

          {/* Inline Contextual Sub-statistics Component */}
          <div className="mt-12 border-t border-stone-200/60 pt-8">
            <Stats />
          </div>
        </div>

        {/* RIGHT COLUMN: VISUAL COMPONENT ARCHITECTURE */}
        <div className="relative lg:mt-0 mt-12 flex items-center justify-center">
          <div className="relative w-full max-w-lg lg:max-w-none">
            {/* Soft decorative shadow frame back drop */}
            <div className="absolute -inset-4 rounded-[48px] bg-stone-200/40 opacity-60 blur-lg" />
            
            <img
              src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury Spa Wellness Session"
              className="relative h-[560px] lg:h-[680px] w-full rounded-[40px] object-cover bg-stone-100 shadow-md ring-1 ring-stone-200/50"
            />

            {/* Overlapping contextual absolute card panel */}
            <div className="absolute -bottom-6 -left-6 md:left-10 transition duration-300 hover:scale-[1.02]">
              <HeroCard />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;