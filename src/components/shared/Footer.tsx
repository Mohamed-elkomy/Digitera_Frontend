"use client";

import Link from "next/link";
import { CircleXIcon, FacebookIcon, InstagramIcon } from "@/components/icons";
import { useFooterNav } from "@/components/shared/navigation";
import { useI18n } from "@/lib/i18n/I18nProvider";

const socials = [
  { label: "Instagram", Icon: InstagramIcon },
  { label: "X", Icon: CircleXIcon },
  { label: "Facebook", Icon: FacebookIcon },
];

const paymentMethods = ["visa", "mastercard", "amex"];

export function Footer() {
  const { dict, fill } = useI18n();
  const columns = useFooterNav();

  return (
    <footer className="mt-16 bg-night text-on-night">
      <div className="flex flex-col gap-12 px-4 pt-14 pb-10 sm:px-6 md:px-10 lg:gap-16 lg:px-20 lg:pt-20">
        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row">
          <div className="flex w-full max-w-[400px] flex-col items-start gap-6">
            <p className="font-serif text-[32px] text-on-night lg:text-[40px]">
              {dict.common.brand}
            </p>
            <p className="text-[14px] leading-[1.6] text-on-night opacity-80">
              {dict.footer.description}
            </p>
            <ul className="flex items-center gap-4">
              {socials.map(({ label, Icon }) => (
                <li key={label}>
                  <Link
                    href="/products"
                    aria-label={label}
                    className="flex rounded-full bg-on-night/10 p-2 text-on-night transition-colors duration-300 hover:bg-gold"
                  >
                    <Icon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid w-full gap-10 sm:grid-cols-3 lg:w-auto lg:gap-20">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-[12px] font-bold text-gold uppercase">
                  {column.title}
                </h2>
                <ul className="mt-5 flex flex-col gap-5">
                  {column.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-on-night opacity-70 transition-opacity duration-300 hover:opacity-100"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="h-px w-full bg-on-night/[0.13]" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-on-night opacity-50">
              {fill(dict.footer.rights, { year: new Date().getFullYear() })}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] text-on-night uppercase opacity-40">
                {dict.footer.securedVia}
              </p>
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="rounded border border-on-night/[0.13] px-2 py-1 text-[9px] font-semibold text-on-night uppercase opacity-60"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
