 'use client'
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast"; 
import Image from 'next/image'
 
 

const Navbar = () => {
  

    return (
        <div className="">
            <div className="navbar bg-base-100 shadow-sm fixed top-0 z-50">
                <div className="navbar-start">
                     <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                         </div>
                            <ul
                            tabIndex={0}
                            className="menu menu-m dropdown-content bg-base-100 rounded-box z-1 mt-3 w-64 p-2 shadow">
                                <li> <Link href={'/'}>Home</Link></li>
                                <li> <Link href={'/dashboard/pages'}>News</Link></li>
                                <li> <Link href={'/dashboard/pages/routine/myRoutine'}>Routine</Link></li>
                                <li><Link href={"/dashboard/pages/habit/myHabit"}>Habit</Link></li>
                                <li><Link href={"/dashboard/pages/time/yourTime"} className="w-full">Tracker</Link></li>
                                <li> <Link href={'/dashboard/pages/time'}>Apex</Link></li>
                            </ul>
                     </div>
                    <div className="hidden md:block w-15 h-15">
                        <Link href={'/'}>
                            <Image
                            src="/routine.png"
                            width={100}
                            height={100}
                            alt="Routine app logo"
                            />
                        </Link>
                        </div>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link href={'/'}>Home</Link></li>
                        <li><Link href={'/dashboard/pages'}>News</Link></li>
                        <li><Link href={'/dashboard/pages/routine/myRoutine'}>Routine</Link></li>
                        <li><Link href={"/dashboard/pages/habit/myHabit"} className="w-full">Habit</Link></li>
                        <li><Link href={"/dashboard/pages/time/yourTime"} className="w-full">Tracker</Link></li>
                        <li><Link href={'/dashboard/pages/time'}>Apex</Link></li>
                    </ul>
                </div> 
            </div>
        </div>
    );
};

export default Navbar;
