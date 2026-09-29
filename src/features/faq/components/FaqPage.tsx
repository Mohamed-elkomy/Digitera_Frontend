"use client";

import Link from "next/link";
import { ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { faqAr } from "@/features/faq/data/faq.ar";
import { faqEn } from "@/features/faq/data/faq.en";
import { useI18n } from "@/lib/i18n/I18nProvider";

/** Native <details>: keyboard, screen readers and no-JS all work for free. */
export function FaqPage() {
  const { dict, locale } = useI18n();
  const items = locale === "ar" ? faqAr : faqEn;

  return (
    <section className="px-4 py-12 sm:px-6 md:px-10 lg:px-20 lg:py-20">
      <div className="mx-auto w-full max-w-[820px]">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">
          {dict.faq.eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-[36px] leading-tight text-ink sm:text-[50px]">
          {dict.faq.title}
        </h1>
        <p className="mt-4 text-[15px] leading-[1.75] text-muted">
          {dict.faq.intro}
        </p>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {items.map((item) => (
            <details key={item.question} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded py-4 text-start font-serif text-[19px] text-ink transition-colors hover:text-gold focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none sm:text-[22px] [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDownIcon className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="pb-5 text-[14px] leading-[1.8] text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-[22px] text-ink">
            {dict.faq.stillQuestions}
          </p>
          <Link href="/contact">
            <Button variant="gold">{dict.faq.contactCta}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
