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
      image="/images/services/houseboat-hero.jpg"
      imageStyle={{ transform: "scale(1.02)" }}
      imageAlt="A carved cedar houseboat moored on Dal Lake in Srinagar in the morning mist"
      contentClassName="text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] md:ml-auto md:mr-8 md:w-[44%] md:text-left lg:w-[42%] xl:w-[40%]"
      titleClassName="text-[2.5rem] sm:text-5xl md:text-5xl lg:text-[4rem] xl:text-[4.75rem]"
      eyebrow="Srinagar · Kashmir"
      title={
        <>
          Houseboats
          <span className="block text-white/70">on Dal &amp; Nigeen Lakes</span>
        </>
      }
      lead="Booking access to carved cedar houseboats on Dal and Nigeen Lake — from a two-bedroom craft to a seven-bedroom houseboat hired in sole use, for solo travellers, small groups or a family party."
      meta={[{ value: "34.0837° N, 74.7973° E", label: "Dal & Nigeen Lakes, Srinagar" }]}
      primaryCta={{ label: "Enquire now", href: "/enquiry?service=houseboats" }}
      secondaryCta={{ label: "What a stay includes", href: "#houseboat-stay" }}
      scrollCue
    />
  );
}
