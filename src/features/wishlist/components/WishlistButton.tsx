"use client";

import { HeartIcon } from "@/components/icons";
import { showToast } from "@/components/ui/toast";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { wishlistPaths } from "@/features/wishlist/paths";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";

type WishlistButtonProps = {
  productId: string;
  productName: string;
  /** "overlay" floats on a card image; "outline" sits beside the add-to-bag button. */
  appearance?: "overlay" | "outline";
  className?: string;
};

export function WishlistButton({
  productId,
  productName,
  appearance = "overlay",
  className,
}: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const { dict, fill } = useI18n();
  const saved = has(productId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={fill(saved ? dict.wishlist.remove : dict.wishlist.add, {
        name: productName,
      })}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const nowSaved = toggle(productId);
        showToast({
          title: nowSaved ? dict.wishlist.added : dict.wishlist.removed,
          message: productName,
          type: nowSaved ? "success" : "info",
          action: nowSaved
            ? { label: dict.wishlist.title, href: wishlistPaths.wishlist }
            : undefined,
        });
      }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none active:scale-90",
        appearance === "overlay"
          ? "size-9 bg-surface/90 text-ink shadow-sm backdrop-blur-md hover:text-gold"
          : "size-12 border border-line bg-surface text-ink hover:border-gold hover:text-gold",
        saved && "text-gold",
        className,
      )}
    >
      <HeartIcon
        size={appearance === "overlay" ? 17 : 20}
        fill={saved ? "currentColor" : "none"}
        className={cn(saved && "animate-[scale-in_0.3s_ease-out]")}
      />
    </button>
  );
}
