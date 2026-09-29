import {
  MAX_FIELD_LENGTH,
  normalizeInquiry,
  validateInquiry,
} from "@/features/inquiries/utils/inquiry.validation";

const valid = {
  name: "Salma",
  email: "salma@example.com",
  phone: "",
  subject: "Corporate gifting",
  message: "I would like twenty gift sets for our team.",
};

describe("validateInquiry", () => {
  it("accepts a complete inquiry with no phone", () => {
    expect(validateInquiry(valid)).toEqual({});
  });

  it("flags every missing or malformed field with its dictionary key", () => {
    expect(
      validateInquiry({
        name: " ",
        email: "salma@",
        phone: "12",
        subject: "",
        message: "hi",
      }),
    ).toEqual({
      name: "nameRequired",
      email: "emailInvalid",
      phone: "phoneInvalid",
      subject: "subjectRequired",
      message: "messageTooShort",
    });
  });

  it("accepts a phone written with spaces and a country code", () => {
    expect(validateInquiry({ ...valid, phone: "+20 111 111 1111" })).toEqual(
      {},
    );
  });
});

describe("normalizeInquiry", () => {
  it("trims fields, drops non-strings and caps length", () => {
    const result = normalizeInquiry({
      name: "  Salma ",
      email: 42 as unknown as string,
      message: "x".repeat(MAX_FIELD_LENGTH + 50),
    });
    expect(result.name).toBe("Salma");
    expect(result.email).toBe("");
    expect(result.message).toHaveLength(MAX_FIELD_LENGTH);
  });
});
