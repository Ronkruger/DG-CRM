import React from "react";
import DashboardCard from "../components/DashboardCard";

const DashboardPage: React.FC = () => {
  return (
    <div className="p-8 space-y-6">
      {/* Welcome + search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Welcome romano lantano</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="search"
            placeholder="Search..."
            className="border rounded px-3 py-2 w-full md:w-80"
          />
          <button className="bg-blue-700 text-white rounded px-4 py-2 hover:bg-blue-800">
            Search
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Open Tasks</div>
          <div className="text-2xl font-semibold">12</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Meetings Today</div>
          <div className="text-2xl font-semibold">3</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Deals Closing (30d)</div>
          <div className="text-2xl font-semibold">$42,300</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">New Leads</div>
          <div className="text-2xl font-semibold">7</div>
        </div>
      </div>

      {/* Main widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="My Open Tasks">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Subject</th>
                  <th className="p-2">Due Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2 text-blue-700 underline cursor-pointer">Register for CRM Webinars</td>
                  <td className="p-2">09/11/2025</td>
                  <td className="p-2">Not Started</td>
                  <td className="p-2">Low</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2 text-blue-700 underline cursor-pointer">Refer CRM Videos</td>
                  <td className="p-2">09/13/2025</td>
                  <td className="p-2">In Progress</td>
                  <td className="p-2">Normal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard title="My Meetings">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Title</th>
                  <th className="p-2">From</th>
                  <th className="p-2">To</th>
                  <th className="p-2">Related To</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2 text-blue-700 underline cursor-pointer">Demo</td>
                  <td className="p-2">09/11/2025 10:31 PM</td>
                  <td className="p-2">09/11/2025 11:31 PM</td>
                  <td className="p-2">Printing Dimensions</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2 text-blue-700 underline cursor-pointer">Webinar</td>
                  <td className="p-2">09/12/2025 01:31 AM</td>
                  <td className="p-2">09/12/2025 01:31 AM</td>
                  <td className="p-2">Commercial Press</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>

      {/* Secondary widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Today's Leads">
          <div className="text-gray-400">No leads for today.</div>
        </DashboardCard>
        <DashboardCard title="My Deals Closing This Month">
          <div className="text-gray-400">No deals closing this month.</div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default DashboardPage;