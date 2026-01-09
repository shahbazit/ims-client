import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="wrapper">
        <Sidebar isOpen={sidebarOpen} />

        <div id="content">
          <TopNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="container-fluid">{children}</div>
        </div>
      </div>
    </>
  );
}
