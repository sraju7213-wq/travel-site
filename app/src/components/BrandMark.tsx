"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/data/brandConfig";
import { useCmsSettings } from "@/components/cms/CmsProvider";

interface BrandMarkProps { className?: string; compact?: boolean; variant?: "header" | "footer" }

export default function BrandMark({ className = "", compact = false, variant = "header" }: BrandMarkProps) {
  const settings = useCmsSettings();
  const name = settings.branding.name || BRAND.name;
  const logo = variant === "footer" ? settings.branding.footerLogo || settings.branding.headerLogo || "/logo.png" : settings.branding.headerLogo || "/logo.png";
  const alt = variant === "footer" ? settings.branding.footerLogoAlt || name : settings.branding.headerLogoAlt || name;
  return <Link href="/" className={`group inline-flex min-h-[44px] items-center transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-none ${className}`} aria-label={`${name} — Home`}>
    {logo ? <span className={`relative block aspect-[3/1] ${compact ? "h-7" : "h-9 md:h-11"} transition-transform duration-300 group-hover:scale-105`}><Image src={logo} alt={alt} fill priority sizes="(min-width: 768px) 132px, 108px" className="object-contain object-center" /></span> : <span className="font-serif text-lg">{name}</span>}
  </Link>;
}
