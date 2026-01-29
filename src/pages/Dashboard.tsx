import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Users, 
  FileText, 
  BarChart3, 
  LogOut,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Menu,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (!session?.user) {
          navigate("/login");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const stats = [
    { label: "Total Recipients", value: "0", icon: Users, change: "Add your first" },
    { label: "Active Requirements", value: "0", icon: FileText, change: "Create one" },
    { label: "Pending Signatures", value: "0", icon: Clock, change: "—" },
    { label: "Compliance Rate", value: "—", icon: BarChart3, change: "No data yet" },
  ];

  const navItems = [
    { label: "Dashboard", icon: BarChart3, href: "/dashboard", active: true },
    { label: "Recipients", icon: Users, href: "/recipients" },
    { label: "Requirements", icon: FileText, href: "/requirements" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-sidebar border-r border-sidebar-border">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Shield className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">Attestly</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Attestly</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border pt-16" onClick={(e) => e.stopPropagation()}>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-sidebar-border">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's an overview of your compliance status.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="heroOutline" asChild>
                <Link to="/recipients">
                  <Plus className="h-4 w-4" />
                  Add Recipient
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/requirements">
                  <Plus className="h-4 w-4" />
                  New Requirement
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Empty State */}
          <div className="card-elevated p-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
              <FileText className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Get started with Attestly
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Create your first compliance requirement and start collecting 
              acknowledgments from your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="heroOutline" asChild>
                <Link to="/recipients">
                  <Users className="h-4 w-4" />
                  Add Recipients
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/requirements">
                  <FileText className="h-4 w-4" />
                  Create Requirement
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-foreground">Add recipients</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add your employees, contractors, or vendors who need to acknowledge policies.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-foreground">Create requirements</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Define what needs to be acknowledged—policies, NDAs, training, and more.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-foreground">Send & track</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Publish to send signing links, then track completion in real-time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
