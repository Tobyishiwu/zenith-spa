const stats = [
  {
    value: "500+",
    label: "Happy Clients",
  },
  {
    value: "20+",
    label: "Certified Therapists",
  },
  {
    value: "4.9★",
    label: "Average Rating",
  },
];

const Stats = () => {
  return (
    <div className="mt-14 grid grid-cols-3 gap-6 border-t border-gray-200 pt-10">
      {stats.map((stat) => (
        <div key={stat.label}>
          <h3 className="text-3xl font-bold text-gray-900">
            {stat.value}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stats;