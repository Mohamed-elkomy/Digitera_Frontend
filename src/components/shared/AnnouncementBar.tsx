"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export function AnnouncementBar() {
  const { dict } = useI18n();

  return (
    <div className="bg-night">
      <p className="px-4 py-3 text-center text-[10px] font-semibold text-on-night uppercase sm:px-6 sm:text-[11px] md:px-10 lg:px-20">
        {dict.nav.announcement}
      </p>
    </div>
  );
}
