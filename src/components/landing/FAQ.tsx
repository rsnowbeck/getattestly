import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  {
    question: "What is Attestly?",
    answer:
      "Attestly is a secure client portal built for accounting and tax firms. It lets you exchange documents, assign tasks, and communicate with clients — all in one organized, branded portal.",
  },
  {
    question: "How do my clients access the portal?",
    answer:
      "You invite clients by email. They receive a branded invitation, create a simple account, and immediately see their tasks and document folders. No complex onboarding required.",
  },
  {
    question: "Is it secure enough for tax documents?",
    answer:
      "Yes. Attestly uses encrypted storage, role-based access control, and secure infrastructure. Only your firm and the specific client can access their documents — never other clients.",
  },
  {
    question: "Can I use it for engagement letters and agreements?",
    answer:
      "Absolutely. Create tasks for clients to review and sign engagement letters, fee agreements, or authorization forms. Track completion status from your dashboard.",
  },
  {
    question: "How is this different from email or shared drives?",
    answer:
      "Email is insecure and unorganized. Shared drives lack task tracking and client-specific access. Attestly gives you per-client folders, task management, automated reminders, and a professional branded experience.",
  },
  {
    question: "Can my team members access the portal too?",
    answer:
      "Yes. On the Firm and Practice plans, you can invite team members to your firm. They can manage clients, upload documents, and assign tasks alongside you.",
  },
  {
    question: "What types of files can clients upload?",
    answer:
      "Clients can upload any file type — PDFs, images, spreadsheets, Word documents, and more. There's no restriction on file formats.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Every plan includes a 14-day free trial with full access. No credit card required to start.",
  },
];

function useFAQSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-faq-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
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
    <section id="faq" className="pt-24 pb-24 bg-background">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
              Frequently asked questions
            </h2>
            <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
              Everything you need to know about Attestly
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-3">
                  {faq.answer.split("\n\n").map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
