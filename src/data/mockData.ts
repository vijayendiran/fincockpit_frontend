export interface Subscription {
  id: string;
  name: string;
  category: string;
  amount: number;
  billingCycle: "monthly" | "yearly" | "weekly";
  renewalDate: string;
  status: "active" | "paused" | "cancelled";
  notes?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  notes: string;
}

export interface Alert {
  id: string;
  subscriptionName: string;
  renewalDate: string;
  amount: number;
  daysUntilRenewal: number;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
}

export const subscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    category: "Entertainment",
    amount: 649,
    billingCycle: "monthly",
    renewalDate: "2025-02-05",
    status: "active",
  },
  {
    id: "2",
    name: "Spotify Premium",
    category: "Entertainment",
    amount: 119,
    billingCycle: "monthly",
    renewalDate: "2025-02-10",
    status: "active",
  },
  {
    id: "3",
    name: "Amazon Prime",
    category: "Shopping",
    amount: 1499,
    billingCycle: "yearly",
    renewalDate: "2025-06-15",
    status: "active",
  },
  {
    id: "4",
    name: "Hotstar",
    category: "Entertainment",
    amount: 299,
    billingCycle: "monthly",
    renewalDate: "2025-02-20",
    status: "active",
  },
  {
    id: "5",
    name: "Gym Membership",
    category: "Health",
    amount: 1500,
    billingCycle: "monthly",
    renewalDate: "2025-02-01",
    status: "active",
  },
  {
    id: "6",
    name: "ChatGPT Plus",
    category: "Productivity",
    amount: 1660,
    billingCycle: "monthly",
    renewalDate: "2025-02-08",
    status: "active",
  },
  {
    id: "7",
    name: "iCloud 50GB",
    category: "Cloud Storage",
    amount: 75,
    billingCycle: "monthly",
    renewalDate: "2025-02-12",
    status: "active",
  },
];

export const expenses: Expense[] = [
  { id: "1", date: "2025-01-28", category: "Food & Dining", amount: 450, notes: "Dinner with friends" },
  { id: "2", date: "2025-01-27", category: "Transportation", amount: 120, notes: "Uber ride" },
  { id: "3", date: "2025-01-26", category: "Shopping", amount: 2500, notes: "New headphones" },
  { id: "4", date: "2025-01-25", category: "Food & Dining", amount: 180, notes: "Zomato order" },
  { id: "5", date: "2025-01-24", category: "Utilities", amount: 1200, notes: "Electricity bill" },
  { id: "6", date: "2025-01-23", category: "Entertainment", amount: 350, notes: "Movie tickets" },
  { id: "7", date: "2025-01-22", category: "Food & Dining", amount: 280, notes: "Swiggy order" },
  { id: "8", date: "2025-01-21", category: "Education", amount: 500, notes: "Online course" },
  { id: "9", date: "2025-01-20", category: "Transportation", amount: 200, notes: "Metro card recharge" },
  { id: "10", date: "2025-01-19", category: "Health", amount: 800, notes: "Medicine" },
];

export const alerts: Alert[] = [
  {
    id: "1",
    subscriptionName: "Gym Membership",
    renewalDate: "2025-02-01",
    amount: 1500,
    daysUntilRenewal: 3,
    reminderEnabled: true,
    reminderDaysBefore: 3,
  },
  {
    id: "2",
    subscriptionName: "Netflix",
    renewalDate: "2025-02-05",
    amount: 649,
    daysUntilRenewal: 7,
    reminderEnabled: true,
    reminderDaysBefore: 5,
  },
  {
    id: "3",
    subscriptionName: "ChatGPT Plus",
    renewalDate: "2025-02-08",
    amount: 1660,
    daysUntilRenewal: 10,
    reminderEnabled: true,
    reminderDaysBefore: 3,
  },
  {
    id: "4",
    subscriptionName: "Spotify Premium",
    renewalDate: "2025-02-10",
    amount: 119,
    daysUntilRenewal: 12,
    reminderEnabled: false,
    reminderDaysBefore: 3,
  },
  {
    id: "5",
    subscriptionName: "iCloud 50GB",
    renewalDate: "2025-02-12",
    amount: 75,
    daysUntilRenewal: 14,
    reminderEnabled: true,
    reminderDaysBefore: 2,
  },
];

export const categories = [
  "Entertainment",
  "Shopping",
  "Health",
  "Productivity",
  "Cloud Storage",
  "Education",
  "Food & Dining",
  "Transportation",
  "Utilities",
  "Other",
];

export const summaryData = {
  totalMonthlySpend: 12450,
  subscriptionSpend: 4302,
  expenseSpend: 6580,
  remainingBudget: 7550,
  monthlyBudget: 20000,
};

export const chartData = {
  monthlyTrend: [
    { month: "Aug", amount: 15200 },
    { month: "Sep", amount: 13800 },
    { month: "Oct", amount: 14500 },
    { month: "Nov", amount: 12900 },
    { month: "Dec", amount: 16200 },
    { month: "Jan", amount: 12450 },
  ],
  categoryBreakdown: [
    { category: "Entertainment", amount: 1947, percentage: 30 },
    { category: "Food & Dining", amount: 1560, percentage: 24 },
    { category: "Health", amount: 2300, percentage: 18 },
    { category: "Shopping", amount: 2500, percentage: 12 },
    { category: "Transportation", amount: 320, percentage: 8 },
    { category: "Other", amount: 1823, percentage: 8 },
  ],
};
