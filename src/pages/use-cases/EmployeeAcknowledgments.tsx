import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertTriangle, Shield, Clock, FileCheck, BarChart3, Download } from "lucide-react";

export default function EmployeeAcknowledgments() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Employee Policy Acknowledgment Software for SMBs"
        description="Track employee policy acknowledgments, recurring requirements, and signed documents with built-in audit logs and reminders. Simple internal document tracking for growing businesses."
        keywords="employee acknowledgment software, policy acknowledgment tracking, internal document tracking, employee signature tracking, employee handbook software, policy tracking software"
        canonical="/employee-acknowledgment-tracking"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                Track Employee Acknowledgments <span className="text-accent">Without the Spreadsheet Chaos</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
                Managing employee policy acknowledgments shouldn't require chasing emails or updating spreadsheets. Attestly makes it simple to send, track, and prove that employees have completed required documents — all in one place.
              </p>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you're distributing a new handbook, updating security policies, or requiring recurring acknowledgments, Attestly gives you visibility and defensible proof.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup" className="gap-2">
                    Start 14-Day Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* The Challenge */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">The Challenge</h2>
              <p className="text-muted-foreground mb-6">
                Internal document tracking often breaks down because:
              </p>
              <ul className="space-y-3">
                {[
                  "Employees forget to sign updated policies",
                  "Acknowledgments are buried in email threads",
                  "Spreadsheets become outdated",
                  "There's no clear audit trail",
                  "Recurring requirements are hard to manage",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6 font-medium">
                When documentation matters, manual systems create risk.
              </p>
            </div>
          </div>
        </section>

        {/* How Attestly Helps */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">How Attestly Helps</h2>
              <p className="text-muted-foreground mb-6">
                Attestly is built specifically for structured internal document tracking. With Attestly, you can:
              </p>
              <ul className="space-y-3">
                {[
                  "Upload employee handbooks and policy documents",
                  "Require acknowledgment with a signature",
                  "Add required fields such as name, title, or date",
                  "Assign documents to individuals or groups",
                  "Set one-time or recurring acknowledgment cycles",
                  "Automatically remind employees who haven't completed",
                  "Monitor completion status in real time",
                  "Export full activity logs and signed documents anytime",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Example Workflow */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Example Workflow</h2>
              <div className="space-y-4">
                {[
                  "Upload your updated employee handbook",
                  "Assign acknowledgment to all staff or specific groups",
                  "Automatic reminders go out to incomplete recipients",
                  "View real-time completion dashboard",
                  "Export audit-ready proof when needed",
                ].map((step, idx) => (
                  <div key={step} className="flex items-start gap-4">
                    <span className="flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-muted-foreground pt-1">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why It's Different */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">Why It's Different from Basic E-Signature Tools</h2>
              <p className="text-muted-foreground mb-6">
                General e-signature tools focus on one-off contracts. Attestly is designed for ongoing internal document tracking — giving you structured visibility, recurring workflows, and organized proof without enterprise complexity.
              </p>
            </div>
          </div>
        </section>

        {/* Built-In Proof */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Built-In Proof & Audit Logs</h2>
              <p className="text-muted-foreground mb-6">Every completed document includes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Clock, title: "Timestamped Activity", desc: "Every action is logged with precise timestamps." },
                  { icon: Shield, title: "IP Tracking", desc: "Capture IP address for every completion." },
                  { icon: FileCheck, title: "Secure Storage", desc: "All documents stored securely and accessible anytime." },
                  { icon: Download, title: "Exportable Data", desc: "Download PDF copies and structured CSV exports." },
                ].map((feature) => (
                  <div key={feature.title} className="card-elevated p-6">
                    <feature.icon className="h-6 w-6 text-accent mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mt-6">
                So you always have documentation when you need it.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Start Tracking Employee Acknowledgments Today</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Get started in minutes. No complex setup. No training required.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Your 14-Day Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
