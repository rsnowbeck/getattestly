import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  {
    question: "What is compliance signature management software?",
    answer:
      "Compliance signature management software helps organizations collect, track, and store digital acknowledgments for policies, training, and legal documents. Attestly streamlines this process by letting recipients sign with one click—no accounts needed—while creating audit-ready proof with timestamps and IP addresses.",
  },
  {
    question: "Are digital signatures legally binding for compliance?",
    answer:
      "Yes. Digital signatures collected through Attestly are legally defensible. Each signature includes a timestamp, IP address, browser information, and the exact document version acknowledged. These records meet common audit and compliance requirements for employee handbooks, NDAs, training acknowledgments, and policy sign-offs.",
  },
  {
    question: "How much does Attestly cost?",
    answer:
      "Attestly offers a 14-day free trial with no credit card required. Paid plans start at $29/month (Starter) for up to 100 recipients and 10 requirements. The Pro plan at $79/month includes 500 recipients, unlimited requirements, and custom branding. Enterprise pricing is available for larger organizations.",
  },
  {
    question: "Do signers need to create an account to sign?",
    answer:
      "No. Signers receive a secure email link and can review and acknowledge documents instantly—no account creation, passwords, or app downloads required. This dramatically improves completion rates compared to systems that require signer registration.",
  },
  {
    question: "How does Attestly compare to DocuSign or Adobe Sign?",
    answer:
      "DocuSign and Adobe Sign are designed for contract negotiations with signature fields. Attestly is purpose-built for compliance acknowledgments—policies, training, and attestations that require proof of receipt and agreement. It's simpler, faster, and more affordable for this specific use case.",
  },
  {
    question: "Why use Attestly instead of my HR platform (ADP, Paylocity, BambooHR)?",
    answer:
      "HR platforms include acknowledgments as a small feature within a larger system. Attestly is purpose-built for fast, audit-ready compliance tracking without the overhead of a full HR platform. It also supports contractors, vendors, and anyone outside your HR system.",
  },
  {
    question: "What types of documents can I send for signature?",
    answer:
      "Attestly supports any document requiring acknowledgment: employee handbooks, codes of conduct, privacy policies (HIPAA, GDPR, CCPA), safety training, NDAs, vendor agreements, confidentiality agreements, and annual policy renewals. You can attach PDFs for recipients to review before signing.",
  },
  {
    question: "How do automated reminders work?",
    answer:
      "Attestly automatically sends reminder emails to recipients who haven't signed. You configure how many days after the initial request reminders go out. This eliminates manual follow-up and significantly improves completion rates for compliance deadlines.",
  },
  {
    question: "Can I export signature records for audits?",
    answer:
      "Yes. Attestly generates PDF proof documents that include the signer's name, email, timestamp, IP address, browser information, and the exact document they acknowledged. You can export individual records or bulk export for audits and legal proceedings.",
  },
  {
    question: "Is Attestly secure?",
    answer:
      "Yes. Attestly uses bank-level encryption for data at rest and in transit. Each signing link is unique and expires after use. We follow SOC 2 Type II compliant practices and are GDPR compliant. Your compliance data is stored securely in the cloud with regular backups.",
  },
  {
    question: "How do I get started with Attestly?",
    answer:
      "Sign up for a free 14-day trial—no credit card required. Create your first requirement, add recipients (manually or via CSV import), and send signature requests in minutes. Most teams are fully set up within 5 minutes.",
  },
];

// Generate FAQ Schema for AI and search engines
function useFAQSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-faq-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-faq-schema", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.querySelector('script[data-faq-schema]');
      if (el) el.remove();
    };
  }, []);
}

export function FAQ() {
  useFAQSchema();

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Attestly
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}