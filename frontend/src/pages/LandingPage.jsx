import { useState } from "react";
import {
  Users,
  Search,
  Send,
  Activity,
  Bell,
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

const BENEFITS = [
  {
    icon: Search,
    title: "Find services",
    description:
      "Search partner organisations by service type, location, and availability so clients get to the right help faster.",
  },
  {
    icon: Send,
    title: "Create referrals",
    description:
      "Send a referral to a partner organisation in a few clicks, with the client details they need to act on it.",
  },
  {
    icon: Activity,
    title: "Track referrals",
    description:
      "See every referral's status in one place, from submitted to in progress to resolved — no more chasing emails.",
  },
  {
    icon: Bell,
    title: "Receive updates",
    description:
      "Get notified the moment a partner organisation updates a referral, so nothing sits unnoticed.",
  },
];

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#security", label: "Security" },
];

export default function LandingPage({ onGetStarted, onLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_rgba(107,143,113,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(31,58,95,0.12),transparent_35%),#f4f7f5] text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-20 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-deepblue-50 flex items-center justify-center">
              <Users className="h-4.5 w-4.5 text-deepblue-500" strokeWidth={1.5} />
            </div>
            <span className="font-semibold text-slate-800">
              Social Work Connect
            </span>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-slate-600 hover:text-deepblue-500 transition"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onLogin}
              className="text-sm font-medium text-slate-600 hover:text-deepblue-500 px-4 py-2 transition"
            >
              Log In
            </button>
            <button
              onClick={onGetStarted}
              className="text-sm font-medium bg-sage-500 hover:bg-sage-600 text-white rounded-full px-5 py-2.5 transition"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="sm:hidden p-2 text-slate-600"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium text-slate-600 hover:text-deepblue-500 transition"
              >
                {label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={onLogin}
                className="text-sm font-medium text-slate-600 border border-slate-200 rounded-full px-5 py-2.5 transition"
              >
                Log In
              </button>
              <button
                onClick={onGetStarted}
                className="text-sm font-medium bg-sage-500 hover:bg-sage-600 text-white rounded-full px-5 py-2.5 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-deepblue-50 flex items-center justify-center">
          <Users className="h-7 w-7 text-deepblue-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-deepblue-500 leading-tight max-w-2xl mx-auto">
          One place to coordinate every client referral
        </h1>
        <p className="text-slate-500 text-lg mt-5 max-w-xl mx-auto">
          Social Work Connect helps social workers find the right partner
          services, send referrals, and follow them through to resolution —
          without losing track along the way.
        </p>
        <div className="flex items-center justify-center gap-3 mt-9">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 text-sm font-medium bg-sage-500 hover:bg-sage-600 text-white rounded-full px-6 py-3.5 transition"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onLogin}
            className="text-sm font-medium text-slate-600 hover:text-deepblue-500 border border-slate-200 hover:border-deepblue-200 hover:bg-white rounded-full px-6 py-3.5 transition"
          >
            Log In
          </button>
        </div>
      </section>

      {/* Benefits */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-14 border-t border-slate-100 scroll-mt-20">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide text-center mb-10">
          What you can do
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-sm p-6 hover:border-deepblue-100 transition"
            >
              <div className="h-11 w-11 rounded-full bg-deepblue-50 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-deepblue-500" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy / security statement */}
      <section id="security" className="border-t border-slate-100 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto flex items-start gap-4">
            <div className="h-11 w-11 shrink-0 rounded-full bg-white border border-slate-200 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-deepblue-500" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1.5">
                Built for sensitive client information
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Access is limited to verified social workers, partner
                organisations, and administrators. Every account is set up by
                an administrator, and partners only ever see referrals sent
                to their own organisation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users className="h-4 w-4" strokeWidth={1.5} />
            <span>Social Work Connect</span>
          </div>
          <p className="text-xs text-slate-400 text-center sm:text-right">
            Need an account? Contact your administrator.
            <br className="sm:hidden" /> © {new Date().getFullYear()} Social
            Work Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}