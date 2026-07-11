const stats = [
  {
    value: "5,000+",
    label: "Global Clients",
  },
  {
    value: "120+",
    label: "Vetted Therapists",
  },
  {
    value: "4.9★",
    label: "Average Rating",
  },
];

const Stats = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="text-left">
          <h3 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            {stat.value}
          </h3>

          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-stone-400">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stats;