"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function HabitTracker() {
  const router = useRouter();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: '',
    frequency: '',
  });

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch("/api/user/habit", { cache: "no-cache" });
        if (!response.ok) throw new Error("Failed to fetch habits");
        const { data } = await response.json();
        setHabits(data || []);
      } catch (err) {
        setError(err.message || "Failed to load habits");
        setHabits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.frequency.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/user/habit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add habit");

      const { data, status } = await response.json();
      
      if (status === "success") {
        setHabits(prev => [data, ...prev]);
        setFormData({ title: "", frequency: "" });
      }
    } catch (error) {
      alert(error.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    try {
      const res = await fetch(`/api/user/habit/ById?id=${id}`, {
        method: 'DELETE',
      });
      const { status } = await res.json();
      
      if (status === 'success') {
        setHabits(prev => prev.filter(habit => habit._id !== id));
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      alert(error.message || "Error deleting habit");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Add Habit Form */}
      <section className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
            Add New Habit
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block mb-2 font-medium">
                  Your Place
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-gray-700"
                  placeholder="Home"
                  required
                />
              </div>

              <div>
                <label htmlFor="frequency" className="block mb-2 font-medium">
                  Your Habit
                </label>
                <input
                  type="text"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-gray-700"
                  placeholder="Keep Your Mobile Away"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Add Habit
            </button>
          </form>
        </div>
      </section>

      {/* Habits List */}
      <section className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">
          Your Habits
        </h1>

        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {habits.length === 0 ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No habits found. Add your first habit!</span>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-1">
            {habits.map((habit) => (
              <div key={habit._id} className="card bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body p-4">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-lg font-semibold break-words flex-1">
                      {habit.title}
                    </h2>
                    <div className="flex gap-2">
                      <Link 
                        href={`/dashboard/pages/habit/${habit._id}`}
                        className="btn btn-xs btn-outline btn-secondary"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>

                  <p className="text-gray-300 mt-2 break-words">
                    {habit.frequency}
                  </p>

                  <div className="card-actions justify-between items-center mt-4">
                    <span className="text-xs text-gray-400">
                      {new Date(habit.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleDelete(habit._id)}
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}