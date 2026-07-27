"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { apiFetch, parseJsonResponse } from "@/lib/api-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    apiFetch("/api/admin/session")
      .then((r) => parseJsonResponse<{ authenticated: boolean }>(r))
      .then((data) => {
        if (data.authenticated) router.replace("/admin/dashboard");
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let message = "Λάθος email ή κωδικός.";
        try {
          const data = await parseJsonResponse<{ error?: string }>(res);
          if (data.error) message = data.error;
        } catch {
          /* ignore parse errors */
        }
        setError(message);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Σφάλμα σύνδεσης. Δοκίμασε ξανά.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-plum/40 text-sm">Έλεγχος σύνδεσης…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[420px] h-[420px] rounded-full bg-lav-100/60 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[320px] h-[320px] rounded-full bg-gold-400/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lav-400 to-lav-600 flex items-center justify-center mx-auto mb-5 shadow-soft">
            <span className="text-white font-display font-bold text-2xl">P</span>
          </div>
          <h1 className="font-display text-3xl text-plum mb-2">Πίνακας Διαχείρισης</h1>
          <p className="text-plum/45 text-sm">The Pouma Academy</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-lav-100 shadow-medium p-8 space-y-5"
        >
          <div>
            <label className="block text-[11px] font-bold text-plum/40 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Το email σας"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-lav-200 bg-ivory/50 text-plum text-sm focus:outline-none focus:ring-2 focus:ring-lav-400/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-plum/40 uppercase tracking-widest mb-2">
              Κωδικός
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-lav-200 bg-ivory/50 text-plum text-sm focus:outline-none focus:ring-2 focus:ring-lav-400/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-plum/35 hover:text-lav-600 transition-colors cursor-pointer"
                aria-label={showPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-lav-600 text-white font-semibold hover:bg-lav-700 transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? "Σύνδεση…" : "Είσοδος"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
