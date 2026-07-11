import { Link } from "react-router-dom";
import { FaArrowRight, FaClock, FaSlidersH, FaGlobe } from "react-icons/fa";
import { services } from "../data/services";

// Inject Erotic Massage safely if it isn't hardcoded in the data array, then sort to feature it first
const baseServices = [...services];
const hasErotic = baseServices.some(s => s.name?.toLowerCase().includes("erotic"));

if (!hasErotic) {
  baseServices.push({
    id: "erotic-massage-default",
    name: "Erotic Massage",
    slug: "erotic-massage",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    subtitle: "Sensual Somatic Rejuvenation",
    description: "A premium, deeply relaxing somatic experience designed to release deep-seated tension, enhance body awareness, and restore intimate energy flow.",
    duration: "60 / 90 / 120 min"
  });
}

const featuredServices = baseServices.sort((a, b) => {
  if (a.name?.toLowerCase().includes("erotic")) return -1;
  if (b.name?.toLowerCase().includes("erotic")) return 1;
  return 0;
});

const Services = () => {
  return (
    <section id="services" className="bg-[#FAF9F6] py-24 border-t border-stone-200/30">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header Section */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 ring-1 ring-stone-200/40 shadow-sm mb-4">
              <FaSlidersH className="text-teal-600/80 text-[9px]" /> Intelligent Recommendations
            </span>
            <h2 className="text-3xl font-light tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Curated Treatments. <span className="font-normal text-teal-600">Worldwide Excellence.</span>
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-500">
              Our worldwide network platform is designed to recommend verified local specialists providing premium therapeutic experiences right to your chosen venue.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 transition-all hover:gap-3 hover:text-stone-800"
          >
            Explore Full Menu
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {featuredServices.map((service) => (
            <article
              key={service.id}
              className="group overflow-hidden rounded-[2rem] border border-stone-200/30 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/30"
            >
              {/* Media Container */}
              <div className="relative overflow-hidden bg-stone-50">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-72 w-full object-cover transition duration-700 group-hover:scale-102 opacity-95 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-stone-500 shadow-sm ring-1 ring-black/5">
                  <FaGlobe className="text-[10px] text-teal-600/80" /> Vetted Network
                </span>
              </div>

              {/* Content Container */}
              <div className="p-8">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium tracking-tight text-stone-800 transition-colors duration-200 group-hover:text-stone-900">
                      {service.name}
                    </h3>
                    {service.subtitle && (
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-teal-600/90">
                        {service.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400">From</span>
                    <span className="text-lg font-medium text-stone-800">
                      $25
                    </span>
                  </div>
                </div>

                <p className="mb-5 text-xs leading-5 text-stone-500 font-normal">
                  {service.description}
                </p>

                {/* Duration Badge */}
                <div className="mb-6 inline-flex items-center gap-1.5 rounded-lg bg-stone-50/80 px-2.5 py-1 text-xs font-medium text-stone-400 ring-1 ring-stone-200/30">
                  <FaClock className="text-[10px] text-stone-300" />
                  <span className="text-stone-500">{service.duration}</span>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-stone-100 pt-5">
                  <Link
                    to={`/booking?service=${service.slug}`}
                    className="inline-flex items-center justify-center rounded-xl border border-teal-600/30 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-teal-600 shadow-sm transition-all duration-200 hover:border-teal-400 hover:bg-teal-50/40 hover:text-teal-700 active:scale-98"
                  >
                    Smart Booking
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-400 transition-all hover:gap-2 hover:text-stone-700"
                  >
                    Details
                    <FaArrowRight className="text-[9px]" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;