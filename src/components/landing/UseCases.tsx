import { UserPlus, PenTool, CalendarRange } from "lucide-react";

const useCases = [
  {
    icon: UserPlus,
    title: "Frictionless Onboarding",
    description:
      "Send new clients a branded link with an automated checklist of everything you need—prior year returns, EIN letters, and bank access. They complete it at their pace; you track it in real-time.",
  },
  {
    icon: PenTool,
    title: "Engagements & E-Signs",
    description:
      "Stop paying for separate e-sign software. Send engagement letters and fee agreements directly through the vault with ESIGN-compliant tracking and automated reminders for stragglers.",
  },
  {
    icon: CalendarRange,
    title: "Year-Round Advisory",
    description:
      'Use your vault for quarterly bookkeeping, consulting projects, or permanent file storage. Keep your clients organized 365 days a year without the "where did I send that email?" chaos.',
  },
];

export function UseCases() {
  return (
    <section className="pt-24 pb-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            One Tool. Every Client Milestone.
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed">
            LedgerStash isn't just for tax season. It's the professional infrastructure your firm needs from January to December.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="group p-8 rounded-xl bg-card border border-border hover:border-accent/50 transition-all duration-300"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <useCase.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-3">
                {useCase.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
