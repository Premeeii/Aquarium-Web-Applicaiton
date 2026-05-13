import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useTaskStore } from "../stores/useTaskStore";
import { useTimerStore } from "../stores/useTimerStore";

export default function TaskPanel() {
  const navigate = useNavigate();

  // Auth store
  const { fetchProfile } = useAuthStore();

  // Task store
  const { tasks, loadingTasks, fetchTasks, cancelTask } = useTaskStore();

  const { startTimer, activeTask } = useTimerStore();

  useEffect(() => {
    fetchProfile().then((authenticated) => {
      if (!authenticated) navigate("/login");
    });
    fetchTasks();
  }, [navigate]);

  const pendingTasks = tasks.filter((t) => t.status === "PENDING");

  return (
    <aside className="task-panel">
      <div className="task-panel-header">
        <h2>Tasks</h2>
        {pendingTasks.length > 0 && (
          <span className="task-count-badge">{pendingTasks.length} Left</span>
        )}
      </div>

      <div className="task-panel-list">
        {loadingTasks ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <svg className="spinner" viewBox="0 0 24 24" fill="none" style={{ width: "24px" }}>
              <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
          </div>
        ) : pendingTasks.length === 0 ? (
          <div className="task-panel-empty">
            <p>No active tasks 🌱</p>
            <span>Add one to start growing!</span>
          </div>
        ) : (
          pendingTasks.map((task) => {
            const isTimerRunning = activeTask?.id === task.id;
            return (
              <div key={task.id} className="task-panel-item">
                <div className="task-panel-item-header">
                  <h4 className="task-panel-item-title">{task.title}</h4>
                  {isTimerRunning && (
                    <div className="task-running-indicator">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "14px" }}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="task-panel-item-meta">
                  <span className={`task-panel-tag tag-${task.tag.toLowerCase()}`}>
                    {task.tag}
                  </span>
                  <span className="task-panel-duration">
                    {task.expectedDuration} min{task.expectedDuration !== 1 ? "s" : ""}
                  </span>
                </div>
                {!isTimerRunning && (
                  <div className="task-panel-actions">
                    <button
                      onClick={() => startTimer(task)}
                      className="task-panel-btn task-panel-btn-start"
                      disabled={!!activeTask}
                    >
                      ▶ Start
                    </button>
                    <button
                      onClick={async () => {
                        await cancelTask(task.id);
                        fetchProfile();
                      }}
                      className="task-panel-btn task-panel-btn-cancel"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                )}
                {isTimerRunning && (
                  <div className="task-panel-running-badge">
                    ⏱️ Running...
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
