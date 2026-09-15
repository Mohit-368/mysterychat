import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib";
import { useAuth } from "../context";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { const data = await api("/auth/login", { method: "POST", body: JSON.stringify(form) }); setUser(data.user); navigate(location.state?.from || "/chat", { replace: true }); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 pt-24 pb-16">
    <div className="w-full max-w-md">
      <div className="text-center mb-8"><Link to="/" className="text-2xl font-semibold">Mystery<span className="text-blue-500 font-light">Chat</span></Link><p className="text-gray-500 text-sm mt-2">Enter the shadows.</p></div>
      <form onSubmit={submit} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 space-y-5">
        {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 px-4 py-3 text-sm">{error}</div>}
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        <button disabled={busy} className="w-full bg-white text-black rounded-xl py-3.5 font-medium disabled:opacity-50">{busy ? "Signing in..." : "Sign In"}</button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">No account? <Link to="/register" className="text-blue-400">Create one</Link></p>
    </div>
  </main>;
}
function Field({ label, type, value, onChange }) { return <label className="block"><span className="text-xs text-gray-400 ml-1">{label}</span><input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500/60" /></label>; }
