import { useState } from "react";
import { Plus, Edit2, Trash2, Settings2, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories as initialCategories } from "@/data/mockData";

export default function Admin() {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [defaultReminderDays, setDefaultReminderDays] = useState("3");

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const systemInfo = [
    { label: "App Version", value: "1.0.0" },
    { label: "Build Date", value: "January 29, 2025" },
    { label: "Environment", value: "Production" },
    { label: "Last Updated", value: "2 hours ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-sm text-muted-foreground">
          System configuration and management
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Manage Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Categories</CardTitle>
              <CardDescription>Manage expense and subscription categories</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                  <DialogDescription>
                    Create a new category for organizing your expenses
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category Name</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Groceries"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <Badge variant="secondary">{category}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Default Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Default Settings</CardTitle>
            </div>
            <CardDescription>Configure system-wide defaults</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Default Reminder Days</Label>
              <Select value={defaultReminderDays} onValueChange={setDefaultReminderDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before renewal</SelectItem>
                  <SelectItem value="2">2 days before renewal</SelectItem>
                  <SelectItem value="3">3 days before renewal</SelectItem>
                  <SelectItem value="5">5 days before renewal</SelectItem>
                  <SelectItem value="7">7 days before renewal</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This will apply to all new subscriptions
              </p>
            </div>
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select defaultValue="INR">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹ INR - Indian Rupee</SelectItem>
                  <SelectItem value="USD">$ USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">€ EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Budget Period</Label>
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">Save Defaults</Button>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">System Information</CardTitle>
          </div>
          <CardDescription>Application details and status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemInfo.map((info) => (
                <TableRow key={info.label}>
                  <TableCell className="font-medium">{info.label}</TableCell>
                  <TableCell>{info.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
