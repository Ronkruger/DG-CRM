
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ARAPBookingPage from "./pages/ARAPBookingPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      {/* Index (/) now loads the Dashboard */}
      <Route path="dashboard" index element={<DashboardPage />} />
      {/* Keep AR/AP Booking on its own path */}
      <Route path="arap-booking" element={<ARAPBookingPage />} />
    </Route>
  )
);

export default router;