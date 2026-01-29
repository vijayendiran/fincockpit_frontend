import { TrendingUp, TrendingDown, PieChart, BarChart3, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { chartData, summaryData } from "@/data/mockData";

export default function Analytics() {
  const insights = [
    {
      type: "success" as const,
      title: "Great job!",
      description: "Your spending is 12% lower than last month. Keep it up!",
      icon: TrendingDown,
    },
    {
      type: "warning" as const,
      title: "Entertainment spending up",
      description: "You spent ₹1,947 on entertainment this month, 15% more than your average.",
      icon: TrendingUp,
    },
    {
      type: "info" as const,
      title: "Subscription tip",
      description: "Consider switching to yearly plans for Netflix and Spotify to save ₹1,200/year.",
      icon: Lightbulb,
    },
  ];

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
              ₹{summaryData.totalMonthlySpend.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Avg. Daily Spend</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              ₹{Math.round(summaryData.totalMonthlySpend / 30).toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Subscriptions</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {Math.round((summaryData.subscriptionSpend / summaryData.totalMonthlySpend) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">of total spending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Budget Used</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {Math.round(((summaryData.monthlyBudget - summaryData.remainingBudget) / summaryData.monthlyBudget) * 100)}%
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{
                  width: `${((summaryData.monthlyBudget - summaryData.remainingBudget) / summaryData.monthlyBudget) * 100}%`,
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
                    ₹{(item.amount / 1000).toFixed(1)}k
                  </span>
                  <div
                    className="w-full rounded-t-md bg-primary transition-all hover:bg-primary/80"
                    style={{
                      height: `${(item.amount / 20000) * 180}px`,
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
                      ₹{item.amount.toLocaleString("en-IN")}
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
                  strokeDasharray={`${(summaryData.subscriptionSpend / summaryData.totalMonthlySpend) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-3xl font-bold text-foreground">
                  {Math.round((summaryData.subscriptionSpend / summaryData.totalMonthlySpend) * 100)}%
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
                  ₹{summaryData.subscriptionSpend.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-muted" />
                  <span className="font-medium text-foreground">Other Expenses</span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  ₹{summaryData.expenseSpend.toLocaleString("en-IN")}
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
            <Alert key={index} variant={insight.type === "warning" ? "destructive" : "default"}>
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
