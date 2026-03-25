import { useState } from "react";
import axios from "../lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, Sparkles, TrendingUp, Clock, History } from "lucide-react";
import { useCurrency } from "../hooks/useCurrency";

interface GoalInput {
  goalText: string;
  targetAmount: number;
  targetYears: number;
  currentSavings: number;
  monthlyIncome: number;
  riskLevel: string;
}

export function GoalPlanner() {
  const { format, symbol } = useCurrency();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<GoalInput>({
    goalText: "",
    targetAmount: 0,
    targetYears: 0,
    currentSavings: 0,
    monthlyIncome: 0,
    riskLevel: "moderate",
  });

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ["goal-history"],
    queryFn: () => axios.get("/api/ai/goal-planner/history").then((r) => r.data),
  });

  const generateGoal = useMutation({
    mutationFn: (data: GoalInput) =>
      axios.post("/api/ai/goal-planner", data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goal-history"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateGoal.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Goal Planner</h1>
        <p className="text-sm text-muted-foreground">
          Map out your dreams and let our financial engine calculate exactly what it takes to reach them.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Section */}
        <Card className="border-t-4 border-t-primary h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              New Goal
            </CardTitle>
            <CardDescription>Enter the specifics of your financial target</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>What is your goal? (e.g. "Buy a car")</Label>
                <Input
                  required
                  placeholder="I want to save for..."
                  value={formData.goalText}
                  onChange={(e) => setFormData({ ...formData, goalText: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Amount ({symbol})</Label>
                  <Input
                    required
                    type="number"
                    min={1}
                    value={formData.targetAmount || ""}
                    onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timeframe (Years)</Label>
                  <Input
                    required
                    type="number"
                    min={1}
                    value={formData.targetYears || ""}
                    onChange={(e) => setFormData({ ...formData, targetYears: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Savings ({symbol})</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.currentSavings || ""}
                    onChange={(e) => setFormData({ ...formData, currentSavings: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <Select
                    value={formData.riskLevel}
                    onValueChange={(v) => setFormData({ ...formData, riskLevel: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (PPF / FD)</SelectItem>
                      <SelectItem value="moderate">Moderate (SIP)</SelectItem>
                      <SelectItem value="high">High (ELSS / Equity)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Monthly Income (Optional)</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="For feasibility check..."
                  value={formData.monthlyIncome || ""}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                />
              </div>

              <Button type="submit" disabled={generateGoal.isPending} className="w-full mt-4">
                {generateGoal.isPending ? (
                  "Crunching Numbers..."
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Calculate AI Strategy
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {generateGoal.data && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {generateGoal.data.headline}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {generateGoal.data.message}
                </p>

                {generateGoal.data.tip && (
                  <div className="rounded-lg bg-background p-4 border border-border shadow-sm">
                    <p className="text-sm font-medium text-primary">💡 Tip: {generateGoal.data.tip}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="rounded-lg bg-background p-4 border shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Monthly Needed</p>
                    <p className="text-lg font-bold">{format(generateGoal.data.summary.monthlyNeeded)}</p>
                  </div>
                  <div className="rounded-lg bg-background p-4 border shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Invested</p>
                    <p className="text-lg font-bold">{format(generateGoal.data.summary.totalInvested)}</p>
                  </div>
                  <div className="rounded-lg bg-background p-4 border shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Wealth Gained</p>
                    <p className="text-lg font-bold text-emerald-600">+{format(generateGoal.data.summary.wealthGained)}</p>
                  </div>
                  <div className="rounded-lg bg-background p-4 border shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Expected Value</p>
                    <p className="text-lg font-bold text-primary">{format(generateGoal.data.summary.expectedValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* History */}
          {!generateGoal.data && history.length > 0 && (
             <Card>
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <History className="h-4 w-4" />
                 Past Goals
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                {history.map((h: any) => (
                  <div key={h.id} className="p-4 border rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground">{h.goalText}</h4>
                      <Badge variant="outline">{h.targetYears} yrs</Badge>
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <Target className="h-4 w-4" /> Target: {format(h.targetAmount)}
                    </div>
                    <p className="text-sm mt-3 font-medium">Recommended: {format(h.result.summary.monthlyNeeded)}/month</p>
                  </div>
                ))}
             </CardContent>
           </Card>
          )}
        </div>
      </div>
    </div>
  );
}
