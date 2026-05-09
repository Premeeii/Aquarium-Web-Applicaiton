import { useTaskStore } from "../stores/useTaskStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useTimerStore } from "../stores/useTimerStore";

export default function CompleteTaskModal() {
  const {
    isCompleteModalOpen,
    selectedTask,
    actualDuration,
    completedEarly,
    completeTask,
    closeCompleteModal,
    setActualDuration,
    setCompletedEarly,
  } = useTaskStore();

  const { refreshProfile } = useAuthStore();
  const { status, resumeTimer, stopTimer } = useTimerStore();

  if (!isCompleteModalOpen || !selectedTask) return null;

  const handleCompleteTask = async (e: React.FormEvent) => {
    e.preventDefault();
    // Fully stop the timer before completing
    if (status !== 'IDLE') {
      stopTimer();
    }
    const success = await completeTask();
    if (success) {
      await refreshProfile(); // Update coins
    }
  };

  const handleClose = () => {
    closeCompleteModal();
    // If timer was paused (from Finish Early), resume it
    if (status === 'PAUSED') {
      resumeTimer();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content mini"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>🎉 Finish Task</h2>
          <button className="btn-close" onClick={handleClose}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ width: "18px" }}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleCompleteTask} className="task-form">
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ margin: "0 0 8px 0" }}>{selectedTask.title}</h3>
            <p
              style={{
                margin: 0,
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
              }}
            >
              Excellent work! How long did you actually focus?
            </p>
          </div>
          <div className="form-group">
            <label>Actual Duration (mins)</label>
            <input
              type="number"
              className="form-input"
              value={actualDuration}
              onChange={(e) => setActualDuration(parseInt(e.target.value))}
              min="1"
              required
            />
          </div>
          <label className="form-checkbox-group">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={completedEarly}
              onChange={(e) => setCompletedEarly(e.target.checked)}
            />
            Finished earlier than expected
          </label>
          <button
            type="submit"
            className="btn-primary-solid"
            style={{ marginTop: "1.5rem", padding: "14px" }}
          >
            Confirm & Collect Rewards
          </button>
        </form>
      </div>
    </div>
  );
}
