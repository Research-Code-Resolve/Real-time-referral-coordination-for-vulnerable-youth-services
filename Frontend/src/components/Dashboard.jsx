

function Dashboard() {
  const followUps = [
    { title: 'Follow up with Ms. Rivera', time: '10:30 AM' },
    { title: 'Review housing referral', time: '1:00 PM' },
    { title: 'Prepare outreach notes', time: '3:15 PM' }
  ];

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

      <section className="dashboard-grid">
        <article className="panel panel-large">
          <h2>Today at a glance</h2>
          <div className="stats">
            <div className="stat-card">
              <strong>12</strong>
              <span>Active cases</span>
            </div>
            <div className="stat-card">
              <strong>4</strong>
              <span>Needs review</span>
            </div>
            <div className="stat-card">
              <strong>2</strong>
              <span>Appointments today</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <h2>Upcoming follow-ups</h2>
          <ul className="task-list">
            {followUps.map((task) => (
              <li key={task.title}>
                <span>{task.title}</span>
                <strong>{task.time}</strong>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;