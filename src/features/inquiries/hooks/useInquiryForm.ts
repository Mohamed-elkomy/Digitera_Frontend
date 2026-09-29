"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { inquiriesService } from "@/features/inquiries/services/inquiries.service";
import {
  EMPTY_INQUIRY,
  type InquiryErrors,
  type InquiryField,
  type InquiryValues,
} from "@/features/inquiries/types/inquiry.types";
import { validateInquiry } from "@/features/inquiries/utils/inquiry.validation";

export function useInquiryForm() {
  const [values, setValues] = useState<InquiryValues>(EMPTY_INQUIRY);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const mutation = useMutation({ mutationFn: inquiriesService.submit });

  function update(field: InquiryField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear a field's error as soon as the visitor starts fixing it.
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  /** Returns the first invalid field so the form can move focus to it. */
  function submit(): InquiryField | null {
    const nextErrors = validateInquiry(values);
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as InquiryField[])[0];
    if (firstInvalid) return firstInvalid;

    mutation.mutate(values);
    return null;
  }

  function reset() {
    setValues(EMPTY_INQUIRY);
    setErrors({});
    mutation.reset();
  }

  return {
    values,
    errors,
    update,
    submit,
    reset,
    isSending: mutation.isPending,
    isSent: mutation.isSuccess,
    isFailed: mutation.isError,
  };
}
