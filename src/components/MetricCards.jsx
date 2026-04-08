import { Icon } from "./Icons";

export default function MetricCards({ metrics }) {
  const items = [
    { label: "Total Sessions Used", value: metrics.totalSessions, icon: "history" },
    { label: "Total Hours Used", value: metrics.totalHours.toFixed(2), icon: "clock" },
    { label: "Most Used Resource", value: metrics.mostUsedResource || "N/A", icon: "resource" },
    { label: "Last Accessed User", value: metrics.lastAccessedUser || "N/A", icon: "user" },
    { label: "Recent Activity", value: metrics.recentActivity || "No recent events", icon: "dashboard" },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item, idx) => (
        <article
          key={item.label}
          className="card-animate rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <span className="rounded-lg bg-rose-50 p-1.5 text-rose-500">
              <Icon name={item.icon} className="h-4 w-4" />
            </span>
          </div>
          <p className={`mt-2 text-lg font-semibold ${idx === 0 ? "text-rose-600" : "text-slate-900"}`}>{item.value}</p>
        </article>
      ))}
    </section>
  );
}
