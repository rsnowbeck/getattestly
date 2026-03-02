import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { UseCases } from "@/components/landing/UseCases";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { StructuredData } from "@/components/landing/StructuredData";
import { PageSEO } from "@/components/seo/PageSEO";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Secure Client Portal for Accountants | Attestly"
        description="Simplify tax season document exchange. Give your accounting firm a branded portal where clients upload documents, complete tasks, and stay organized — securely."
        keywords="client portal accountants, tax document collection software, secure document exchange CPA, accounting firm client portal, tax season document management"
        canonical="/"
      />
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <UseCases />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
