import PageHero from "@/components/ui/PageHero";

/**
 * Wilderness-style cinematic hero for the houseboats page:
 * full-bleed landscape, coordinate motif, oversized serif title and a
 * single pair of actions over the image.
 */
export default function HouseboatHero() {
  return (
    <PageHero
      align="left"
      height="full"
      image="/images/services/houseboats.jpg"
      imageStyle={{ transform: "scale(1.1)" }}
      imageAlt="A shikara crossing Dal Lake in Srinagar towards the carved houseboats moored along the far shore in the morning mist"
      eyebrow="Srinagar · Kashmir"
      title={
        <>
          Houseboats
          <span className="block text-white/60">on Nigeen Lake</span>
        </>
      }
      lead="Booking access to carved cedar houseboats on Dal and Nagin Lake — from a two-bedroom craft to a seven-bedroom houseboat hired in sole use, for solo travellers, small groups or a family party."
      meta={[{ value: "34.0837° N, 74.7973° E", label: "Dal Lake, Srinagar" }]}
      primaryCta={{ label: "Enquire now", href: "/enquiry?service=houseboats" }}
      secondaryCta={{ label: "What a stay includes", href: "#houseboat-stay" }}
      scrollCue
    />
  );
}
