import { useState } from "react";
import axios from "../lib/axios";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "../hooks/useCurrency";

interface ParsedExpense {
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  currency?: string;
}

export function NLPExpenseInput({ onExpenseAdded, allCategories }: { 
  onExpenseAdded: () => void, 
  allCategories: { id: string, name: string }[] 
}) {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ParsedExpense | null>(null);
  const [loading, setLoading] = useState(false);
  const { format, convert, symbol } = useCurrency();

  async function handleParse() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post("/api/ai/parse-expense", { text });
      if (data.status === 'success') {
        setPreview(data.data);
      }
    } catch (e) {
      console.error(e);
      alert("AI could not parse that. Please try again or add manually.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!preview) return;

    try {
      // Find category ID
      let matchedCat = allCategories.find(c => c.name.toLowerCase() === preview.category.toLowerCase());
      let categoryId = matchedCat?.id;

      // If category doesn't exist, create it
      if (!categoryId) {
        const catRes = await axios.post('/api/categories', { 
          name: preview.category, 
          type: 'expense' 
        });
        if (catRes.data.success) {
          categoryId = catRes.data.data.category.id;
        }
      }

      await axios.post("/api/expenses", {
        title: preview.title,
        amount: preview.amount,
        categoryId: categoryId,
        date: preview.date,
        description: preview.description
      });

      setText("");
      setPreview(null);
      onExpenseAdded();
      alert("Expense added successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to add expense.");
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <Input
                placeholder={`Magic Entry: 'Pizza for 450 yesterday' or '${symbol}2000 for Petrol today'...`}
                className="pl-10 border-primary/20 focus-visible:ring-primary h-11"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleParse()}
                disabled={loading}
              />
            </div>
            <Button 
              onClick={handleParse} 
              disabled={loading || !text.trim()}
              className="h-11 px-6 shadow-sm"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Analyzing..." : "Magic Entry"}
            </Button>
          </div>

          {preview && (
            <div className="mt-4 rounded-xl border border-primary/10 bg-white dark:bg-zinc-950 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Verify Expense Details
                  </h4>
                  <p className="text-xs text-muted-foreground">AI has parsed your text into this structure:</p>
                </div>
                <Badge variant="outline" className="text-primary border-primary/20">
                  {preview.category}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Title</p>
                  <p className="text-sm font-medium">{preview.title}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount</p>
                  <p className="text-sm font-bold text-foreground">{format(convert(preview.amount, preview.currency || "INR"))}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">{preview.category}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">
                    {new Date(preview.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={handleConfirm}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  Confirm & Add
                </Button>
                <Button 
                  onClick={() => setPreview(null)}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Discard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
