import { useState, useEffect } from "react";
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
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../hooks/useCurrency";
import { AnomalyCard } from "../components/AnomalyCard";
import { SavingsSuggestions } from "../components/SavingsSuggestions";
import { ForecastCard } from "../components/ForecastCard";
import { NLPExpenseInput } from "../components/NLPExpenseInput";
import axios from "../lib/axios";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency?: string;
  renewalDate: string;
  status: string;
}

export default function Dashboard() {
  const { token, user } = useAuth();
  const { format, convert } = useCurrency();

  const [summaryData, setSummaryData] = useState({
    totalMonthlySpend: 0,
    subscriptionSpend: 0,
    expenseSpend: 0,
    remainingBudget: 0,
    monthlyBudget: user?.monthlyBudget || 20000,
  });

  const [chartData, setChartData] = useState({
    monthlyTrend: [] as { month: string; amount: number }[],
    categoryBreakdown: [] as { category: string; amount: number; percentage: number }[],
  });

   const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
   const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([]);
   const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, trendRes, categoryRes, subsRes, allCatsRes] = await Promise.all([
        axios.get('/api/analytics/summary'),
        axios.get('/api/analytics/monthly-trend'),
        axios.get('/api/analytics/expenses-by-category'),
        axios.get('/api/subscriptions'),
        axios.get('/api/categories')
      ]);

      const summaryJson = summaryRes.data;
      const trendJson = trendRes.data;
      const categoryJson = categoryRes.data;
      const subsJson = subsRes.data;
      const allCatsJson = allCatsRes.data;

      if (summaryJson.success) {
        const totalMonthlySpend = summaryJson.data.totalExpenses + summaryJson.data.monthlySubscriptionCost;
        const currentBudget = user?.monthlyBudget || 20000;
        setSummaryData({
          totalMonthlySpend,
          subscriptionSpend: summaryJson.data.monthlySubscriptionCost,
          expenseSpend: summaryJson.data.totalExpenses,
          remainingBudget: Math.max(0, currentBudget - totalMonthlySpend),
          monthlyBudget: currentBudget
        });
      }

      if (trendJson.success) {
        setChartData(prev => ({ ...prev, monthlyTrend: trendJson.data.map((item: any) => ({ month: item.month, amount: item.expenses })) }));
      }

      if (categoryJson.success) {
        setChartData(prev => ({ ...prev, categoryBreakdown: categoryJson.data.map((item: any) => ({ category: item.categoryName || 'Unknown', amount: item.total, percentage: item.percentage })) }));
      }

      if (subsJson.success) {
        setSubscriptions(subsJson.data.subscriptions || []);
      }

      if (allCatsJson.success) {
        setAllCategories(allCatsJson.data.categories || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token]);

  const upcomingRenewals = subscriptions
    .filter((sub) => sub.status === "active")
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
    .slice(0, 4);

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
                {format(convert(summaryData.totalMonthlySpend, "INR"))}
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
                {format(convert(summaryData.subscriptionSpend, "INR"))}
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
                {format(convert(summaryData.expenseSpend, "INR"))}
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
                {format(convert(summaryData.remainingBudget, "INR"))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Spending Insights & Savings */}
      <div className="flex flex-col gap-6">
        <NLPExpenseInput 
          onExpenseAdded={fetchDashboardData} 
          allCategories={allCategories} 
        />
        <AnomalyCard />
        <SavingsSuggestions />
        <ForecastCard />
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
              {chartData.monthlyTrend.map((item, index) => {
                const maxAmount = Math.max(...chartData.monthlyTrend.map(i => i.amount), summaryData.monthlyBudget, 1);
                return (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-md bg-primary transition-all hover:bg-primary/80"
                      style={{
                        height: `${(item.amount / maxAmount) * 200}px`,
                        opacity: index === chartData.monthlyTrend.length - 1 ? 1 : 0.6,
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{item.month}</span>
                  </div>
                );
              })}
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
            {upcomingRenewals.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming renewals</p>
            )}
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
                  {format(convert(sub.amount, sub.currency || "INR"))}
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
                    {format(convert(item.amount, "INR"))}
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
