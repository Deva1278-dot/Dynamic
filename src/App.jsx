import { useEffect, useMemo, useState } from "react";
import AccessRequestForm from "./components/AccessRequestForm";
import ActiveSessionsPanel from "./components/ActiveSessionsPanel";
import AdminAuditLog from "./components/AdminAuditLog";
import HistoryTable from "./components/HistoryTable";
import { Icon } from "./components/Icons";
import LoginPanel from "./components/LoginPanel";
import MetricCards from "./components/MetricCards";
import SettingsPanel from "./components/SettingsPanel";
import SessionTimeline from "./components/SessionTimeline";
import Sidebar from "./components/Sidebar";

const STORAGE_KEY = "dynamicIamRecords";
const ACTIVE_KEY = "dynamicIamActiveSessions";
const AUTH_KEY = "dynamicIamAuthUser";
const SETTINGS_KEY = "dynamicIamUiSettings";

const defaultForm = {
  developerName: "",
  role: "",
  resourceType: "",
  resourceId: "",
  environment: "production",
  durationValue: 30,
  durationUnit: "minutes",
  status: "active",
};

export default function App() {
  const [formData, setFormData] = useState(defaultForm);
  const [records, setRecords] = useState(() => readLocalStorage(STORAGE_KEY));
  const [activeSessions, setActiveSessions] = useState(() => readLocalStorage(ACTIVE_KEY));
  const [nowMs, setNowMs] = useState(Date.now());
  const [filters, setFilters] = useState({ name: "", resource: "", date: "", status: "all" });
  const [compactMode, setCompactMode] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [authUser, setAuthUser] = useState(() => readLocalStorage(AUTH_KEY));
  const [settings, setSettings] = useState(() =>
    readLocalStorage(SETTINGS_KEY, { compactMode: false, animations: true }),
  );

  useEffect(() => {
    if (settings?.compactMode !== undefined) setCompactMode(settings.compactMode);
  }, [settings]);

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(activeSessions));
  }, [activeSessions]);

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const expired = activeSessions.filter((s) => new Date(s.expiryTime).getTime() <= nowMs);
    if (expired.length === 0) return;

    const expiredIds = new Set(expired.map((s) => s.tokenId));
    setActiveSessions((prev) => prev.filter((s) => !expiredIds.has(s.tokenId)));
    setRecords((prev) =>
      prev.map((record) =>
        expiredIds.has(record.tokenId)
          ? {
              ...record,
              status: "expired",
              totalDurationUsed: calculateUsedDuration(record.startTime, record.expiryTime),
            }
          : record,
      ),
    );
  }, [activeSessions, nowMs]);

  const durationMs = getDurationMs(Number(formData.durationValue), formData.durationUnit);
  const startDate = new Date(nowMs);
  const expiryDate = new Date(nowMs + durationMs);

  const metrics = useMemo(() => {
    const totalSessions = records.length;
    const totalHours = records.reduce((sum, record) => {
      const duration = parseDurationToHours(record.totalDurationUsed);
      return sum + duration;
    }, 0);
    const resourceCount = records.reduce((acc, r) => {
      const key = `${r.resourceType}:${r.resourceId}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const mostUsedResource = Object.entries(resourceCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const lastAccessed = records[0]?.developerName || "";
    const recentActivity = records[0]
      ? `${records[0].developerName} - ${records[0].status}`
      : "";
    return {
      totalSessions,
      totalHours,
      mostUsedResource,
      lastAccessedUser: lastAccessed,
      recentActivity,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const nameMatch = record.developerName.toLowerCase().includes(filters.name.toLowerCase());
      const resourceMatch = `${record.resourceType} ${record.resourceId}`
        .toLowerCase()
        .includes(filters.resource.toLowerCase());
      const statusMatch = filters.status === "all" || record.status === filters.status;
      const dateMatch =
        !filters.date || new Date(record.startTime).toISOString().slice(0, 10) === filters.date;
      return nameMatch && resourceMatch && statusMatch && dateMatch;
    });
  }, [records, filters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: name === "durationValue" ? Number(value) : value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const timestamp = new Date().toISOString();
    const startTime = timestamp;
    const expiryTime = new Date(Date.now() + getDurationMs(formData.durationValue, formData.durationUnit)).toISOString();
    const tokenId = `tok-${Math.random().toString(36).slice(2, 10)}`;

    const newRecord = {
      ...formData,
      tokenId,
      requestedTime: timestamp,
      approvedTime: formData.status === "rejected" ? null : timestamp,
      startTime: formData.status === "rejected" ? null : startTime,
      expiryTime: formData.status === "rejected" ? null : expiryTime,
      totalDurationUsed:
        formData.status === "rejected"
          ? "0h 0m"
          : calculateUsedDuration(startTime, expiryTime),
      revokedTime: null,
      status: formData.status,
    };

    setRecords((prev) => [newRecord, ...prev]);
    if (formData.status === "active") {
      setActiveSessions((prev) => [newRecord, ...prev]);
    }
    setFormData(defaultForm);
  };

  const handleRevoke = (tokenId) => {
    const revokedTime = new Date().toISOString();
    setActiveSessions((prev) => prev.filter((session) => session.tokenId !== tokenId));
    setRecords((prev) =>
      prev.map((record) =>
        record.tokenId === tokenId
          ? {
              ...record,
              status: "revoked",
              revokedTime,
              totalDurationUsed: calculateUsedDuration(record.startTime, revokedTime),
            }
          : record,
      ),
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setAuthUser({
      email: credentials.email,
      loggedInAt: new Date().toISOString(),
    });
    setCredentials({ email: "", password: "" });
    setActiveView("dashboard");
  };

  const handleLogout = () => {
    setAuthUser(null);
    setActiveView("login");
  };

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === "compactMode") setCompactMode(next.compactMode);
      return next;
    });
  };

  const showLogin = !authUser;

  return (
    <div className="flex min-h-screen text-slate-900">
      {!showLogin && (
        <Sidebar
          compactMode={compactMode}
          activeView={activeView}
          onChangeView={setActiveView}
          user={authUser}
          onLogout={handleLogout}
        />
      )}
      <main className={`flex-1 ${compactMode ? "p-4 md:p-5" : "p-6 md:p-8"}`}>
        <div className={`mx-auto ${compactMode ? "max-w-6xl space-y-4" : "max-w-7xl space-y-6"}`}>
          {showLogin ? (
            <LoginPanel credentials={credentials} onChange={handleLoginChange} onSubmit={handleLogin} />
          ) : (
            <>
              <section className="card-animate rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Access Intelligence</p>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
                      <Icon name="dashboard" className="h-6 w-6 text-rose-500" />
                      Dynamic IAM Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Manage privileged access sessions with live controls and full audit history.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
                    <p className="text-xs text-slate-500">Current Time</p>
                    <p className="text-sm font-medium text-slate-800">{startDate.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => toggleSetting("compactMode")}
                    className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                  >
                    {compactMode ? "Switch to Expanded Layout" : "Switch to Compact Layout"}
                  </button>
                </div>
              </section>
              {(activeView === "dashboard" || activeView === "access") && <MetricCards metrics={metrics} />}

              {activeView === "dashboard" && (
                <div className={`grid ${compactMode ? "gap-4" : "gap-6"} xl:grid-cols-3`}>
                  <div className={`${compactMode ? "space-y-4" : "space-y-6"} xl:col-span-2`}>
                    <AccessRequestForm
                      formData={formData}
                      onChange={handleChange}
                      onSubmit={handleSubmit}
                      now={startDate.toLocaleString()}
                      calculatedExpiry={expiryDate.toLocaleString()}
                      remaining={formatRemaining(durationMs)}
                    />
                    <HistoryTable records={filteredRecords} filters={filters} onFilterChange={handleFilterChange} />
                  </div>
                  <div className={compactMode ? "space-y-4" : "space-y-6"}>
                    <ActiveSessionsPanel
                      sessions={activeSessions}
                      nowMs={nowMs}
                      onRevoke={handleRevoke}
                      animate={settings.animations}
                    />
                    <SessionTimeline records={records} />
                    <AdminAuditLog records={records} />
                  </div>
                </div>
              )}

              {activeView === "access" && (
                <AccessRequestForm
                  formData={formData}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  now={startDate.toLocaleString()}
                  calculatedExpiry={expiryDate.toLocaleString()}
                  remaining={formatRemaining(durationMs)}
                />
              )}

              {activeView === "active" && (
                <ActiveSessionsPanel
                  sessions={activeSessions}
                  nowMs={nowMs}
                  onRevoke={handleRevoke}
                  animate={settings.animations}
                />
              )}

              {activeView === "history" && (
                <div className="space-y-6">
                  <HistoryTable records={filteredRecords} filters={filters} onFilterChange={handleFilterChange} />
                  <SessionTimeline records={records} />
                </div>
              )}

              {activeView === "audit" && <AdminAuditLog records={records} />}

              {activeView === "settings" && (
                <SettingsPanel settings={settings} onToggle={toggleSetting} onLogout={handleLogout} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function getDurationMs(value, unit) {
  const safe = Number.isFinite(value) && value > 0 ? value : 1;
  if (unit === "days") return safe * 24 * 60 * 60 * 1000;
  if (unit === "hours") return safe * 60 * 60 * 1000;
  return safe * 60 * 1000;
}

function formatRemaining(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function calculateUsedDuration(startIso, endIso) {
  if (!startIso || !endIso) return "0h 0m";
  const diff = Math.max(0, new Date(endIso).getTime() - new Date(startIso).getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

function parseDurationToHours(value) {
  if (!value) return 0;
  const match = value.match(/(\d+)h\s+(\d+)m/);
  if (!match) return 0;
  return Number(match[1]) + Number(match[2]) / 60;
}

function readLocalStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback ?? [];
    const parsed = JSON.parse(raw);
    return parsed ?? fallback ?? [];
  } catch {
    return fallback ?? [];
  }
}
