import { imageUrl } from "../utils/imageUrl";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import useTherapists from "../hooks/useTherapists";

const fallback =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80";

const Therapists = () => {
  const { therapists, loading } = useTherapists();

  if (loading) {
    return (
      <section id="therapists" className="bg-[#FAF9F6] py-24 border-t border-stone-200/30">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-medium text-stone-500 tracking-wider uppercase animate-pulse">
            Loading therapist network...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="therapists"
      className="bg-[#FAF9F6] py-24 border-t border-stone-200/30"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Dynamic Image Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {therapists.map((therapist) => (
            <div
              key={therapist._id}
              className="group overflow-hidden rounded-[2rem] border border-stone-200/30 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/30"
            >
              {/* Clean, Badge-Free Image Layout */}
              <Link
                to={`/therapists/${therapist.slug}`}
                className="relative block overflow-hidden bg-stone-50"
              >
                <img
                  src={imageUrl(therapist.image) || fallback}
                  alt={therapist.name}
                  onError={(e) => (e.target.src = fallback)}
                  className="h-[450px] w-full object-cover transition duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 via-transparent to-transparent pointer-events-none" />
              </Link>

              {/* Text Context & Interactive Actions */}
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-normal tracking-tight text-stone-900 group-hover:text-teal-600 transition-colors">
                    {therapist.name}
                  </h3>
                </div>

                <p className="text-[11px] font-medium uppercase tracking-widest text-teal-600/90 mt-1">
                  {therapist.specialization}
                </p>

                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to={`/therapists/${therapist.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:bg-black active:scale-98"
                  >
                    View Details
                    <FaArrowRight className="text-[9px]" />
                  </Link>

                  <Link
                    to={`/therapists/${therapist.slug}`}
                    className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-500 transition-all duration-200 hover:border-stone-300 hover:bg-stone-50"
                  >
                    Request Appointment
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Therapists;