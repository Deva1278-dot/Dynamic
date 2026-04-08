import { Icon } from "./Icons";

export default function SessionTimeline({ records }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Icon name="history" className="h-5 w-5 text-rose-500" />
        Session Timeline View
      </h2>
      <div className="space-y-3">
        {records.length === 0 ? (
          <p className="text-sm text-slate-400">No timeline events yet.</p>
        ) : (
          records.slice(0, 8).map((record) => (
            <article key={record.tokenId} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-900">{record.developerName}</p>
              <p className="mt-2 text-sm text-slate-700">
                Requested: {formatDate(record.requestedTime)} - Approved: {formatDate(record.approvedTime)}
              </p>
              <p className="text-sm text-slate-700">
                Started: {formatDate(record.startTime)} - Expired: {formatDate(record.expiryTime)}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "-";
}
