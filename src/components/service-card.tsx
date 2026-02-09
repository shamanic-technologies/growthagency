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
      className={`rounded-2xl border p-6 transition-all duration-200 hover:shadow-md ${
        isAvailable
          ? "bg-white border-slate-100 shadow-sm"
          : "bg-slate-50 border-slate-100"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{icon}</div>
        {isAvailable ? (
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-medium border border-emerald-100">
            Available
          </span>
        ) : (
          <span className="text-xs bg-slate-50 text-slate-400 px-2.5 py-1 rounded-full border border-slate-200">
            Coming Soon
          </span>
        )}
      </div>
      <h3 className="font-semibold text-lg text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
