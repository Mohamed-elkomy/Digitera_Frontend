import { auth } from "@/lib/i18n/dictionaries/en/auth";
import { catalogue } from "@/lib/i18n/dictionaries/en/catalogue";
import { checkout } from "@/lib/i18n/dictionaries/en/checkout";
import { shell } from "@/lib/i18n/dictionaries/en/shell";

/**
 * Source of truth for every user-facing string. Copy follows the Figma file.
 * Split across three files so no single one outgrows the project's size rule:
 * `shell` is the chrome, `catalogue` the shop, `auth` the account screens.
 */
export const en = {
  ...shell,
  ...catalogue,
  ...checkout,
  ...auth,
} as const;

/** Same shape as `en`, but every leaf widened to `string`. */
export type Dictionary = {
  [Section in keyof typeof en]: {
    [Key in keyof (typeof en)[Section]]: string;
  };
};
