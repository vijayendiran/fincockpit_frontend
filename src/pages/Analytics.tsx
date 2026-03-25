import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, PieChart, BarChart3, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../hooks/useCurrency";
import axios from "../lib/axios";

export default function Analytics() {
  const { token, user } = useAuth();
  const { format, convert, symbol } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    totalMonthlySpend: 0,
    subscriptionSpend: 0,
    expenseSpend: 0,
    monthlyBudget: user?.monthlyBudget || 20000,
    remainingBudget: 0,
  });

  const [chartData, setChartData] = useState({
    monthlyTrend: [] as { month: string; amount: number }[],
    categoryBreakdown: [] as { category: string; amount: number; percentage: number }[],
  });

  const [subAnalysis, setSubAnalysis] = useState({
    subscriptionTotal: 0,
    oneTimeTotal: 0,
    subscriptionPercentage: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [summaryRes, trendRes, categoryRes, subAnalysisRes] = await Promise.all([
          axios.get('/api/analytics/summary'),
          axios.get('/api/analytics/monthly-trend'),
          axios.get('/api/analytics/expenses-by-category'),
          axios.get('/api/analytics/subscription-analysis'),
        ]);

        const summaryJson = summaryRes.data;
        const trendJson = trendRes.data;
        const categoryJson = categoryRes.data;
        const subAnalysisJson = subAnalysisRes.data;

        if (summaryJson.success) {
          const totalMonthlySpend = summaryJson.data.totalExpenses + summaryJson.data.monthlySubscriptionCost;
          const currentBudget = user?.monthlyBudget || 20000;
          setSummaryData({
            totalMonthlySpend,
            subscriptionSpend: summaryJson.data.monthlySubscriptionCost,
            expenseSpend: summaryJson.data.totalExpenses,
            monthlyBudget: currentBudget,
            remainingBudget: Math.max(0, currentBudget - totalMonthlySpend),
          });
        }

        if (trendJson.success) {
          setChartData(prev => ({ ...prev, monthlyTrend: trendJson.data.map((item: any) => ({ month: item.month, amount: item.expenses })) }));
        }

        if (categoryJson.success) {
          setChartData(prev => ({ ...prev, categoryBreakdown: categoryJson.data.map((item: any) => ({ category: item.categoryName || 'Unknown', amount: item.total, percentage: item.percentage })) }));
        }

        if (subAnalysisJson.success) {
          const subTotal = subAnalysisJson.data.subscriptions.monthlyTotal;
          const oneTimeTotal = subAnalysisJson.data.oneTimeExpenses.total;
          const total = subTotal + oneTimeTotal;
          setSubAnalysis({
            subscriptionTotal: subTotal,
            oneTimeTotal: oneTimeTotal,
            subscriptionPercentage: total > 0 ? Math.round((subTotal / total) * 100) : 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchAnalytics();
  }, [token, user]);

  const insights = [
    {
      type: "success" as const,
      title: "Budget Status",
      description: summaryData.totalMonthlySpend <= summaryData.monthlyBudget
        ? `You are within your budget! Remaining: ${format(convert(summaryData.remainingBudget, "INR"))}`
        : `You have exceeded your budget by ${format(convert(summaryData.totalMonthlySpend - summaryData.monthlyBudget, "INR"))}`,
      icon: summaryData.totalMonthlySpend <= summaryData.monthlyBudget ? TrendingDown : TrendingUp,
    },
    {
      type: "info" as const,
      title: "Subscription Impact",
      description: `Subscriptions make up ${subAnalysis.subscriptionPercentage}% of your current monthly spending.`,
      icon: Lightbulb,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Insights and trends about your spending
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total This Month</p>
              <Badge variant="secondary" className="text-xs">
                <TrendingDown className="mr-1 h-3 w-3" />
                12%
              </Badge>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {format(convert(summaryData.totalMonthlySpend, "INR"))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Avg. Daily Spend</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {format(convert(Math.round(summaryData.totalMonthlySpend / 30), "INR"))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Subscriptions</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {subAnalysis.subscriptionPercentage}%
            </p>
            <p className="text-xs text-muted-foreground">of total spending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Budget Used</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {Math.min(100, Math.round((summaryData.totalMonthlySpend / summaryData.monthlyBudget) * 100))}%
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{
                  width: `${Math.min(100, (summaryData.totalMonthlySpend / summaryData.monthlyBudget) * 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end justify-between gap-3">
              {chartData.monthlyTrend.map((item, index) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-foreground">
                    {symbol}{(convert(item.amount, "INR") / 1000).toFixed(1)}k
                  </span>
                  <div
                    className="w-full rounded-t-md bg-primary transition-all hover:bg-primary/80"
                    style={{
                      height: `${(item.amount / summaryData.monthlyBudget) * 180}px`,
                      opacity: index === chartData.monthlyTrend.length - 1 ? 1 : 0.6,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {chartData.categoryBreakdown.map((item, index) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`,
                      }}
                    />
                    <span className="text-foreground">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {format(convert(item.amount, "INR"))}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Subscription vs Other Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subscription vs Other Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative flex h-48 w-48 flex-shrink-0 items-center justify-center self-center">
              <svg className="h-48 w-48 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="12"
                  strokeDasharray={`${(subAnalysis.subscriptionTotal / summaryData.totalMonthlySpend || 0) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-3xl font-bold text-foreground">
                  {subAnalysis.subscriptionPercentage}%
                </p>
                <p className="text-xs text-muted-foreground">Subscriptions</p>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                  <span className="font-medium text-foreground">Subscriptions</span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  {format(convert(subAnalysis.subscriptionTotal, "INR"))}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-muted" />
                  <span className="font-medium text-foreground">Other Expenses</span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  {format(convert(subAnalysis.oneTimeTotal, "INR"))}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Smart Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <Alert key={index} variant={insight.type === "success" ? "default" : "default"}>
              <insight.icon className="h-4 w-4" />
              <AlertTitle>{insight.title}</AlertTitle>
              <AlertDescription>{insight.description}</AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
