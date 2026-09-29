import type { Metadata } from "next";
import { FaqPage } from "@/features/faq";
import { readPreferences } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await readPreferences();

  return {
    title: locale === "ar" ? "الأسئلة الشائعة" : "FAQ",
    description:
      locale === "ar"
        ? "إجابات عن الطلب عبر الواتساب والدفع والتوصيل وتغليف الهدايا."
        : "Answers about WhatsApp ordering, payment, delivery and gift wrapping.",
  };
}

export default function FaqRoute() {
  return <FaqPage />;
}
