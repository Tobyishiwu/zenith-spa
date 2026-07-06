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
        <p className="text-lg text-gray-500">Loading therapist...</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#FAF9F6] pb-24 pt-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">
            Zenith Spa
          </p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Complete Your Booking
          </h1>
          <p className="mt-4 text-gray-500">
            Fill in your details and we will bring the spa to you.
          </p>
        </div>
        <BookingForm
          therapist={therapist || null}
          preselectedService={preselectedService}
        />
      </div>
    </section>
  );
};

export default Booking;
