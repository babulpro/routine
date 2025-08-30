"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function TimeTrackerPage() {
  const router = useRouter();
  const [timeData, setTimeData] = useState({
    mobileUse: { hours: 0, minutes: 0 },
    productivity: { hours: 0, minutes: 0 },
    others: { hours: 0, minutes: 0 }
  });

  const handleTimeChange = (category, field, value) => {
    if (value === "") {
      setTimeData(prev => ({
        ...prev,
        [category]: { ...prev[category], [field]: 0 }
      }));
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    if (field === "hours" && (numValue < 0 || numValue > 12)) return;
    if (field === "minutes" && (numValue < 0 || numValue > 59)) return;

    setTimeData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: numValue }
    }));
  };

  // 🔹 Compute total minutes & hours
  const { totalMinutes, totalHours, remainingHours } = useMemo(() => {
    const toMinutes = (h, m) => (h || 0) * 60 + (m || 0);
    const mobile = toMinutes(timeData.mobileUse.hours, timeData.mobileUse.minutes);
    const productivity = toMinutes(timeData.productivity.hours, timeData.productivity.minutes);
    const others = toMinutes(timeData.others.hours, timeData.others.minutes);

    const total = mobile + productivity + others;
    return {
      totalMinutes: total,
      totalHours: (total / 60).toFixed(2),
      remainingHours: (14 - total / 60).toFixed(2)
    };
  }, [timeData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (totalMinutes > 14 * 60) {
      toast.error("Total time cannot exceed 14 hours per day.");
      return;
    }

    try {
      const res = await fetch("/api/user/timeEntry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timeData)
      });

      const result = await res.json();

      if (result.status === "success") {
        toast.success("Time entry saved successfully!");
        // setTimeData({
        //   mobileUse: { hours: 0, minutes: 0 },
        //   productivity: { hours: 0, minutes: 0 },
        //   others: { hours: 0, minutes: 0 }
        // });
        router.push("/dashboard/pages/time/yourTime")
      } else {
        throw new Error(result.msg || "Failed to save entry");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const categories = [
    { key: "mobileUse", label: "Mobile Use" },
    { key: "productivity", label: "Productivity" },
    { key: "others", label: "Others" }
  ];

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="md:w-4/5 bg-gray-700 shadow-2xl rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Daily Time Tracker</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {categories.map(({ key, label }) => (
            <div key={key} className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">{label}</h3>
              <div className="grid grid-cols-2 gap-4">
                {["hours", "minutes"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={field === "hours" ? 12 : 59}
                      value={timeData[key][field] || ""}
                      onChange={(e) => handleTimeChange(key, field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* 🔹 Show total & remaining */}
          <div className="text-center text-gray-200">
            <p>Total: {totalHours} hrs</p>
            <p>Remaining: {remainingHours >= 0 ? remainingHours : 0} hrs</p>
            {totalMinutes > 14 * 60 && (
              <p className="text-red-500 font-semibold mt-2">
                ⚠️ Total cannot exceed 14 hrs
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={totalMinutes > 14 * 60}
            className={`w-full text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${totalMinutes > 14 * 60 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Save Entry
          </button>
        </form>
      </div>
    </div>
  );
}
