'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast"; 
import Image from 'next/image'

const MainNavbar = () => { 
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/currentUser", { 
        cache: 'no-cache' 
      });
      
      if (!response.ok) throw new Error("Failed to fetch user data");
      
      const { data } = await response.json();
      setUserData(data || {});
    } catch (error) {
      console.error("Fetch error:", error);
      setUserData({});
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async () => {
    try {
      const response = await fetch("/api/user/createUser", { 
        method: "GET",
        cache: 'no-cache'
      });
      
      const json = await response.json();

      if (json.status === "ok") {
        toast.success("Log Out Success");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  // Navigation items configuration
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard/pages', label: 'News' },
    { href: '/dashboard/pages/routine/myRoutine', label: 'Routine' },
    { href: '/dashboard/pages/habit/myHabit', label: 'Habit' },
    { href: '/dashboard/pages/time/yourTime', label: 'Tracker' },
    { href: '/dashboard/pages/time', label: 'Apex' },
  ];

  // Admin-only items
  const adminItems = [
    { href: '/dashboard/pages/admin', label: 'Admin Panel' },
    { href: '/dashboard/pages/statistics', label: 'Statistics' },
  ];

  const renderNavItem = (item) => (
    <li key={item.href}>
      <Link href={item.href} className="w-full">
        {item.label}
      </Link>
    </li>
  );

   
  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 z-50">
      {/* Mobile Menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 6h16M4 12h8m-8 6h16" 
              />
            </svg>
          </div>
          
          <ul
            tabIndex={0}
            className="menu menu-md dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow"
          >
            {/* Regular navigation items */}
            {navItems.map(renderNavItem)}
            
            {/* Admin items (if user is admin) */}
            {userData.role === 'admin' && adminItems.map(renderNavItem)}
          </ul>
        </div>

        {/* Logo */}
        <div className="w-12 h-12 hidden md:block">
          <Link href="/">
            <Image
              src="/routine.png"
              width={48}
              height={48}
              alt="App Logo"
              className="object-contain"
            />
          </Link>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems.map(renderNavItem)}
          
          {/* Admin items with visual distinction */}
          {userData.role === 'admin' && 
            adminItems.map(item => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="w-full text-purple-600 font-semibold hover:text-purple-700"
                >
                  👑 {item.label}
                </Link>
              </li>
            ))
          }
        </ul>
      </div>

      {/* Logout Button */}
      <div className="navbar-end">
        {!isLoading && (
          <button
            onClick={logOut}
            className="btn btn-ghost hover:btn-error transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Logout'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MainNavbar;