import NewsFeed from "@/components/NewsFeed";
import LegalNotice from "@/components/LegalNotice";

export default function NewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الأخبار والإعلانات</h1>

      <NewsFeed />

      <LegalNotice />
    </div>
  );
}
