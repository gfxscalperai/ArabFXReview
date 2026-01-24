import { news } from "@/data/news";
import LegalNotice from "@/components/LegalNotice";

export default function NewsDetail({ params }: { params: { locale: string; id: string } }) {
  const item = news.find((n) => n.id === params.id);
  if (!item) return <div>المقال غير موجود</div>;

  return (
    <div className="p-6">
      <article className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">{item.title}</h1>
        <p className="text-xs text-gray-500 mt-2">{new Date(item.date).toLocaleString()} • {item.source}</p>
        {item.content && <p className="mt-4">{item.content}</p>}
      </article>

      <LegalNotice />
    </div>
  );
}
