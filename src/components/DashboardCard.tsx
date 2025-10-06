import React, { type ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className }) => (
  <div className={`bg-white rounded-lg shadow p-4 mb-4 ${className || ""}`}>
    <h2 className="font-semibold text-gray-700 mb-2">{title}</h2>
    {children}
  </div>
);

export default DashboardCard;