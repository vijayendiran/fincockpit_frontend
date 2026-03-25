import { useCurrency, CURRENCY_SYMBOLS } from "../hooks/useCurrency";
import { useAuth } from "../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function CurrencySelector() {
  const { baseCurrency, currencies } = useCurrency();
  const { updateUser } = useAuth();
  const queryClient = useQueryClient();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newCurrency = e.target.value;

    // Save to backend & update local state via AuthContext helper
    const success = await updateUser({ currency: newCurrency });

    if (success) {
      // Invalidate cached rates so fresh rates are fetched for new base
      queryClient.invalidateQueries({ queryKey: ["currency-rates"] });
    } else {
      alert("Failed to update currency preference");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-muted-foreground whitespace-nowrap">Base Currency</label>
      <select
        value={baseCurrency}
        onChange={handleChange}
        className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {currencies.map((c: string) => (
          <option key={c} value={c}>
            {CURRENCY_SYMBOLS[c] || ""} {c}
          </option>
        ))}
      </select>
    </div>
  );
}
