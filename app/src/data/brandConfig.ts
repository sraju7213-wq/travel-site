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
   * Published Booking Bureau and corporate details from Preview Brouchure.pdf (page 10).
   */
  bookingOffice: {
    name: "Asian Bazaar / India Nepal Travel Centre",
    legalName: "Asian Bazaar",
    address: "68 Beauchamp St., Wiley Park, NSW 2195, Australia",
    phoneMobile: "0409 155 229",
    phoneLandline: "02 9579 0044",
    email: "indianepaltravel@yahoo.com.au",
    altEmail: "asianbazaar@live.com.au",
    websites: [
      "www.indianepaltravel.com",
      "www.asianbazaar.org",
      "www.exportofindia.com",
    ],
    deposit: "$200 per person (non-refundable deposit)",
    amendmentFee: "$25 per amendment",
  },
  /**
   * Official Grade and Activity Level definitions from Preview Brouchure.pdf (page 2).
   */
  grades: [
    {
      grade: "Easy",
      description: "Suitable for beginners. Relaxed walks on good paths, 6–12 km per day, up to 2,500 m altitude.",
      altitude: "Up to 2,500m",
      dailyDistance: "6–12 km/day",
    },
    {
      grade: "Moderate",
      description: "Requires reasonable fitness. Some steep ascents and descents, 6–12 km per day, up to 4,200 m altitude.",
      altitude: "Up to 4,200m",
      dailyDistance: "6–12 km/day",
    },
    {
      grade: "Demanding",
      description: "For experienced hill-walkers. Challenging terrain and longer days, 10–15 km per day, up to 4,500 m altitude.",
      altitude: "Up to 4,500m",
      dailyDistance: "10–15 km/day",
    },
    {
      grade: "Strenuous",
      description: "For very fit, experienced trekkers. Difficult terrain, high passes and possible rope use, 10–15 km per day, up to 5,500 m altitude.",
      altitude: "Up to 5,500m",
      dailyDistance: "10–15 km/day",
    },
  ],
  /**
   * Published booking conditions and cancellation schedule from Preview Brouchure.pdf (page 10).
   */
  bookingConditions: {
    deposit: "$200 non-refundable deposit upon booking",
    finalPayment: "Due no later than 8 weeks prior to departure",
    cancellationSchedule: [
      { window: "More than 8 weeks prior", penalty: "30% of holiday price deposit" },
      { window: "Less than 8 weeks prior", penalty: "45% of holiday price deposit" },
      { window: "Less than 4 weeks prior", penalty: "60% of holiday price deposit" },
      { window: "Less than 7 days prior", penalty: "No refund (100% forfeiture)" },
    ],
    amendments: "$25 administration charge per amendment",
    surchargesPolicy: "Surcharges kept to a minimum; fluctuations over 10% absorbed or refundable if cancelled within 7 days",
    insuranceRequirement: "Comprehensive travel and medical insurance is a mandatory condition of booking",
  },
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
