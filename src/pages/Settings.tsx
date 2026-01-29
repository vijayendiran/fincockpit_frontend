import { useState } from "react";
import { User, CreditCard, Bell, LogOut, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Rahul Kumar",
    email: "rahul.kumar@example.com",
    phone: "+91 98765 43210",
  });

  const [preferences, setPreferences] = useState({
    currency: "INR",
    monthlyBudget: "20000",
    emailReminders: true,
    pushNotifications: true,
    weeklyReport: false,
    reminderDays: "3",
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Profile Details</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Budget Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Budget Settings</CardTitle>
            </div>
            <CardDescription>Configure your financial preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={preferences.currency}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹ INR - Indian Rupee</SelectItem>
                  <SelectItem value="USD">$ USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">€ EUR - Euro</SelectItem>
                  <SelectItem value="GBP">£ GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Monthly Budget</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="budget"
                  type="number"
                  className="pl-8"
                  value={preferences.monthlyBudget}
                  onChange={(e) =>
                    setPreferences({ ...preferences, monthlyBudget: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminderDays">Default Reminder Days</Label>
              <Select
                value={preferences.reminderDays}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, reminderDays: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before</SelectItem>
                  <SelectItem value="2">2 days before</SelectItem>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="5">5 days before</SelectItem>
                  <SelectItem value="7">7 days before</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Budget
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Notification Preferences</CardTitle>
          </div>
          <CardDescription>Control how you receive reminders and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive renewal reminders via email
              </p>
            </div>
            <Switch
              checked={preferences.emailReminders}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, emailReminders: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get real-time alerts on your device
              </p>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, pushNotifications: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Spending Report</Label>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of your spending
              </p>
            </div>
            <Switch
              checked={preferences.weeklyReport}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, weeklyReport: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-destructive/50">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="font-medium text-foreground">Sign Out</p>
            <p className="text-sm text-muted-foreground">
              Sign out of your FinCockpit account
            </p>
          </div>
          <Button variant="destructive" asChild>
            <Link to="/login">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
