import Link from "next/link";
import { brokers } from "@/data/brokers";
import BrokerCard from "@/components/BrokerCard";

export default function Home() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">مرحبًا بك في ArabFXReview</h2>

      <section>
        <h3 className="text-xl font-semibold mb-3">أفضل الوسطاء</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {brokers.slice(0, 3).map((b) => (
            <BrokerCard key={b.slug} broker={b} />
          ))}
        </div>
        <div className="mt-4">
          <Link href="/ar/brokers" className="text-blue-600">عرض جميع الوسطاء</Link>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-3">الأخبار والإعلانات</h3>
        <Link href="/ar/news" className="text-blue-600">اذهب إلى الأخبار</Link>
      </section>
    </div>
  );
}
