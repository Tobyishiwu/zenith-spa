import {
  FaSlidersH,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaSlidersH className="text-2xl text-teal-600" />,
    title: "Intelligent Therapist Matching",
    description: "Our platform is designed to recommend the ideal certified expert based on your specific body metrics and recovery goals.",
  },
  {
    icon: <FaGlobe className="text-2xl text-teal-600" />,
    title: "Worldwide Wellness Network",
    description: "Access elite, rigorously vetted wellness professionals across major global cities, ensuring luxury quality wherever you travel.",
  },
  {
    icon: <FaMapMarkerAlt className="text-2xl text-teal-600" />,
    title: "Choose Your Preferred Location",
    description: "Seamlessly select where your treatment happens: your home, hotel suite, workplace, vacation rental, or a curated luxury venue.",
  },
];

const Features = () => {
  return (
    <section className="-mt-12 relative z-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 rounded-[32px] bg-white p-8 shadow-xl border border-stone-200/40 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 rounded-2xl p-4 transition-all duration-200 hover:bg-stone-50/60"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-stone-50 ring-1 ring-stone-200/50">
                {feature.icon}
              </div>

              <div>
                <h3 className="text-base font-semibold text-stone-900 tracking-tight">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-stone-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;