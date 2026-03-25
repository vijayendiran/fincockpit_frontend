import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";
import { useCurrency } from "../hooks/useCurrency";

export function ForecastCard() {
  const { format, convert } = useCurrency();
  const { data, isLoading } = useQuery({
    queryKey: ["forecast"],
    queryFn: () => axios.get("/api/ai/forecast").then((r) => r.data),
  });

  if (isLoading) return <p className="text-sm text-gray-400">Calculating forecast...</p>;
  if (!data?.predictedTotal) return null;

  const confidenceColor: Record<string, string> = {
    high: "text-green-600",
    medium: "text-yellow-600",
    low: "text-red-500",
  };

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <h3 className="font-semibold text-sm">Next Month Forecast</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold">{format(convert(data.predictedTotal, "INR"))}</span>
        <span className={`text-xs mb-1 ${confidenceColor[data.confidence as string] || "text-gray-500"}`}>
          {data.confidence} confidence
        </span>
      </div>
      <p className="text-xs text-gray-500">{data.trend}</p>
      <div className="space-y-1">
        {data.breakdown?.map((b: any) => (
          <div key={b.category} className="flex justify-between text-xs">
            <span className="text-gray-600">{b.category}</span>
            <span className="font-medium">{format(convert(b.predicted || 0, "INR"))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
