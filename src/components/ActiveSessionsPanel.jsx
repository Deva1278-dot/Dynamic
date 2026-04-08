import { Icon } from "./Icons";

export default function ActiveSessionsPanel({ sessions, nowMs, onRevoke, animate = true }) {
  return (
    <section className="card-animate rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Icon name="active" className="h-5 w-5 text-rose-500" />
          Live Session Tracker
        </h2>
        <span className={`${animate ? "pulse-soft" : ""} rounded-full bg-rose-100 px-3 py-1 text-xs text-rose-700`}>
          {sessions.length} active
        </span>
      </div>
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-400">No active sessions.</p>
        ) : (
          sessions.map((session) => (
            <article key={session.tokenId} className="card-animate rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{session.developerName}</p>
                  <p className="text-sm text-slate-700">
                    {session.resourceType}: {session.resourceId}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.durationValue} {session.durationUnit}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRevoke(session.tokenId)}
                  className="rounded-lg border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-100"
                >
                  Revoke
                </button>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-rose-600">
                <Icon name="clock" className="h-4 w-4" />
                Remaining: {getRemaining(session.expiryTime, nowMs)}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function getRemaining(expiryTime, nowMs) {
  const diff = Math.max(0, new Date(expiryTime).getTime() - nowMs);
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
