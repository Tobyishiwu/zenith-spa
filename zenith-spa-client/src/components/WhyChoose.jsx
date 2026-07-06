import {
  FaSpa,
  FaShieldAlt,
  FaClock,
  FaHome,
} from "react-icons/fa";

const items = [
  {
    icon: <FaSpa />,
    title: "Luxury Treatments",
    text: "Premium spa experiences delivered by certified professionals.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Trusted Professionals",
    text: "Background-checked and highly trained therapists.",
  },
  {
    icon: <FaClock />,
    title: "Flexible Scheduling",
    text: "Book appointments at times that fit your lifestyle.",
  },
  {
    icon: <FaHome />,
    title: "At Your Doorstep",
    text: "Enjoy a spa-quality experience in your home or hotel.",
  },
];

const WhyChoose = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="font-semibold uppercase tracking-widest text-teal-700">
            Why Choose Us
          </span>

          <h2 className="mt-3 text-5xl font-bold text-gray-900">
            Wellness Without Leaving Home
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            We combine luxury, convenience, and experienced therapists to
            create an unforgettable spa experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-gray-100 bg-[#FAF9F6] p-8 transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-700 text-2xl text-white">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;