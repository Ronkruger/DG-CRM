import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { sidebarMenu } from "../sidebarMenu";

const routeMap: Record<string, string> = {
  dashboard: "/",
  arap_booking: "/arap-booking",
};

type SidebarProps = {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, isOpen = false, onClose }) => {
  const [search, setSearch] = useState("");
  const filteredMenu = sidebarMenu.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  // Desktop static sidebar
  if (!isMobile) {
    return (
      <aside className="bg-blue-900 text-white w-64 min-h-screen flex flex-col">
        <div className="text-2xl font-bold py-4 px-6 border-b border-blue-800">Modules</div>
        <div className="px-4 py-3">
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded bg-blue-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {filteredMenu.map((item) => (
              <li key={item.key}>
                {routeMap[item.key] ? (
                  <NavLink
                    to={routeMap[item.key]}
                    className={({ isActive }) =>
                      `block px-6 py-2 hover:bg-blue-800 flex items-center transition ${
                        item.priority ? "font-bold text-yellow-300" : ""
                      } ${isActive ? "bg-blue-700" : ""}`
                    }
                    end
                  >
                    <span>{item.label}</span>
                    {item.priority && (
                      <span className="ml-2 bg-yellow-300 text-blue-900 text-xs px-2 rounded">PRIORITY</span>
                    )}
                  </NavLink>
                ) : (
                  <div
                    className={`px-6 py-2 flex items-center opacity-60 cursor-not-allowed ${
                      item.priority ? "font-bold text-yellow-300" : ""
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.priority && (
                      <span className="ml-2 bg-yellow-300 text-blue-900 text-xs px-2 rounded">PRIORITY</span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-800 flex items-center justify-between">
          <div className="rounded-full bg-orange-400 w-8 h-8 flex items-center justify-center text-white font-bold">R</div>
          <button className="ml-2 text-blue-300 hover:text-white">⚙️</button>
        </div>
      </aside>
    );
  }

  // Mobile off-canvas sidebar (ensure hidden on md+)
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white transform transition-transform md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between py-4 px-6 border-b border-blue-800">
          <div className="text-2xl font-bold">Modules</div>
          <button aria-label="Close menu" className="p-2 rounded hover:bg-blue-800" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="px-4 py-3">
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded bg-blue-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {filteredMenu.map((item) => (
              <li key={item.key}>
                {routeMap[item.key] ? (
                  <NavLink
                    to={routeMap[item.key]}
                    className={({ isActive }) =>
                      `block px-6 py-2 hover:bg-blue-800 flex items-center transition ${
                        item.priority ? "font-bold text-yellow-300" : ""
                      } ${isActive ? "bg-blue-700" : ""}`
                    }
                    end
                    onClick={onClose}
                  >
                    <span>{item.label}</span>
                    {item.priority && (
                      <span className="ml-2 bg-yellow-300 text-blue-900 text-xs px-2 rounded">PRIORITY</span>
                    )}
                  </NavLink>
                ) : (
                  <div
                    className={`px-6 py-2 flex items-center opacity-60 cursor-not-allowed ${
                      item.priority ? "font-bold text-yellow-300" : ""
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.priority && (
                      <span className="ml-2 bg-yellow-300 text-blue-900 text-xs px-2 rounded">PRIORITY</span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-800 flex items-center justify-between">
          <div className="rounded-full bg-orange-400 w-8 h-8 flex items-center justify-center text-white font-bold">R</div>
          <button className="ml-2 text-blue-300 hover:text-white">⚙️</button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;