import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function Profile() {
  const navigate = useNavigate();
  const { profile, loading, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile().then((authenticated) => {
      if (!authenticated) navigate("/login");
    });
  }, [navigate]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="loading-screen">
        <svg className="spinner" viewBox="0 0 24 24" fill="none">
          <circle
            opacity="0.25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            opacity="0.75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
          />
        </svg>
      </div>
    );

  return (
    <div className="dashboard-page" style={{ padding: 0 }}>
      <div className="dashboard-container" style={{ paddingTop: "2rem" }}>
        {/* Profile Header */}
        <div className="dash-card welcome animate-fade-in">
          <h1>
            Profile <span>Settings</span>
          </h1>
          <p>Manage your identity and ecosystem metrics</p>
        </div>

        {/* Profile Avatar & Identity */}
        <div
          className="dash-card animate-fade-in"
          style={{ animationDelay: "0.1s", textAlign: "center" }}
        >
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-circle">
              <span style={{ fontSize: "2.5rem" }}>
                {profile?.username?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
          </div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}
          >
            {profile?.username}
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            @{profile?.username}
          </p>
        </div>

        {/* Account Information */}
        <div
          className="dash-card profile-section animate-fade-in"
          style={{ animationDelay: "0.15s" }}
        >
          <h2>Account Information</h2>
          <div>
            <div className="profile-row">
              <span className="label">Username</span>
              <span className="value">{profile?.username}</span>
            </div>
            <div className="profile-row">
              <span className="label">Email Address</span>
              <span className="value">{profile?.email}</span>
            </div>
            <div className="profile-row">
              <span className="label">Member Since</span>
              <span className="value">
                {profile?.createdAt ? formatDate(profile.createdAt) : "N/A"}
              </span>
            </div>
            <div className="profile-row">
              <span className="label">Last Login</span>
              <span className="value">
                {profile?.lastLoginDate
                  ? formatDate(profile.lastLoginDate)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid" style={{ animationDelay: "0.2s" }}>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon coins">🪙</div>
              <span className="stat-label">Coins Balance</span>
            </div>
            <p className="stat-value">{profile?.coins ?? 0}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon streak">🔥</div>
              <span className="stat-label">Current Streak</span>
            </div>
            <p className="stat-value">
              {profile?.streakCount ?? 0} <span className="unit">days</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
