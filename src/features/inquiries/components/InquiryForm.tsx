"use client";

import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { InquiryField } from "@/features/inquiries/components/InquiryField";
import { useInquiryForm } from "@/features/inquiries/hooks/useInquiryForm";
import { useI18n } from "@/lib/i18n/I18nProvider";

/** Contact form. Submissions land in the owner's dashboard as inquiries. */
export function InquiryForm() {
  const form = useInquiryForm();
  const { dict } = useI18n();
  const t = dict.inquiry;
  const errorText = (field: keyof typeof form.errors) => {
    const key = form.errors[field];
    return key ? t[key] : undefined;
  };

  if (form.isSent) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-2xl border border-gold/40 bg-surface px-6 py-12 text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold">
          <CheckIcon size={22} />
        </span>
        <h3 className="font-serif text-[24px] text-ink">{t.sent}</h3>
        <p className="text-[13px] text-muted">{t.sentBody}</p>
        <Button variant="secondary" onClick={form.reset}>
          {t.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      aria-labelledby="inquiry-heading"
      onSubmit={(event) => {
        event.preventDefault();
        const firstInvalid = form.submit();
        if (firstInvalid)
          document.getElementById(`inquiry-${firstInvalid}`)?.focus();
      }}
      className="grid gap-5 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-2 sm:p-8"
    >
      <div className="sm:col-span-2">
        <h2 id="inquiry-heading" className="font-serif text-[28px] text-ink">
          {t.title}
        </h2>
        <p className="mt-2 text-[13px] leading-[1.7] text-muted">{t.intro}</p>
      </div>

      <InquiryField
        name="name"
        label={t.name}
        autoComplete="name"
        required
        value={form.values.name}
        onChange={(v) => form.update("name", v)}
        error={errorText("name")}
      />
      <InquiryField
        name="email"
        type="email"
        label={t.email}
        autoComplete="email"
        required
        value={form.values.email}
        onChange={(v) => form.update("email", v)}
        error={errorText("email")}
      />
      <InquiryField
        name="phone"
        type="tel"
        label={t.phone}
        autoComplete="tel"
        value={form.values.phone}
        onChange={(v) => form.update("phone", v)}
        error={errorText("phone")}
      />
      <InquiryField
        name="subject"
        label={t.subject}
        required
        value={form.values.subject}
        onChange={(v) => form.update("subject", v)}
        error={errorText("subject")}
      />
      <InquiryField
        name="message"
        label={t.message}
        multiline
        required
        className="sm:col-span-2"
        value={form.values.message}
        onChange={(v) => form.update("message", v)}
        error={errorText("message")}
      />

      {form.isFailed ? (
        <p role="alert" className="text-[13px] text-[#c4564a] sm:col-span-2">
          {t.failed}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={form.isSending}
        >
          {form.isSending ? t.sending : t.submit}
        </Button>
      </div>
    </form>
  );
}
