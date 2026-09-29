export type InquiryValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type InquiryField = keyof InquiryValues;

/** Errors are dictionary keys, so they re-translate when the language changes. */
export type InquiryErrorKey =
  | "nameRequired"
  | "emailInvalid"
  | "phoneInvalid"
  | "subjectRequired"
  | "messageTooShort";

export type InquiryErrors = Partial<Record<InquiryField, InquiryErrorKey>>;

export const EMPTY_INQUIRY: InquiryValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};
