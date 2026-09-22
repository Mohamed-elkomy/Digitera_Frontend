import { iconDefaults, type IconProps } from "@/components/icons/icon.types";

/**
 * Odoratus house mark: a faceted flacon with a drop of oil at its heart.
 * Drawn by hand so the brand never depends on an icon package.
 */
export function OdoratusMark({ size = 22, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...iconDefaults}
      {...props}
    >
      <path d="M10 2.5h4v2.2h-4z" />
      <path d="M9.4 6.9h5.2l2.1 3.3v8.4a2.9 2.9 0 0 1-2.9 2.9h-3.6a2.9 2.9 0 0 1-2.9-2.9v-8.4z" />
      <path d="M12 12.3c1.2 1.4 1.9 2.4 1.9 3.3a1.9 1.9 0 0 1-3.8 0c0-.9.7-1.9 1.9-3.3z" />
    </svg>
  );
}

export function GiftIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...iconDefaults}
      {...props}
    >
      <path d="M4 10h16v10H4zM4 7h16v3H4zM12 7v13" />
      <path d="M12 7S10.6 4 8.9 4A1.9 1.9 0 0 0 8.9 7.9M12 7s1.4-3 3.1-3a1.9 1.9 0 0 1 0 3.9" />
    </svg>
  );
}

export function LeafIcon({ size = 14, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...iconDefaults}
      {...props}
    >
      <path d="M19 5c0 8-5.2 12-11 12 0-6.8 4.6-11 11-12z" />
      <path d="M8 17c1.8-3.4 4.2-5.8 7.5-7.5" />
    </svg>
  );
}

export function InstagramIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...iconDefaults}
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M16.9 7.2h.01" strokeWidth={2} />
    </svg>
  );
}

export function CircleXIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...iconDefaults}
      {...props}
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  );
}

export function FacebookIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...iconDefaults}
      {...props}
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.3 8.6h-1.1a1.5 1.5 0 0 0-1.5 1.5v1.2m-1.4 0h4" />
      <path d="M12.7 11.3v5" />
    </svg>
  );
}
