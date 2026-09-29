"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/icons";
import { BottleLoader } from "@/components/ui/BottleLoader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCard, productPaths } from "@/features/products";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useWishlistProducts } from "@/features/wishlist/hooks/useWishlistProducts";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function WishlistPage() {
  const { ids, count, hydrated } = useWishlist();
  const { products, isLoading, isError } = useWishlistProducts(ids);
  const { dict, fill } = useI18n();

  if (!hydrated) {
    return <BottleLoader label={dict.common.loading} />;
  }

  return (
    <section className="px-4 py-10 sm:px-6 md:px-10 lg:px-20 lg:py-14">
      <h1 className="font-serif text-[36px] text-ink sm:text-[44px]">
        {dict.wishlist.title}
      </h1>
      <p className="mt-1 text-[13px] text-muted">
        {count === 0
          ? dict.wishlist.empty
          : fill(dict.wishlist.count, { count })}
      </p>

      {count === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 border border-line bg-surface px-6 py-16 text-center">
          <HeartIcon size={28} className="text-gold" />
          <h2 className="font-serif text-[24px] text-ink">
            {dict.wishlist.emptyTitle}
          </h2>
          <p className="max-w-sm text-[13px] leading-relaxed text-muted">
            {dict.wishlist.emptyBody}
          </p>
          <Link href={productPaths.list}>
            <Button>{dict.common.browseAll}</Button>
          </Link>
        </div>
      ) : (
        <>
          {isError ? (
            <p role="alert" className="mt-6 text-[13px] text-muted">
              {dict.wishlist.loadError}
            </p>
          ) : null}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {isLoading
              ? ids.map((id) => (
                  <Skeleton key={id} className="h-[420px] w-full" />
                ))
              : products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-[fade-up_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </>
      )}
    </section>
  );
}
