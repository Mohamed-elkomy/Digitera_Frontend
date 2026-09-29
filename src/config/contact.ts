/** The house's public contact line: WhatsApp, calls and the announcement bar. */
export const STORE_PHONE_RAW = "201272782474";
export const STORE_PHONE_DISPLAY = "+20 127 278 2474";

/**
 * Where order invoices go when NEXT_PUBLIC_WHATSAPP_NUMBER is not set. It is a
 * placeholder on purpose: this is a demo shop, so test orders placed by
 * visitors must not land on a real person's WhatsApp.
 */
export const ORDER_WHATSAPP_FALLBACK = "201111111111";

export function storeWhatsAppHref(message: string): string {
  return `https://wa.me/${STORE_PHONE_RAW}?text=${encodeURIComponent(message)}`;
}
