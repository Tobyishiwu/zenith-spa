import { Link } from "react-router-dom";
import { FaArrowRight, FaClock } from "react-icons/fa";
import { getFeaturedServices } from "../data/services";

const featuredServices = getFeaturedServices();

const Services = () => {
  return (
    <section id="services" className="bg-[#F8F6F2] py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              Our Treatments
            </p>
            <h2 className="mt-4 text-4xl font-light text-stone-900 md:text-5xl">
              Luxury spa experiences designed for complete relaxation.
            </h2>
            <p className="mt-6 text-lg leading-8 text-stone-600">
              Premium spa treatments delivered by experienced therapists in
              the comfort of your home, hotel, or office.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-900 transition hover:gap-3"
          >
            View All Treatments
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {featuredServices.map((service) => (
            <article
              key={service.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-8">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-semibold text-stone-900">
                    {service.name}
                  </h3>
                  <span className="flex-shrink-0 text-lg font-semibold text-stone-900">
                    From ${service.startingPrice}
                  </span>
                </div>

                {service.subtitle && (
                  <p className="mb-3 text-xs font-medium uppercase tracking-widest text-teal-600">
                    {service.subtitle}
                  </p>
                )}

                <p className="mb-5 leading-7 text-stone-600">
                  {service.description}
                </p>

                <div className="mb-8 flex items-center gap-2 text-sm text-stone-500">
                  <FaClock />
                  {service.duration}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to={`/booking?service=${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                  >
                    Book Treatment
                  </Link>

                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:gap-3 hover:text-stone-900"
                  >
                    Learn More
                    <FaArrowRight className="text-xs" />
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
