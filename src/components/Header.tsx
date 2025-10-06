import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
      <div className="flex items-center">
        <div className="bg-blue-200 rounded-md p-3 mr-4">
          {/* Example building icon */}
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 2a2 2 0 00-2 2v14h16V4a2 2 0 00-2-2H4zm0 2h12v12H4V4zm2 2v8h2V6H6zm4 0v2h2V6h-2zm2 4v4h2v-4h-2z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-700">Welcome romano lantano</span>
      </div>
      <div className="flex items-center space-x-3">
        <select className="border rounded px-2 py-1">
          <option>romano lantano's Home</option>
        </select>
        <button className="p-2 rounded-full hover:bg-gray-200">⋯</button>
      </div>
    </header>
  );
};

export default Header;