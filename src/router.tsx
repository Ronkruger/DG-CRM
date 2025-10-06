import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ARAPBookingPage from "./pages/ARAPBookingPage";

// eslint-disable-next-line react-refresh/only-export-components
const ErrorFallback: React.FC = () => (
  <div style={{ padding: 24 }}>
    <h2>Page not found</h2>
    <p>The page you requested does not exist.</p>
    <p>
      <a href="/">Go to Dashboard</a>
    </p>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorFallback />,
    children: [
      // Index route at "/"
      { index: true, element: <DashboardPage /> },

      // Other routes
      { path: "arap-booking", element: <ARAPBookingPage /> },
    ],
  },
]);

export default router;