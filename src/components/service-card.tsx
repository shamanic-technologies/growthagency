interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  isAvailable: boolean;
}

export function ServiceCard({
  icon,
  title,
  description,
  isAvailable,
}: ServiceCardProps) {
  return (
    <div
      className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
        isAvailable
          ? "bg-white border-emerald-200 hover:border-emerald-300 glow"
          : "bg-slate-50 border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{icon}</div>
        {isAvailable ? (
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
            Available
          </span>
        ) : (
          <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full border border-slate-200">
            Coming Soon
          </span>
        )}
      </div>
      <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
