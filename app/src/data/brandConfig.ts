/**
 * Brand Configuration & Trust Claims Source of Truth
 *
 * Provides a single, maintainable reference for:
 * 1. Consumer display brand ("KS World Adventure" — from logo & repository identity)
 * 2. Heritage expedition operator ("India Nepal Travel Organisation" — from brochure archives)
 * 3. Booking bureau identity ("India Nepal Travel Centre" — from historical brochure text)
 * 4. Factual, qualified definitions for "Since 1927", "Guaranteed Departures", and fleet/office claims.
 *
 * NOTE: The exact corporate/legal relationship between these names is pending
 * owner confirmation. Do NOT invent legal corporate links or registration numbers.
 */

export const BRAND = {
  /**
   * Primary public consumer brand as displayed on the logo mark.
   */
  name: "KS World Adventure",

  /**
   * Historical expedition operator name transcribed from the printed brochure.
   */
  operatorName: "India Nepal Travel Organisation",

  /**
   * Historical booking desk name referenced in the printed brochure.
   */
  bookingDeskName: "India Nepal Travel Centre",

  /**
   * Composite site title used for HTML metadata and page titles.
   */
  compositeTitle: "KS World Adventure — India Nepal Travel Organisation",

  /**
   * Legal entity name placeholder (pending site owner confirmation).
   */
  legalEntityPlaceholder:
    "[Owner to confirm: Registered corporate entity name and jurisdiction]",

  /**
   * Tagline derived from brochure founding heritage.
   */
  tagline: "Specialist Travel Across India & Nepal Since 1927",

  /**
   * Factual qualification for the "Since 1927" heritage claim.
   */
  heritageClaim: {
    label: "Heritage Since 1927",
    summary:
      "Grounded in the Baktoo family's pioneering tourism operations in Kashmir and Northern India dating back to 1927.",
    fullText:
      "The itineraries in our catalogue descend from the pioneering tourism work of Haji Mohammed Sultan Baktoo, who began operating treks and houseboat hospitality in Kashmir and Northern India in 1927.",
  },

  /**
   * Factual qualification for the "Guaranteed Departures" claim.
   */
  guaranteedDepartureClaim: {
    shortBadge: "No Minimum Group Quota",
    cardBadge: "Guaranteed Departure*",
    summary:
      "Tours run for solo travellers or small private groups without minimum passenger cancellations, subject to mountain weather safety.",
    termsExplanation:
      "*Guaranteed departure policy: Itineraries do not depend on minimum group quotas and depart with as few as 1–2 travellers. All high-altitude trekking and road journeys remain subject to mountain pass conditions, weather safety, and regulatory permits.",
  },

  /**
   * Factual qualification for operator offices and fleet claims.
   */
  officesAndFleetClaim: {
    summary:
      "Brochure records describe historical hubs in Delhi, Kashmir and Ladakh, and M.S. Baktoo houseboats on Dal Lake. Current verified street addresses are pending owner publication.",
    disclaimer:
      "Office locations in Delhi, Srinagar and Leh, vehicle fleets, and overseas representatives are transcribed from brochure records. Current physical addresses and licensing credentials are being verified with the business owner prior to full commercial rollout.",
  },

  /**
   * List of specific questions requiring owner confirmation before launch.
   */
  ownerConfirmationsRequired: [
    {
      topic: "Brand Hierarchy & Relationship",
      question:
        "Is 'KS World Adventure' the primary trading brand, with 'India Nepal Travel Organisation' as the operating entity, or are they distinct joint-venture businesses?",
    },
    {
      topic: "Historical Booking Desk",
      question:
        "Should 'India Nepal Travel Centre' be retained as an active booking desk reference, or should all inquiries reference 'KS World Adventure Concierge Desk'?",
    },
    {
      topic: "KHE Acronym Definition",
      question:
        "What is the official expanded name of 'KHE' (referenced on the About page), and should it be displayed publicly alongside the Baktoo family history?",
    },
    {
      topic: "Guaranteed Departures Terms",
      question:
        "What are the exact contractual conditions under which departures are guaranteed (e.g. minimum 1 person, cancellation refund terms in case of road closures or high-altitude weather)?",
    },
    {
      topic: "Fleet & Property Assets",
      question:
        "Which specific vehicle fleets, hotel affiliations, and houseboats (e.g., M.S. Baktoo group) are currently owned or contracted under the live operating entity?",
    },
    {
      topic: "Tour Leader Origin",
      question:
        "Does the brochure claim that 'all special-interest tours are escorted by a team leader from Australia' apply to all bookings today, or should it state 'qualified expedition leaders'?",
    },
    {
      topic: "Corporate & Licensing Details",
      question:
        "What are the official legal entity name, corporate registration number, tourism license number, and registered office address?",
    },
  ],
} as const;
