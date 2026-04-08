import { Icon } from "./Icons";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "access", label: "Access Requests", icon: "request" },
  { id: "active", label: "Active Sessions", icon: "active" },
  { id: "history", label: "Usage History", icon: "history" },
  { id: "audit", label: "Admin Audit", icon: "audit" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function Sidebar({ compactMode, activeView, onChangeView, user, onLogout }) {
  return (
    <aside className={`sticky top-0 h-screen border-r border-slate-200 bg-white/85 backdrop-blur-xl ${compactMode ? "w-64 p-4" : "w-72 p-6"}`}>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Dynamic IAM</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Agent Console</h1>
        <p className="mt-2 text-xs text-slate-500">Cloud access control and usage observability</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onChangeView(item.id)}
            className={`card-animate flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
              activeView === item.id
                ? "bg-gradient-to-r from-rose-500/15 to-orange-400/20 text-rose-700 ring-1 ring-rose-300"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon name={item.icon} className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs text-slate-500">Signed in as</p>
        <p className="mt-1 text-sm font-medium text-slate-900">{user?.email || "Guest User"}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 inline-flex items-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700"
        >
          <Icon name="logout" className="h-3.5 w-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
