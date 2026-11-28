export const instant = false;
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CreateCmsDocument from "@/components/cms/CreateCmsDocument";

export default async function NewPackagePage() {
  const { role } = await requireCmsAdminPage();
  return <div><h1 className="mb-5 font-serif text-3xl">Add New Package</h1><CreateCmsDocument type="package" titleLabel="Package name" redirectTo="/admin/packages/{id}" defaultData={{ category: "", destination: "", destinationSlug: "", region: [], regionName: "", brochure_code: "", summary: "", shortDescription: "", fullDescription: "", duration: "", durationDays: null, durationNights: null, difficulty: null, tourType: "", bestSeason: "", featured: false, status: "draft", source_page: 0, content_flags: [], highlights: [], itinerary: [], itineraryVisible: true, inclusions: [], exclusions: [], inclusionsVisible: true, exclusionsVisible: true, pricing: { basePrice: null, currency: "", priceBasis: "per_person", childPrice: null, seasonalPricing: [], customPricingNotes: "", startingPriceDisplay: "", showPricing: false, showStartingPrice: false }, heroImage: "", thumbnail: "", coverImage: "", media: [], startingPoint: "", endingPoint: "", transportation: "", accommodationDetails: "", importantInformation: "", cancellationPolicy: "", faqs: [], relatedPackages: [], seo: {} }} developer={role === "developer"} /></div>;
}
