import React, { useState } from "react";

type Tab = "send" | "log" | "activities";

const ActivityPanel: React.FC = () => {
  const [tab, setTab] = useState<Tab>("send");

  return (
    <aside className="w-full lg:w-80 xl:w-96 border-l border-gray-200 bg-white flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-2 p-2 border-b">
        <button
          className={`px-3 py-1 rounded text-sm ${
            tab === "send" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setTab("send")}
        >
          Send message
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${
            tab === "log" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setTab("log")}
        >
          Log note
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${
            tab === "activities" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setTab("activities")}
        >
          Activities
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {tab === "send" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // submit message here
            }}
            className="space-y-2"
          >
            <textarea className="w-full border rounded p-2" rows={4} placeholder="Type a message..." />
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded cursor-pointer">
                <span>Attach</span>
                <input type="file" className="hidden" />
              </label>
              <button className="ml-auto bg-indigo-600 text-white px-3 py-1 rounded">Send</button>
            </div>
          </form>
        )}

        {tab === "log" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // submit log note here
            }}
            className="space-y-2"
          >
            <textarea className="w-full border rounded p-2" rows={4} placeholder="Write a log note..." />
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded cursor-pointer">
                <span>Attach</span>
                <input type="file" className="hidden" />
              </label>
              <button className="ml-auto bg-indigo-600 text-white px-3 py-1 rounded">Add note</button>
            </div>
          </form>
        )}

        {tab === "activities" && (
          <ul className="space-y-3 text-sm">
            <li className="border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold">
                  R
                </span>
                <div>
                  <div className="font-medium">Romano Lantano</div>
                  <div className="text-gray-500">Today at 2:31 PM</div>
                </div>
              </div>
              <div className="mt-1">Creating a new record…</div>
            </li>
            <li className="text-gray-400">No more activities.</li>
          </ul>
        )}
      </div>
    </aside>
  );
};

export default ActivityPanel;