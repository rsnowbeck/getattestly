import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Attestly</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Attestly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
