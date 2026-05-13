import { useState, useEffect, useMemo } from "react";
import { taskApi } from "../api/task";
import type { TaskResponse } from "../api/task";

const TAG_ICON_MAP: Record<string, string> = {
  Work: "💼",
  Study: "📚",
  Exercise: "🏋️",
  Rest: "😴",
  Other: "📋",
};

const TAG_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Work: { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" },
  Study: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  Exercise: { bg: "#fef3c7", color: "#b45309", border: "#fde68a" },
  Rest: { bg: "#fce7f3", color: "#be185d", border: "#fbcfe8" },
  Other: { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" },
};

function formatHistoryDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + `, ${time}`;
}

export default function History() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const loadHistory = async () => {
    setLoading(true);
    try {
      const tagParam = activeTag === "All" ? undefined : activeTag;
      const res = await taskApi.getTaskHistory(tagParam);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load task history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [activeTag]);

  // Derive unique tags from tasks for dynamic filter buttons
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((t) => {
      if (t.tag) tagSet.add(t.tag);
    });
    return ["All", ...Array.from(tagSet)];
  }, [tasks]);

  // Use available tags if tasks are loaded, otherwise use defaults
  const filterTags = useMemo(() => {
    if (tasks.length > 0) return availableTags;
    return ["All", "Work", "Study", "Exercise", "Rest", "Other"];
  }, [tasks, availableTags]);

  // Filter by search query (client-side)
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.tag && t.tag.toLowerCase().includes(q))
    );
  }, [tasks, searchQuery]);

  return (
    <div className="history-page">
      <h1 className="history-title">Task History</h1>

      {/* Search & Filter Bar */}
      <div className="history-toolbar">
        <div className="history-search-wrapper">
          <svg
            className="history-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="history-search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="history-filters">
          <span className="history-filter-label">FILTER BY:</span>
          {filterTags.map((tag) => (
            <button
              key={tag}
              className={`history-filter-btn ${activeTag === tag ? "active" : ""}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards */}
      <div className="history-list">
        {loading ? (
          <div className="history-loading">
            <svg className="spinner" viewBox="0 0 24 24" fill="none">
              <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
            <span>Loading history...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="history-empty">
            <span style={{ fontSize: "3rem" }}>📭</span>
            <p>No completed tasks found.</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Complete some focus sessions and they'll appear here!
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const tagStyle = TAG_COLORS[task.tag] || TAG_COLORS.Other;
            const tagIcon = TAG_ICON_MAP[task.tag] || "📋";
            const isCancelled = task.status === "CANCELLED" || (task.status as string) === "CANCELED";
            const duration = task.actualDuration || task.expectedDuration;

            return (
              <div
                key={task.id}
                className={`history-card ${isCancelled ? "cancelled" : ""}`}
              >
                <div className="history-card-accent" />
                <div className="history-card-body">
                  <div className="history-card-icon">
                    <span>{tagIcon}</span>
                  </div>
                  <div className="history-card-info">
                    <div className="history-card-top">
                      <h3 className="history-card-title">{task.title}</h3>
                      <span className="history-card-date">
                        {formatHistoryDate(task.createdAt)}
                      </span>
                    </div>
                    <div className="history-card-meta">
                      <span
                        className="history-tag-badge"
                        style={{
                          backgroundColor: tagStyle.bg,
                          color: tagStyle.color,
                          border: `1px solid ${tagStyle.border}`,
                        }}
                      >
                        {task.tag?.toUpperCase() || "OTHER"}
                      </span>
                      <span className="history-card-duration">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {duration} min
                      </span>
                    </div>
                  </div>
                  <div className="history-card-reward">
                    {isCancelled ? (
                      <span className="history-reward-cancelled">Cancelled</span>
                    ) : (
                      <>
                        <span className="history-reward-amount">
                          +{task.coinsEarned || 0}{" "}
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="history-token-icon"
                          >
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                          </svg>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
