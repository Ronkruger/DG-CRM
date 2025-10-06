import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { sidebarMenu } from "../sidebarMenu";

const routeMap: Record<string, string> = {
  arap_booking: "/arap-booking",
    dashboard: "/dashboard",
    arap: "/arap",
};

const Sidebar: React.FC = () => {
  const [search, setSearch] = useState("");
  const filteredMenu = sidebarMenu.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="bg-blue-900 text-white w-64 min-h-screen flex flex-col">
      <div className="text-2xl font-bold py-4 px-6 border-b border-blue-800">Modules</div>
      <div className="px-4 py-3">
        <input
          type="text"
          placeholder="Search modules..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded bg-blue-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {filteredMenu.map(item => (
            <li key={item.key}>
              {routeMap[item.key] ? (
                <NavLink
                  to={routeMap[item.key]}
                  className={({ isActive }: { isActive: boolean }) =>
                    `block px-6 py-2 hover:bg-blue-800 cursor-pointer flex items-center transition ${
                      item.comingSoon ? "font-bold text-yellow-300" : ""
                    } ${isActive ? "bg-blue-700" : ""}`
                  }
                  end
                >
                  <span>{item.label}</span>
                  {item.comingSoon && (
                    <span className="ml-2 bg-yellow-300 text-blue-900 text-xs px-2 rounded">COMMING SOON</span>
                  )}
                </NavLink>
              ) : (
                <div
                  className={`px-6 py-2 flex items-center opacity-60 cursor-not-allowed ${
                    item.comingSoon ? "font-bold text-yellow-300" : ""
                  }`}
                >
                  <span>{item.label}</span>
                  {item.comingSoon && (
                    <span className="ml-2 bg-yellow-300 text-blue-900 text-xs px-2 rounded">COMMING SOON</span>
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
};

export default Sidebar;