import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaClock, FaArrowRight } from "react-icons/fa";
import { services, getCategories } from "../data/services";

const categories = getCategories();

const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? services
        : services.filter((s) => s.category === activeCategory),
    [activeCategory]
  );

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[60vh] items-end bg-stone-900 pb-20 pt-40">
        <img
          src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1800&q=80"
          alt="Zenith Spa treatments"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-300">
            Zenith Spa
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl font-light leading-tight text-white md:text-6xl">
            Our Treatments
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-300">
            Professional spa experiences curated for the modern lifestyle —
            delivered wherever you are in the United States.
          </p>
        </div>
      </section>

      {/* ── Category Filter ───────────────────────────────────────────────── */}
      <section className="border-b border-stone-100 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeCategory === cat
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────────────────── */}
      <section className="bg-[#F8F6F2] py-20">
        <div className="mx-auto max-w-7xl px-6">

          {filtered.length === 0 ? (
            <div className="py-24 text-center text-stone-500">
              No treatments found in this category.
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((service) => (
                <article
                  key={service.id}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-60 w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-7">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-600">
                      {service.category}
                    </p>

                    <h3 className="text-xl font-semibold text-stone-900">
                      {service.name}
                    </h3>

                    {service.subtitle && (
                      <p className="mt-1 text-xs text-stone-400">
                        {service.subtitle}
                      </p>
                    )}

                    <p className="mt-4 flex-1 text-sm leading-7 text-stone-600">
                      {service.description}
                    </p>

                    {/* Meta */}
                    <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
                      <div className="flex items-center gap-1.5 text-sm text-stone-500">
                        <FaClock className="text-xs" />
                        {service.duration}
                      </div>
                      <span className="text-base font-bold text-stone-900">
                        From ${service.startingPrice}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-3">
                      <Link
                        to={`/booking?service=${service.slug}`}
                        className="flex-1 rounded-xl bg-teal-700 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-800"
                      >
                        Book Treatment
                      </Link>
                      <Link
                        to={`/services/${service.slug}`}
                        className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400"
                      >
                        Details
                        <FaArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-stone-900 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-400">
            Not Sure Where to Start?
          </p>
          <h2 className="mt-4 text-4xl font-light text-white">
            Our therapists will guide you to the perfect treatment.
          </h2>
          <p className="mt-6 text-lg text-stone-400">
            Browse our expert therapists and book a session tailored to your
            specific needs.
          </p>
          <Link
            to="/therapists"
            className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-semibold text-stone-900 transition hover:bg-stone-100"
          >
            Meet Our Therapists
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
