"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { StarRating } from "@/features/reviews/components/StarRating";
import { useProductReviews } from "@/features/reviews/hooks/useProductReviews";
import { summarizeReviews } from "@/features/reviews/utils/review.utils";
import { useI18n } from "@/lib/i18n/I18nProvider";

type ProductReviewsProps = {
  productId: string;
};

export function ProductReviews({ productId }: ProductReviewsProps) {
  const reviewsQuery = useProductReviews(productId);
  const { dict, fill, locale } = useI18n();
  const reviews = reviewsQuery.data ?? [];
  const summary = summarizeReviews(reviews);
  const dateFormat = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-EG" : "en-GB",
    { dateStyle: "medium" },
  );

  return (
    <section
      aria-labelledby="reviews-heading"
      className="border-t border-line px-4 py-12 sm:px-6 md:px-10 lg:px-20 lg:py-16"
    >
      <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-16">
        <div className="flex flex-col gap-3">
          <h2
            id="reviews-heading"
            className="font-serif text-[32px] leading-tight text-ink sm:text-[40px]"
          >
            {dict.reviews.title}
          </h2>

          {summary.count > 0 ? (
            <>
              <p className="font-serif text-[48px] leading-none text-ink tabular-nums">
                {summary.average.toFixed(1)}
              </p>
              <StarRating
                value={summary.average}
                size={18}
                label={fill(dict.reviews.starsLabel, {
                  rating: summary.average,
                })}
              />
              <p className="text-[13px] text-muted">
                {fill(dict.reviews.basedOn, { count: summary.count })}
              </p>
            </>
          ) : null}

          <div className="mt-4">
            <ReviewForm key={productId} productId={productId} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {reviewsQuery.isLoading ? (
            Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-[120px] w-full" />
            ))
          ) : reviewsQuery.isError ? (
            <p role="alert" className="text-[13px] text-muted">
              {dict.reviews.loadError}
            </p>
          ) : reviews.length === 0 ? (
            <p className="text-[13px] text-muted">{dict.reviews.none}</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-xl border border-line/70 bg-surface p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex size-9 items-center justify-center rounded-full bg-gold/15 font-serif text-[16px] text-gold"
                      >
                        {review.author.charAt(0)}
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-ink">
                          {review.author}
                        </p>
                        <p className="text-[11px] text-muted">
                          {dict.reviews.verified} ·{" "}
                          <time dateTime={review.createdAt}>
                            {dateFormat.format(new Date(review.createdAt))}
                          </time>
                        </p>
                      </div>
                    </div>
                    <StarRating
                      value={review.rating}
                      label={fill(dict.reviews.starsLabel, {
                        rating: review.rating,
                      })}
                    />
                  </div>
                  <p
                    dir="auto"
                    className="mt-4 text-[14px] leading-[1.7] text-ink/85"
                  >
                    {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
