import { env } from "@/config/env";
import type { InquiryValues } from "@/features/inquiries/types/inquiry.types";

export type InquiriesService = {
  submit(values: InquiryValues): Promise<void>;
};

/** Demo mode: no backend, so the message is accepted after a short pause. */
const mockInquiriesService: InquiriesService = {
  async submit() {
    await new Promise((resolve) => setTimeout(resolve, 700));
  },
};

/** Posts to our own route, which stores the inquiry in the Sanity dashboard. */
const httpInquiriesService: InquiriesService = {
  async submit(values) {
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(`Inquiry failed: ${response.status}`);
    }
  },
};

export const inquiriesService: InquiriesService = env.useMockApi
  ? mockInquiriesService
  : httpInquiriesService;
