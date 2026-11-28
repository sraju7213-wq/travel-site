"use client";

import Link from "next/link";
import { useCms } from "@/components/cms/CmsProvider";
import { safeCmsHref } from "@/lib/safeCmsHref";

export default function PromotionalAnnouncement() { const { settings } = useCms(); const announcement = settings.announcement; if (!announcement.visible || !announcement.text) return null; return <aside className="border-b border-white/10 bg-[var(--color-brass)] px-4 py-2 text-center text-sm text-[#0c1617]" aria-label="Promotional announcement"><span>{String(announcement.text)}</span>{announcement.href && announcement.ctaLabel && <Link href={safeCmsHref(String(announcement.href))} className="ml-3 underline">{String(announcement.ctaLabel)}</Link>}</aside>; }
