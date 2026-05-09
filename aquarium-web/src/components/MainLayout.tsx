import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { TimerBanner } from "./TimerBanner";
import CompleteTaskModal from "./CompleteTaskModal";

export default function MainLayout() {
  return (
    <div className="main-layout" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div className="layout-content" style={{ flex: 1, position: "relative" }}>
        <Outlet />
      </div>
      <TimerBanner />
      <CompleteTaskModal />
    </div>
  );
}
