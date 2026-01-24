import { brokers } from "@/data/brokers";
import LegalNotice from "@/components/LegalNotice";
import Image from "next/image";

export default function BrokerDetail({ params }: { params: { locale: string; slug: string } }) {
  const broker = brokers.find((b) => b.slug === params.slug);

  if (!broker) {
    return <div>الوسيط غير موجود</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center gap-6">
          <Image src={broker.logo} alt={broker.name} width={160} height={80} />
          <div>
            <h1 className="text-2xl font-bold">{broker.name}</h1>
            <p className="text-sm text-gray-600">التنظيم: {broker.regulation}</p>
            <p className="text-sm text-gray-600">الحد الأدنى للإيداع: {broker.minDeposit}</p>
            <p className="text-sm mt-2">التقييم: ⭐ {broker.rating}</p>
          </div>
        </div>

        {broker.description && <p className="mt-4">{broker.description}</p>}

        <div className="mt-4">
          <a
            href={broker.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            التسجيل لدى {broker.name}
          </a>
        </div>
      </div>

      <LegalNotice />
    </div>
  );
}
