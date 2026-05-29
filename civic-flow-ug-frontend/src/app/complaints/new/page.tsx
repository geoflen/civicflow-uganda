"use client";

import ComplaintForm from "../../../components/ComplaintForm";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";

export default function NewComplaintPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 bg-slate-100 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-5 border-b border-slate-200 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">
              Citizen Reporting
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Submit a Public Service Complaint
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Provide enough detail for district and agency officers to route, investigate, and resolve the issue.
            </p>
          </header>
          <ComplaintForm
            onCreated={(ticket) => {
              router.push(`/complaints/track/${ticket}`);
            }}
          />
        </div>
      </main>
    </div>
  );
}
