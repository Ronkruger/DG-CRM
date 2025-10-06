import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

type SidebarProps = {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
};

const SidebarTyped = Sidebar as React.ComponentType<SidebarProps>;

const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar (visible on md and up) */}
      <div className="hidden md:block">
        <SidebarTyped />
      </div>

      {/* Mobile sidebar (off-canvas) - fully hidden on md+ */}
      <div className="md:hidden">
        <SidebarTyped
          isMobile
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-2 px-3 py-2 bg-white border-b">
          <button
            aria-label="Open menu"
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-100"
          >
            ☰
          </button>
          <div className="font-semibold">Dashboard</div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;