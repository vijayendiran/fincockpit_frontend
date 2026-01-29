import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Filter, CreditCard } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subscriptions as initialSubscriptions, categories, type Subscription } from "@/data/mockData";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amount: "",
    billingCycle: "monthly" as "monthly" | "yearly" | "weekly",
    startDate: "",
    notes: "",
  });

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || sub.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalMonthly = filteredSubscriptions
    .filter((sub) => sub.status === "active")
    .reduce((sum, sub) => {
      if (sub.billingCycle === "yearly") return sum + sub.amount / 12;
      if (sub.billingCycle === "weekly") return sum + sub.amount * 4;
      return sum + sub.amount;
    }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSub) {
      setSubscriptions(subscriptions.map(sub => 
        sub.id === editingSub.id
          ? { ...sub, ...formData, amount: parseFloat(formData.amount) }
          : sub
      ));
    } else {
      const newSub: Subscription = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        amount: parseFloat(formData.amount),
        billingCycle: formData.billingCycle,
        renewalDate: formData.startDate,
        status: "active",
        notes: formData.notes,
      };
      setSubscriptions([...subscriptions, newSub]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      amount: "",
      billingCycle: "monthly",
      startDate: "",
      notes: "",
    });
    setEditingSub(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setFormData({
      name: sub.name,
      category: sub.category,
      amount: sub.amount.toString(),
      billingCycle: sub.billingCycle,
      startDate: sub.renewalDate,
      notes: sub.notes || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary border-primary/20";
      case "paused":
        return "bg-muted text-muted-foreground border-muted";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-sm text-muted-foreground">
            Manage all your recurring subscriptions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSub ? "Edit Subscription" : "Add New Subscription"}
              </DialogTitle>
              <DialogDescription>
                {editingSub
                  ? "Update your subscription details"
                  : "Add a new recurring subscription to track"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subscription Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Netflix, Spotify"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Billing Cycle</Label>
                <Tabs
                  value={formData.billingCycle}
                  onValueChange={(value) =>
                    setFormData({ ...formData, billingCycle: value as typeof formData.billingCycle })
                  }
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly" className="flex-1">Yearly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSub ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{Math.round(totalMonthly).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <Badge variant="outline">
            {filteredSubscriptions.filter((s) => s.status === "active").length} Active
          </Badge>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subscriptions Table */}
      {filteredSubscriptions.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Billing</TableHead>
                <TableHead className="hidden md:table-cell">Next Renewal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{sub.category}</Badge>
                  </TableCell>
                  <TableCell>₹{sub.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="hidden capitalize sm:table-cell">
                    {sub.billingCycle}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(sub.renewalDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sub.status)} variant="outline">
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(sub)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{sub.name}"? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(sub.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No subscriptions found
            </h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding your first subscription"}
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subscription
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
