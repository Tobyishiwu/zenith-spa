import { useSearchParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import useTherapist from "../hooks/useTherapist";
import { getServiceBySlug } from "../data/services";

const Booking = () => {
  const [searchParams] = useSearchParams();

  const therapistSlug = searchParams.get("therapist");
  const serviceSlug = searchParams.get("service");

  const { therapist, loading: therapistLoading } = useTherapist(therapistSlug);
  const preselectedService = serviceSlug ? getServiceBySlug(serviceSlug) : null;

  if (therapistSlug && therapistLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <p className="text-xs font-semibold tracking-wider uppercase text-stone-400 animate-pulse">
          Loading booking engine...
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#FAF9F6] text-stone-800 antialiased pb-24 pt-36">
      <div className="mx-auto max-w-3xl px-6">
        {/* ── CLEAN TECH HEADER ── */}
        <div className="mb-14 text-center">
          <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Zenith Spa
          </span>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-stone-900 sm:text-4xl">
            Complete Your Booking
          </h1>
          <p className="mt-3 text-xs font-light leading-5 text-stone-500 max-w-md mx-auto">
            Fill in your details below and our professional team will bring the complete luxury wellness experience directly to you.
          </p>
        </div>

        {/* ── FORM CONTAINER WRAPPER ── */}
        <div className="rounded-2xl border border-stone-200/40 bg-white p-6 sm:p-10 shadow-xs">
          <BookingForm
            therapist={therapist || null}
            preselectedService={preselectedService}
          />
        </div>
      </div>
    </section>
  );
};

export default Booking;