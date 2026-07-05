"use client";

import { useState } from "react";

type Props = {
  initialCategory?: string;
  onCreated?: (ticketNumber: string) => void;
};

const categories = [
  "Roads",
  "Water",
  "Health",
  "Education",
  "Sanitation",
  "Corruption",
  "Security",
  "Electricity",
];

const districts = ["Kampala", "Wakiso", "Gulu", "Mbarara", "Jinja", "Arua", "Mbale"];
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function normalizeCategory(initialCategory?: string) {
  if (!initialCategory) return "";
  return categories.find((item) => item.toLowerCase() === initialCategory.toLowerCase()) || "";
}

export default function ComplaintForm({
  initialCategory,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(() => normalizeCategory(initialCategory));
  const [district, setDistrict] = useState("");
  const [addressText, setAddressText] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function formatFileSize(size: number) {
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("district", district);
      formData.append("address_text", addressText);
      if (latitude) formData.append("latitude", latitude);
      if (longitude) formData.append("longitude", longitude);
      formData.append("contact_phone", anonymous ? "" : contactPhone);
      formData.append("is_anonymous", String(anonymous));
      attachments.forEach((file) => formData.append("attachments", file));

      const res = await fetch(`${apiBaseUrl}/api/v1/complaints/public/`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const firstFieldError = Object.values(payload).flat().at(0);
        throw new Error(
          payload.detail ||
            (typeof firstFieldError === "string" ? firstFieldError : "Failed to submit complaint")
        );
      }

      const data = await res.json();
      onCreated?.(data.ticket_number);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-950">Complaint Intake</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Capture the issue, location, and contact preference for routing to the responsible agency.
        </p>
      </div>

      <div className="space-y-6 px-4 py-5 sm:px-6">
        {/* Core issue details are kept first because they drive triage and routing. */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="complaint-title">
              Issue title
            </label>
            <input
              id="complaint-title"
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Broken borehole serving Kasangati village"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="complaint-category">
              Service category
            </label>
            <select
              id="complaint-category"
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="complaint-district">
              District
            </label>
            <select
              id="complaint-district"
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            >
              <option value="">Select district</option>
              {districts.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="complaint-description">
              Description
            </label>
            <textarea
              id="complaint-description"
              className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, who is affected, and how long the issue has been unresolved."
              required
            />
          </div>
        </section>

        <section className="grid gap-4 border-t border-slate-200 pt-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="complaint-address">
              Location description
            </label>
            <input
              id="complaint-address"
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              placeholder="Nearest landmark, parish, road, facility, or village"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="complaint-latitude">
              Latitude
            </label>
            <input
              id="complaint-latitude"
              inputMode="decimal"
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="0.347596"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="complaint-longitude">
              Longitude
            </label>
            <input
              id="complaint-longitude"
              inputMode="decimal"
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="32.582520"
            />
          </div>
        </section>

        <section className="grid gap-4 border-t border-slate-200 pt-5 lg:grid-cols-[1fr_220px]">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="complaint-phone">
              Contact phone
            </label>
            <input
              id="complaint-phone"
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+256..."
              disabled={anonymous}
            />
          </div>

          <label className="flex min-h-11 items-center gap-3 self-end rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Submit anonymously
          </label>
        </section>

        <section className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
          <label className="block text-sm font-medium text-slate-800" htmlFor="complaint-attachments">
            Attach photos or videos
          </label>
          <input
            id="complaint-attachments"
            type="file"
            accept="image/*,video/*"
            multiple
            className="mt-3 block w-full text-sm text-slate-700 file:mr-4 file:h-10 file:rounded-md file:border-0 file:bg-blue-800 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-900"
            onChange={(e) => setAttachments(Array.from(e.target.files || []))}
          />
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <span className="min-w-0 truncate font-medium text-slate-700">{file.name}</span>
                  <span className="shrink-0 text-slate-500">{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-500">A tracking number is generated after submission.</p>
        <button
          type="submit"
          className="h-11 rounded-lg bg-blue-800 px-5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </div>
    </form>
  );
}
