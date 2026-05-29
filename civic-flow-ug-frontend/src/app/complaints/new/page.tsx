"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ComplaintForm from "../../../components/ComplaintForm";
import Sidebar from "../../../components/Sidebar";

function NewComplaintContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read category parameter from URL (e.g., ?category=roads)
  const initialCategory = searchParams.get("category") || "";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />
      
      {/* Container forced to stay within screen boundaries */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100 h-full overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl flex flex-col h-full">
          
          {/* Compressed high-density header */}
          <header className="mb-4 border-b border-slate-200 pb-3 shrink-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-800">
              Citizen Reporting
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              Submit a Public Service Complaint
            </h1>
            <p className="mt-0.5 max-w-2xl text-xs text-slate-600">
              Provide necessary details for line ministries and responsible authorities to investigate and resolve the issue.
            </p>
          </header>

          {/* Form wrapper styled for high density visibility */}
          <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4 overflow-y-auto">
            <ComplaintForm
              initialCategory={initialCategory} // Pass category property directly to your sub-form element
              onCreated={(ticket) => {
                router.push(`/complaints/track/${ticket}`);
              }}
            />
          </div>
          
        </div>
      </main>
    </div>
  );
}

// Next.js requires useSearchParams to be wrapped in a Suspense boundary when using static rendering features
export default function NewComplaintPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-sm font-semibold text-slate-500 animate-pulse">Loading secure reporting pipeline...</div>
      </div>
    }>
      <NewComplaintContent />
    </Suspense>
  );
}