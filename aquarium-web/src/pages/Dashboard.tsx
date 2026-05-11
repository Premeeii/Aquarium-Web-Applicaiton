import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useTaskStore } from "../stores/useTaskStore";
import { AquariumCanvas } from "../components/AquariumCanvas";

export default function Dashboard() {
  const navigate = useNavigate();

  // Auth store
  const { loading, fetchProfile } = useAuthStore();

  // Task store
  const { loadingTasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchProfile().then((authenticated) => {
      if (!authenticated) navigate("/login");
    });
    fetchTasks();
  }, [navigate]);

  if (loading || loadingTasks) {
    return (
      <div className="loading-screen" style={{ minHeight: "100%", background: "transparent" }}>
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

  return <AquariumCanvas />;
}
