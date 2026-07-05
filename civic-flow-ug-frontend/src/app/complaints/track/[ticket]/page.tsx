"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ComplaintDetail, { type ComplaintDetailRecord } from "../../../../components/ComplaintDetail";
import Sidebar from "../../../../components/Sidebar";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TrackTicketPage() {
  const params = useParams();
  const ticket = params?.ticket as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [complaint, setComplaint] = useState<ComplaintDetailRecord | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchTicket() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBaseUrl}/api/v1/complaints/track/${ticket}/`);
        if (!res.ok) throw new Error("Ticket not found");
        const data = await res.json();
        if (mounted) setComplaint(data as ComplaintDetailRecord);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load ticket");
      } finally {
        setLoading(false);
      }
    }

    fetchTicket();
    return () => {
      mounted = false;
    };
  }, [ticket]);

  if (loading) return <PageShell><div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading...</div></PageShell>;
  if (error) return <PageShell><div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">{error}</div></PageShell>;
  if (!complaint) return null;

  return (
    <PageShell>
      <header className="mb-5 border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">Complaint Detail</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{complaint.ticket_number}</h1>
      </header>
      <ComplaintDetail complaint={complaint} />
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
