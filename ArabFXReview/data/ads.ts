export type AdItem = {
  id: string;
  title: string;
  body?: string;
  image?: string;
  affiliateUrl: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
};

export const ads: AdItem[] = [
  {
    id: "a1",
    title: "عرض خاص: خصم على عمولات التداول",
    body: "احصل على خصومات حصرية عند التسجيل عبر رابطنا.",
    image: "/brokers/justmarkets.webp",
    affiliateUrl: "https://one.justmarkets.link/a/jvnpt0b3z9",
    startDate: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "a2",
    title: "ترويج Exness – حسابات مميزة",
    body: "مزايا سحب فوري ورافعة ممتازة.",
    image: "/brokers/exness.webp",
    affiliateUrl: "https://one.exnessonelink.com/a/9kjsbuqe3e",
    startDate: "2026-01-15T00:00:00.000Z",
  },
];
