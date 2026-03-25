import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios"; // created this to support your component

const severityColor: Record<string, string> = {
  high: "bg-red-50 border-red-300 text-red-800",
  medium: "bg-yellow-50 border-yellow-300 text-yellow-800",
  low: "bg-blue-50 border-blue-300 text-blue-800",
};

export function AnomalyCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["anomalies"],
    queryFn: () => axios.get("/api/ai/anomalies").then((r) => r.data.data), // data structure from your backend
    staleTime: 1000 * 60 * 30, // re-fetch every 30 mins
  });

  if (isLoading) return <p className="text-sm text-gray-400">Analyzing spending...</p>;
  if (!data?.anomalies?.length) return null;

  return (
    <div className="rounded-xl border p-4 space-y-3 bg-white shadow-sm">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
        AI Spending Insights
      </h3>
      {data.anomalies.map((a: any, i: number) => (
        <div key={i} className={`rounded-lg border p-3 text-sm ${severityColor[a.severity] || severityColor.low}`}>
          <p className="font-medium">{a.category} — {a.message}</p>
          <p className="mt-1 opacity-80">{a.suggestion}</p>
        </div>
      ))}
      {data.summary && (
        <p className="text-xs text-gray-500 italic">"{data.summary}"</p>
      )}
    </div>
  );
}
