"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm relative z-20">
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold tracking-[0.24em] text-slate-700">
                COA
              </div>
              <div className="leading-tight">
                <h1 className="text-lg font-semibold font-sans tracking-tight text-slate-900">CivicFlow</h1>
                <p className="text-sm text-slate-500 font-sans">Digital Accountability Infrastructure</p>
              </div>
            </Link>
          </div>

          {/* Landing navigation exposes both citizen actions and officer operations. */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/complaints/new" className="text-sm font-medium text-slate-700 hover:text-slate-900">Report Issue</Link>
            <Link href="/complaints/track" className="text-sm font-medium text-slate-700 hover:text-slate-900">Track Issue</Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-slate-900">Dashboard</Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-slate-900">View Complaints</Link>
            <Link href="/help" className="text-sm font-medium text-slate-700 hover:text-slate-900">Help</Link>
          </nav>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-3">
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100"
            >
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden ${open ? "block" : "hidden"} absolute inset-x-0 top-full bg-white border-b border-slate-200 shadow-sm` }>
        <div className="px-4 py-4 space-y-1">
          <Link href="/complaints/new" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-md text-slate-800 hover:bg-slate-50">Report Issue</Link>
          <Link href="/complaints/track" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-md text-slate-800 hover:bg-slate-50">Track Issue</Link>
          <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-md text-slate-800 hover:bg-slate-50">Dashboard</Link>
          <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-md text-slate-800 hover:bg-slate-50">View Complaints</Link>
          <Link href="/help" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-md text-slate-800 hover:bg-slate-50">Help</Link>
        </div>
      </div>

      <div className="flex h-2 w-full">
        <div className="bg-black flex-1" />
        <div className="bg-yellow-400 flex-1" />
        <div className="bg-red-600 flex-1" />
      </div>
    </header>
  );
}
