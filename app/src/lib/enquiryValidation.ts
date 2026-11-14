/**
 * Shared validation for the enquiry and newsletter forms.
 *
 * Pure functions only — no environment access, no secrets. Imported by both the
 * client form components and the server route handlers, so the client can give
 * immediate feedback while the server still validates every field itself.
 */

export interface EnquiryPayload {
  enquiryType: "package" | "custom";
  packageSlug: string | null;
  packageTitle: string | null;
  fullName: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone";
  travelDate: string;
  datesFlexible: boolean;
  travellers: string;
  message: string;
  consent: boolean;
  /** Honeypot — must stay empty. */
  website: string;
}

export interface NewsletterPayload {
  firstName: string;
  surname: string;
  email: string;
  country: string;
  consent: boolean;
  /** Honeypot — must stay empty. */
  website: string;
}

export const MAX_MESSAGE_LENGTH = 2000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED = /^[0-9+()\-/.\s]+$/;

function trimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** ISO `YYYY-MM-DD` string for today in UTC, used for date comparisons. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function validateEnquiry(input: Partial<EnquiryPayload>): Record<string, string> {
  const errors: Record<string, string> = {};

  const fullName = trimmed(input.fullName);
  if (!fullName) {
    errors.fullName = "Please enter your full name.";
  } else if (fullName.length < 2) {
    errors.fullName = "Please enter your full name (at least 2 characters).";
  } else if (fullName.length > 100) {
    errors.fullName = "Please enter a shorter name (100 characters maximum).";
  }

  const email = trimmed(input.email);
  if (!email) {
    errors.email = "Please enter an email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  } else if (email.length > 254) {
    errors.email = "Please enter a shorter email address.";
  }

  const phone = trimmed(input.phone);
  if (!phone) {
    errors.phone = "Please enter a phone number.";
  } else if (!PHONE_ALLOWED.test(phone)) {
    errors.phone = "Please enter a phone number using digits, spaces and + ( ) - only.";
  } else {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7) {
      errors.phone = "Please enter a complete phone number (at least 7 digits).";
    } else if (digits.length > 20) {
      errors.phone = "Please enter a shorter phone number (20 digits maximum).";
    }
  }

  const travellers = trimmed(input.travellers);
  if (!travellers) {
    errors.travellers = "Please let us know the number of travellers.";
  } else if (!/^\d+$/.test(travellers)) {
    errors.travellers = "Please enter a whole number of travellers.";
  } else {
    const count = Number(travellers);
    if (count < 1) {
      errors.travellers = "Please enter at least 1 traveller.";
    } else if (count > 50) {
      errors.travellers = "Please contact us directly for groups larger than 50.";
    }
  }

  const travelDate = trimmed(input.travelDate);
  const datesFlexible = input.datesFlexible === true;
  if (!datesFlexible) {
    if (!travelDate) {
      errors.travelDate = "Please give an intended travel date, or tick that your dates are flexible.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(travelDate)) {
      errors.travelDate = "Please enter a valid date.";
    } else if (travelDate < todayIso()) {
      errors.travelDate = "Please choose a date that has not already passed.";
    }
  } else if (travelDate && travelDate < todayIso()) {
    errors.travelDate = "Please choose a date that has not already passed.";
  }

  const message = typeof input.message === "string" ? input.message : "";
  if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`;
  }

  if (input.consent !== true) {
    errors.consent = "Please confirm that we may contact you about this enquiry.";
  }

  return errors;
}

export function validateNewsletter(input: Partial<NewsletterPayload>): Record<string, string> {
  const errors: Record<string, string> = {};

  const email = trimmed(input.email);
  if (!email) {
    errors.email = "Please enter an email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  } else if (email.length > 254) {
    errors.email = "Please enter a shorter email address.";
  }

  const firstName = trimmed(input.firstName);
  if (firstName.length > 100) {
    errors.firstName = "Please enter a shorter first name.";
  }
  const surname = trimmed(input.surname);
  if (surname.length > 100) {
    errors.surname = "Please enter a shorter surname.";
  }

  if (input.consent !== true) {
    errors.consent = "Please confirm that you would like to receive travel notes by email.";
  }

  return errors;
}
