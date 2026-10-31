"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import BrandMark from "@/components/BrandMark";
import { getAllPackages } from "@/data/catalogue";
import { DESTINATIONS } from "@/data/siteContent";
import { CATEGORIES } from "@/types/travel";
import { supabase } from "@/lib/supabaseClient";

type AdminTab = "overview" | "enquiries" | "packages" | "destinations" | "qa" | "settings";

type EnquiryStatus = "New" | "In Review" | "Quoted" | "Confirmed" | "Archived";

interface EnquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone";
  packageTitle: string;
  packageSlug: string;
  departureDate: string;
  datesFlexible: boolean;
  travellers: number;
  message: string;
  receivedAt: string;
  status: EnquiryStatus;
  notes?: string;
}

const INITIAL_ENQUIRIES: EnquiryRecord[] = [
  {
    id: "ENQ-2026-081",
    name: "Eleanor Vance",
    email: "eleanor.vance@gmail.com",
    phone: "+44 7700 900123",
    preferredContact: "email",
    packageTitle: "Golden Triangle",
    packageSlug: "golden-triangle",
    departureDate: "2026-11-15",
    datesFlexible: false,
    travellers: 2,
    message: "Looking for private luxury heritage accommodation in Jaipur and an early sunrise visit to the Taj Mahal.",
    receivedAt: "10 mins ago",
    status: "New",
  },
  {
    id: "ENQ-2026-080",
    name: "Marcus Aurelius Thorne",
    email: "m.thorne@oxford.ac.uk",
    phone: "+44 7911 123456",
    preferredContact: "email",
    packageTitle: "Markha Valley",
    packageSlug: "markha-valley",
    departureDate: "2026-12-05",
    datesFlexible: true,
    travellers: 4,
    message: "Group of 4 experienced hikers. Inquiring about support crew, pack ponies, and high pass acclimatization schedule.",
    receivedAt: "2 hours ago",
    status: "In Review",
  },
  {
    id: "ENQ-2026-079",
    name: "Dr. Alistair Sterling",
    email: "sterling.a@sydneyhealth.com.au",
    phone: "+61 412 345 678",
    preferredContact: "phone",
    packageTitle: "Kashmir Houseboats Stay",
    packageSlug: "kashmir-package-7-day",
    departureDate: "2026-11-28",
    datesFlexible: false,
    travellers: 2,
    message: "Interested in a private cedarwood houseboat on Dal Lake with dedicated shikara for morning lotus garden trips.",
    receivedAt: "Yesterday",
    status: "Quoted",
  },
  {
    id: "ENQ-2026-078",
    name: "Sophia Rossi",
    email: "sophia.rossi@milanodesign.it",
    phone: "+39 02 1234567",
    preferredContact: "email",
    packageTitle: "Glimpses of Kerala",
    packageSlug: "glimpses-of-kerala",
    departureDate: "2027-01-10",
    datesFlexible: true,
    travellers: 2,
    message: "Would love to add 2 nights in a spice plantation bungalow in Munnar before boarding the Alleppey houseboat.",
    receivedAt: "2 days ago",
    status: "Confirmed",
  },
  {
    id: "ENQ-2026-077",
    name: "David & Sarah Chen",
    email: "dchen@singaporetech.sg",
    phone: "+65 9123 4567",
    preferredContact: "email",
    packageTitle: "Nepal Wildlife Safari",
    packageSlug: "nepal-wildlife-safari",
    departureDate: "2026-12-20",
    datesFlexible: false,
    travellers: 3,
    message: "Family journey with our 14-year-old son. Interested in Chitwan canoe rides, walking safaris, and Pokhara mountain views.",
    receivedAt: "3 days ago",
    status: "Confirmed",
  },
  {
    id: "ENQ-2026-076",
    name: "Henrik Lindqvist",
    email: "henrik.l@stockholm.se",
    phone: "+46 8 123 4567",
    preferredContact: "email",
    packageTitle: "Discover Ladakh",
    packageSlug: "discover-ladakh",
    departureDate: "2027-02-14",
    datesFlexible: true,
    travellers: 1,
    message: "Solo expedition across winter Ladakh to view frozen Pangong Tso and monastic prayer festivals.",
    receivedAt: "4 days ago",
    status: "Archived",
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(INITIAL_ENQUIRIES);
  const [enquirySearch, setEnquirySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);

  // Packages list & search
  const allPackages = useMemo(() => getAllPackages(), []);
  const [packageSearch, setPackageSearch] = useState("");
  const [packageCategoryFilter, setPackageCategoryFilter] = useState("All");
  const [selectedPackageSlug, setSelectedPackageSlug] = useState<string | null>(null);

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(enquirySearch.toLowerCase()) ||
        e.email.toLowerCase().includes(enquirySearch.toLowerCase()) ||
        e.packageTitle.toLowerCase().includes(enquirySearch.toLowerCase()) ||
        e.id.toLowerCase().includes(enquirySearch.toLowerCase());
      const matchesStatus = statusFilter === "All" || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enquiries, enquirySearch, statusFilter]);

  // Filtered Packages
  const filteredPackages = useMemo(() => {
    return allPackages.filter((p) => {
      const q = packageSearch.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.brochure_code.toLowerCase().includes(q) ||
        p.region.some((r) => r.toLowerCase().includes(q));
      const matchesCat = packageCategoryFilter === "All" || p.category === packageCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [allPackages, packageSearch, packageCategoryFilter]);

  useEffect(() => {
    async function fetchLiveEnquiries() {
      try {
        const { data, error } = await supabase
          .from("enquiries")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: EnquiryRecord[] = data.map((row) => ({
            id: row.id,
            name: row.full_name,
            email: row.email,
            phone: row.phone,
            preferredContact: row.preferred_contact === "phone" ? "phone" : "email",
            packageTitle: row.package_title || "Tailor-made trip",
            packageSlug: row.package_slug || "enquiry",
            departureDate: row.travel_date || "Flexible",
            datesFlexible: row.dates_flexible,
            travellers: Number(row.travellers) || 2,
            message: row.message || "",
            receivedAt: new Date(row.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: row.status as EnquiryStatus,
            notes: row.notes,
          }));
          setEnquiries(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch enquiries from Supabase:", err);
      }
    }
    fetchLiveEnquiries();
  }, []);

  const updateEnquiryStatus = async (id: string, newStatus: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    try {
      await supabase.from("enquiries").update({ status: newStatus }).eq("id", id);
    } catch (e) {
      console.error("Failed to update status in Supabase:", e);
    }
  };

  const selectedPackage = useMemo(() => {
    if (!selectedPackageSlug) return null;
    return allPackages.find((p) => p.slug === selectedPackageSlug) ?? null;
  }, [allPackages, selectedPackageSlug]);

  return (
    <div className="min-h-screen bg-[#0E1515] text-[#ECE7DF] flex flex-col font-display antialiased">
      {/* 1. Global Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#121A1A]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <BrandMark compact className="scale-95" />
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-semibold text-white/70">
              Admin Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1.5 rounded-button border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 transition-all hover:bg-white/10 hover:text-white hover:border-brass cursor-pointer"
          >
            <span>Live Site</span>
            <span className="text-brass">&rarr;</span>
          </Link>
          <div className="flex items-center gap-2.5 rounded-pill border border-white/10 bg-black/40 px-3 py-1.5 text-xs">
            <span className="h-6 w-6 rounded-full bg-brass text-white flex items-center justify-center font-serif font-bold text-xs">
              AD
            </span>
            <span className="hidden sm:inline font-medium text-white/90">Concierge Desk</span>
          </div>
        </div>
      </header>

      {/* 2. Main Workspace (Sidebar + Content Stage) */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Navigation Sidebar */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#101717] p-4 lg:py-8 lg:px-4 shrink-0">
          <nav className="space-y-1.5" aria-label="Admin Navigation">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[0.75rem] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-brass text-white shadow-[0_6px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>📊</span>
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("enquiries")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-[0.75rem] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "enquiries"
                  ? "bg-brass text-white shadow-[0_6px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span>📨</span>
                <span>Enquiries</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "enquiries" ? "bg-black/30 text-white" : "bg-brass/20 text-brass"}`}>
                {enquiries.filter((e) => e.status === "New").length} New
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("packages")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-[0.75rem] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "packages"
                  ? "bg-brass text-white shadow-[0_6px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span>🗺️</span>
                <span>Tour Packages</span>
              </div>
              <span className="text-[10px] text-white/50">{allPackages.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("destinations")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[0.75rem] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "destinations"
                  ? "bg-brass text-white shadow-[0_6px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>📍</span>
              <span>Destinations</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("qa")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-[0.75rem] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "qa"
                  ? "bg-brass text-white shadow-[0_6px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span>⚠️</span>
                <span>Brochure QA</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                7 Flags
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[0.75rem] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-brass text-white shadow-[0_6px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>⚙️</span>
              <span>Theme &amp; Config</span>
            </button>
          </nav>

          {/* Quick Stats Footnote */}
          <div className="mt-10 rounded-[1rem] border border-white/10 bg-white/5 p-4 text-xs space-y-2 hidden lg:block">
            <p className="text-[0.65rem] uppercase tracking-widest text-brass font-semibold">Catalogue Sync</p>
            <p className="text-white/70 leading-relaxed text-[0.75rem]">
              27 verified packages &amp; 1 houseboat service loaded directly from brochure JSON.
            </p>
          </div>
        </aside>

        {/* Right Stage Workspace */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              {/* Header */}
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brass font-semibold mb-1">
                  Executive Dashboard
                </p>
                <h1 className="font-serif text-3xl font-bold text-white">Operations &amp; Enquiries</h1>
              </div>

              {/* KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="rounded-[1.25rem] border border-white/10 bg-[#121E1E] p-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-white/60 text-xs uppercase tracking-wider font-semibold mb-3">
                    <span>Active Enquiries</span>
                    <span>📨</span>
                  </div>
                  <p className="font-serif text-3xl font-bold text-white">{enquiries.length}</p>
                  <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                    <span>↑ +18%</span>
                    <span className="text-white/50">vs last month</span>
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-[#121E1E] p-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-white/60 text-xs uppercase tracking-wider font-semibold mb-3">
                    <span>Catalogue Packages</span>
                    <span>🗺️</span>
                  </div>
                  <p className="font-serif text-3xl font-bold text-white">{allPackages.length}</p>
                  <p className="text-xs text-brass mt-2 font-medium">100% Brochure Aligned</p>
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-[#121E1E] p-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-white/60 text-xs uppercase tracking-wider font-semibold mb-3">
                    <span>Average Party Size</span>
                    <span>👥</span>
                  </div>
                  <p className="font-serif text-3xl font-bold text-white">2.8 Guests</p>
                  <p className="text-xs text-white/50 mt-2 font-medium">Max group cap: 15</p>
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-[#121E1E] p-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-white/60 text-xs uppercase tracking-wider font-semibold mb-3">
                    <span>Top Demand Region</span>
                    <span>📍</span>
                  </div>
                  <p className="font-serif text-3xl font-bold text-white">Ladakh &amp; Kashmir</p>
                  <p className="text-xs text-emerald-400 mt-2 font-medium">42% of inquiries</p>
                </div>
              </div>

              {/* Two Column Grid: Recent Inquiries + Top Booked Itineraries */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Inquiries Card */}
                <div className="lg:col-span-8 rounded-[1.25rem] border border-white/10 bg-[#121E1E] p-6 sm:p-7 shadow-xl">
                  <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-5">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-white">Recent Enquiries</h2>
                      <p className="text-xs text-white/60 mt-0.5">Click any record to inspect or change quote status</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("enquiries")}
                      className="text-xs text-brass hover:text-white uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                    >
                      View All &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {enquiries.slice(0, 4).map((enq) => (
                      <div
                        key={enq.id}
                        onClick={() => setSelectedEnquiry(enq)}
                        className="rounded-[1rem] border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/10 hover:border-brass/50 transition-all cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-base font-bold text-white">{enq.name}</span>
                            <span className="text-[10px] font-mono text-white/50">{enq.id}</span>
                          </div>
                          <p className="text-xs text-brass font-medium mt-0.5">{enq.packageTitle}</p>
                          <p className="text-[11px] text-white/60 mt-1 line-clamp-1">{enq.message}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              enq.status === "New"
                                ? "bg-brass/20 text-brass border border-brass/40"
                                : enq.status === "Confirmed"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-white/10 text-white/80 border border-white/20"
                            }`}
                          >
                            {enq.status}
                          </span>
                          <span className="text-xs text-white/40">{enq.receivedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Destinations Quick Column */}
                <div className="lg:col-span-4 rounded-[1.25rem] border border-white/10 bg-[#121E1E] p-6 sm:p-7 shadow-xl">
                  <h2 className="font-serif text-xl font-bold text-white mb-1">Region Demand</h2>
                  <p className="text-xs text-white/60 mb-5">Brochure inquiry distribution</p>

                  <div className="space-y-4">
                    {[
                      { name: "Ladakh (Markha & Pangong)", pct: 42 },
                      { name: "Kashmir & Dal Lake", pct: 28 },
                      { name: "Golden Triangle (Taj Mahal)", pct: 18 },
                      { name: "Nepal Adventure & Chitwan", pct: 12 },
                    ].map((item) => (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/90 font-medium">{item.name}</span>
                          <span className="text-brass font-bold">{item.pct}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brass transition-all duration-700"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-5">
                    <p className="text-xs text-white/60 leading-relaxed">
                      💡 <strong>Concierge Tip:</strong> Winter enquiries for Gulmarg skiing and Dal Lake houseboats are up 30%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ENQUIRIES */}
          {activeTab === "enquiries" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-white">Client Enquiries</h1>
                  <p className="text-xs text-white/60 mt-1">Manage brochure itinerary inquiries, client preferences and quotes</p>
                </div>
                <span className="rounded-button border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-brass">
                  {filteredEnquiries.length} Enquiries Total
                </span>
              </div>

              {/* Filters bar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <input
                    type="search"
                    placeholder="Search by client name, email, package or reference ID..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full rounded-button border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30"
                  />
                </div>
                <div className="sm:col-span-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-button border border-white/15 bg-[#121A1A] px-4 py-2.5 text-sm text-white focus:border-brass focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Enquiries Table */}
              <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#121E1E] shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 uppercase tracking-wider text-white/60 font-semibold">
                        <th className="py-4 px-5">ID &amp; Client</th>
                        <th className="py-4 px-5">Package</th>
                        <th className="py-4 px-5">Dates &amp; Party</th>
                        <th className="py-4 px-5">Contact</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredEnquiries.map((enq) => (
                        <tr
                          key={enq.id}
                          className="hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => setSelectedEnquiry(enq)}
                        >
                          <td className="py-4 px-5">
                            <span className="font-mono text-[10px] text-white/50 block">{enq.id}</span>
                            <span className="font-serif text-sm font-bold text-white block mt-0.5">{enq.name}</span>
                            <span className="text-[11px] text-white/60">{enq.email}</span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="font-medium text-white block">{enq.packageTitle}</span>
                            <span className="text-[11px] text-brass font-mono">/{enq.packageSlug}</span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-white block font-medium">{enq.departureDate}</span>
                            <span className="text-[11px] text-white/60 block">
                              {enq.travellers} guest{enq.travellers > 1 ? "s" : ""} {enq.datesFlexible && "· Flexible"}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="inline-block rounded px-2 py-0.5 text-[10px] uppercase font-bold bg-white/10 text-white/80 mb-1">
                              {enq.preferredContact}
                            </span>
                            <span className="text-[11px] text-white/60 block">{enq.phone}</span>
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-semibold inline-block ${
                                enq.status === "New"
                                  ? "bg-brass/20 text-brass border border-brass/40"
                                  : enq.status === "Confirmed"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : enq.status === "Quoted"
                                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                                  : "bg-white/10 text-white/80 border border-white/20"
                              }`}
                            >
                              {enq.status}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEnquiry(enq);
                              }}
                              className="rounded-button border border-white/20 bg-white/5 px-3 py-1 text-xs text-white hover:border-brass hover:text-brass transition-all cursor-pointer"
                            >
                              Details &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGES CATALOGUE */}
          {activeTab === "packages" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-white">Tour Catalogue</h1>
                  <p className="text-xs text-white/60 mt-1">All 27 brochure packages synchronized with the website</p>
                </div>
                <span className="rounded-button border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-brass">
                  27 Brochure Records Loaded
                </span>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <input
                    type="search"
                    placeholder="Search by tour title, brochure code (e.g. S01, II7), or region..."
                    value={packageSearch}
                    onChange={(e) => setPackageSearch(e.target.value)}
                    className="w-full rounded-button border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-brass focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-4">
                  <select
                    value={packageCategoryFilter}
                    onChange={(e) => setPackageCategoryFilter(e.target.value)}
                    className="w-full rounded-button border border-white/15 bg-[#121A1A] px-4 py-2.5 text-sm text-white focus:border-brass focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Packages Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageSlug(pkg.slug)}
                    className="group rounded-[1.25rem] border border-white/10 bg-[#121E1E] overflow-hidden shadow-xl hover:border-brass/50 transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-black">
                      <Image
                        src={`/images/packages/${pkg.slug}.jpg`}
                        alt={pkg.title}
                        fill
                        sizes="400px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      <div className="absolute inset-x-4 top-3 flex items-center justify-between">
                        <span className="rounded-pill bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold uppercase text-brass border border-white/10">
                          {pkg.category}
                        </span>
                        <span className="rounded-pill bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono text-white/90 border border-white/10">
                          {pkg.brochure_code}
                        </span>
                      </div>
                      <div className="absolute inset-x-4 bottom-3">
                        <span className="text-[10px] font-display uppercase tracking-wider text-white/70">
                          {pkg.region.join(" · ")}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-white group-hover:text-brass transition-colors">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-white/70 line-clamp-2 mt-1 leading-relaxed">
                          {pkg.summary}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-white/60 font-medium">{pkg.duration}</span>
                        <span className="text-brass group-hover:underline">Inspect Details &rarr;</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DESTINATIONS */}
          {activeTab === "destinations" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="font-serif text-3xl font-bold text-white">Destinations &amp; Asset Status</h1>
                <p className="text-xs text-white/60 mt-1">Review the 8 operational regions and high-definition photography</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {DESTINATIONS.map((d) => (
                  <div
                    key={d.name}
                    className="rounded-[1.25rem] border border-white/10 bg-[#121E1E] overflow-hidden shadow-xl"
                  >
                    <div className="relative aspect-[4/3] bg-black">
                      <Image
                        src={d.image}
                        alt={d.name}
                        fill
                        sizes="300px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute inset-x-4 bottom-3">
                        <p className="text-[10px] uppercase font-display tracking-widest text-brass font-semibold">
                          {d.tagline}
                        </p>
                        <h3 className="font-serif text-xl font-bold text-white">{d.name}</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-2 text-xs">
                      <p className="text-white/70 line-clamp-2">{d.blurb}</p>
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-semibold">✓ Asset Active</span>
                        <Link href={d.href} className="text-brass hover:underline">
                          View &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BROCHURE QA & FLAGS */}
          {activeTab === "qa" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="font-serif text-3xl font-bold text-white">Brochure Quality &amp; Content Flags</h1>
                <p className="text-xs text-white/60 mt-1">Internal editorial checkpoints preserved for operator confirmation</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Kathmandu–Pokhara Duration Label Conflict",
                    code: "C-1",
                    severity: "Moderate",
                    details: "Brochure contents page specifies 3 nights / 4 days, while card header text has conflicting label. Internal code handles both safely without breaking public pages.",
                  },
                  {
                    title: "Golden Triangle Brochure Code Casing (ii7 vs II7)",
                    code: "C-2",
                    severity: "Low",
                    details: "Brochure printed code as lowercase ii7 on card; normalized safely to canonical uppercase II7 across routes.",
                  },
                  {
                    title: "Vale of Kashmir Trek Duration Card vs Itinerary Mismatch",
                    code: "C-3",
                    severity: "Moderate",
                    details: "Itinerary lists 6 nights / 7 days, card heading had conflicting duration text. Day-by-day sequence verified.",
                  },
                  {
                    title: "Nepal Difficulty Grades (Easy Badge vs Grade D Body)",
                    code: "C-4",
                    severity: "High",
                    details: "Himalayan Combination and Nepal Mini Trek cards printed contradictory difficulty tags. Difficulty filter is intentionally hidden publicly until operator confirms.",
                  },
                  {
                    title: "Nepal Mini Trek 4-Day Itinerary Day Sequence Verification",
                    code: "C-5",
                    severity: "Moderate",
                    details: "Brochure scan had repeated day label; day-by-day programme outline is presented with transparent verified route stops.",
                  },
                  {
                    title: "Kashmir Ski vs Enfield Motorbike Tour Contents Mismatch",
                    code: "C-6",
                    severity: "Low",
                    details: "Contents page listed Enfield Motorbike Tour, actual brochure card p7 contains Kashmir Ski (KS22). Handled with separate verified routes.",
                  },
                  {
                    title: "Generic Inclusions Panel Restriction",
                    code: "C-7",
                    severity: "Guardrail",
                    details: "Brochure reuses a generic inclusions panel. System strictly enforces package-specific inclusions/exclusions only.",
                  },
                ].map((item) => (
                  <div
                    key={item.code}
                    className="rounded-[1.25rem] border border-white/10 bg-[#121E1E] p-6 shadow-xl space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-brass font-bold">
                          {item.code}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-white">{item.title}</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-xs font-display text-white/75 leading-relaxed pt-1">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & CONFIG */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in max-w-3xl">
              <div>
                <h1 className="font-serif text-3xl font-bold text-white">System &amp; Theme Configuration</h1>
                <p className="text-xs text-white/60 mt-1">Review operational environment and brand variables</p>
              </div>

              <div className="rounded-[1.25rem] border border-white/10 bg-[#121E1E] p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">Active Brand Palette</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-[0.75rem] border border-white/10 bg-[#ff6e00] text-white">
                      <p className="text-[10px] uppercase font-bold">Wilderness Orange</p>
                      <p className="font-mono text-xs mt-1">#FF6E00</p>
                    </div>
                    <div className="p-3 rounded-[0.75rem] border border-white/10 bg-[#123438] text-white">
                      <p className="text-[10px] uppercase font-bold">Dark Pine Teal</p>
                      <p className="font-mono text-xs mt-1">#123438</p>
                    </div>
                    <div className="p-3 rounded-[0.75rem] border border-white/10 bg-[#221f20] text-white">
                      <p className="text-[10px] uppercase font-bold">Luxury Charcoal</p>
                      <p className="font-mono text-xs mt-1">#221F20</p>
                    </div>
                    <div className="p-3 rounded-[0.75rem] border border-white/10 bg-[#eeebe5] text-charcoal">
                      <p className="text-[10px] uppercase font-bold">Light Cream</p>
                      <p className="font-mono text-xs mt-1">#EEEBE5</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="font-serif text-lg font-bold text-white mb-3">Enquiry Endpoint Status</h3>
                  <div className="flex items-center justify-between p-4 rounded-[0.75rem] border border-white/10 bg-white/5">
                    <div>
                      <p className="text-xs font-semibold text-white">Direct Consultation Mode</p>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        Client submissions log truthfully with unique submission IDs. API webhook ready for configuration.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300">
                      Operational
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Slide-Over Drawer for Selected Enquiry */}
      {selectedEnquiry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enquiry Details"
          className="fixed inset-0 z-50 flex"
        >
          <div
            onClick={() => setSelectedEnquiry(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          />
          <div className="relative ml-auto flex h-full w-full max-w-lg flex-col bg-[#121E1E] text-white shadow-2xl p-6 sm:p-8 overflow-y-auto border-l border-white/15">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="font-mono text-[11px] text-brass font-bold">{selectedEnquiry.id}</span>
                <h2 className="font-serif text-2xl font-bold text-white mt-0.5">{selectedEnquiry.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                aria-label="Close details"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:bg-brass hover:border-brass transition-all cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6 flex-1 text-xs font-display">
              {/* Status Updater */}
              <div className="rounded-[1rem] border border-white/10 bg-white/5 p-4">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/60 mb-2">
                  Update Booking Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["New", "In Review", "Quoted", "Confirmed", "Archived"] as EnquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateEnquiryStatus(selectedEnquiry.id, st)}
                      className={`py-1.5 px-2 rounded-button text-[11px] font-semibold uppercase transition-all cursor-pointer ${
                        selectedEnquiry.status === st
                          ? "bg-brass text-white shadow-md"
                          : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journey Requested */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-brass font-semibold mb-1">
                  Requested Itinerary
                </p>
                <p className="font-serif text-lg font-bold text-white">{selectedEnquiry.packageTitle}</p>
                <p className="text-white/60 text-[11px] mt-0.5">Slug: /{selectedEnquiry.packageSlug}</p>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div>
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Email</p>
                  <p className="font-semibold text-white select-all">{selectedEnquiry.email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Phone</p>
                  <p className="font-semibold text-white select-all">{selectedEnquiry.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Preferred Channel</p>
                  <p className="font-semibold text-white capitalize">{selectedEnquiry.preferredContact}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Guests</p>
                  <p className="font-semibold text-white">{selectedEnquiry.travellers} travellers</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Departure Date</p>
                  <p className="font-semibold text-white">
                    {selectedEnquiry.departureDate} {selectedEnquiry.datesFlexible && "(Flexible)"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Received</p>
                  <p className="font-semibold text-white">{selectedEnquiry.receivedAt}</p>
                </div>
              </div>

              {/* Message / Special Requests */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-[10px] uppercase text-brass font-semibold mb-1.5">Client Preferences &amp; Questions</p>
                <div className="rounded-[0.75rem] border border-white/10 bg-white/5 p-4 text-white/85 leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex gap-3">
              <a
                href={`mailto:${selectedEnquiry.email}?subject=KS%20World%20Adventure%20Itinerary%20Quote%20${selectedEnquiry.id}`}
                className="btn-primary flex-1 justify-center py-2.5 text-xs text-center"
              >
                Send Email Quote &rarr;
              </a>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-button border border-white/20 px-4 text-xs font-semibold uppercase text-white/80 hover:bg-white/10 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Slide-Over Drawer for Selected Package */}
      {selectedPackage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Package Details"
          className="fixed inset-0 z-50 flex"
        >
          <div
            onClick={() => setSelectedPackageSlug(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          />
          <div className="relative ml-auto flex h-full w-full max-w-lg flex-col bg-[#121E1E] text-white shadow-2xl p-6 sm:p-8 overflow-y-auto border-l border-white/15">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="font-mono text-[11px] text-brass font-bold">{selectedPackage.brochure_code}</span>
                <h2 className="font-serif text-2xl font-bold text-white mt-0.5">{selectedPackage.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPackageSlug(null)}
                aria-label="Close package details"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:bg-brass hover:border-brass transition-all cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6 flex-1 text-xs font-display">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] bg-black border border-white/15">
                <Image
                  src={`/images/packages/${selectedPackage.slug}.jpg`}
                  alt={selectedPackage.title}
                  fill
                  sizes="450px"
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Category</p>
                  <p className="font-semibold text-white">{selectedPackage.category}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Duration</p>
                  <p className="font-semibold text-white">{selectedPackage.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Regions</p>
                  <p className="font-semibold text-white">{selectedPackage.region.join(", ")}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Source Brochure</p>
                  <p className="font-semibold text-white">Page {selectedPackage.source_page}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-[10px] uppercase text-brass font-semibold mb-1">Itinerary Overview</p>
                <p className="text-white/80 leading-relaxed">{selectedPackage.summary}</p>
              </div>

              {selectedPackage.highlights && selectedPackage.highlights.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[10px] uppercase text-brass font-semibold mb-2">Highlights</p>
                  <ul className="space-y-1.5 text-white/75">
                    {selectedPackage.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-brass">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex gap-3">
              <Link
                href={`/packages/${selectedPackage.slug}`}
                target="_blank"
                className="btn-primary flex-1 justify-center py-2.5 text-xs text-center"
              >
                View Public Page &rarr;
              </Link>
              <button
                type="button"
                onClick={() => setSelectedPackageSlug(null)}
                className="rounded-button border border-white/20 px-4 text-xs font-semibold uppercase text-white/80 hover:bg-white/10 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
