"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertIcon, CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { reviewsService } from "@/features/reviews/services/reviews.service";
import {
  validateReview,
  type ReviewErrors,
} from "@/features/reviews/utils/review.validation";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";

const field =
  "w-full rounded border bg-surface px-3 py-3 text-[13px] text-ink outline-none transition-colors focus:border-gold";

export function ReviewForm({ productId }: { productId: string }) {
  const { dict, fill } = useI18n();
  const t = dict.reviews;
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<ReviewErrors>({});
  const mutation = useMutation({ mutationFn: reviewsService.submit });

  if (mutation.isSuccess) {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-gold/40 bg-surface p-5"
      >
        <CheckIcon size={18} className="mt-0.5 text-gold" />
        <div>
          <p className="font-serif text-[18px] text-ink">{t.thanks}</p>
          <p className="mt-1 text-[13px] text-muted">{t.thanksBody}</p>
        </div>
      </div>
    );
  }

  const error = (key?: keyof typeof t) =>
    key ? (
      <p className="flex items-center gap-1.5 text-[12px] text-[#c4564a]">
        <AlertIcon size={13} />
        {t[key]}
      </p>
    ) : null;

  return (
    <form
      noValidate
      aria-labelledby="review-form-heading"
      className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5"
      onSubmit={(event) => {
        event.preventDefault();
        const input = { productId, author, rating, comment };
        const found = validateReview(input);
        setErrors(found);
        if (Object.keys(found).length === 0) mutation.mutate(input);
      }}
    >
      <h3 id="review-form-heading" className="font-serif text-[22px] text-ink">
        {t.writeTitle}
      </h3>

      <fieldset>
        <legend className="text-[11px] font-semibold tracking-wide text-muted uppercase">
          {t.yourRating}
        </legend>
        <div className="mt-2 flex gap-1" dir="ltr">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => setRating(value)}
                className="peer sr-only"
                aria-label={fill(t.starOption, { count: value })}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "block text-[26px] leading-none transition-colors peer-focus-visible:rounded peer-focus-visible:ring-2 peer-focus-visible:ring-gold/60",
                  value <= rating
                    ? "text-gold"
                    : "text-line hover:text-gold/60",
                )}
              >
                ★
              </span>
            </label>
          ))}
        </div>
        {error(errors.rating)}
      </fieldset>

      <label className="flex flex-col gap-1.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
        {t.yourName}
        <input
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          autoComplete="name"
          aria-invalid={Boolean(errors.author)}
          className={cn(
            field,
            "normal-case",
            errors.author ? "border-[#c4564a]" : "border-line",
          )}
        />
      </label>
      {error(errors.author)}

      <label className="flex flex-col gap-1.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
        {t.comment}
        <textarea
          rows={4}
          dir="auto"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          aria-invalid={Boolean(errors.comment)}
          className={cn(
            field,
            "normal-case",
            errors.comment ? "border-[#c4564a]" : "border-line",
          )}
        />
      </label>
      {error(errors.comment)}

      {mutation.isError ? (
        <p role="alert" className="text-[13px] text-[#c4564a]">
          {t.failed}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="self-start"
      >
        {mutation.isPending ? t.sending : t.submit}
      </Button>
    </form>
  );
}
