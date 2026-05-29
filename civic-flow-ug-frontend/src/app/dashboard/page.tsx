import Link from "next/link";
import Sidebar from "../../components/Sidebar";

const kpis = [
  { label: "Assigned Today", value: "186", detail: "42 new since 08:00", tone: "blue" },
  { label: "Overdue Cases", value: "31", detail: "12 escalated to supervisors", tone: "red" },
  { label: "Resolved Today", value: "94", detail: "Avg. closure time 1.8 days", tone: "green" },
  { label: "SLA Compliance", value: "91%", detail: "+3.4% from last week", tone: "teal" },
];

const complaints = [
  {
    id: "CIVIC-8F4A21B0",
    title: "Overflowing garbage near Owino Market",
    category: "Sanitation",
    district: "Kampala",
    agency: "KCCA",
    status: "In Progress",
    priority: "High",
    sla: "2h 14m",
  },
  {
    id: "CIVIC-71D903AE",
    title: "Broken borehole serving three villages",
    category: "Water",
    district: "Wakiso",
    agency: "NWSC",
    status: "Escalated",
    priority: "Critical",
    sla: "Overdue",
  },
  {
    id: "CIVIC-3290AC44",
    title: "No essential medicines at health centre",
    category: "Health",
    district: "Gulu",
    agency: "District Health Office",
    status: "Assigned",
    priority: "Medium",
    sla: "1d 6h",
  },
  {
    id: "CIVIC-A9E43077",
    title: "Unsafe road shoulder near primary school",
    category: "Roads",
    district: "Mbarara",
    agency: "UNRA",
    status: "Resolved",
    priority: "Medium",
    sla: "Closed",
  },
];

const activity = [
  "Water complaint CIVIC-71D903AE escalated to Wakiso supervisor.",
  "KCCA accepted sanitation ticket CIVIC-8F4A21B0.",
  "Gulu health ticket assigned to District Health Office.",
  "Mbarara road ticket marked resolved pending citizen feedback.",
];

const districtRankings = [
  { name: "Kampala", count: 284, trend: "+18%" },
  { name: "Wakiso", count: 241, trend: "+11%" },
  { name: "Gulu", count: 126, trend: "-4%" },
  { name: "Mbarara", count: 103, trend: "+6%" },
];

function statusClass(status: string) {
  if (status === "Resolved") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "Escalated") return "border-red-200 bg-red-50 text-red-700";
  if (status === "In Progress") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-blue-200 bg-blue-50 text-blue-700";
}

function kpiAccent(tone: string) {
  if (tone === "red") return "border-l-red-600";
  if (tone === "green") return "border-l-emerald-600";
  if (tone === "teal") return "border-l-teal-600";
  return "border-l-blue-700";
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">
                National Operations
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Public Service Complaint Dashboard
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                Monitor agency response, escalation pressure, and district service hotspots from one operational view.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                aria-label="Search complaints"
                placeholder="Search ticket, district, agency"
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
              <Link
                href="/complaints/new"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-800 px-4 text-sm font-semibold text-white transition hover:bg-blue-900"
              >
                Report Issue
              </Link>
            </div>
          </header>

          {/* KPI cards stay compact so officers can scan operational health quickly. */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className={`rounded-lg border border-slate-200 border-l-4 bg-white p-4 shadow-sm ${kpiAccent(kpi.tone)}`}
              >
                <p className="text-sm font-medium text-slate-600">{kpi.label}</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className="text-3xl font-semibold tracking-tight text-slate-950">{kpi.value}</p>
                  <p className="text-right text-xs leading-5 text-slate-500">{kpi.detail}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">Active Complaint Queue</h2>
                  <p className="mt-1 text-sm text-slate-500">Prioritized by SLA risk, district load, and escalation status.</p>
                </div>
                <button className="h-9 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  Filter
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Ticket</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">District</th>
                      <th className="px-4 py-3 font-semibold">Agency</th>
                      <th className="px-4 py-3 font-semibold">Priority</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">SLA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaints.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <Link href={`/complaints/${complaint.id}`} className="font-semibold text-blue-800 hover:text-blue-950">
                            {complaint.id}
                          </Link>
                          <p className="mt-1 max-w-xs truncate text-slate-500">{complaint.title}</p>
                        </td>
                        <td className="px-4 py-4 text-slate-700">{complaint.category}</td>
                        <td className="px-4 py-4 text-slate-700">{complaint.district}</td>
                        <td className="px-4 py-4 text-slate-700">{complaint.agency}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                            {complaint.priority}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${statusClass(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-900">{complaint.sla}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-5">
              <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-950">District Rankings</h2>
                <div className="mt-4 space-y-3">
                  {districtRankings.map((district) => (
                    <div key={district.name} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium text-slate-900">{district.name}</p>
                        <p className="text-xs text-slate-500">{district.count} open complaints</p>
                      </div>
                      <span className="text-sm font-semibold text-blue-800">{district.trend}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold text-slate-950">Recent Activity</h2>
                <div className="mt-4 space-y-3">
                  {activity.map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-teal-600" />
                      <p className="text-sm leading-6 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-950">Hotspot Map</h2>
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">PostGIS ready</span>
                </div>
                <div className="mt-4 grid h-64 grid-cols-5 grid-rows-4 gap-1 rounded-lg border border-slate-200 bg-slate-50 p-2">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <div
                      key={index}
                      className={`rounded ${index % 7 === 0 ? "bg-red-300" : index % 5 === 0 ? "bg-amber-200" : "bg-blue-100"}`}
                    />
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
