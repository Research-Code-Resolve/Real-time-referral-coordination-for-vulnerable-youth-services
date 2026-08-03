import { useEffect, useState } from 'react';
import { buildApiUrl, getStoredCredentials } from '../lib/api.js';

function Dashboard() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReferrals() {
      try {
        const authHeader = getStoredCredentials();
        const response = await fetch(buildApiUrl('/referrals/'), {
          headers: { Authorization: authHeader },
        });

        if (!response.ok) {
          throw new Error('Failed to load referrals');
        }

        const data = await response.json();
        setReferrals(data);
      } catch {
        setError('Could not load referrals from the server.');
      } finally {
        setLoading(false);
      }
    }

    fetchReferrals();
  }, []);

  const activeCases = referrals.length;
  const needsReview = referrals.filter((r) => r.status === 'Submitted').length;
  const emergencyCases = referrals.filter((r) => r.priority === 'Emergency').length;

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Social Work Connect</p>
          <h1>Care team overview</h1>
        </div>
        <button type="button" className="ghost-btn">
          Log out
        </button>
      </header>

      {error && <p className="error-banner">{error}</p>}

      <section className="dashboard-grid">
        <article className="panel panel-large">
          <h2>Today at a glance</h2>
          <div className="stats">
            <div className="stat-card">
              <strong>{loading ? '…' : activeCases}</strong>
              <span>Active cases</span>
            </div>
            <div className="stat-card">
              <strong>{loading ? '…' : needsReview}</strong>
              <span>Needs review</span>
            </div>
            <div className="stat-card">
              <strong>{loading ? '…' : emergencyCases}</strong>
              <span>Emergency priority</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <h2>Recent referrals</h2>
          {loading ? (
            <p>Loading…</p>
          ) : (
            <ul className="task-list">
              {referrals.slice(0, 5).map((referral) => (
                <li key={referral.id}>
                  <span>{referral.service_needed}</span>
                  <strong>{referral.status}</strong>
                </li>
              ))}
              {referrals.length === 0 && <li>No referrals yet.</li>}
            </ul>
          )}
        </article>
      </section>
    </div>
  );
}

export default Dashboard;