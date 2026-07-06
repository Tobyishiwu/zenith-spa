import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const BookingCTA = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-teal-700 to-teal-900 px-10 py-20 text-white lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              Mobile Luxury Spa
            </span>

            <h2 className="mt-6 text-5xl font-bold leading-tight">
              Relax in the Comfort of Your Home
            </h2>

            <p className="mt-6 text-lg text-teal-100">
              Book a certified therapist today and enjoy a premium spa
              experience delivered to your doorstep.
            </p>
          </div>

          <div className="mt-10 lg:mt-0">
            <Link
              to="/booking"
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-5 text-lg font-bold text-teal-700 transition hover:scale-105"
            >
              Book Appointment
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCTA;