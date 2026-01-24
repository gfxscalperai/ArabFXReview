"use client";
"use client";
import Image from "next/image";
import Link from "next/link";

interface BrokerCardProps {
  broker: any;
}

export default function BrokerCard({ broker }: BrokerCardProps) {
  return (
    <div className="border rounded-lg p-5 bg-white shadow">
      <Image
        src={broker.logo}
        alt={broker.name}
        width={140}
        height={70}
        className="mx-auto mb-4"
      />

      <h3 className="text-lg font-bold text-center">{broker.name}</h3>

      <p className="text-sm text-center mt-1">التقييم: ⭐ {broker.rating}</p>

      <p className="text-sm text-center">الحد الأدنى للإيداع: {broker.minDeposit}</p>

      <ul className="text-sm mt-3 list-disc list-inside">
        {broker.pros.map((pro: string, i: number) => (
          <li key={i}>{pro}</li>
        ))}
      </ul>

      <div className="flex gap-2 mt-4">
        <a
          href={broker.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          التسجيل لدى {broker.name}
        </a>

        <Link href={`/ar/brokers/${broker.slug}`} className="flex-1 text-center border rounded py-2">
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}
