import Link from "next/link";
import Image from "next/image";

const categories = ["Roads", "Water", "Health", "Sanitation", "Education", "Electricity"];

const metrics = [
  { label: "Issues resolved", value: "8,420" },
  { label: "Active districts", value: "72" },
  { label: "Avg response time", value: "2.1 days" },
];

const steps = [
  {
    title: "1. Report",
    text: "Submit a public service issue with precise location, category, and supporting media.",
  },
  {
    title: "2. Track",
    text: "Receive a ticket number to monitor cross-agency routing and status updates.",
  },
  {
    title: "3. Resolve",
    text: "Field officers act on routed cases while supervisors monitor SLA performance.",
  },
];

function QueueItem({ title, district, status }: { title: string; district: string; status: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/30">
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{district} District</p>
      </div>
      <span 
        className="self-start rounded-md bg-white px-2 py-1 text-xs font-bold text-blue-800 border border-slate-200/60 shadow-sm"
        aria-label={`Current status: ${status}`}
      >
        {status}
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 antialiased selection:bg-blue-100">
      
      {/* Three-Column Unified Viewport Section */}
      <section className="border-b border-slate-200 bg-white" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6 lg:grid lg:h-[calc(100vh-64px)] lg:min-h-[760px] lg:grid-cols-[1.1fr_0.9fr_1fr] lg:gap-8 lg:px-8 lg:py-0 items-center">
          
          {/* Column 1: Core Content, Actions & Metrics */}
          <div className="flex flex-col justify-between h-full py-8 lg:py-12 lg:pr-4 border-b border-slate-100 lg:border-b-0 lg:border-r lg:border-slate-200">
            <div className="space-y-6">
              <header className="flex items-center gap-4">
                <Image
                  src="/coat.png"
                  alt="Uganda Coat of Arms"
                  width={64}
                  height={64}
                  priority
                  className="h-14 w-14 rounded-lg border border-slate-200 bg-white object-contain p-2"
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-800">
                    CivicFlow Uganda
                  </p>
                  <p className="text-xs font-medium text-slate-500">Digital public service accountability portal</p>
                </div>
              </header>

              <div className="space-y-4">
                <h1 id="hero-heading" className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-4xl xl:text-5xl lg:leading-[1.15]">
                  Report Public Service Issues Transparently
                </h1>
                <p className="text-base leading-relaxed text-slate-600">
                  An open platform for citizens to instantly log infrastructure shortfalls, track real-time resolution pipelines, and monitor agency performance metrics.
                </p>
              </div>

              {/* Core CTA Actions Stacked Stacked/Row hybrid */}
              <div className="flex flex-col gap-2.5 pt-2 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/complaints/new"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-blue-800 px-4 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                >
                  Report an Issue
                </Link>
                <Link
                  href="/complaints/track"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-center text-sm font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
                >
                  Track Issue Status
                </Link>
              </div>
            </div>

            {/* Consolidated High-Visibility Impact Metrics (Fills bottom-left quadrant cleanly) */}
            <div className="mt-8 lg:mt-0 pt-6 border-t border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Platform Impact Data</p>
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                {metrics.map((metric) => (
                  <div key={metric.label} className="text-center border-r border-slate-200/80 last:border-r-0 px-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight line-clamp-1">{metric.label}</p>
                    <p className="mt-0.5 text-base font-extrabold text-slate-950">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: System Workflow Timeline */}
          <div className="flex flex-col justify-center h-full py-8 lg:py-12 lg:px-2 border-b border-slate-100 lg:border-b-0 lg:border-r lg:border-slate-200">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-800">System Workflow</p>
                <h2 className="text-lg font-bold text-slate-900 mt-1">How accountability loops close</h2>
              </div>

              <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {steps.map((step) => (
                  <div key={step.title} className="group relative rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50">
                    {/* Visual Node Tracker dot */}
                    <div className="absolute -left-[22px] top-4 h-3 w-3 rounded-full border-2 border-white bg-blue-800 ring-4 ring-blue-50 group-hover:scale-120 transition-transform" aria-hidden="true" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-950">{step.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: The Restored Live Feed Preview Container */}
          <div className="flex items-center h-full py-8 lg:py-12 lg:pl-4">
            <div className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm backdrop-blur-sm">
              <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-950">Live Complaint Queue</h2>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">National operational updates</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                    Live Feed
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  <QueueItem title="Water outage" district="Wakiso" status="Escalated" />
                  <QueueItem title="Road damage" district="Mbarara" status="Assigned" />
                  <QueueItem title="Waste collection" district="Kampala" status="In Progress" />
                </div>

                <Link 
                  href="/dashboard"
                  className="mt-4 flex w-full items-center justify-center rounded-lg border border-blue-200 bg-blue-50/50 py-2.5 text-xs font-bold text-blue-800 transition-all hover:bg-blue-100"
                >
                  View Interactive System Map →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* High Visibility Quick-Filing Grid Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="categories-heading">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-800">Quick-Launch Reports</p>
            <h2 id="categories-heading" className="mt-1 text-lg font-bold tracking-tight text-slate-950">Select category to auto-populate report form</h2>
          </div>
          <nav aria-label="Report by service category">
            <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/complaints/new?category=${encodeURIComponent(category.toLowerCase())}`}
                    className="block text-center rounded-lg border border-slate-200 bg-white py-3.5 px-3 text-xs font-bold text-slate-900 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

    </main>
  );
}