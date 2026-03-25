import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";
import { useAuth } from "../contexts/AuthContext";

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹", USD: "$", EUR: "€", GBP: "£",
  JPY: "¥", AED: "د.إ", SGD: "S$", AUD: "A$", CAD: "C$",
};

export function useCurrency() {
  const { user } = useAuth(); // get preferredCurrency from user profile
  // Note: user.currency is what we have in schema.prisma as default
  const baseCurrency = user?.currency ?? "INR";

  const { data, isLoading } = useQuery({
    queryKey: ["currency-rates", baseCurrency],
    queryFn: () =>
      axios
        .get("/api/currency/rates", { params: { base: baseCurrency } })
        .then((r) => r.data.data),
    staleTime: 1000 * 60 * 60, // re-use for 1 hour in frontend
    enabled: !!user,
  });

  // Convert any amount from any currency to user's preferred currency
  function convert(amount: number, fromCurrency = "INR"): number {
    if (!data?.rates || fromCurrency === baseCurrency) return amount;
    // Frankfurter rates are relative to base
    // If base is INR: rates[USD] is 0.012
    // amount(USD) / 0.012 = amount(INR)
    const inBase = amount / (data.rates[fromCurrency] ?? 1);
    return Math.round(inBase * (data.rates[baseCurrency] ?? 1) * 100) / 100;
  }

  // Format a number as a currency string e.g. "₹1,250.00"
  function format(amount: number, currency = baseCurrency): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  return {
    baseCurrency,
    symbol: CURRENCY_SYMBOLS[baseCurrency] ?? baseCurrency,
    rates: data?.rates ?? {},
    currencies: data?.currencies ?? Object.keys(CURRENCY_SYMBOLS),
    isLoading,
    convert,
    format,
  };
}
