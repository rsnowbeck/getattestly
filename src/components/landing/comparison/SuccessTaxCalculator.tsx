import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Calculator } from "lucide-react";

export function SuccessTaxCalculator() {
  const [staffCount, setStaffCount] = useState(3);

  const enterpriseCost = staffCount * 800;
  const ledgerStashCost = 348;
  const annualSavings = enterpriseCost - ledgerStashCost;

  return (
    <div className="max-w-2xl mx-auto mt-14 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Calculate Your &ldquo;Success Tax&rdquo;
        </h3>
      </div>

      <label className="block text-sm font-medium text-foreground mb-4">
        How many staff members do you have?{" "}
        <span className="text-primary font-bold text-lg">{staffCount}</span>
      </label>

      <Slider
        min={1}
        max={50}
        step={1}
        value={[staffCount]}
        onValueChange={([v]) => setStaffCount(v)}
        className="mb-8"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg border border-border p-4 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Enterprise Portals
          </p>
          <p className="text-2xl font-bold" style={{ color: "#D93025" }}>
            ${enterpriseCost.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground"> / year</span>
          </p>
        </div>
        <div className="rounded-lg border border-border p-4 text-center" style={{ backgroundColor: "#F0F7FF" }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            LedgerStash
          </p>
          <p className="text-2xl font-bold" style={{ color: "#1E8E3E" }}>
            $348
            <span className="text-sm font-normal text-muted-foreground"> / year</span>
          </p>
        </div>
      </div>

      {annualSavings > 0 && (
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">Your Annual Savings</p>
          <p className="text-3xl font-bold text-primary">
            ${annualSavings.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
