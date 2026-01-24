"use client";
import { news } from "@/data/news";
import { ads } from "@/data/ads";
import AdCard from "@/components/AdCard";

export default function NewsFeed() {
  // Merge news and ads by date (ads have startDate); simple interleave logic
  type FeedItem = { type: "news" | "ad"; date: string; item: any };

  const newsItems = news.map((n) => ({ type: "news", date: n.date, item: n }));
  const adItems = ads.map((a) => ({ type: "ad", date: a.startDate ?? new Date().toISOString(), item: a }));

  const feed: FeedItem[] = [...newsItems, ...adItems].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-4">
      {feed.map((f) => (
        <div key={`${f.type}-${f.item.id}`} className="p-4 bg-white rounded shadow-sm">
          {f.type === "news" ? (
            <article>
              <a href={`/ar/news/${f.item.id}`} className="font-semibold hover:underline">{f.item.title}</a>
              {f.item.excerpt && <p className="text-sm mt-1">{f.item.excerpt}</p>}
              <p className="text-xs text-gray-500 mt-2">{new Date(f.item.date).toLocaleString()}</p>
            </article>
          ) : (
            <AdCard ad={f.item} />
          )}
        </div>
      ))}
    </div>
  );
}
