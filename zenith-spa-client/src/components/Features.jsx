import {
  FaUserNurse,
  FaCrown,
  FaHouseUser,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUserNurse className="text-3xl text-amber-500" />,
    title: "Professional Therapists",
    description: "Licensed and carefully selected wellness professionals.",
  },
  {
    icon: <FaCrown className="text-3xl text-amber-500" />,
    title: "Premium Experience",
    description: "Luxury spa treatments tailored to your comfort.",
  },
  {
    icon: <FaHouseUser className="text-3xl text-amber-500" />,
    title: "We Come To You",
    description: "Enjoy a complete spa experience without leaving home.",
  },
];

const Features = () => {
  return (
    <section className="-mt-12 relative z-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 rounded-[32px] bg-white p-8 shadow-2xl md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 rounded-2xl p-4 transition hover:bg-gray-50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
                {feature.icon}
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
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