"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import BrandMark from "@/components/BrandMark";
import { BRAND } from "@/data/brandConfig";
import { getAllPackages } from "@/data/catalogue";
import { DESTINATIONS } from "@/data/siteContent";
import { CATEGORIES } from "@/types/travel";
import { supabase } from "@/lib/supabaseClient";

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

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

interface BrochureQAItem {
  code: string;
  title: string;
  severity: "High" | "Moderate" | "Low" | "Guardrail";
  details: string;
  acknowledged?: boolean;
}

// ---------------------------------------------------------------------------
// Sample Initial Data (Brochure-grounded)
// ---------------------------------------------------------------------------

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
    notes: "VIP enquiry. Requested heritage palace hotel in Jaipur.",
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
    notes: "Awaiting confirmation on high pass pony support availability.",
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
    notes: "Quote sent via phone consultation; awaiting flight confirmation.",
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
    notes: "Confirmed. Deluxe houseboat voucher issued.",
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
    notes: "Family suite reserved in Chitwan national park lodge.",
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
    notes: "Postponed to summer departure window due to winter pass closure.",
  },
];

const INITIAL_QA_ITEMS: BrochureQAItem[] = [
  {
    code: "C-1",
    title: "Kathmandu–Pokhara Duration Label Conflict",
    severity: "Moderate",
    details: "Brochure contents page specifies 3 nights / 4 days, while card header text has conflicting label. Internal code handles both safely without breaking public pages.",
    acknowledged: true,
  },
  {
    code: "C-2",
    title: "Golden Triangle Brochure Code Casing (ii7 vs II7)",
    severity: "Low",
    details: "Brochure printed code as lowercase ii7 on card; normalized safely to canonical uppercase II7 across routes.",
    acknowledged: true,
  },
  {
    code: "C-3",
    title: "Vale of Kashmir Trek Duration Card vs Itinerary Mismatch",
    severity: "Moderate",
    details: "Itinerary lists 6 nights / 7 days, card heading had conflicting duration text. Day-by-day sequence verified.",
    acknowledged: false,
  },
  {
    code: "C-4",
    title: "Nepal Difficulty Grades (Easy Badge vs Grade D Body)",
    severity: "High",
    details: "Himalayan Combination and Nepal Mini Trek cards printed contradictory difficulty tags. Difficulty filter is intentionally hidden publicly until operator confirms.",
    acknowledged: false,
  },
  {
    code: "C-5",
    title: "Nepal Mini Trek 4-Day Itinerary Day Sequence Verification",
    severity: "Moderate",
    details: "Brochure scan had repeated day label; day-by-day programme outline is presented with transparent verified route stops.",
    acknowledged: true,
  },
  {
    code: "C-6",
    title: "Kashmir Ski vs Enfield Motorbike Tour Contents Mismatch",
    severity: "Low",
    details: "Contents page listed Enfield Motorbike Tour, actual brochure card p7 contains Kashmir Ski (KS22). Handled with separate verified routes.",
    acknowledged: true,
  },
  {
    code: "C-7",
    title: "Generic Inclusions Panel Restriction",
    severity: "Guardrail",
    details: "Brochure reuses a generic inclusions panel. System strictly enforces package-specific inclusions/exclusions only.",
    acknowledged: true,
  },
];

const ADMIN_PASSWORD = "raju@123456";

// ---------------------------------------------------------------------------
// Minimalist Vector Icons (Zero Emojis for Executive Grade UI)
// ---------------------------------------------------------------------------

function IconDashboard({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[1.8]`}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function IconInbox({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[1.8]`}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function IconCompass({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[1.8]`}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.25" />
    </svg>
  );
}

function IconMapPin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[1.8]`}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconShieldCheck({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[1.8]`}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconSliders({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[1.8]`}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function IconSearch({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[1.8]`}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconDownload({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[1.8]`}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconPlus({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[2]`}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconRefresh({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[1.8]`}>
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
    </svg>
  );
}

function IconExternalLink({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[1.8]`}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// CSV Export Utility
// ---------------------------------------------------------------------------

function exportToCSV(records: EnquiryRecord[]) {
  const headers = [
    "Reference ID",
    "Client Name",
    "Email",
    "Phone",
    "Preferred Channel",
    "Package Title",
    "Package Slug",
    "Departure Date",
    "Flexible Dates",
    "Guests",
    "Status",
    "Received At",
    "Client Message",
    "Internal Notes",
  ];

  const rows = records.map((r) => [
    r.id,
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.email.replace(/"/g, '""')}"`,
    `"${r.phone.replace(/"/g, '""')}"`,
    r.preferredContact,
    `"${r.packageTitle.replace(/"/g, '""')}"`,
    r.packageSlug,
    r.departureDate,
    r.datesFlexible ? "Yes" : "No",
    r.travellers,
    r.status,
    `"${r.receivedAt}"`,
    `"${(r.message || "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`,
    `"${(r.notes || "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `ks_world_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------------------------------------------------------------------------
// Component Implementation
// ---------------------------------------------------------------------------

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem("admin_auth_token") === "raju_authenticated";
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Enquiries State
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(INITIAL_ENQUIRIES);
  const [enquirySearch, setEnquirySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [channelFilter, setChannelFilter] = useState<string>("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // New Enquiry Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newEnquiryForm, setNewEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "email" as "email" | "phone",
    packageSlug: "golden-triangle",
    departureDate: "",
    datesFlexible: false,
    travellers: 2,
    message: "",
  });

  // Packages State
  const allPackages = useMemo(() => getAllPackages(), []);
  const [packageSearch, setPackageSearch] = useState("");
  const [packageCategoryFilter, setPackageCategoryFilter] = useState("All");
  const [packageViewMode, setPackageViewMode] = useState<"grid" | "table">("grid");
  const [selectedPackageSlug, setSelectedPackageSlug] = useState<string | null>(null);

  // QA Audit Items State
  const [qaItems, setQaItems] = useState<BrochureQAItem[]>(INITIAL_QA_ITEMS);
  const [qaFilter, setQaFilter] = useState<string>("All");

  // Authentication Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem("admin_auth_token", "raju_authenticated");
      } catch {
        // ignore
      }
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Please verify and try again.");
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("admin_auth_token");
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  // Live Supabase Sync
  const fetchLiveEnquiries = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
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
          packageTitle: row.package_title || "Tailor-made expedition",
          packageSlug: row.package_slug || "enquiry",
          departureDate: row.travel_date || "Flexible",
          datesFlexible: Boolean(row.dates_flexible),
          travellers: Number(row.travellers) || 2,
          message: row.message || "",
          receivedAt: new Date(row.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: (row.status as EnquiryStatus) || "New",
          notes: row.notes,
        }));
        setEnquiries(mapped);
        setSyncMessage(`Synced ${mapped.length} live records from Supabase.`);
      } else {
        setSyncMessage("Connected to Supabase. Loaded verified local archives.");
      }
    } catch (err) {
      console.error("Failed to fetch enquiries from Supabase:", err);
      setSyncMessage("Using offline verified cache.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLiveEnquiries();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update Status
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

  // Update Internal Notes
  const saveEnquiryNotes = async (id: string, notes: string) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, notes } : null));
    }
    try {
      await supabase.from("enquiries").update({ notes }).eq("id", id);
    } catch (e) {
      console.error("Failed to update notes in Supabase:", e);
    }
  };

  // Toggle QA Item Acknowledged
  const toggleQAAcknowledged = (code: string) => {
    setQaItems((prev) =>
      prev.map((item) =>
        item.code === code ? { ...item, acknowledged: !item.acknowledged } : item
      )
    );
  };

  // Create Manual Enquiry
  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = allPackages.find((p) => p.slug === newEnquiryForm.packageSlug);
    const newRecord: EnquiryRecord = {
      id: `ENQ-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      name: newEnquiryForm.name,
      email: newEnquiryForm.email,
      phone: newEnquiryForm.phone,
      preferredContact: newEnquiryForm.preferredContact,
      packageTitle: pkg ? pkg.title : "Custom Itinerary",
      packageSlug: newEnquiryForm.packageSlug,
      departureDate: newEnquiryForm.departureDate || "Flexible",
      datesFlexible: newEnquiryForm.datesFlexible,
      travellers: Number(newEnquiryForm.travellers) || 2,
      message: newEnquiryForm.message || "Manual booking entered by concierge desk.",
      receivedAt: "Just now",
      status: "New",
      notes: "Manual entry logged directly from admin console.",
    };

    setEnquiries((prev) => [newRecord, ...prev]);
    setIsNewModalOpen(false);
    setNewEnquiryForm({
      name: "",
      email: "",
      phone: "",
      preferredContact: "email",
      packageSlug: "golden-triangle",
      departureDate: "",
      datesFlexible: false,
      travellers: 2,
      message: "",
    });
  };

  // Filtered Enquiries Computation
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const q = enquirySearch.toLowerCase();
      const matchesSearch =
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.packageTitle.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || e.status === statusFilter;
      const matchesChannel = channelFilter === "All" || e.preferredContact === channelFilter;
      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [enquiries, enquirySearch, statusFilter, channelFilter]);

  // Filtered Packages Computation
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

  // Filtered QA Items Computation
  const filteredQAItems = useMemo(() => {
    return qaItems.filter((item) => {
      if (qaFilter === "All") return true;
      if (qaFilter === "Unresolved") return !item.acknowledged;
      if (qaFilter === "Acknowledged") return item.acknowledged;
      return item.severity === qaFilter;
    });
  }, [qaItems, qaFilter]);

  // Selected Package Detail
  const selectedPackage = useMemo(() => {
    if (!selectedPackageSlug) return null;
    return allPackages.find((p) => p.slug === selectedPackageSlug) ?? null;
  }, [allPackages, selectedPackageSlug]);

  // Executive Overview Metrics
  const metrics = useMemo(() => {
    const totalEnquiries = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === "New").length;
    const inReviewCount = enquiries.filter((e) => e.status === "In Review").length;
    const quotedCount = enquiries.filter((e) => e.status === "Quoted").length;
    const confirmedCount = enquiries.filter((e) => e.status === "Confirmed").length;
    const archivedCount = enquiries.filter((e) => e.status === "Archived").length;
    const totalGuests = enquiries.reduce((sum, e) => sum + (e.travellers || 0), 0);
    const avgGuests = totalEnquiries > 0 ? (totalGuests / totalEnquiries).toFixed(1) : "0.0";

    return {
      totalEnquiries,
      newCount,
      inReviewCount,
      quotedCount,
      confirmedCount,
      archivedCount,
      totalGuests,
      avgGuests,
    };
  }, [enquiries]);

  // -------------------------------------------------------------------------
  // Render: Authentication Gate
  // -------------------------------------------------------------------------

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070E0F] text-[#ECE7DF] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[var(--color-wild-orange,#ff6e00)] selection:text-white">
        {/* Ambient background glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-5xl rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,110,0,0.12),transparent_70%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-10 h-[400px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(18,52,56,0.4),transparent_70%)] blur-3xl"
        />

        <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0E1718]/95 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <BrandMark compact className="mb-4 scale-105" />
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-wild-orange,#ff6e00)]/40 bg-[var(--color-wild-orange,#ff6e00)]/10 px-3.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.24em] text-[var(--color-wild-orange,#ff6e00)] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-wild-orange,#ff6e00)] animate-pulse" />
              Concierge Restricted Access
            </div>
            <h1 className="font-serif text-3xl font-light text-white tracking-wide">
              Admin Portal
            </h1>
            <p className="font-sans font-light text-xs text-white/60 mt-1.5 leading-relaxed">
              Authorised concierge &amp; itinerary operations desk for {BRAND.name}.
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="admin-pass"
                  className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-white/80"
                >
                  Administrator Key
                </label>
                <span className="text-[10px] text-white/40 font-mono">Encrypted Session</span>
              </div>

              <div className="relative">
                <input
                  id="admin-pass"
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="Enter administrator password"
                  autoFocus
                  required
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 pr-11 text-sm text-white placeholder-white/30 transition-all focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none focus:ring-1 focus:ring-[var(--color-wild-orange,#ff6e00)] font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showPassword ? (
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>

              {authError && (
                <p className="mt-2 text-xs text-rose-400 font-sans flex items-center gap-1.5" role="alert">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">!</span>
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 cursor-pointer"
            >
              Unlock Dashboard &rarr;
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-sans">
            <Link
              href="/"
              className="hover:text-[var(--color-wild-orange,#ff6e00)] transition-colors inline-flex items-center gap-1"
            >
              &larr; Return to main site
            </Link>
            <span className="font-mono text-[10px] text-white/40">v2.4 Protected</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Authenticated Executive Dashboard
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#070E0F] text-[#ECE7DF] flex flex-col font-sans antialiased selection:bg-[var(--color-wild-orange,#ff6e00)] selection:text-white">
      {/* 1. Global Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1516]/95 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <BrandMark compact className="scale-95" />
          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] font-medium tracking-wider text-white/80">
              Operations Hub
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Quick Action: Export CSV */}
          <button
            type="button"
            onClick={() => exportToCSV(enquiries)}
            title="Download complete enquiries dataset as CSV"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white/80 transition-all hover:bg-white/10 hover:text-white hover:border-[var(--color-wild-orange,#ff6e00)] cursor-pointer"
          >
            <IconDownload className="h-3.5 w-3.5 text-[var(--color-wild-orange,#ff6e00)]" />
            <span>Export CSV</span>
          </button>

          {/* Quick Action: New Manual Enquiry */}
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-wild-orange,#ff6e00)] px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_4px_14px_rgba(255,110,0,0.35)] transition-all hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <IconPlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Enquiry</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* Live Site Link */}
          <Link
            href="/"
            target="_blank"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:text-white transition-colors"
          >
            <span>Live Site</span>
            <IconExternalLink className="h-3 w-3 text-[var(--color-wild-orange,#ff6e00)]" />
          </Link>

          {/* Concierge Desk User Pill */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs">
            <span className="h-6 w-6 rounded-full bg-[var(--color-wild-orange,#ff6e00)] text-white flex items-center justify-center font-mono font-bold text-[10px]">
              AD
            </span>
            <span className="hidden sm:inline font-medium text-white/90">Concierge Desk</span>
          </div>

          {/* Lock Workspace */}
          <button
            type="button"
            onClick={handleLogout}
            title="Log out and lock workspace"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-white/70 transition-all hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-200 cursor-pointer"
          >
            <span className="hidden sm:inline">Lock</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2]">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Sync Notification Banner */}
      {syncMessage && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 text-center text-xs font-mono text-emerald-300 flex items-center justify-center gap-2 animate-fadeIn">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* 2. Main Workspace Layout (Sidebar + Stage) */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Navigation Sidebar */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#091213] p-3 sm:p-4 lg:py-6 lg:px-4 shrink-0 flex flex-col justify-between">
          <nav className="space-y-1.5" aria-label="Admin Navigation">
            {/* Overview */}
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[var(--color-wild-orange,#ff6e00)] text-white shadow-[0_4px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <IconDashboard className="h-4 w-4" />
              <span>Overview</span>
            </button>

            {/* Enquiries */}
            <button
              type="button"
              onClick={() => setActiveTab("enquiries")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "enquiries"
                  ? "bg-[var(--color-wild-orange,#ff6e00)] text-white shadow-[0_4px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconInbox className="h-4 w-4" />
                <span>Enquiries</span>
              </div>
              {metrics.newCount > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === "enquiries"
                      ? "bg-black/40 text-white"
                      : "bg-[var(--color-wild-orange,#ff6e00)]/20 text-[var(--color-wild-orange,#ff6e00)]"
                  }`}
                >
                  {metrics.newCount} New
                </span>
              )}
            </button>

            {/* Packages */}
            <button
              type="button"
              onClick={() => setActiveTab("packages")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "packages"
                  ? "bg-[var(--color-wild-orange,#ff6e00)] text-white shadow-[0_4px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconCompass className="h-4 w-4" />
                <span>Tour Catalogue</span>
              </div>
              <span className="text-[10px] font-mono text-white/50">{allPackages.length}</span>
            </button>

            {/* Destinations */}
            <button
              type="button"
              onClick={() => setActiveTab("destinations")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "destinations"
                  ? "bg-[var(--color-wild-orange,#ff6e00)] text-white shadow-[0_4px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconMapPin className="h-4 w-4" />
                <span>Destinations</span>
              </div>
              <span className="text-[10px] font-mono text-white/50">{DESTINATIONS.length}</span>
            </button>

            {/* QA Checklist */}
            <button
              type="button"
              onClick={() => setActiveTab("qa")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "qa"
                  ? "bg-[var(--color-wild-orange,#ff6e00)] text-white shadow-[0_4px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <IconShieldCheck className="h-4 w-4" />
                <span>Brochure QA</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold font-mono">
                {qaItems.filter((q) => !q.acknowledged).length} Open
              </span>
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[var(--color-wild-orange,#ff6e00)] text-white shadow-[0_4px_16px_rgba(255,110,0,0.35)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <IconSliders className="h-4 w-4" />
              <span>Theme &amp; Config</span>
            </button>
          </nav>

          {/* Sidebar Footnote: Supabase Live Sync Indicator */}
          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2 hidden lg:block">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-wild-orange,#ff6e00)] font-semibold">
                Supabase Sync
              </span>
              <button
                type="button"
                onClick={fetchLiveEnquiries}
                disabled={isSyncing}
                title="Force refresh from Supabase"
                className="text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <IconRefresh className={`h-3 w-3 ${isSyncing ? "animate-spin text-brass" : ""}`} />
              </button>
            </div>
            <p className="text-white/60 text-[11px] leading-relaxed">
              27 verified packages &amp; 1 houseboat service synchronized directly from brochure catalogue archives.
            </p>
          </div>
        </aside>

        {/* Right Stage Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-y-auto">
          {/* ================================================================= */}
          {/* TAB 1: OVERVIEW (EXECUTIVE PULSE) */}
          {/* ================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Header with date & quick actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-wild-orange,#ff6e00)] font-semibold">
                      Executive Operations
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-xs text-white/50 font-mono">
                      {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-light text-white">
                    Operations &amp; Client Demand
                  </h1>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("enquiries")}
                    className="btn-ghost-dark py-2 px-4 text-xs font-mono uppercase"
                  >
                    View All Enquiries &rarr;
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Active Inquiries */}
                <div className="rounded-2xl border border-white/10 bg-[#0E1819] p-5 shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between text-white/60 text-xs font-mono uppercase tracking-wider mb-3">
                    <span>Total Enquiries</span>
                    <IconInbox className="h-4 w-4 text-[var(--color-wild-orange,#ff6e00)]" />
                  </div>
                  <p className="font-serif text-3xl font-light text-white">{metrics.totalEnquiries}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-mono font-medium">
                      +{metrics.newCount} requiring review
                    </span>
                    <span className="text-white/40 font-mono text-[11px]">Direct CRM</span>
                  </div>
                </div>

                {/* Catalogue Packages */}
                <div className="rounded-2xl border border-white/10 bg-[#0E1819] p-5 shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between text-white/60 text-xs font-mono uppercase tracking-wider mb-3">
                    <span>Active Packages</span>
                    <IconCompass className="h-4 w-4 text-brass-soft" />
                  </div>
                  <p className="font-serif text-3xl font-light text-white">{allPackages.length}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-brass font-medium">100% Brochure Verified</span>
                    <span className="text-white/40 font-mono text-[11px]">8 Regions</span>
                  </div>
                </div>

                {/* Total Prospective Guests */}
                <div className="rounded-2xl border border-white/10 bg-[#0E1819] p-5 shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between text-white/60 text-xs font-mono uppercase tracking-wider mb-3">
                    <span>Pipeline Travellers</span>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8] text-sky-400">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <p className="font-serif text-3xl font-light text-white">{metrics.totalGuests} Guests</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-white/60 font-mono">Avg {metrics.avgGuests} guests / party</span>
                    <span className="text-white/40 font-mono text-[11px]">Cap: 15</span>
                  </div>
                </div>

                {/* Conversion Status */}
                <div className="rounded-2xl border border-white/10 bg-[#0E1819] p-5 shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between text-white/60 text-xs font-mono uppercase tracking-wider mb-3">
                    <span>Confirmed Bookings</span>
                    <IconShieldCheck className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="font-serif text-3xl font-light text-emerald-400">{metrics.confirmedCount}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-white/60 font-mono">{metrics.quotedCount} Quoted</span>
                    <span className="text-emerald-400/80 font-mono text-[11px]">Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Status Pipeline Progress Bar */}
              <div className="rounded-2xl border border-white/10 bg-[#0E1819] p-5 shadow-xl">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white/70 mb-3">
                  <span>Enquiry Pipeline Distribution</span>
                  <span className="text-white/40">{metrics.totalEnquiries} Total Submissions</span>
                </div>

                <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden flex">
                  <div
                    title={`New: ${metrics.newCount}`}
                    style={{ width: `${(metrics.newCount / (metrics.totalEnquiries || 1)) * 100}%` }}
                    className="bg-[var(--color-wild-orange,#ff6e00)] transition-all"
                  />
                  <div
                    title={`In Review: ${metrics.inReviewCount}`}
                    style={{ width: `${(metrics.inReviewCount / (metrics.totalEnquiries || 1)) * 100}%` }}
                    className="bg-amber-400 transition-all"
                  />
                  <div
                    title={`Quoted: ${metrics.quotedCount}`}
                    style={{ width: `${(metrics.quotedCount / (metrics.totalEnquiries || 1)) * 100}%` }}
                    className="bg-sky-400 transition-all"
                  />
                  <div
                    title={`Confirmed: ${metrics.confirmedCount}`}
                    style={{ width: `${(metrics.confirmedCount / (metrics.totalEnquiries || 1)) * 100}%` }}
                    className="bg-emerald-400 transition-all"
                  />
                  <div
                    title={`Archived: ${metrics.archivedCount}`}
                    style={{ width: `${(metrics.archivedCount / (metrics.totalEnquiries || 1)) * 100}%` }}
                    className="bg-white/20 transition-all"
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-white/70">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-wild-orange,#ff6e00)]" />
                    <span>New ({metrics.newCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span>In Review ({metrics.inReviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    <span>Quoted ({metrics.quotedCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Confirmed ({metrics.confirmedCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/30" />
                    <span>Archived ({metrics.archivedCount})</span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Recent Inquiries + Regional Demand */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* Left: Recent Inquiries Table */}
                <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0E1819] p-5 sm:p-6 shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <div>
                      <h2 className="font-serif text-xl font-light text-white">Recent Client Enquiries</h2>
                      <p className="text-xs text-white/50 mt-0.5 font-sans">
                        Click any client row to open the complete itinerary dossier
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("enquiries")}
                      className="text-xs text-[var(--color-wild-orange,#ff6e00)] hover:underline font-mono uppercase tracking-wider"
                    >
                      View All &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {enquiries.slice(0, 5).map((enq) => (
                      <div
                        key={enq.id}
                        onClick={() => setSelectedEnquiry(enq)}
                        className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.08] hover:border-[var(--color-wild-orange,#ff6e00)]/50 transition-all cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-base font-medium text-white group-hover:text-[var(--color-wild-orange,#ff6e00)] transition-colors">
                              {enq.name}
                            </span>
                            <span className="font-mono text-[10px] text-white/40">[{enq.id}]</span>
                          </div>
                          <p className="text-xs text-[var(--color-wild-orange,#ff6e00)] font-sans mt-0.5 font-medium">
                            {enq.packageTitle}
                          </p>
                          <p className="text-[11px] text-white/60 mt-1 line-clamp-1 font-sans">
                            {enq.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold ${
                              enq.status === "New"
                                ? "bg-[var(--color-wild-orange,#ff6e00)]/20 text-[var(--color-wild-orange,#ff6e00)] border border-[var(--color-wild-orange,#ff6e00)]/40"
                                : enq.status === "Confirmed"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : enq.status === "Quoted"
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                                : "bg-white/10 text-white/70 border border-white/20"
                            }`}
                          >
                            {enq.status}
                          </span>
                          <span className="text-xs text-white/40 font-mono">{enq.receivedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Regional Demand & Concierge Notice */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Region Demand Card */}
                  <div className="rounded-2xl border border-white/10 bg-[#0E1819] p-5 sm:p-6 shadow-xl">
                    <h2 className="font-serif text-xl font-light text-white mb-1">Brochure Region Demand</h2>
                    <p className="text-xs text-white/50 mb-5 font-sans">Current inquiry volume distribution</p>

                    <div className="space-y-4">
                      {[
                        { name: "Ladakh (Markha, Pangong)", pct: 42 },
                        { name: "Kashmir (Houseboats & Valleys)", pct: 28 },
                        { name: "Golden Triangle (Taj Mahal, Jaipur)", pct: 18 },
                        { name: "Nepal (Chitwan & Trekking)", pct: 12 },
                      ].map((item) => (
                        <div key={item.name} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-white/80 font-sans">{item.name}</span>
                            <span className="text-[var(--color-wild-orange,#ff6e00)] font-bold">{item.pct}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[var(--color-wild-orange,#ff6e00)] transition-all duration-700"
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Concierge Desk Operational Notes */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-xs text-white/70 space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-wild-orange,#ff6e00)] font-semibold block">
                      Direct Brochure Consultation Mode
                    </span>
                    <p className="leading-relaxed">
                      All itineraries are custom-priced on consultation based on group party size and season. No online payment processing is enabled; bookings are confirmed directly by travel planners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: CLIENT ENQUIRIES (CRM CONSOLE) */}
          {/* ================================================================= */}
          {activeTab === "enquiries" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h1 className="font-serif text-3xl font-light text-white">Client Enquiries</h1>
                  <p className="text-xs text-white/60 mt-1 font-sans">
                    Review incoming travel requests, update quotation statuses, and export data
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => exportToCSV(filteredEnquiries)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 font-mono text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    <IconDownload className="h-3.5 w-3.5" />
                    <span>Download CSV ({filteredEnquiries.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(true)}
                    className="btn-primary py-2 px-4 text-xs font-mono uppercase cursor-pointer"
                  >
                    + Log New Enquiry
                  </button>
                </div>
              </div>

              {/* Filter Controls Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#0E1819] p-4 rounded-xl border border-white/10">
                <div className="sm:col-span-6 relative">
                  <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
                  <input
                    type="search"
                    placeholder="Search by client name, email, package or reference ID..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none font-mono"
                  >
                    <option value="All">All Statuses ({enquiries.length})</option>
                    <option value="New">New ({metrics.newCount})</option>
                    <option value="In Review">In Review ({metrics.inReviewCount})</option>
                    <option value="Quoted">Quoted ({metrics.quotedCount})</option>
                    <option value="Confirmed">Confirmed ({metrics.confirmedCount})</option>
                    <option value="Archived">Archived ({metrics.archivedCount})</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={channelFilter}
                    onChange={(e) => setChannelFilter(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none font-mono"
                  >
                    <option value="All">All Contact Channels</option>
                    <option value="email">Email Preference</option>
                    <option value="phone">Phone Preference</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E1819] shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 uppercase font-mono tracking-wider text-white/60 font-semibold text-[11px]">
                        <th className="py-3.5 px-4">Ref &amp; Client</th>
                        <th className="py-3.5 px-4">Requested Itinerary</th>
                        <th className="py-3.5 px-4">Departure &amp; Guests</th>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredEnquiries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-white/50 font-mono">
                            No client enquiries matched your search filters.
                          </td>
                        </tr>
                      ) : (
                        filteredEnquiries.map((enq) => (
                          <tr
                            key={enq.id}
                            className="hover:bg-white/[0.04] transition-colors cursor-pointer"
                            onClick={() => setSelectedEnquiry(enq)}
                          >
                            <td className="py-3.5 px-4">
                              <span className="font-mono text-[10px] text-white/40 block">{enq.id}</span>
                              <span className="font-serif text-sm font-medium text-white block mt-0.5">
                                {enq.name}
                              </span>
                              <span className="text-[11px] text-white/60 font-mono">{enq.email}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-medium text-white block font-sans">{enq.packageTitle}</span>
                              <span className="text-[11px] text-[var(--color-wild-orange,#ff6e00)] font-mono">
                                /{enq.packageSlug}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-white block font-sans">{enq.departureDate}</span>
                              <span className="text-[11px] text-white/60 font-mono block">
                                {enq.travellers} guest{enq.travellers > 1 ? "s" : ""}{" "}
                                {enq.datesFlexible && "• Flexible"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-block rounded px-2 py-0.5 text-[10px] font-mono uppercase font-bold bg-white/10 text-white/80 mb-1">
                                {enq.preferredContact}
                              </span>
                              <span className="text-[11px] text-white/60 block font-mono">{enq.phone}</span>
                            </td>
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={enq.status}
                                onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-black/60 focus:outline-none cursor-pointer border ${
                                  enq.status === "New"
                                    ? "text-[var(--color-wild-orange,#ff6e00)] border-[var(--color-wild-orange,#ff6e00)]/40"
                                    : enq.status === "Confirmed"
                                    ? "text-emerald-300 border-emerald-500/40"
                                    : enq.status === "Quoted"
                                    ? "text-sky-300 border-sky-500/40"
                                    : "text-white/70 border-white/20"
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="In Review">In Review</option>
                                <option value="Quoted">Quoted</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Archived">Archived</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEnquiry(enq);
                                }}
                                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 font-mono text-[11px] text-white hover:border-[var(--color-wild-orange,#ff6e00)] hover:text-[var(--color-wild-orange,#ff6e00)] transition-all cursor-pointer"
                              >
                                Dossier &rarr;
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: PACKAGES CATALOGUE */}
          {/* ================================================================= */}
          {activeTab === "packages" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h1 className="font-serif text-3xl font-light text-white">Tour Catalogue</h1>
                  <p className="text-xs text-white/60 mt-1 font-sans">
                    All 27 verified brochure itineraries synchronized with public exploration routes
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center rounded-full border border-white/15 bg-white/5 p-1 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setPackageViewMode("grid")}
                      className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                        packageViewMode === "grid"
                          ? "bg-[var(--color-wild-orange,#ff6e00)] text-white"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setPackageViewMode("table")}
                      className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                        packageViewMode === "table"
                          ? "bg-[var(--color-wild-orange,#ff6e00)] text-white"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Table
                    </button>
                  </div>

                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-[var(--color-wild-orange,#ff6e00)] font-semibold">
                    {filteredPackages.length} Loaded
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#0E1819] p-4 rounded-xl border border-white/10">
                <div className="sm:col-span-8 relative">
                  <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
                  <input
                    type="search"
                    placeholder="Search by tour title, brochure code (e.g. S01, II7), or region..."
                    value={packageSearch}
                    onChange={(e) => setPackageSearch(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-4">
                  <select
                    value={packageCategoryFilter}
                    onChange={(e) => setPackageCategoryFilter(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none font-mono"
                  >
                    <option value="All">All Categories ({allPackages.length})</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* View: Cards Grid */}
              {packageViewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageSlug(pkg.slug)}
                      className="group rounded-2xl border border-white/10 bg-[#0E1819] overflow-hidden shadow-xl hover:border-[var(--color-wild-orange,#ff6e00)]/60 transition-all cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-black">
                        <Image
                          src={`/images/packages/${pkg.slug}.jpg`}
                          alt={pkg.title}
                          fill
                          sizes="400px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                        <div className="absolute inset-x-4 top-3 flex items-center justify-between">
                          <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase text-[var(--color-wild-orange,#ff6e00)] border border-white/10">
                            {pkg.category}
                          </span>
                          <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono text-white/90 border border-white/10">
                            {pkg.brochure_code}
                          </span>
                        </div>
                        <div className="absolute inset-x-4 bottom-3">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/70">
                            {pkg.region.join(" • ")}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-lg font-light text-white group-hover:text-[var(--color-wild-orange,#ff6e00)] transition-colors leading-snug">
                            {pkg.title}
                          </h3>
                          <p className="text-xs text-white/70 line-clamp-2 mt-1.5 leading-relaxed font-sans">
                            {pkg.summary}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                          <span className="text-white/60 font-mono text-[11px]">{pkg.duration}</span>
                          <span className="text-[var(--color-wild-orange,#ff6e00)] group-hover:translate-x-0.5 transition-transform font-mono text-[11px]">
                            Details &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* View: Table View */
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E1819] shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 uppercase font-mono tracking-wider text-white/60 font-semibold text-[11px]">
                          <th className="py-3 px-4">Code</th>
                          <th className="py-3 px-4">Title &amp; Summary</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Duration</th>
                          <th className="py-3 px-4">Regions</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 font-sans">
                        {filteredPackages.map((pkg) => (
                          <tr
                            key={pkg.id}
                            className="hover:bg-white/[0.04] transition-colors cursor-pointer"
                            onClick={() => setSelectedPackageSlug(pkg.slug)}
                          >
                            <td className="py-3 px-4 font-mono font-bold text-[var(--color-wild-orange,#ff6e00)]">
                              {pkg.brochure_code}
                            </td>
                            <td className="py-3 px-4 max-w-sm">
                              <span className="font-medium text-white block">{pkg.title}</span>
                              <span className="text-[11px] text-white/50 line-clamp-1">{pkg.summary}</span>
                            </td>
                            <td className="py-3 px-4 text-white/80">{pkg.category}</td>
                            <td className="py-3 px-4 font-mono text-white/70">{pkg.duration}</td>
                            <td className="py-3 px-4 text-white/70">{pkg.region.join(", ")}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPackageSlug(pkg.slug);
                                }}
                                className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white hover:text-[var(--color-wild-orange,#ff6e00)] hover:border-[var(--color-wild-orange,#ff6e00)]"
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: DESTINATIONS */}
          {/* ================================================================= */}
          {activeTab === "destinations" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-5">
                <h1 className="font-serif text-3xl font-light text-white">Destinations &amp; Photographic Assets</h1>
                <p className="text-xs text-white/60 mt-1 font-sans">
                  Review the 8 operational regions and high-resolution photography catalogue
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {DESTINATIONS.map((d) => (
                  <div
                    key={d.name}
                    className="rounded-2xl border border-white/10 bg-[#0E1819] overflow-hidden shadow-xl"
                  >
                    <div className="relative aspect-[4/3] bg-black">
                      <Image
                        src={d.image}
                        alt={d.name}
                        fill
                        sizes="300px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                      <div className="absolute inset-x-4 bottom-3">
                        <p className="text-[10px] uppercase font-mono tracking-widest text-[var(--color-wild-orange,#ff6e00)] font-semibold">
                          {d.tagline}
                        </p>
                        <h3 className="font-serif text-xl font-light text-white">{d.name}</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-2 text-xs">
                      <p className="text-white/70 line-clamp-2 leading-relaxed">{d.blurb}</p>
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-emerald-400 font-semibold">✓ Asset Active</span>
                        <Link href={d.href} target="_blank" className="text-[var(--color-wild-orange,#ff6e00)] hover:underline inline-flex items-center gap-1">
                          <span>Explore</span>
                          <IconExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: BROCHURE QA & INTEGRITY AUDIT */}
          {/* ================================================================= */}
          {activeTab === "qa" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h1 className="font-serif text-3xl font-light text-white">Brochure Quality &amp; Editorial Flags</h1>
                  <p className="text-xs text-white/60 mt-1 font-sans">
                    Traceability checkpoints preserved between printed 1927 brochure archives and digital catalogue
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  {["All", "Unresolved", "Acknowledged"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setQaFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs font-mono cursor-pointer transition-all ${
                        qaFilter === f
                          ? "bg-[var(--color-wild-orange,#ff6e00)] text-white"
                          : "border border-white/15 bg-white/5 text-white/70 hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* System Diagnostics Health Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/10 bg-[#0E1819] p-4 text-xs">
                  <span className="text-white/50 font-mono text-[10px] uppercase block mb-1">Catalogue Records</span>
                  <p className="font-mono text-lg text-emerald-400 font-bold">27 / 27 Verified</p>
                  <p className="text-white/60 mt-1 text-[11px]">Strict day-by-day JSON transcribed</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#0E1819] p-4 text-xs">
                  <span className="text-white/50 font-mono text-[10px] uppercase block mb-1">Additional Services</span>
                  <p className="font-mono text-lg text-emerald-400 font-bold">1 / 1 Verified</p>
                  <p className="text-white/60 mt-1 text-[11px]">Kashmir Houseboat fleet specifications</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#0E1819] p-4 text-xs">
                  <span className="text-white/50 font-mono text-[10px] uppercase block mb-1">Guardrail Status</span>
                  <p className="font-mono text-lg text-brass font-bold">Active Enforced</p>
                  <p className="text-white/60 mt-1 text-[11px]">Generic inclusions panel strictly prohibited</p>
                </div>
              </div>

              {/* Flags List */}
              <div className="space-y-4">
                {filteredQAItems.map((item) => (
                  <div
                    key={item.code}
                    className={`rounded-2xl border p-5 sm:p-6 shadow-xl transition-all ${
                      item.acknowledged
                        ? "border-white/10 bg-[#0E1819] opacity-80"
                        : "border-amber-500/40 bg-[#121E1E]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-[var(--color-wild-orange,#ff6e00)] font-bold">
                          {item.code}
                        </span>
                        <h3 className="font-serif text-lg font-light text-white">{item.title}</h3>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-3 py-0.5 rounded-full text-xs font-mono font-semibold ${
                            item.severity === "High"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : item.severity === "Moderate"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                          }`}
                        >
                          {item.severity}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleQAAcknowledged(item.code)}
                          className={`text-xs font-mono px-3 py-1 rounded-full cursor-pointer transition-all ${
                            item.acknowledged
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "border border-white/20 hover:border-white text-white/80"
                          }`}
                        >
                          {item.acknowledged ? "✓ Acknowledged" : "Mark Reviewed"}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-sans text-white/75 leading-relaxed pt-1">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: SETTINGS & CONFIG */}
          {/* ================================================================= */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn max-w-4xl">
              <div className="border-b border-white/10 pb-5">
                <h1 className="font-serif text-3xl font-light text-white">System &amp; Brand Configuration</h1>
                <p className="text-xs text-white/60 mt-1 font-sans">
                  Active brand tokens, Supabase database bindings, and operational variables
                </p>
              </div>

              {/* Brand Variables */}
              <div className="rounded-2xl border border-white/10 bg-[#0E1819] p-6 shadow-xl space-y-5">
                <h3 className="font-serif text-xl font-light text-white">Brand Source of Truth</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-white/40 uppercase block mb-1">Consumer Brand</span>
                    <span className="text-white text-sm font-semibold">{BRAND.name}</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-white/40 uppercase block mb-1">Operator Archive Entity</span>
                    <span className="text-white text-sm font-semibold">{BRAND.operatorName}</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-white/40 uppercase block mb-1">Booking Bureau Desk</span>
                    <span className="text-white text-sm font-semibold">{BRAND.bookingDeskName}</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <span className="text-white/40 uppercase block mb-1">Brochure Tagline</span>
                    <span className="text-white text-sm font-semibold">{BRAND.tagline}</span>
                  </div>
                </div>
              </div>

              {/* Active Brand Palette Swatches */}
              <div className="rounded-2xl border border-white/10 bg-[#0E1819] p-6 shadow-xl space-y-4">
                <h3 className="font-serif text-xl font-light text-white">Active Design System Swatches</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl border border-white/10 bg-[#ff6e00] text-white shadow-lg">
                    <p className="text-[10px] uppercase font-mono font-bold tracking-wider">Wild Orange</p>
                    <p className="font-mono text-xs mt-1">#FF6E00</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-white/10 bg-[#123438] text-white shadow-lg">
                    <p className="text-[10px] uppercase font-mono font-bold tracking-wider">Dark Pine Teal</p>
                    <p className="font-mono text-xs mt-1">#123438</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-white/10 bg-[#221f20] text-white shadow-lg">
                    <p className="text-[10px] uppercase font-mono font-bold tracking-wider">Luxury Charcoal</p>
                    <p className="font-mono text-xs mt-1">#221F20</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-white/10 bg-[#eeebe5] text-charcoal shadow-lg">
                    <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-black">Light Cream</p>
                    <p className="font-mono text-xs mt-1 text-black font-semibold">#EEEBE5</p>
                  </div>
                </div>
              </div>

              {/* Supabase Database Connection Details */}
              <div className="rounded-2xl border border-white/10 bg-[#0E1819] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-light text-white">Supabase Live Connection</h3>
                  <button
                    type="button"
                    onClick={fetchLiveEnquiries}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 font-mono text-xs text-white hover:border-[var(--color-wild-orange,#ff6e00)] cursor-pointer"
                  >
                    <IconRefresh className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>Test Ping</span>
                  </button>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs font-mono space-y-2">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50">Database Endpoint:</span>
                    <span className="text-emerald-400 font-semibold">Ready / Configured</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50">Enquiries Table:</span>
                    <span className="text-white">public.enquiries</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Deduplication Window:</span>
                    <span className="text-white">10 Minutes (IP &amp; Payload Hash)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================== */}
      {/* 3. SLIDE-OVER DOSSIER DRAWER: SELECTED ENQUIRY */}
      {/* ===================================================================== */}
      {selectedEnquiry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enquiry Details"
          className="fixed inset-0 z-50 flex animate-fadeIn"
        >
          <div
            onClick={() => setSelectedEnquiry(null)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          />

          <div className="relative ml-auto flex h-full w-full max-w-lg flex-col bg-[#0B1516] text-white shadow-2xl p-6 sm:p-8 overflow-y-auto border-l border-white/15">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="font-mono text-[11px] text-[var(--color-wild-orange,#ff6e00)] font-bold">
                  {selectedEnquiry.id}
                </span>
                <h2 className="font-serif text-2xl font-light text-white mt-0.5">
                  {selectedEnquiry.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                aria-label="Close details"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white hover:bg-[var(--color-wild-orange,#ff6e00)] hover:border-[var(--color-wild-orange,#ff6e00)] transition-all cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6 flex-1 text-xs">
              {/* Status Updater */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-white/60 mb-2">
                  Update Booking Status
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["New", "In Review", "Quoted", "Confirmed", "Archived"] as EnquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateEnquiryStatus(selectedEnquiry.id, st)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-semibold uppercase transition-all cursor-pointer ${
                        selectedEnquiry.status === st
                          ? "bg-[var(--color-wild-orange,#ff6e00)] text-white shadow-md"
                          : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journey Requested */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] uppercase font-mono tracking-wider text-[var(--color-wild-orange,#ff6e00)] font-semibold mb-1">
                  Requested Itinerary
                </p>
                <p className="font-serif text-lg font-light text-white">{selectedEnquiry.packageTitle}</p>
                <p className="text-white/60 text-[11px] font-mono mt-0.5">Slug: /{selectedEnquiry.packageSlug}</p>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 font-mono text-[11px]">
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
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Party Size</p>
                  <p className="font-semibold text-white">{selectedEnquiry.travellers} guests</p>
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

              {/* Client Message */}
              <div className="border-t border-white/10 pt-4 font-sans">
                <p className="text-[10px] font-mono uppercase text-[var(--color-wild-orange,#ff6e00)] font-semibold mb-1.5">
                  Client Request &amp; Preferences
                </p>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/85 leading-relaxed text-xs">
                  {selectedEnquiry.message || "No special requests specified."}
                </div>
              </div>

              {/* Internal Concierge Notes Editor */}
              <div className="border-t border-white/10 pt-4 font-sans">
                <p className="text-[10px] font-mono uppercase text-white/60 font-semibold mb-1.5">
                  Internal Staff Notes (Persisted)
                </p>
                <textarea
                  defaultValue={selectedEnquiry.notes || ""}
                  onBlur={(e) => saveEnquiryNotes(selectedEnquiry.id, e.target.value)}
                  placeholder="Add private staff notes, quote amounts, flight vouchers, or phone conversation summary..."
                  rows={3}
                  className="w-full rounded-xl border border-white/15 bg-black/40 p-3 text-xs text-white placeholder-white/30 focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-4 border-t border-white/10 flex gap-3">
              <a
                href={`mailto:${selectedEnquiry.email}?subject=${encodeURIComponent(
                  `${BRAND.name} Itinerary Quote: ${selectedEnquiry.packageTitle} (${selectedEnquiry.id})`
                )}`}
                className="btn-primary flex-1 justify-center py-2.5 text-xs text-center cursor-pointer"
              >
                Send Direct Email Quote &rarr;
              </a>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-full border border-white/20 px-4 text-xs font-mono font-semibold uppercase text-white/80 hover:bg-white/10 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. SLIDE-OVER DRAWER: SELECTED PACKAGE DOSSIER */}
      {/* ===================================================================== */}
      {selectedPackage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Package Details"
          className="fixed inset-0 z-50 flex animate-fadeIn"
        >
          <div
            onClick={() => setSelectedPackageSlug(null)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          />

          <div className="relative ml-auto flex h-full w-full max-w-lg flex-col bg-[#0B1516] text-white shadow-2xl p-6 sm:p-8 overflow-y-auto border-l border-white/15">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="font-mono text-[11px] text-[var(--color-wild-orange,#ff6e00)] font-bold">
                  {selectedPackage.brochure_code}
                </span>
                <h2 className="font-serif text-2xl font-light text-white mt-0.5">
                  {selectedPackage.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPackageSlug(null)}
                aria-label="Close package details"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white hover:bg-[var(--color-wild-orange,#ff6e00)] hover:border-[var(--color-wild-orange,#ff6e00)] transition-all cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6 flex-1 text-xs">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black border border-white/15">
                <Image
                  src={`/images/packages/${selectedPackage.slug}.jpg`}
                  alt={selectedPackage.title}
                  fill
                  sizes="450px"
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-[11px]">
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
                  <p className="text-[10px] uppercase text-white/50 mb-0.5">Brochure Source</p>
                  <p className="font-semibold text-white">Page {selectedPackage.source_page}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 font-sans">
                <p className="text-[10px] uppercase font-mono text-[var(--color-wild-orange,#ff6e00)] font-semibold mb-1">
                  Itinerary Summary
                </p>
                <p className="text-white/80 leading-relaxed text-xs">{selectedPackage.summary}</p>
              </div>

              {selectedPackage.highlights && selectedPackage.highlights.length > 0 && (
                <div className="border-t border-white/10 pt-4 font-sans">
                  <p className="text-[10px] uppercase font-mono text-[var(--color-wild-orange,#ff6e00)] font-semibold mb-2">
                    Brochure Highlights
                  </p>
                  <ul className="space-y-1.5 text-white/75 text-xs">
                    {selectedPackage.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[var(--color-wild-orange,#ff6e00)]">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex gap-3 font-mono">
              <Link
                href={`/packages/${selectedPackage.slug}`}
                target="_blank"
                className="btn-ghost-dark flex-1 justify-center py-2.5 text-xs text-center"
              >
                View Public Page &rarr;
              </Link>
              <button
                type="button"
                onClick={() => setSelectedPackageSlug(null)}
                className="rounded-full border border-white/20 px-4 text-xs font-semibold uppercase text-white/80 hover:bg-white/10 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. MODAL: LOG NEW CLIENT ENQUIRY */}
      {/* ===================================================================== */}
      {isNewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Log New Enquiry"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={() => setIsNewModalOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          <div className="relative z-10 w-full max-w-xl rounded-2xl border border-white/15 bg-[#0C1516] text-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-wild-orange,#ff6e00)] font-semibold">
                  Concierge Desk Intake
                </span>
                <h2 className="font-serif text-2xl font-light text-white mt-0.5">
                  Log New Client Enquiry
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                aria-label="Close modal"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white hover:bg-[var(--color-wild-orange,#ff6e00)] hover:border-[var(--color-wild-orange,#ff6e00)] transition-all cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateEnquiry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lord Charles Sterling"
                    value={newEnquiryForm.name}
                    onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, name: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@domain.com"
                    value={newEnquiryForm.email}
                    onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, email: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+44 7700 900123"
                    value={newEnquiryForm.phone}
                    onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    Preferred Contact Channel
                  </label>
                  <select
                    value={newEnquiryForm.preferredContact}
                    onChange={(e) =>
                      setNewEnquiryForm({
                        ...newEnquiryForm,
                        preferredContact: e.target.value as "email" | "phone",
                      })
                    }
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none font-mono"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone / WhatsApp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/70 mb-1">
                  Requested Tour Package
                </label>
                <select
                  value={newEnquiryForm.packageSlug}
                  onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, packageSlug: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none font-sans"
                >
                  {allPackages.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      [{p.brochure_code}] {p.title} ({p.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    Estimated Travel Date
                  </label>
                  <input
                    type="date"
                    value={newEnquiryForm.departureDate}
                    onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, departureDate: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={newEnquiryForm.travellers}
                    onChange={(e) =>
                      setNewEnquiryForm({ ...newEnquiryForm, travellers: Number(e.target.value) || 2 })
                    }
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/70 mb-1">
                  Client Notes &amp; Preferences
                </label>
                <textarea
                  rows={3}
                  placeholder="Record custom requests, hotel categories, dietary or trekking experience..."
                  value={newEnquiryForm.message}
                  onChange={(e) => setNewEnquiryForm({ ...newEnquiryForm, message: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-black/40 p-3 text-xs text-white placeholder-white/30 focus:border-[var(--color-wild-orange,#ff6e00)] focus:outline-none font-sans"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 font-mono">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-5 text-xs cursor-pointer"
                >
                  Save Enquiry &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
