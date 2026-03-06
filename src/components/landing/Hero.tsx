import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, LinkIcon, ClipboardCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="section-hero pt-20 lg:pt-28 pb-16 lg:pb-24">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Headline */}
          <h1 className="text-[2.1rem] font-extrabold tracking-tight leading-[1.12] text-foreground sm:text-[3.2rem] lg:text-[3.8rem] mb-4 animate-slide-up">
            A client vault for accounting firms —{" "}
            <span className="text-accent font-bold">no client logins, no per-user fees.</span>
          </h1>

          {/* Subheader */}
          <p className="mx-auto max-w-[44rem] text-lg text-muted-foreground mb-6 animate-slide-up" style={{ animationDelay: "0.08s" }}>
            Built for CPAs and accounting teams that need a simple way to collect client documents — secure upload links, no accounts, no passwords.
          </p>

          {/* Body copy */}
          <p className="mx-auto max-w-[42rem] text-base text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: "0.12s" }}>
            PBC checklists, reminders, and an organized vault for every client. Pricing scales by active clients, not seats — so solo CPAs avoid 3-user minimums and teams get unlimited users.
          </p>

          {/* Bullets */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center mb-2 text-sm text-foreground animate-slide-up" style={{ animationDelay: "0.18s" }}>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <span>Unlimited team members (no seat-based pricing)</span>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-accent" />
              <span>Secure upload links (clients upload in seconds)</span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-accent" />
              <span>PBC checklists + reminders (see what's missing)</span>
            </div>
          </div>

          {/* Pricing pain micro-line */}
          <p className="text-xs text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: "0.22s" }}>
            Avoid per-seat pricing and annual lock-ins common with firm portals.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 animate-slide-up" style={{ animationDelay: "0.28s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              No credit card • Setup in minutes • Priced by clients
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
