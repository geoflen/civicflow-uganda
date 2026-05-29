"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";

export default function TrackLandingPage() {
  const router = useRouter();
  const [ticket, setTicket] = useState("");

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">Ticket Tracking</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Track your complaint</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
            Enter the ticket number issued when your complaint was submitted.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="ticket" className="block text-sm font-medium text-slate-700">
                Ticket number
              </label>
              <input
                id="ticket"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                placeholder="CIVIC-ABCDEFG1"
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="button"
              onClick={() => ticket.trim() && router.push(`/complaints/track/${ticket.trim()}`)}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-800 px-5 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              View Ticket
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
