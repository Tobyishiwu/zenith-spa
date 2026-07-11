import {
  FaSlidersH,
  FaGlobe,
  FaShieldAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const items = [
  {
    icon: <FaSlidersH />,
    title: "Intelligent Matching",
    text: "Our system is designed to recommend the ideal specialist based on your unique biometric preferences and recovery targets.",
  },
  {
    icon: <FaGlobe />,
    title: "Worldwide Network",
    text: "Access premium luxury treatments spanning a unified, elite network of international practitioners across the globe.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Verified Professionals",
    text: "Every single practitioner undergoes a rigorous credential validation and background assessment for unmatched safety.",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Flexible Venues",
    text: "Experience top-tier therapy seamlessly delivered directly to your home, hotel, office, workspace, or private luxury venue.",
  },
];

const WhyChoose = () => {
  return (
    <section className="bg-[#FAF9F6] py-24 border-t border-stone-200/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            Why Choose Us
          </span>

          <h2 className="mt-4 text-3xl font-light tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            A New Standard for <span className="font-medium text-teal-600">Luxury Wellness.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-stone-500">
            Zenith Spa reimagines holistic care by converging smart booking mechanics with a premiere global network of elite mobile therapeutic experts.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-stone-200/40 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/40"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50/60 text-lg text-teal-600 transition-colors duration-300 group-hover:bg-teal-600 group-hover:text-white shadow-sm">
                {item.icon}
              </div>

              <h3 className="text-base font-semibold tracking-tight text-stone-800">
                {item.title}
              </h3>

              <p className="mt-3 text-xs leading-5 text-stone-500 font-normal">
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