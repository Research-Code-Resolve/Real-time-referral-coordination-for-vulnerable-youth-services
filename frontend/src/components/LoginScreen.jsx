import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl, buildBasicAuthHeader, getStoredCredentials, saveCredentials } from '../lib/api.js';

function LoginScreen() {
  const storedCredentials = getStoredCredentials();
  const [email, setEmail] = useState(storedCredentials?.email ?? '');
  const [password, setPassword] = useState(storedCredentials?.password ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(buildApiUrl('/organisations/'), {
        headers: {
          Accept: 'application/json',
          Authorization: buildBasicAuthHeader(email, password),
        },
      });

      if (!response.ok) {
        throw new Error('Unable to authenticate with the provided credentials.');
      }

      saveCredentials(email, password);
      navigate('/dashboard');
    } catch {
      setError('We could not sign you in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = () => {
    navigate('/request-access');
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(167,230,255,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(134,239,172,0.22),transparent_35%),#ebf7fb] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-xl flex-col justify-center">
        <div className="rounded-[36px] border border-white/70 bg-white/90 p-7 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-8">
          <div className="mb-10 flex flex-col items-center gap-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 shadow-sm">
              <svg viewBox="0 0 64 64" className="h-12 w-12 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 26c0-6 4-12 12-12s12 6 12 12" strokeLinecap="round" />
                <path d="M16 42c0-8 6-16 16-16s16 8 16 16" strokeLinecap="round" />
                <path d="M24 48c0-4 4-8 8-8s8 4 8 8" strokeLinecap="round" />
                <path d="M20 32l-4-6m28 6l4-6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-700 sm:text-4xl">
                Social Work 
                <br />
                Connect
              </h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                A clean, secure access point for your team.
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 inline-block">Email</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 inline-block">Password</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </label>

            {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[28px] bg-slate-800 px-5 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(15,23,42,0.5)] transition hover:bg-slate-900 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>

            <button
              type="button"
              onClick={handleRequestAccess}
              className="w-full rounded-[28px] border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Request Access / Register
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}

export default LoginScreen;
