import Link from "next/link";
import Image from "next/image";
import { draftMode } from "next/headers";
import PackageCard from "@/components/PackageCard";
import CtaZoom from "@/components/CtaZoom";
import DiscoverSection from "@/components/DiscoverSection";
import { getCmsDocuments } from "@/lib/cmsDocuments";
import type { CmsCta, CmsDocument, CmsDestination, CmsSection } from "@/types/cms";
import type { PackageViewModel } from "@/types/travel";
import { safeCmsHref } from "@/lib/safeCmsHref";

function Cta({ cta, className = "" }: { cta?: CmsCta; className?: string }) {
  if (!cta || cta.visible === false || !cta.label || !cta.href) return null;
  return <Link href={safeCmsHref(cta.href)} target={cta.target === "_blank" ? "_blank" : undefined} rel={cta.target === "_blank" ? "noopener noreferrer" : undefined} className={`inline-flex min-h-11 items-center justify-center rounded-button bg-[var(--cms-button-background,var(--color-wild-orange))] px-5 py-3 text-sm font-semibold text-[var(--cms-button-text,#0c1617)] ${className}`}>{cta.label}</Link>;
}

function dataOf<T>(document: CmsDocument<T>, preview: boolean): T { return preview ? document.draftData : document.publishedData ?? document.draftData; }
function destinationImage(destination: CmsDestination): string { return destination.heroImage || destination.image || ""; }
function destinationHref(destination: CmsDestination): string { return safeCmsHref(typeof destination.href === "string" ? destination.href : `/destinations/${destination.slug ?? destination.name}`, "/destinations"); }

export default async function CmsSectionRenderer({ section, packages = [], destinations = [] }: { section: CmsSection; packages?: PackageViewModel[]; destinations?: CmsDestination[] }) {
  if (section.visible === false) return null;
  const { isEnabled: preview } = await draftMode();
  const heading = section.heading ?? "";
  const description = section.description ?? "";
  const image = section.image || section.backgroundImage || "";
  const imageAlt = section.imageAlt ?? "";
  const textAlign = section.textAlign === "center" ? "text-center" : section.textAlign === "right" ? "text-right" : "text-left";
  const style = { minHeight: section.height || undefined, backgroundColor: section.backgroundColor || undefined, backgroundImage: section.backgroundImage && section.type !== "full-width-image" ? `url(${JSON.stringify(section.backgroundImage)})` : undefined, backgroundSize: "cover", backgroundPosition: section.backgroundPosition || `${((section.focalPoint?.x ?? 0.5) * 100).toFixed(0)}% ${((section.focalPoint?.y ?? 0.5) * 100).toFixed(0)}%`, color: undefined };
  const wrapperClass = `relative isolate w-full overflow-hidden px-5 py-16 md:px-8 md:py-24 ${textAlign}`;

  if (section.type === "full-width-image") return <section id={section.id} className="w-full" aria-label={imageAlt || heading || undefined}>{image ? <img src={image} alt={imageAlt} className="h-auto w-full object-cover" style={{ objectPosition: `${((section.focalPoint?.x ?? 0.5) * 100).toFixed(0)}% ${((section.focalPoint?.y ?? 0.5) * 100).toFixed(0)}%`, minHeight: section.height }} loading="lazy" /> : null}{heading || description ? <div className="p-5"><h2 className="font-serif text-2xl">{heading}</h2><p className="mt-2 text-sm text-white/65">{description}</p></div> : null}</section>;

  if (section.type === "image-gallery") {
    const images = (section.images ?? []).filter((item) => item.visible !== false && item.url);
    return <section id={section.id} className={wrapperClass} style={style}><SectionHeading section={section} /><div className={`mx-auto mt-8 grid max-w-[1240px] gap-3 ${section.layout === "three-column" ? "sm:grid-cols-2 lg:grid-cols-3" : section.layout === "four-column" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>{images.map((item, index) => <figure key={item.id ?? `${item.url}-${index}`} className="overflow-hidden rounded-image"><img src={item.url} alt={item.alt ?? ""} className="aspect-[4/3] w-full object-cover" style={{ objectPosition: `${((item.focalPoint?.x ?? 0.5) * 100).toFixed(0)}% ${((item.focalPoint?.y ?? 0.5) * 100).toFixed(0)}%` }} loading="lazy" />{item.caption && <figcaption className="p-2 text-xs text-white/60">{item.caption}</figcaption>}</figure>)}</div></section>;
  }

  if (section.type === "package-grid") {
    const selected = section.packages?.length ? packages.filter((pkg) => section.packages?.includes(pkg.slug)) : packages;
    const ordered = section.packages?.length ? [...selected].sort((a, b) => (section.packages ?? []).indexOf(a.slug) - (section.packages ?? []).indexOf(b.slug)) : selected;
    const limit = section.packageLimit && section.packageLimit > 0 ? section.packageLimit : ordered.length;
    return <section id={section.id} className={wrapperClass} style={style}><SectionHeading section={section} /><div className="mx-auto mt-8 grid max-w-[1240px] gap-5 md:grid-cols-2 xl:grid-cols-3">{ordered.slice(0, limit).map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}</div>{!ordered.length && <p className="mt-5 text-sm text-white/50">No published packages are selected.</p>}</section>;
  }

  if (section.type === "destination-grid") {
    const selected = section.destinations?.length ? destinations.filter((destination) => section.destinations?.includes(destination.slug ?? "")) : destinations;
    const limit = section.destinationLimit && section.destinationLimit > 0 ? section.destinationLimit : selected.length;
    return <section id={section.id} className={wrapperClass} style={style}><SectionHeading section={section} /><div className="mx-auto mt-8 grid max-w-[1240px] gap-5 md:grid-cols-2 lg:grid-cols-3">{selected.slice(0, limit).map((destination) => <article key={destination.slug ?? destination.name} className="overflow-hidden rounded-card border border-white/10 bg-white/5">{destinationImage(destination) && <Image src={destinationImage(destination)} alt={destination.imageAlt ?? destination.name} width={1200} height={800} className="aspect-[3/2] w-full object-cover" />}<div className="p-4"><h3 className="font-serif text-xl">{destination.name}</h3>{(destination.shortDescription || destination.tagline || destination.description) && <p className="mt-2 text-sm text-white/60">{destination.shortDescription || destination.tagline || destination.description}</p>}<Link href={destinationHref(destination)} className="mt-3 inline-block text-sm text-[#e5b99b]">Explore destination</Link></div></article>)}</div></section>;
  }

  if (section.type === "statistics") {
    if (section.variant === "discover") return <DiscoverSection stats={(section.stats ?? []).map((stat) => ({ value: stat.value, label: stat.label, note: stat.note ?? "" }))} />;
    const stats = (section.stats ?? []).filter((stat) => stat.visible !== false);
    return <section id={section.id} className={wrapperClass} style={style}><SectionHeading section={section} /><div className="mx-auto mt-8 grid max-w-[1240px] grid-cols-2 gap-4 lg:grid-cols-4">{stats.map((stat, index) => <div key={`${stat.label}-${index}`} className="rounded-card border border-white/10 p-4"><p className="font-serif text-3xl">{stat.value}</p><p className="mt-1 text-sm font-semibold">{stat.label}</p>{stat.note && <p className="mt-1 text-xs text-white/55">{stat.note}</p>}</div>)}</div></section>;
  }

  if (section.type === "faq") {
    let faqs = (section.faqs ?? []).filter((faq) => faq.visible !== false);
    if (!faqs.length) {
      const documents = await getCmsDocuments<{ question?: string; answer?: string; visible?: boolean }>("faq", preview);
      faqs = documents.map((doc) => dataOf(doc, preview)).filter((faq) => faq.visible !== false && faq.question && faq.answer).map((faq) => ({ question: faq.question!, answer: faq.answer! }));
    }
    return <section id={section.id} className={wrapperClass} style={style}><SectionHeading section={section} /><div className="mx-auto mt-8 max-w-3xl divide-y divide-white/10 border-y border-white/10">{faqs.map((faq, index) => <details key={`${faq.question}-${index}`} className="py-5"><summary className="cursor-pointer font-serif text-lg">{faq.question}</summary><p className="mt-3 text-sm leading-relaxed text-white/65">{faq.answer}</p></details>)}</div></section>;
  }

  if (section.type === "testimonials") {
    let testimonials = (section.testimonials ?? []).filter((testimonial) => testimonial.visible !== false);
    if (!testimonials.length) {
      const documents = await getCmsDocuments<Record<string, unknown>>("testimonial", preview);
      testimonials = documents.map((doc) => dataOf(doc, preview)).filter((item) => item.visible !== false && typeof item.quote === "string" && typeof item.name === "string").map((item) => ({ name: item.name as string, quote: item.quote as string, role: typeof item.role === "string" ? item.role : undefined, location: typeof item.location === "string" ? item.location : undefined, image: typeof item.image === "string" ? item.image : undefined, visible: true }));
    }
    return <section id={section.id} className={wrapperClass} style={style}><SectionHeading section={section} /><div className="mx-auto mt-8 grid max-w-[1240px] gap-5 md:grid-cols-2 lg:grid-cols-3">{testimonials.map((testimonial, index) => <figure key={testimonial.id ?? `${testimonial.name}-${index}`} className="rounded-card border border-white/10 p-5"><blockquote className="font-serif text-lg leading-relaxed">“{testimonial.quote}”</blockquote><figcaption className="mt-4 text-sm text-white/65"><strong>{testimonial.name}</strong>{(testimonial.role || testimonial.location) && <span className="block">{[testimonial.role, testimonial.location].filter(Boolean).join(" · ")}</span>}</figcaption></figure>)}</div></section>;
  }

  if (section.type === "promotional-banner" || section.type === "cta") return <CtaZoom image={image || null} imageAlt={imageAlt} eyebrow={section.eyebrow ?? ""} title={heading} body={description || section.subheading || ""} ctaLabel={section.ctaPrimary?.visible === false ? "" : section.ctaPrimary?.label ?? ""} ctaHref={safeCmsHref(section.ctaPrimary?.href)} />;

  const imageFirst = section.layout === "left";
  const text = <div><SectionHeading section={section} /><Cta cta={section.ctaPrimary} className="mt-5" />{section.ctaSecondary?.visible !== false && section.ctaSecondary?.label && <Link href={safeCmsHref(section.ctaSecondary.href)} className="mt-3 inline-flex min-h-11 items-center px-2 text-sm underline">{section.ctaSecondary.label}</Link>}</div>;
  const media = image ? <div className="relative min-h-64 overflow-hidden rounded-image bg-black/20"><img src={image} alt={imageAlt} className="h-full w-full object-cover" style={{ objectPosition: `${((section.focalPoint?.x ?? 0.5) * 100).toFixed(0)}% ${((section.focalPoint?.y ?? 0.5) * 100).toFixed(0)}%` }} loading="lazy" /></div> : null;
  return <section id={section.id} className={wrapperClass} style={style}>{section.overlay ? <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-black" style={{ opacity: section.overlay }} /> : null}<div className={`relative z-10 mx-auto grid max-w-[1240px] items-center gap-8 ${media ? "md:grid-cols-2" : ""}`}>{imageFirst ? <>{media}{text}</> : <>{text}{media}</>}</div></section>;
}

function SectionHeading({ section }: { section: CmsSection }) { return <div className="mx-auto max-w-3xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e5b99b]">{section.eyebrow}</p><h2 className="font-serif text-3xl font-light md:text-4xl">{section.heading}</h2><p className="mt-3 text-sm leading-relaxed text-white/60">{section.subheading}</p><p className="mt-3 text-base leading-relaxed text-white/65">{section.description}</p></div>; }
