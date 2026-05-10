import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TaskPanel from "./TaskPanel";
import { TimerBanner } from "./TimerBanner";
import CompleteTaskModal from "./CompleteTaskModal";

export default function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="center-content">
        <Outlet />
        <TimerBanner />
      </main>
      <TaskPanel />
      <CompleteTaskModal />
    </div>
  );
}
