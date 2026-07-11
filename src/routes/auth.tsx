import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CloudSun, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Sign in — Mausam" },
      { name: "description", content: "Sign in or create an account to access your personalized weather, alerts, and emergency dashboard." },
      { property: "og:title", content: "Sign in — Mausam" },
      { property: "og:description", content: "Sign in or create an account to access your personalized weather, alerts, and emergency dashboard." },
      { property: "og:url", content: "https://mauam.lovable.app/auth" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/00b364fa-3c06-4a33-b3ff-7623d2c8f8c5" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/00b364fa-3c06-4a33-b3ff-7623d2c8f8c5" },
      { name: "robots", content: "noindex" },
    ],
    links: [
      { rel: "canonical", href: "https://mauam.lovable.app/auth" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") navigate({ to: "/", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null); setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        setInfo("Account created. You're signed in.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden mausam-bg">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
        <Link to="/" className="mb-8 flex items-center gap-2 self-center text-lg font-semibold">
          <CloudSun className="h-5 w-5 text-primary" />
          <span className="font-display">Mausam</span>
        </Link>

        <div className="glass-strong rounded-3xl border border-glass-border/60 p-8 shadow-2xl">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to see weather, alerts, and news for your saved locations."
              : "Set up your Mausam dashboard in seconds."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Display name</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex"
                  className="w-full rounded-xl border border-glass-border/60 bg-glass px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-glass-border/60 bg-glass px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-glass-border/60 bg-glass px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-news-breaking/50 bg-news-breaking/10 px-3 py-2 text-xs text-news-breaking">
                {error}
              </div>
            )}
            {info && (
              <div className="rounded-xl border border-news-official/50 bg-news-official/10 px-3 py-2 text-xs text-news-official">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            {mode === "signin" ? (
              <>New here?{" "}
                <button className="font-semibold text-primary hover:underline" onClick={() => { setMode("signup"); setError(null); }}>
                  Create an account
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button className="font-semibold text-primary hover:underline" onClick={() => { setMode("signin"); setError(null); }}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          By continuing you agree to receive weather and emergency information tailored to your saved locations.
        </p>
      </div>
    </div>
  );
}
