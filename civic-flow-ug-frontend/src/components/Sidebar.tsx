"use client";

import { type ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "National Dashboard", href: "/dashboard" },
  { label: "Complaints", href: "/complaints/new" },
  { label: "Escalations", href: "/escalations" },
  { label: "Agencies", href: "/agencies" },
  { label: "District Analytics", href: "/analytics" },
  { label: "Map View", href: "/map" },
  { label: "Users & Roles", href: "/users" },
  { label: "Audit Logs", href: "/audit-logs" },
  { label: "Settings", href: "/settings" },
];

export default function Sidebar(): ReactElement {
  const pathname = usePathname() ?? "/";
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="w-72 bg-slate-900 text-white p-6 hidden lg:flex flex-col">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="h-11 w-11 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-lg">
            CF
          </div>
          <div>
            <h1 className="font-bold text-xl">CivicFlow</h1>
            <p className="text-slate-400 text-sm">Governance Infrastructure</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={href}
                className={`block w-full px-4 py-3 rounded-xl transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-800 pt-5">
        <div className="rounded-2xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Logged in as</p>
          <h3 className="font-semibold mt-1">National Administrator</h3>
          <p className="text-xs text-slate-500 mt-1">Ministry of ICT & National Guidance</p>
        </div>
      </div>
    </aside>
  );
}
