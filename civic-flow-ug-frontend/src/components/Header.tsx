"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  // Dynamic path evaluation for precise active highlighting
  const isHomeActive = pathname === "/";
  const isComplaintsActive = pathname.startsWith("/complaints");
  const isDashboardActive = pathname.startsWith("/dashboard");

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-[90rem] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          {/* Left Side: Branding & Official Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/coat.png"
              alt="Uganda Coat of Arms"
              width={44}
              height={44}
              priority
              className="h-11 w-11 rounded-lg border border-slate-200 bg-white object-contain p-1.5"
            />
            <div className="leading-tight">
              <h1 className="text-lg font-bold font-sans tracking-tight text-slate-900">CivicFlow</h1>
              <p className="text-xs font-medium text-slate-500 font-sans">Digital Accountability Infrastructure & Governance Platform</p>
            </div>
          </div>

          {/* Center/Right Dynamic Navigation Menu & Affiliation */}
          <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:gap-6">
            <nav aria-label="Primary navigation">
              <ul className="flex items-center gap-1.5">
                <li>
                  <Link
                    href="/"
                    className={`inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-bold transition-all ${
                      isHomeActive
                        ? "bg-blue-50 text-blue-800 border border-blue-100/80"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    aria-current={isHomeActive ? "page" : undefined}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/complaints/new"
                    className={`inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-bold transition-all ${
                      isComplaintsActive
                        ? "bg-blue-50 text-blue-800 border border-blue-100/80"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    aria-current={isComplaintsActive ? "page" : undefined}
                  >
                    Report Issue
                  </Link>
                </li>
                <li>
                  <Link
                    href="/complaints/track"
                    className={`inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-bold transition-all ${
                      pathname === "/complaints/track"
                        ? "bg-blue-50 text-blue-800 border border-blue-100/80"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    Track Status
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className={`inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-bold transition-all ${
                      isDashboardActive
                        ? "bg-blue-50 text-blue-800 border border-blue-100/80"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    aria-current={isDashboardActive ? "page" : undefined}
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 md:border-l md:border-slate-200 md:pl-6">
              Ministry of ICT & National Guidance
            </div>
          </div>

        </div>
      </div>

      {/* Authentic National Flag Horizontal Stripes (Full length, stacked vertically) */}
      <div className="flex flex-col w-full" aria-hidden="true">
        <div className="bg-black h-0.5 w-full" />
        <div className="bg-[#FCDC3B] h-0.5 w-full" />
        <div className="bg-[#D92322] h-0.5 w-full" />
      </div>
    </header>
  );
}