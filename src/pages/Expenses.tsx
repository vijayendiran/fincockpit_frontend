import { useState, useEffect } from "react";
import { Plus, Search, Filter, Receipt, TrendingUp, MoreVertical, Edit, Trash2 } from "lucide-react";
import { NLPExpenseInput } from "@/components/NLPExpenseInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency, CURRENCY_SYMBOLS } from "../hooks/useCurrency";
import axios from "../lib/axios";

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  notes: string;
  currency: string;
}

const months = [
  "All Months",
  ...Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString("en-IN", { month: "long", year: "numeric" });
  })
];

export default function Expenses() {
  const { token } = useAuth();
  const { format, convert, symbol, currencies, baseCurrency } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allCategories, setAllCategories] = useState<{ id: string, name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("All Months");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    category: "",
    amount: "",
    notes: "",
    currency: baseCurrency,
  });

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + convert(exp.amount, exp.currency), 0);

  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + convert(exp.amount, exp.currency);
    return acc;
  }, {} as Record<string, number>);

  const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/expenses');
      const json = response.data;
      if (json.success) {
        setExpenses(json.data.expenses.map((e: any) => ({
          id: e.id,
          date: e.date,
          category: e.category?.name || 'Other',
          amount: e.amount,
          notes: e.description || e.title,
          currency: e.currency || "INR"
        })));
      }
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories?type=expense');
      const json = response.data;
      if (json.success) setAllCategories(json.data.categories);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (token) {
      fetchExpenses();
      fetchCategories();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Find or create category
    let matchedCat = allCategories.find(c => c.name === formData.category);
    let categoryId = matchedCat?.id;

    if (!categoryId) {
      try {
        const catRes = await axios.post('/api/categories', {
          name: formData.category,
          type: 'expense'
        });
        const catJson = catRes.data;
        if (catJson.success) {
          categoryId = catJson.data.category.id;
          setAllCategories([...allCategories, catJson.data.category]);
        } else {
          alert("Failed to create category");
          return;
        }
      } catch (err) {
        console.error(err);
        alert("Failed to create category");
        return;
      }
    }

    try {
      const url = editingExpenseId ? `/api/expenses/${editingExpenseId}` : '/api/expenses';
      const payload = {
        title: formData.notes || 'Expense',
        description: formData.notes,
        amount: parseFloat(formData.amount),
        categoryId: categoryId,
        date: formData.date,
        currency: formData.currency
      };

      const response = editingExpenseId 
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      const json = response.data;
      if (json.success) {
        fetchExpenses();
        resetForm();
      } else {
        alert(json.message || "Failed to save expense");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    
    // Convert YYYY-MM-DD to date input format (already is)
    // Find category ID since we need it for the form?
    // Wait, formData.category is the NAME here.
    setFormData({
      date: new Date(expense.date).toISOString().split('T')[0],
      category: expense.category,
      amount: expense.amount.toString(),
      notes: expense.notes,
      currency: (expense as any).currency || "INR"
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await axios.delete(`/api/expenses/${id}`);
      const json = response.data;
      if (json.success) {
        setExpenses(expenses.filter(e => e.id !== id));
      } else {
        alert(json.message || "Failed to delete");
      }
    } catch (err) { console.error(err); }
  };

  const resetForm = () => {
    setFormData({
      date: "",
      category: "",
      amount: "",
      notes: "",
      currency: baseCurrency,
    });
    setEditingExpenseId(null);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your daily expenses
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpenseId ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              <DialogDescription>
                {editingExpenseId ? 'Update the details of your expense' : 'Record a new expense to track your spending'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c: string) => (
                        <SelectItem key={c} value={c}>
                          {CURRENCY_SYMBOLS[c] || ""} {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="What was this expense for?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">Save Expense</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Magic AI Entry */}
      <NLPExpenseInput onExpenseAdded={fetchExpenses} allCategories={allCategories} />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-foreground">
                {format(totalExpenses)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Highest Spending</p>
              <p className="text-xl font-bold text-foreground">
                {highestCategory ? highestCategory[0] : "N/A"}
              </p>
              {highestCategory && (
                <p className="text-sm text-muted-foreground">
                  {format(highestCategory[1])}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Expenses Table */}
      {filteredExpenses.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {format(convert(expense.amount, expense.currency || "INR"))}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {expense.notes}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(expense)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive "
                          onClick={() => handleDelete(expense.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No expenses found
            </h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {searchQuery || categoryFilter !== "all"
                ? "Try adjusting your filters"
                : "Start tracking your expenses"}
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
