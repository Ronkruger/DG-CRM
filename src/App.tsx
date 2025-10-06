import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ARAPBookingPage from "./pages/ARAPBookingPage";
// import other pages as you build them

const App: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/arap-booking" />} />
          <Route path="/arap-booking" element={<ARAPBookingPage />} />
          {/* Add more routes here */}
        </Routes>
      </div>
    </div>
  );
};

export default App;