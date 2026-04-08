import { Icon } from "./Icons";

export default function LoginPanel({ credentials, onChange, onSubmit }) {
  return (
    <div className="mx-auto mt-12 max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon name="login" className="h-7 w-7" />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Dynamic IAM</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Welcome Back</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to access the dashboard</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-700">Email</span>
          <input
            required
            type="email"
            name="email"
            value={credentials.email}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-rose-300"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-slate-700">Password</span>
          <input
            required
            type="password"
            name="password"
            value={credentials.password}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-rose-300"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-2.5 font-semibold text-white transition hover:opacity-95"
        >
          Login
        </button>
      </form>
    </div>
  );
}
