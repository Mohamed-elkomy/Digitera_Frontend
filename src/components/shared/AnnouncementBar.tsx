"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function AnnouncementBar() {
  const { dict } = useI18n();
  const items = dict.nav.announcements || [dict.nav.announcement];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [items.length]);

  function prev() {
    setIndex((curr) => (curr - 1 + items.length) % items.length);
  }

  function next() {
    setIndex((curr) => (curr + 1) % items.length);
  }

  return (
    <aside
      aria-label="Store Announcements"
      className="relative flex items-center justify-between bg-night px-4 py-2.5 text-on-night transition-colors duration-300 sm:px-8"
    >
      <button
        type="button"
        onClick={prev}
        aria-label="Previous announcement"
        className="flex size-6 items-center justify-center rounded text-on-night/60 transition-colors hover:text-gold focus-visible:outline-none"
      >
        <ChevronLeftIcon size={12} />
      </button>

      <div className="relative mx-2 flex-1 overflow-hidden text-center">
        <p
          key={index}
          className="animate-[fade-in_0.4s_ease-out] text-[11px] font-medium tracking-wider text-on-night uppercase sm:text-[12px]"
        >
          {items[index]}
        </p>
      </div>

      <button
        type="button"
        onClick={next}
        aria-label="Next announcement"
        className="flex size-6 items-center justify-center rounded text-on-night/60 transition-colors hover:text-gold focus-visible:outline-none"
      >
        <ChevronRightIcon size={12} />
      </button>
    </aside>
  );
}
