export type Broker = {
  slug: string;
  name: string;
  logo: string;
  rating: number;
  regulation?: string;
  minDeposit?: string;
  pros: string[];
  cons: string[];
  affiliateUrl: string;
  description?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  date: string; // ISO
  source?: string;
};

export type AdItem = {
  id: string;
  title: string;
  body?: string;
  image?: string;
  affiliateUrl: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
};
