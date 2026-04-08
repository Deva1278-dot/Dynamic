export default function SettingsPanel({ settings, onToggle, onLogout }) {
  return (
    <section className="card-animate rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
      <p className="mt-1 text-sm text-slate-500">Manage app preferences and session controls.</p>

      <div className="mt-5 space-y-3">
        <SettingRow
          label="Compact Layout"
          hint="Condense spacing to show more information."
          checked={settings.compactMode}
          onChange={() => onToggle("compactMode")}
        />
        <SettingRow
          label="Live Countdown Animation"
          hint="Enable pulse animation for active session indicator."
          checked={settings.animations}
          onChange={() => onToggle("animations")}
        />
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="mt-6 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
      >
        Logout
      </button>
    </section>
  );
}

function SettingRow({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`h-7 w-12 rounded-full p-1 transition ${checked ? "bg-emerald-500" : "bg-slate-300"}`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}
