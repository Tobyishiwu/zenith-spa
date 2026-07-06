import { Link, useParams } from "react-router-dom";
import {
  FaStar,
  FaBriefcase,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import useTherapist from "../hooks/useTherapist";
import { imageUrl } from "../utils/imageUrl";

const fallback =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80";

const TherapistDetails = () => {
  const { slug } = useParams();
  const { therapist, loading } = useTherapist(slug);

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <p className="text-xl font-semibold text-gray-500">Loading therapist...</p>
      </section>
    );
  }

  if (!therapist) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">Therapist Not Found</h2>
          <p className="mt-4 text-gray-600">The therapist you are looking for does not exist.</p>
          <Link
            to="/therapists"
            className="mt-8 inline-block rounded-xl bg-teal-700 px-8 py-4 font-semibold text-white transition hover:bg-teal-800"
          >
            Back to Therapists
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FAF9F6] pb-24 pt-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">

        {/* Hero Image — imageUrl() resolves relative /uploads/... to full URL */}
        <div className="relative">
          <img
            src={imageUrl(therapist.image) || fallback}
            alt={therapist.name}
            onError={(e) => { e.target.src = fallback; }}
            className="h-[720px] w-full rounded-[40px] object-cover shadow-2xl"
          />
          <div className="absolute left-8 top-8 rounded-full bg-white px-5 py-3 font-semibold text-teal-700 shadow">
            Available Today
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="font-semibold uppercase tracking-widest text-teal-700">
            Zenith Spa Therapist
          </span>

          <h1 className="mt-4 text-6xl font-black text-gray-900">{therapist.name}</h1>

          <p className="mt-4 text-2xl font-semibold text-teal-700">{therapist.specialization}</p>

          <div className="mt-8 flex flex-wrap gap-8">
            {therapist.rating && (
              <div className="flex items-center gap-2">
                <FaStar className="text-amber-400" />
                <span className="font-semibold">{therapist.rating}</span>
                {therapist.reviews && (
                  <span className="text-gray-500">({therapist.reviews} reviews)</span>
                )}
              </div>
            )}
            {therapist.experience && (
              <div className="flex items-center gap-2">
                <FaBriefcase />
                <span>{therapist.experience} Years</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-green-700">
              <FaCheckCircle />
              Available
            </div>
          </div>

          {therapist.bio && (
            <p className="mt-10 text-lg leading-9 text-gray-600">{therapist.bio}</p>
          )}

          <div className="mt-12 rounded-[32px] bg-white p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900">
              Why Choose {therapist.name.split(" ")[0]}?
            </h3>
            <div className="mt-8 space-y-4">
              {[
                "Certified professional therapist",
                "Luxury home spa treatments",
                "Flexible appointment scheduling",
                "Trusted by hundreds of satisfied clients",
              ].map((point) => (
                <div key={point} className="flex gap-3">
                  <FaCheckCircle className="mt-1 flex-shrink-0 text-teal-700" />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to={`/booking?therapist=${therapist.slug}`}
            className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-teal-700 px-10 py-5 text-lg font-bold text-white transition hover:bg-teal-800"
          >
            Book {therapist.name.split(" ")[0]}
            <FaArrowRight />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default TherapistDetails;
