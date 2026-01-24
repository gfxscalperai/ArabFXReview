import { brokers } from "@/data/brokers";
import BrokerCard from "@/components/BrokerCard";

export default function BrokersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">تقييم شركات التداول</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {brokers.map((broker) => (
          <BrokerCard key={broker.slug} broker={broker} />
        ))}
      </div>
    </div>
  );
}
