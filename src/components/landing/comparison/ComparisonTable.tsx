import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface CompRow {
  feature: string;
  ledger: string;
  ledgerSub?: string;
  smart: string;
  smartSub?: string;
  tax: string;
  taxSub?: string;
  liscio: string;
  liscioSub?: string;
}

const rows: CompRow[] = [
  {
    feature: "Solo Firm Pricing",
    ledger: "$49/month flat",
    ledgerSub: "Unlimited team members included",
    smart: "$110/month min",
    smartSub: "Accounting Pro, 2-user minimum",
    tax: "~$800/seat — paid upfront annually",
    taxSub: "Full year billed upfront — no refunds, no cancellation",
    liscio: "$49/user + overages",
    liscioSub: "Demo required for monthly pricing",
  },
  {
    feature: "Staff Seat Minimums",
    ledger: "None",
    smart: "2–3 user minimum",
    tax: "Per seat",
    liscio: "Per user",
  },
  {
    feature: "Seasonal Staff Cost",
    ledger: "Always included",
    smart: "+$55/staff seat/month",
    tax: "Full year upfront per seat",
    liscio: "+$49/user/month",
  },
  {
    feature: "Annual Contract",
    ledger: "Month to month",
    smart: "Annual billing",
    tax: "Full year paid upfront",
    liscio: "Contact for monthly",
  },
  {
    feature: "Pricing Transparency",
    ledger: "Public",
    smart: "Demo required to purchase",
    tax: "Public",
    liscio: "Demo required",
  },
  {
    feature: "Context-Aware AI Client Bot",
    ledger: "Conversational, real-time checklist status",
    smart: "⚠️ SmartRequestAI — intake only",
    tax: "—",
    liscio: "—",
  },
  {
    feature: "AI Practice Intelligence Bot",
    ledger: "Portfolio queries + sends reminders",
    smart: "—",
    tax: "—",
    liscio: "—",
  },
  {
    feature: "E-Signatures",
    ledger: "Included all plans",
    smart: "⚠️ Add-on on most plans",
    tax: "Included",
    liscio: "Usage-billed",
  },
  {
    feature: "Client Accounts Required",
    ledger: "No — magic link",
    smart: "Yes — password portal",
    tax: "Yes",
    liscio: "Yes",
  },
  {
    feature: "Time to First Client",
    ledger: "Under 5 minutes",
    smart: "Guided setup required",
    tax: "6–8 weeks",
    liscio: "Demo required",
  },
];

const greenValues = [
  "$49/month flat",
  "None",
  "No — magic link",
  "Under 5 minutes",
  "Always included",
  "Month to month",
  "Public",
  "Included all plans",
  "Conversational, real-time checklist status",
  "Portfolio queries + sends reminders",
];
const isGreenValue = (val: string) =>
  greenValues.includes(val) || val.includes("Included");

const redKeywords = ["$110", "$800", "$55/staff", "$49/user", "Per user", "Per seat", "Demo required", "Full year", "Annual", "+$", "Yes", "Guided setup", "6–8 weeks", "Usage-billed", "password portal"];
const isRedValue = (val: string) => redKeywords.some((k) => val.includes(k));

const isDash = (val: string) => val === "—";
const isWarning = (val: string) => val.startsWith("⚠️");

export function ComparisonTable() {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto max-w-6xl mx-auto">
        <table className="w-full border-collapse bg-card rounded-xl shadow-md overflow-hidden">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-4 py-4 text-left font-semibold text-sm">Feature</th>
              <th className="px-4 py-4 text-left font-semibold text-sm">Ledger Stash</th>
              <th className="px-4 py-4 text-left font-semibold text-sm">SmartVault</th>
              <th className="px-4 py-4 text-left font-semibold text-sm">TaxDome</th>
              <th className="px-4 py-4 text-left font-semibold text-sm">Liscio</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-4 font-semibold text-foreground text-sm">
                  {row.feature}
                </td>
                {/* LedgerStash column */}
                <td className="px-4 py-4 text-sm font-bold bg-accent/5">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-success" />
                    <div>
                      <span className={isGreenValue(row.ledger) ? "text-success" : ""}>
                        {row.ledger}
                      </span>
                      {row.ledgerSub && (
                        <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                          {row.ledgerSub}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                {([
                  { val: row.smart, sub: row.smartSub },
                  { val: row.tax, sub: row.taxSub },
                  { val: row.liscio, sub: row.liscioSub },
                ] as const).map((col, j) => (
                  <td key={j} className="px-4 py-4 text-sm text-muted-foreground">
                    <span className={
                      isWarning(col.val) ? "text-amber-600 font-semibold" :
                      isRedValue(col.val) ? "text-destructive font-semibold" :
                      isDash(col.val) ? "text-muted-foreground/50" : ""
                    }>
                      {col.val}
                    </span>
                    {col.sub && (
                      <span className={`block text-xs mt-0.5 ${isRedValue(col.sub) ? "text-destructive" : ""}`}>
                        {col.sub}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-3 text-center italic">
          SmartVault Accounting Pro: $55/user/month, 2-user minimum, annual billing. TaxDome billed annually upfront. Liscio usage fees apply beyond base limits. Pricing as of 2026.
        </p>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <h3 className="font-semibold text-foreground text-sm mb-3">{row.feature}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 font-bold rounded-lg p-2 bg-accent/5">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-success" />
                <div>
                  <span className="text-xs text-muted-foreground font-normal block">Ledger Stash</span>
                  <span className={isGreenValue(row.ledger) ? "text-success" : ""}>
                    {row.ledger}
                  </span>
                  {row.ledgerSub && (
                    <span className="block text-xs font-normal text-muted-foreground">
                      {row.ledgerSub}
                    </span>
                  )}
                </div>
              </div>
              {[
                { label: "SmartVault", val: row.smart },
                { label: "TaxDome", val: row.tax },
                { label: "Liscio", val: row.liscio },
              ].map((c, j) => (
                <div key={j} className="text-muted-foreground p-2">
                  <span className="text-xs block font-medium text-foreground/60">{c.label}</span>
                  <span className={
                    isWarning(c.val) ? "text-amber-600" :
                    isRedValue(c.val) ? "text-destructive" : ""
                  }>
                    {c.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Full comparison link */}
      <div className="text-center mt-6">
        <Link to="/compare" className="text-sm font-medium text-accent hover:underline">
          See the full 25-point comparison →
        </Link>
      </div>
    </>
  );
}
