import type {
  InquiryErrors,
  InquiryValues,
} from "@/features/inquiries/types/inquiry.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;
export const MIN_MESSAGE_LENGTH = 10;
export const MAX_FIELD_LENGTH = 2000;

function isValidPhone(value: string): boolean {
  if (!/^\+?[\d\s()-]{7,20}$/.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15;
}

/** Shared by the form and the API route, so both reject the same input. */
export function validateInquiry(values: InquiryValues): InquiryErrors {
  const errors: InquiryErrors = {};

  if (!values.name.trim()) errors.name = "nameRequired";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "emailInvalid";

  const phone = values.phone.trim();
  if (phone && !isValidPhone(phone)) errors.phone = "phoneInvalid";

  if (!values.subject.trim()) errors.subject = "subjectRequired";
  if (values.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = "messageTooShort";
  }

  return errors;
}

/** Trims every field and caps its length before anything is stored. */
export function normalizeInquiry(input: Partial<InquiryValues>): InquiryValues {
  const field = (value: unknown) =>
    typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) : "";

  return {
    name: field(input.name),
    email: field(input.email),
    phone: field(input.phone),
    subject: field(input.subject),
    message: field(input.message),
  };
}
