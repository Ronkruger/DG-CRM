import React from "react";
import DashboardCard from "./DashboardCard";

const Dashboard: React.FC = () => {
  // Replace these with your actual data fetching logic/components
  return (
    <main className="flex-1 bg-gray-100 p-8 overflow-y-auto min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Tasks */}
        <DashboardCard title="My Open Tasks">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Subject</th>
                  <th className="text-left p-2">Due Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 text-blue-700 underline cursor-pointer">Register for CRM Webinars</td>
                  <td className="p-2">09/11/2025</td>
                  <td className="p-2">Not Started</td>
                  <td className="p-2">Low</td>
                </tr>
                <tr>
                  <td className="p-2 text-blue-700 underline cursor-pointer">Refer CRM Videos</td>
                  <td className="p-2">09/13/2025</td>
                  <td className="p-2">In Progress</td>
                  <td className="p-2">Normal</td>
                </tr>
                {/* ...more rows */}
              </tbody>
            </table>
          </div>
        </DashboardCard>
        {/* Right column: Meetings */}
        <DashboardCard title="My Meetings">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">From</th>
                  <th className="text-left p-2">To</th>
                  <th className="text-left p-2">Related To</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 text-blue-700 underline cursor-pointer">Demo</td>
                  <td className="p-2">09/11/2025 10:31PM</td>
                  <td className="p-2">09/11/2025 11:31PM</td>
                  <td className="p-2">Printing Dimensions</td>
                </tr>
                <tr>
                  <td className="p-2 text-blue-700 underline cursor-pointer">Webinar</td>
                  <td className="p-2">09/12/2025 01:31AM</td>
                  <td className="p-2">09/12/2025 01:31AM</td>
                  <td className="p-2">Commercial Press</td>
                </tr>
                {/* ...more rows */}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DashboardCard title="Today's Leads">
          <div className="text-gray-400">No leads for today.</div>
        </DashboardCard>
        <DashboardCard title="My Deals Closing This Month">
          <div className="text-gray-400">No deals closing this month.</div>
        </DashboardCard>
      </div>
    </main>
  );
};

export default Dashboard;