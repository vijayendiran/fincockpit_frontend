import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";
import { Lightbulb, TrendingDown, ArrowRight, Loader2, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "../hooks/useCurrency";

interface Suggestion {
  title: string;
  detail: string;
  potentialSaving: string;
  category: string;
}

interface SavingsData {
  suggestions: Suggestion[];
  totalPotentialSaving: string;
  summary: string;
}

export function SavingsSuggestions() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () => axios.get("/api/ai/suggestions").then((r) => r.data.data),
    staleTime: 1000 * 60 * 60, // cache for 1 hour
  });
  const { format } = useCurrency();

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-primary/10 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          <p className="text-sm text-muted-foreground animate-pulse">Analyzing your spending habits...</p>
        </CardContent>
      </Card>
    );
  }

  const savings: SavingsData = data || { suggestions: [], totalPotentialSaving: format(0), summary: "" };

  if (savings.suggestions.length === 0) return null;

  return (
    <Card className="overflow-hidden border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 shadow-sm dark:from-zinc-950 dark:to-indigo-950/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-indigo-900 dark:text-indigo-300">
              <Lightbulb className="h-5 w-5 text-amber-500 fill-amber-500/20" />
              Smart Saving Suggestions
            </CardTitle>
            <CardDescription className="text-xs">
              AI-driven insights to help you optimize your finances
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Potential Saving</p>
            <p className="text-lg font-bold text-green-600">{savings.totalPotentialSaving}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {savings.summary && (
          <div className="rounded-lg bg-indigo-500/5 p-3 text-sm text-indigo-900/80 dark:text-indigo-300/80 italic border-l-2 border-indigo-400">
            "{savings.summary}"
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          {savings.suggestions.map((s, i) => (
            <div 
              key={i} 
              className="group relative rounded-xl border border-white bg-white/60 p-4 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div className="mb-3 flex items-center justify-between">
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {s.category}
                </Badge>
                <span className="text-xs font-bold text-green-600">Save {s.potentialSaving}</span>
              </div>
              <h4 className="mb-1 text-sm font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                {s.title}
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {s.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] text-muted-foreground">
            Swipe to see more or click for details
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refetch()}
            className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            Refresh Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
