import { imageUrl } from "../utils/imageUrl";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBriefcase,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

import useTherapists from "../hooks/useTherapists";

const fallback =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80";

const Therapists = () => {
  const { therapists, loading } = useTherapists();

  if (loading) {
    return (
      <section id="therapists" className="bg-[#FAF9F6] py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-lg font-semibold">
            Loading therapists...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="therapists"
      className="bg-[#FAF9F6] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mb-16 text-center">

          <span className="font-semibold uppercase tracking-[4px] text-teal-700">
            PROFESSIONAL THERAPISTS
          </span>

          <h2 className="mt-4 text-5xl font-black text-gray-900">
            Meet Our Experts
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Choose a therapist that matches your wellness goals,
            view their profile and book your preferred session.
          </p>

        </div>

        {/* Cards */}

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">

          {therapists.map((therapist) => (

            <div
              key={therapist._id}
              className="group overflow-hidden rounded-[32px] bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >

              {/* Image */}

              <Link
                to={`/therapists/${therapist.slug}`}
                className="relative block overflow-hidden"
              >

                <img
src={imageUrl(therapist.image) || fallback}
                  alt={therapist.name}
                  onError={(e) => (e.target.src = fallback)}
                  className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                  <span className="rounded-xl bg-white px-6 py-3 font-semibold text-teal-700 shadow-lg">
                    View Profile
                  </span>

                </div>

                <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow">

                  <FaCheckCircle className="mr-2 inline" />

                  Available

                </div>

              </Link>

              {/* Body */}

              <div className="p-6">

                <div className="mb-3 flex items-center justify-between">

                  <h3 className="text-2xl font-bold">
                    {therapist.name}
                  </h3>

                  <div className="flex items-center gap-1">

                    <FaStar className="text-amber-400" />

                    <span className="font-semibold">
                      {therapist.rating}
                    </span>

                  </div>

                </div>

                <p className="font-semibold text-teal-700">
                  {therapist.specialization}
                </p>

                <p className="mt-4 line-clamp-3 leading-7 text-gray-600">
                  {therapist.bio}
                </p>

                <div className="mt-8 flex items-center justify-between">

                  <div className="flex items-center gap-2 text-gray-600">

                    <FaBriefcase />

                    {therapist.experience} Years

                  </div>

                  <Link
                    to={`/booking?therapist=${therapist.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800"
                  >
                    Book Now

                    <FaArrowRight />
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* View All */}

        <div className="mt-16 text-center">

          <Link
            to="/therapists"
            className="inline-flex items-center gap-3 rounded-2xl border-2 border-teal-700 px-8 py-4 font-bold text-teal-700 transition hover:bg-teal-700 hover:text-white"
          >
            View All Therapists

            <FaArrowRight />
          </Link>

        </div>

      </div>
    </section>
  );
};

export default Therapists;