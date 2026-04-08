import { Icon } from "./Icons";

const statusOptions = ["approved", "active", "rejected"];
const unitOptions = ["minutes", "hours", "days"];

export default function AccessRequestForm({
  formData,
  onChange,
  onSubmit,
  now,
  calculatedExpiry,
  remaining,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Icon name="request" className="h-5 w-5 text-rose-500" />
        Access Request
      </h2>
      <p className="mb-5 text-sm text-slate-500">Create custom time-based IAM access sessions.</p>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <Input label="Developer Name" name="developerName" value={formData.developerName} onChange={onChange} />
        <Input label="Role" name="role" value={formData.role} onChange={onChange} />
        <Input label="Resource Type" name="resourceType" value={formData.resourceType} onChange={onChange} />
        <Input label="Resource ID" name="resourceId" value={formData.resourceId} onChange={onChange} />
        <Input label="Environment" name="environment" value={formData.environment} onChange={onChange} />

        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Initial Status</span>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-rose-300 focus:outline-none"
          >
            {statusOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-slate-700">Duration (numeric)</span>
            <input
              required
              min="1"
              type="number"
              name="durationValue"
              value={formData.durationValue}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-rose-300 focus:outline-none"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-700">Duration Unit</span>
            <select
              name="durationUnit"
              value={formData.durationUnit}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-rose-300 focus:outline-none"
            >
              {unitOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 p-4 md:col-span-2">
          <p className="flex items-center gap-2 text-sm text-slate-800">
            <Icon name="clock" className="h-4 w-4 text-rose-500" /> Start Time: {now}
          </p>
          <p className="flex items-center gap-2 text-sm text-slate-800">
            <Icon name="clock" className="h-4 w-4 text-orange-500" /> Expiry Time: {calculatedExpiry}
          </p>
          <p className="flex items-center gap-2 text-sm text-rose-700">
            <Icon name="active" className="h-4 w-4 text-rose-500" /> Remaining Live Countdown: {remaining}
          </p>
        </div>

        <button
          type="submit"
          className="md:col-span-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-2 font-semibold text-white transition hover:opacity-90"
        >
          Create Access Session
        </button>
      </form>
    </section>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-slate-700">{label}</span>
      <input
        required
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-rose-300 focus:outline-none"
      />
    </label>
  );
}
