"use client";
import Image from "next/image";

interface AdCardProps {
  ad: any;
}

export default function AdCard({ ad }: AdCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-yellow-50 shadow-sm">
      {ad.image && (
        <div className="mb-3 flex justify-center">
          <Image src={ad.image} alt={ad.title} width={160} height={60} />
        </div>
      )}
      <h4 className="font-semibold">{ad.title}</h4>
      {ad.body && <p className="text-sm mt-1">{ad.body}</p>}

      <a
        href={ad.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 px-3 py-1 bg-yellow-600 text-white rounded"
      >
        تفقّد العرض
      </a>
    </div>
  );
}
