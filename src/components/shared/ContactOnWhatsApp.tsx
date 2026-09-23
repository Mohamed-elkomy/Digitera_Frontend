"use client";

import { WhatsAppIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";

const CONTACT_PHONE_NUMBER = "201272782474";

export function ContactOnWhatsApp() {
  const { dict } = useI18n();

  return (
    <a
      href={`https://wa.me/${CONTACT_PHONE_NUMBER}?text=${encodeURIComponent(dict.footer.whatsAppGreeting)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-full border border-on-night/20 px-3.5 py-2 text-[11px] font-semibold tracking-wide text-on-night uppercase transition-colors duration-300 hover:border-gold hover:text-gold"
    >
      <WhatsAppIcon size={15} />
      {dict.footer.contactUs}
    </a>
  );
}
