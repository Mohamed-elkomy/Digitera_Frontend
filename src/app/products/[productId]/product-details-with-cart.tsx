"use client";

import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { AddToCartButton } from "@/features/cart";
import { ProductDetailsPage } from "@/features/products";
import { ProductReviews } from "@/features/reviews";
import { WishlistButton } from "@/features/wishlist";

type ProductDetailsWithCartProps = {
  productId: string;
};

/**
 * Route-level composition of the products, cart, wishlist and reviews features.
 * The selected variant's price is what reaches the cart.
 */
export function ProductDetailsWithCart({
  productId,
}: ProductDetailsWithCartProps) {
  return (
    <ProductDetailsPage
      productId={productId}
      actions={({
        product,
        variant,
        giftWrapping,
        quantity,
        setQuantity,
        disabled,
      }) => (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <QuantityStepper value={quantity} onChange={setQuantity} />

          <AddToCartButton
            className="flex-1"
            productId={product.id}
            variantId={variant?.id ?? ""}
            name={product.name}
            variantLabel={variant?.label ?? ""}
            unitPrice={variant?.price ?? 0}
            giftWrapping={giftWrapping}
            quantity={quantity}
            image={product.images[0]}
            disabled={disabled || !variant}
          />

          <WishlistButton
            appearance="outline"
            productId={product.id}
            productName={product.name}
            className="self-start"
          />
        </div>
      )}
      afterDetails={(product) => <ProductReviews productId={product.id} />}
    />
  );
}
