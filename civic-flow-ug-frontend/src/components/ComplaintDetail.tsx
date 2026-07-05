"use client";

import { useMemo, useState } from "react";
import Timeline from "./Timeline";

type Attachment = {
  id: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
};

export type ComplaintDetailRecord = {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  category: { id: string; name: string } | null;
  status: { id: string; name: string } | null;
  priority?: { id: string; name: string } | null;
  agency?: { id: string; name: string } | string | null;
  district?: { id: string; name: string } | string | null;
  created_by: string | null;
  assigned_to: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  is_anonymous?: boolean;
  address_text?: string;
  contact_phone?: string;
  attachments?: Attachment[];
  sla_due_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  complaint: ComplaintDetailRecord;
};

const tabs = [
  { key: "activity", label: "Activity Timeline" },
  { key: "attachments", label: "Attachments" },
  { key: "escalations", label: "Escalations" },
  { key: "notes", label: "Internal Notes" },
];
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function relatedName(value: ComplaintDetailRecord["agency"] | ComplaintDetailRecord["district"]) {
  if (!value) return "-";
  return typeof value === "string" ? value : value.name;
}

function statusClass(status?: string) {
  if (status === "Resolved" || status === "Closed") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "Escalated") return "border-red-200 bg-red-50 text-red-700";
  if (status === "In Progress") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-blue-200 bg-blue-50 text-blue-700";
}

function attachmentUrl(fileUrl: string) {
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  return `${apiBaseUrl}${fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`}`;
}

function attachmentLabel(attachment: Attachment) {
  if (attachment.file_type.startsWith("image/")) return "Photo evidence";
  if (attachment.file_type.startsWith("video/")) return "Video evidence";
  return "Attachment";
}

export default function ComplaintDetail({ complaint }: Props) {
  const [activeTab, setActiveTab] = useState("activity");
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  const locationLabel = useMemo(() => {
    if (complaint.address_text) return complaint.address_text;
    if (complaint.latitude && complaint.longitude) return `${complaint.latitude}, ${complaint.longitude}`;
    return "Not provided";
  }, [complaint.address_text, complaint.latitude, complaint.longitude]);

  const statusName = complaint.status?.name || "New";
  const citizenLabel = complaint.is_anonymous ? "Anonymous report" : complaint.created_by || "Citizen";

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
      <div className="space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">Complaint Summary</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{complaint.title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">{complaint.description}</p>
            </div>
            <span className={`w-fit rounded-md border px-3 py-1.5 text-sm font-semibold ${statusClass(statusName)}`}>
              {statusName}
            </span>
          </div>

          {/* These summary fields mirror the MVP complaint detail requirements from AGENTS.md. */}
          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-6">
            {[
              ["Ticket ID", complaint.ticket_number],
              ["Category", complaint.category?.name || "-"],
              ["Priority", complaint.priority?.name || "Normal"],
              ["Location", locationLabel],
              ["Citizen Info", citizenLabel],
              ["District", relatedName(complaint.district)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-2 break-words text-sm font-semibold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3 sm:px-6">
            <nav className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? "bg-blue-800 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "activity" && <Timeline />}
            {activeTab === "attachments" && (
              complaint.attachments?.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {complaint.attachments.map((attachment) => (
                    <button
                      key={attachment.id}
                      type="button"
                      className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
                      onClick={() => setPreviewAttachment(attachment)}
                    >
                      <div className="aspect-video bg-slate-100">
                        {attachment.file_type.startsWith("image/") ? (
                          <img
                            src={attachmentUrl(attachment.file_url)}
                            alt={attachmentLabel(attachment)}
                            className="h-full w-full object-cover"
                          />
                        ) : attachment.file_type.startsWith("video/") ? (
                          <video
                            src={attachmentUrl(attachment.file_url)}
                            className="h-full w-full object-cover"
                            muted
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
                            Attachment
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="truncate text-sm font-semibold text-slate-950">{attachmentLabel(attachment)}</p>
                        <p className="mt-1 text-xs text-slate-500">{attachment.file_type}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyPanel title="No attachments uploaded" text="Evidence files will appear here after citizens upload photos or videos." />
              )
            )}
            {activeTab === "escalations" && (
              <div className="space-y-3">
                <EscalationRow label="Current level" value="Level 0" />
                <EscalationRow label="SLA due" value={complaint.sla_due_at || "Not set"} />
                <EscalationRow label="Next action" value="Escalate if unresolved after SLA breach" />
              </div>
            )}
            {activeTab === "notes" && (
              <EmptyPanel title="No internal notes yet" text="Officer comments and resolution notes will be listed here." />
            )}
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">Assignment</h2>
          <div className="mt-4 space-y-4">
            <InfoLine label="Agency" value={relatedName(complaint.agency)} />
            <InfoLine label="Assigned officer" value={complaint.assigned_to || "Unassigned"} />
            <InfoLine label="Last updated" value={complaint.updated_at || "-"} />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">Workflow Actions</h2>
          <div className="mt-4 grid gap-2">
            <button className="h-10 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Acknowledge
            </button>
            <button className="h-10 rounded-lg bg-blue-800 text-sm font-semibold text-white transition hover:bg-blue-900">
              Resolve Complaint
            </button>
            <button className="h-10 rounded-lg border border-red-200 bg-red-50 text-sm font-semibold text-red-700 transition hover:bg-red-100">
              Escalate
            </button>
            <button className="h-10 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Reassign
            </button>
          </div>
        </section>
      </aside>

      {previewAttachment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Attachment preview"
          onClick={() => setPreviewAttachment(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">{attachmentLabel(previewAttachment)}</p>
                <p className="text-xs text-slate-500">{previewAttachment.file_type}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={attachmentUrl(previewAttachment.file_url)}
                  download
                  className="rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
                >
                  Download
                </a>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setPreviewAttachment(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex max-h-[78vh] items-center justify-center bg-slate-100 p-3">
              {previewAttachment.file_type.startsWith("image/") ? (
                <img
                  src={attachmentUrl(previewAttachment.file_url)}
                  alt={attachmentLabel(previewAttachment)}
                  className="max-h-[74vh] max-w-full rounded-md object-contain"
                />
              ) : previewAttachment.file_type.startsWith("video/") ? (
                <video
                  src={attachmentUrl(previewAttachment.file_url)}
                  className="max-h-[74vh] max-w-full rounded-md"
                  controls
                />
              ) : (
                <a
                  href={attachmentUrl(previewAttachment.file_url)}
                  className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-blue-800 shadow-sm"
                >
                  Open attachment
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function EscalationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function EmptyPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
