import { useState } from "react";
import { Bell, BellOff, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { alerts as initialAlerts, type Alert as AlertType } from "@/contexts/data/mockData";
import { useCurrency } from "../hooks/useCurrency";

export default function Alerts() {
  const [alertsList, setAlertsList] = useState<AlertType[]>(initialAlerts);
  const { format, convert } = useCurrency();

  const urgentAlerts = alertsList.filter((a) => a.daysUntilRenewal <= 3);
  const upcomingAlerts = alertsList.filter(
    (a) => a.daysUntilRenewal > 3 && a.daysUntilRenewal <= 14
  );

  const toggleReminder = (id: string) => {
    setAlertsList(
      alertsList.map((alert) =>
        alert.id === id ? { ...alert, reminderEnabled: !alert.reminderEnabled } : alert
      )
    );
  };

  const updateReminderDays = (id: string, days: string) => {
    setAlertsList(
      alertsList.map((alert) =>
        alert.id === id ? { ...alert, reminderDaysBefore: parseInt(days) } : alert
      )
    );
  };

  const getDaysColor = (days: number) => {
    if (days <= 3) return "bg-destructive/10 text-destructive border-destructive/20";
    if (days <= 7) return "bg-primary/10 text-primary border-primary/20";
    return "bg-muted text-muted-foreground border-muted";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alerts & Reminders</h1>
        <p className="text-sm text-muted-foreground">
          Never miss a subscription renewal
        </p>
      </div>

      {/* Urgent Alerts */}
      {urgentAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Urgent Renewals
          </h2>
          {urgentAlerts.map((alert) => (
            <Alert key={alert.id} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                {alert.subscriptionName}
                <Badge variant="outline" className="text-xs">
                  {alert.daysUntilRenewal === 0
                    ? "Today"
                    : alert.daysUntilRenewal === 1
                      ? "Tomorrow"
                      : `${alert.daysUntilRenewal} days`}
                </Badge>
              </AlertTitle>
              <AlertDescription>
                Renewing on{" "}
                {new Date(alert.renewalDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                })}{" "}
                for {format(convert(alert.amount, alert.currency || "INR"))}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Urgent (≤3 days)</p>
              <p className="text-2xl font-bold text-foreground">{urgentAlerts.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold text-foreground">
                {alertsList.filter((a) => a.daysUntilRenewal <= 7).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reminders Active</p>
              <p className="text-2xl font-bold text-foreground">
                {alertsList.filter((a) => a.reminderEnabled).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Renewals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Renewals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscription</TableHead>
                <TableHead>Renewal Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Reminder</TableHead>
                <TableHead>Days Before</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertsList.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.subscriptionName}</TableCell>
                  <TableCell>
                    {new Date(alert.renewalDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{format(convert(alert.amount, alert.currency || "INR"))}</TableCell>
                  <TableCell>
                    <Badge className={getDaysColor(alert.daysUntilRenewal)} variant="outline">
                      {alert.daysUntilRenewal} days
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.reminderEnabled}
                        onCheckedChange={() => toggleReminder(alert.id)}
                      />
                      {alert.reminderEnabled ? (
                        <Bell className="h-4 w-4 text-primary" />
                      ) : (
                        <BellOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={alert.reminderDaysBefore.toString()}
                      onValueChange={(value) => updateReminderDays(alert.id, value)}
                      disabled={!alert.reminderEnabled}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="2">2 days</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
