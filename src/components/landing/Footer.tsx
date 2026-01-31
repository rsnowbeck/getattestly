import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/security" className="text-muted-foreground hover:text-foreground transition-colors">
              Security
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            © Attestly
          </p>
        </div>
      </div>
    </footer>
  );
}
