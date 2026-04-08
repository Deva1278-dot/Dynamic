import { Icon } from "./Icons";

const statuses = ["all", "approved", "active", "expired", "revoked", "rejected"];

export default function HistoryTable({
  records,
  filters,
  onFilterChange,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Icon name="history" className="h-5 w-5 text-rose-500" />
          Usage History
        </h2>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <FilterInput
          placeholder="Search by name"
          value={filters.name}
          onChange={(value) => onFilterChange("name", value)}
        />
        <FilterInput
          placeholder="Search by resource"
          value={filters.resource}
          onChange={(value) => onFilterChange("resource", value)}
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange("date", e.target.value)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900"
        />
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              {["Name", "Resource", "Environment", "Start Time", "End Time", "Duration Used", "Status", "Token ID"].map(
                (header) => (
                  <th key={header} className="px-3 py-2 font-medium">
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-slate-400">
                  No history records match current filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.tokenId} className="border-b border-slate-100 text-slate-900 hover:bg-slate-50">
                  <td className="px-3 py-2">{record.developerName}</td>
                  <td className="px-3 py-2">{record.resourceType}:{record.resourceId}</td>
                  <td className="px-3 py-2">{record.environment}</td>
                  <td className="px-3 py-2">{formatDate(record.startTime)}</td>
                  <td className="px-3 py-2">{formatDate(record.expiryTime)}</td>
                  <td className="px-3 py-2">{record.totalDurationUsed}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-1 text-xs uppercase ring-1 ${getStatusClass(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1">
                      <Icon name="token" className="h-3.5 w-3.5 text-rose-500" />
                      {record.tokenId}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FilterInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900"
    />
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "-";
}

function getStatusClass(status) {
  if (status === "approved") return "bg-emerald-100 text-emerald-700 ring-emerald-300";
  if (status === "active") return "bg-sky-100 text-sky-700 ring-sky-300";
  if (status === "expired") return "bg-amber-100 text-amber-700 ring-amber-300";
  if (status === "revoked") return "bg-rose-100 text-rose-700 ring-rose-300";
  if (status === "rejected") return "bg-violet-100 text-violet-700 ring-violet-300";
  return "bg-slate-100 text-slate-700 ring-slate-300";
}
