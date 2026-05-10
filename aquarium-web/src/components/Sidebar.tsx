import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useFishStore } from "../stores/useFishStore";
import { useInventoryStore } from "../stores/useInventoryStore";
import { useTaskStore } from "../stores/useTaskStore";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auth store
  const { profile, logout } = useAuthStore();

  // Fish store
  const { fishes, loadingFishes, isModalOpen, fetchFishes, closeShop } =
    useFishStore();

  // Inventory store
  const {
    inventory,
    loadingInventory,
    isInventoryOpen,
    fetchInventory,
    closeInventory,
    ensureLoaded,
  } = useInventoryStore();

  // Task store
  const {
    isTaskModalOpen,
    taskTitle,
    taskTag,
    taskDuration,
    selectedFishId,
    createTask,
    openTaskModal,
    closeTaskModal,
    setTaskTitle,
    setTaskTag,
    setTaskDuration,
    setSelectedFishId,
  } = useTaskStore();

  // Logout modal — local UI state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask();
  };

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

  const initial = profile?.username?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      <aside className="sidebar">
        {/* Profile Section */}
        <div className="sidebar-profile">
          <div className="sidebar-avatar">{initial}</div>
          <h3 className="sidebar-username">{profile?.username || "User"}</h3>
          <span className="sidebar-role">Aquarium</span>
          <div className="sidebar-stats">
            <div className="sidebar-stat">
              <span className="sidebar-stat-icon">🪙</span>
              <span className="sidebar-stat-value">{profile?.coins ?? 0}</span>
            </div>
            <div className="sidebar-stat">
              <span className="sidebar-stat-icon">🔥</span>
              <span className="sidebar-stat-value">
                {profile?.streakCount ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <button
            onClick={() => navigate("/dashboard")}
            className={`sidebar-nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Home</span>
          </button>

          <button
            onClick={fetchFishes}
            className={`sidebar-nav-item ${isModalOpen ? "active" : ""}`}
            disabled={loadingFishes}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            <span>{loadingFishes ? "..." : "Shop"}</span>
          </button>

          <button
            onClick={() => {
              ensureLoaded();
              openTaskModal();
            }}
            className="sidebar-nav-item"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span>Add Task</span>
          </button>

          <button
            onClick={fetchInventory}
            className={`sidebar-nav-item ${isInventoryOpen ? "active" : ""}`}
            disabled={loadingInventory}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>{loadingInventory ? "..." : "Inventory"}</span>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className={`sidebar-nav-item ${location.pathname === "/profile" ? "active" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="sidebar-nav-item sidebar-logout"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ============ Modals ============ */}

      {/* Shop Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeShop}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🛒 Shop</h2>
              <button className="btn-close" onClick={closeShop}>
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
            <div className="modal-body">
              <div className="fish-grid">
                {fishes.map((fish) => (
                  <div key={fish.id} className="fish-item">
                    <div className="fish-img-container">
                      {fish.imageUrlAdult ? (
                        <img src={fish.imageUrlAdult} alt={fish.speciesName} />
                      ) : (
                        <span>🐟</span>
                      )}
                    </div>
                    <div className="fish-info">
                      <h3>
                        {fish.speciesName}
                        <span
                          className={`fish-rarity rarity-${fish.rarity.toLowerCase()}`}
                        >
                          {fish.rarity}
                        </span>
                      </h3>
                      <p className="fish-desc">{fish.description}</p>
                      <div className="fish-price">
                        <span>🪙 {fish.basePrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {isInventoryOpen && (
        <div className="modal-overlay" onClick={closeInventory}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>My Inventory</h2>
              <button className="btn-close" onClick={closeInventory}>
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
            <div className="modal-body">
              {inventory.length === 0 ? (
                <div
                  className="empty-state"
                  style={{ textAlign: "center", padding: "40px 0" }}
                >
                  <p style={{ opacity: 0.6 }}>
                    Your inventory is empty. Time to go fishing! 🎣
                  </p>
                </div>
              ) : (
                <div className="inventory-list">
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      className="inventory-item"
                      style={{
                        display: "flex",
                        gap: "16px",
                        padding: "16px",
                        marginBottom: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "20px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          right: "-20px",
                          bottom: "-20px",
                          fontSize: "5rem",
                          opacity: 0.03,
                          transform: "rotate(-15deg)",
                          pointerEvents: "none",
                        }}
                      >
                        {item.itemType === "FISH" ? "🐟" : "🎁"}
                      </div>

                      <div
                        className="item-image-container"
                        style={{
                          width: "80px",
                          height: "80px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "2rem",
                          flexShrink: 0,
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          overflow: "hidden",
                        }}
                      >
                        {item.itemType === "FISH" &&
                        item.fishDetails?.imageUrlAdult ? (
                          <img
                            src={item.fishDetails.imageUrlAdult}
                            alt={item.fishDetails.speciesName}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              padding: "8px",
                            }}
                          />
                        ) : (
                          <span>{item.itemType === "FISH" ? "🐟" : "🎁"}</span>
                        )}
                      </div>

                      <div
                        className="item-info"
                        style={{ flex: 1, minWidth: 0 }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "1.1rem",
                              fontWeight: "700",
                              color: "#fff",
                            }}
                          >
                            {item.itemType === "FISH"
                              ? item.fishDetails?.speciesName || "Unknown Fish"
                              : `Item #${item.itemId}`}
                          </h3>
                          {item.itemType === "FISH" && item.fishDetails && (
                            <span
                              className={`fish-rarity rarity-${item.fishDetails.rarity.toLowerCase()}`}
                              style={{
                                fontSize: "0.65rem",
                                padding: "2px 8px",
                                borderRadius: "6px",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                              }}
                            >
                              {item.fishDetails.rarity}
                            </span>
                          )}
                        </div>

                        {item.itemType === "FISH" &&
                          item.fishDetails?.description && (
                            <p
                              style={{
                                margin: "0 0 8px 0",
                                fontSize: "0.85rem",
                                opacity: 0.6,
                                lineHeight: "1.4",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {item.fishDetails.description}
                            </p>
                          )}

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.75rem",
                              opacity: 0.4,
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              style={{ width: "12px" }}
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            {formatDate(item.acquiredAt)}
                          </div>

                          <div
                            style={{
                              padding: "2px 8px",
                              borderRadius: "5px",
                              fontSize: "0.6rem",
                              fontWeight: "700",
                              backgroundColor:
                                item.itemType === "FISH"
                                  ? "rgba(59, 130, 246, 0.1)"
                                  : "rgba(16, 185, 129, 0.1)",
                              color:
                                item.itemType === "FISH"
                                  ? "#60a5fa"
                                  : "#34d399",
                              border: `1px solid ${item.itemType === "FISH" ? "rgba(59, 130, 246, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
                            }}
                          >
                            {item.itemType}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsLogoutModalOpen(false)}
        >
          <div
            className="modal-content mini"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-body">
              <div className="confirm-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ width: "32px" }}
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
              </div>
              <h3>Sign Out</h3>
              <p>
                Are you sure you want to log out of your aquarium? Your progress
                is safely saved.
              </p>
              <div className="confirm-actions">
                <button
                  className="btn-confirm-cancel"
                  onClick={() => setIsLogoutModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn-confirm-danger" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="modal-overlay" onClick={closeTaskModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "480px" }}
          >
            <div className="modal-header">
              <h2>➕ Add New Task</h2>
              <button className="btn-close" onClick={closeTaskModal}>
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
            <form onSubmit={handleCreateTask} className="task-form">
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="What are you focusing on?"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label>Tag</label>
                  <select
                    className="form-select"
                    value={taskTag}
                    onChange={(e) => setTaskTag(e.target.value)}
                  >
                    <option value="Work">Work</option>
                    <option value="Study">Study</option>
                    <option value="Exercise">Exercise</option>
                    <option value="Rest">Rest</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (mins)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(parseInt(e.target.value))}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Assign to Fish (Optional)</label>
                <select
                  className="form-select"
                  value={selectedFishId || ""}
                  onChange={(e) =>
                    setSelectedFishId(
                      e.target.value ? parseInt(e.target.value) : null,
                    )
                  }
                >
                  <option value="">No Fish (Coins only)</option>
                  {inventory
                    .filter((i) => i.itemType === "FISH")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.fishDetails?.speciesName ||
                          `Fish #${item.itemId}`}
                      </option>
                    ))}
                </select>
              </div>
              <button
                type="submit"
                className="btn-primary-solid"
                style={{ marginTop: "1rem", padding: "14px" }}
              >
                Create Focus Session
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
