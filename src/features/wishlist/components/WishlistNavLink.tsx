"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/icons";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { wishlistPaths } from "@/features/wishlist/paths";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";

export function WishlistNavLink({ className }: { className?: string }) {
  const { count } = useWishlist();
  const { dict, fill } = useI18n();

  return (
    <Link
      href={wishlistPaths.wishlist}
      className={cn("relative", className)}
      aria-label={
        count > 0
          ? fill(dict.wishlist.navCount, { count })
          : dict.wishlist.navEmpty
      }
    >
      <HeartIcon size={19} />
      {count > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 flex size-4 animate-[scale-in_0.3s_ease-out] items-center justify-center rounded-full bg-gold text-[9px] font-bold text-[#faf8f5] tabular-nums"
        >
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
