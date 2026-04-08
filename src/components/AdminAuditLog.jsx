import { Icon } from "./Icons";

export default function AdminAuditLog({ records }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Icon name="audit" className="h-5 w-5 text-rose-500" />
        Admin Audit Log
      </h2>
      <div className="space-y-2">
        {records.length === 0 ? (
          <p className="text-sm text-slate-400">No audit entries available.</p>
        ) : (
          records.slice(0, 10).map((record) => (
            <div key={`audit-${record.tokenId}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="text-slate-800">
                <span className="font-medium">{record.developerName}</span> used{" "}
                <span className="font-medium">
                  {record.resourceType}:{record.resourceId}
                </span>{" "}
                for {record.totalDurationUsed}
              </p>
              <p className="text-slate-500">
                Status: {record.status} | Start: {formatDate(record.startTime)} | End: {formatDate(record.expiryTime)}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "-";
}
