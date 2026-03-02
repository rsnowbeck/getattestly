import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Shield, Clock, FileCheck, Lock } from "lucide-react";

export function Hero() {
  return (
    <section className="section-hero pt-20 lg:pt-28 pb-16 lg:pb-24">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex -translate-y-2 items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8 -mt-4 animate-fade-in">
            <Lock className="h-4 w-4 text-accent" />
            <span>End-to-End Encrypted Document Vault</span>
          </div>

          {/* Headline */}
          <h1 className="text-[2.1rem] font-extrabold tracking-tight leading-[1.12] text-foreground sm:text-[3.2rem] lg:text-[3.8rem] mb-3 animate-slide-up">
            Secure Client Vault<br />
            <span className="text-accent font-bold">For Your Firm</span>
          </h1>

          {/* Product Definition */}
          <p className="mx-auto max-w-[42rem] text-base text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: "0.08s" }}>
            VaultLedger gives accounting and tax firms a branded, secure vault where clients upload documents, complete PBC tasks, and exchange sensitive files — with full audit trails and automated follow-ups.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start 14-Day Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              See How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Live in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="card-elevated p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Secure Document Vault</h3>
            <p className="text-sm text-muted-foreground">
              Encrypted file exchange with per-client folders, version tracking, and organized document storage.
            </p>
          </div>

          <div className="card-elevated p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">PBC Task Management</h3>
            <p className="text-sm text-muted-foreground">
              Create and track "Provided By Client" task lists so clients know exactly what to upload and when.
            </p>
          </div>

          <div className="card-elevated p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Automated Reminders</h3>
            <p className="text-sm text-muted-foreground">
              Automatically follow up on missing documents so you never chase clients manually.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}