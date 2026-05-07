import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import type { UserProfile } from '../api/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    authApi.getProfile()
      .then(res => setProfile(res.data))
      .catch(() => { setError('Session expired'); localStorage.clear(); navigate('/login'); })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="loading-screen">
      <svg className="spinner" viewBox="0 0 24 24" fill="none">
        <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
      </svg>
    </div>
  );

  if (error) return (
    <div className="loading-screen">
      <p style={{ color: 'var(--error)' }}>{error}</p>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-brand">
            <div className="dashboard-brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
            </div>
            <span>Aquarium</span>
          </div>
          <button onClick={handleLogout} className="btn-sign-out">Sign Out</button>
        </div>

        {/* Welcome */}
        <div className="dash-card welcome animate-fade-in">
          <h1>Welcome back, <span>{profile?.username}</span> 👋</h1>
          <p>Here's your flow state overview</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card" style={{ animationDelay: '0.1s' }}>
            <div className="stat-header">
              <div className="stat-icon coins">🪙</div>
              <span className="stat-label">Coins</span>
            </div>
            <p className="stat-value">{profile?.coins ?? 0}</p>
          </div>

          <div className="stat-card" style={{ animationDelay: '0.15s' }}>
            <div className="stat-header">
              <div className="stat-icon streak">🔥</div>
              <span className="stat-label">Streak</span>
            </div>
            <p className="stat-value">
              {profile?.streakCount ?? 0} <span className="unit">days</span>
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="dash-card profile-section" style={{ animationDelay: '0.2s' }}>
          <h2>Profile Details</h2>
          <div>
            <div className="profile-row">
              <span className="label">Email</span>
              <span className="value">{profile?.email}</span>
            </div>
            <div className="profile-row">
              <span className="label">Last Login</span>
              <span className="value">{profile?.lastLoginDate ? formatDate(profile.lastLoginDate) : 'N/A'}</span>
            </div>
            <div className="profile-row">
              <span className="label">Member Since</span>
              <span className="value">{profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
