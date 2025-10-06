import React from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const STATUS_STEPS = [
  "New",
  "Submitted",
  "Budget Approved",
  "Parameters Approved",
  "Auditing Approved",
  "Releasing Approved",
  "On hold",
  "Paid",
  "Receipt Verified",
  "Refused",
  "Void",
  "Waiting to be charged"
] as const;

type Status = (typeof STATUS_STEPS)[number];

interface Props {
  value: Status;
  onChange: (s: Status) => void;
}

const StatusTabs: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
      {STATUS_STEPS.map((s) => {
        const active = s === value;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={
              "px-3 py-1 rounded text-sm border transition " +
              (active
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300")
            }
          >
            {s}
          </button>
        );
      })}
    </div>
  );
};

export default StatusTabs;
export type { Status };