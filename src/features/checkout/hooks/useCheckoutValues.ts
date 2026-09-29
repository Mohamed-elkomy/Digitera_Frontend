"use client";

import { useState } from "react";
import type { AuthUser } from "@/features/auth";
import type { CheckoutValues } from "@/features/checkout/types/checkout.types";

const EMPTY: CheckoutValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
  paymentMethod: "cash-on-delivery",
};

/**
 * The form's values, starting from the signed-in customer's details. The
 * session is restored after the first paint, so the details are filled in when
 * it arrives (during render, React's pattern for adjusting state to a prop) —
 * never overwriting anything already typed.
 */
export function useCheckoutValues(user: AuthUser | null) {
  const [values, setValues] = useState<CheckoutValues>(EMPTY);
  const [prefilledFor, setPrefilledFor] = useState<string | null>(null);

  if (user && prefilledFor !== user.email) {
    setPrefilledFor(user.email);
    setValues((current) => ({
      ...current,
      fullName: current.fullName || user.name,
      email: current.email || user.email,
    }));
  }

  return [values, setValues] as const;
}
