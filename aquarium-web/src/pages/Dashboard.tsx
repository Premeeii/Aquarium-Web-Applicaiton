import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useTaskStore } from "../stores/useTaskStore";
import { useTimerStore } from "../stores/useTimerStore";

export default function Dashboard() {
  const navigate = useNavigate();

  // Auth store
  const { profile, loading, fetchProfile } =
    useAuthStore();

  // Task store
  const {
    tasks,
    loadingTasks,
    fetchTasks,
    openCompleteModal,
  } = useTaskStore();

  const { startTimer, activeTask } = useTimerStore();

  useEffect(() => {
    fetchProfile().then((authenticated) => {
      if (!authenticated) navigate("/login");
    });
    fetchTasks();
  }, [navigate]);

  if (loading || loadingTasks) {
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
  }

  return (
    <div className="dashboard-page" style={{ padding: 0 }}>
      {/* Navbar has been extracted to MainLayout */}

      <div className="dashboard-container" style={{ paddingTop: "2rem" }}>
        {/* Welcome */}
        <div className="dash-card welcome animate-fade-in">
          <h1>
            Welcome back, <span>{profile?.username}</span> 👋
          </h1>
          <p>Here's your flow state overview</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card" style={{ animationDelay: "0.1s" }}>
            <div className="stat-header">
              <div className="stat-icon coins">🪙</div>
              <span className="stat-label">Coins Balance</span>
            </div>
            <p className="stat-value">{profile?.coins ?? 0}</p>
          </div>

          <div className="stat-card" style={{ animationDelay: "0.15s" }}>
            <div className="stat-header">
              <div className="stat-icon streak">🔥</div>
              <span className="stat-label">Current Streak</span>
            </div>
            <p className="stat-value">
              {profile?.streakCount ?? 0} <span className="unit">days</span>
            </p>
          </div>
        </div>

        {/* Active Tasks Section */}
        <div
          className="dash-card tasks-section animate-fade-in"
          style={{ animationDelay: "0.18s" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-secondary)",
              }}
            >
              Active Tasks
            </h2>
            {loadingTasks && (
              <svg
                className="spinner"
                viewBox="0 0 24 24"
                fill="none"
                style={{ width: "16px" }}
              >
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
            )}
          </div>

          <div className="task-list">
            {tasks.filter((t) => t.status === "PENDING").length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  background: "#f8fafc",
                  borderRadius: "16px",
                  border: "1px dashed var(--card-border)",
                }}
              >
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                    margin: 0,
                  }}
                >
                  No active tasks. Add one to start growing! 🌱
                </p>
              </div>
            ) : (
              tasks
                .filter((t) => t.status === "PENDING")
                .map((task) => {
                  const isTimerRunning = activeTask?.id === task.id;
                  return (
                    <div key={task.id} className="task-item">
                      <div className="task-info-main">
                        <span className="task-tag">{task.tag}</span>
                        <h4>{task.title}</h4>
                        <div className="task-meta">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ width: "14px" }}
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          {task.expectedDuration} mins
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {isTimerRunning ? (
                          <span
                            style={{
                              padding: "8px 16px",
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                              color: "#10b981",
                              background: "#ecfdf5",
                              borderRadius: "10px",
                              border: "1px solid #a7f3d0",
                            }}
                          >
                            ⏱️ Running...
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => startTimer(task)}
                              className="btn-primary-solid"
                              disabled={!!activeTask}
                              style={{
                                width: "auto",
                                padding: "8px 20px",
                                marginTop: 0,
                                fontSize: "0.8125rem",
                                opacity: activeTask ? 0.5 : 1,
                              }}
                            >
                              Start
                            </button>
                            <button
                              onClick={() => openCompleteModal(task)}
                              className="btn-primary-outline"
                              style={{
                                width: "auto",
                                padding: "8px 16px",
                                marginTop: 0,
                                fontSize: "0.8125rem",
                              }}
                            >
                              Complete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
