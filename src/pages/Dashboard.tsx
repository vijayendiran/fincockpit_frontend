import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Target,
  Plus,
  Receipt,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { subscriptions, summaryData, chartData } from "@/data/mockData";

export default function Dashboard() {
  const upcomingRenewals = subscriptions
    .filter((sub) => sub.status === "active")
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Your financial overview at a glance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/subscriptions">
              <Plus className="mr-2 h-4 w-4" />
              Add Subscription
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/expenses">
              <Receipt className="mr-2 h-4 w-4" />
              Add Expense
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs">
                <TrendingDown className="mr-1 h-3 w-3" />
                12%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Monthly Spend</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{summaryData.totalMonthlySpend.toLocaleString("en-IN")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-xs">Monthly</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Subscription Spend</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{summaryData.subscriptionSpend.toLocaleString("en-IN")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="mr-1 h-3 w-3" />
                8%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Other Expenses</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{summaryData.expenseSpend.toLocaleString("en-IN")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-xs">
                {Math.round((summaryData.remainingBudget / summaryData.monthlyBudget) * 100)}% left
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Remaining Budget</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{summaryData.remainingBudget.toLocaleString("en-IN")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Renewals */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end justify-between gap-2">
              {chartData.monthlyTrend.map((item, index) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-primary transition-all hover:bg-primary/80"
                    style={{
                      height: `${(item.amount / 20000) * 200}px`,
                      opacity: index === chartData.monthlyTrend.length - 1 ? 1 : 0.6,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Renewals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Renewals</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/alerts">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingRenewals.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="font-medium text-foreground">{sub.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(sub.renewalDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
                <p className="font-semibold text-foreground">
                  ₹{sub.amount.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.categoryBreakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{item.category}</span>
                  <span className="font-medium text-foreground">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
