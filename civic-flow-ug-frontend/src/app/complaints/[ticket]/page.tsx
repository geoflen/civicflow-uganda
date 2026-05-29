import ComplaintDetail, { type ComplaintDetailRecord } from "../../../components/ComplaintDetail";
import Sidebar from "../../../components/Sidebar";

type PageProps = {
  params: Promise<{ ticket: string }>;
};

export default async function ComplaintDetailPage({ params }: PageProps) {
  const { ticket } = await params;
  const sampleComplaint: ComplaintDetailRecord = {
    id: ticket,
    ticket_number: ticket,
    title: "Overflowing garbage near Owino Market",
    description:
      "Residents report that collection has not happened for several days and waste is blocking pedestrian access near the market entrance.",
    category: { id: "sanitation", name: "Sanitation" },
    status: { id: "in-progress", name: "In Progress" },
    priority: { id: "high", name: "High" },
    agency: "Kampala Capital City Authority",
    district: "Kampala",
    created_by: "Citizen report",
    assigned_to: "Officer A. Nansubuga",
    address_text: "Owino Market, Kampala Central Division",
    is_anonymous: false,
    sla_due_at: "2026-05-31 17:00",
    updated_at: "2026-05-29 08:45",
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Static preview route for dashboard links until authenticated API detail loading is wired in. */}
          <header className="mb-5 border-b border-slate-200 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">Complaint Detail</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{sampleComplaint.ticket_number}</h1>
          </header>
          <ComplaintDetail complaint={sampleComplaint} />
        </div>
      </main>
    </div>
  );
}
