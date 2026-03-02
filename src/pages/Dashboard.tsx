import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  FolderOpen, 
  BarChart3, 
  Plus,
  Clock,
  ArrowRight,
  CheckSquare,
  ChevronRight,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalDocuments: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [firmId, setFirmId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadFirmAndStats();
    }
  }, [user?.id]);

  const loadFirmAndStats = async () => {
    if (!user?.id) return;
    
    try {
      // Get user's firm
      const { data: firmMember } = await supabase
        .from('firm_members')
        .select('firm_id')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (!firmMember) {
        // Create a firm for this user
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        const firmName = profile?.full_name ? `${profile.full_name}'s Firm` : 'My Firm';
        
        const { data: newFirm } = await supabase
          .from('firms')
          .insert({ name: firmName, owner_id: user.id })
          .select()
          .single();

        if (newFirm) {
          await supabase
            .from('firm_members')
            .insert({ firm_id: newFirm.id, profile_id: user.id, role: 'owner' });
          setFirmId(newFirm.id);
          await fetchStats(newFirm.id);
        }
      } else {
        setFirmId(firmMember.firm_id);
        await fetchStats(firmMember.firm_id);
      }
    } catch (error) {
      console.error('Error loading firm:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchStats = async (fId: string) => {
    try {
      // Fetch clients
      const { data: clients, count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact' })
        .eq('firm_id', fId)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentClients(clients || []);

      // Fetch documents count
      const { count: docsCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .in('client_id', (clients || []).map(c => c.id));

      // Fetch tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('status')
        .in('client_id', (clients || []).map(c => c.id));

      const pending = (tasks || []).filter(t => t.status !== 'completed').length;
      const completed = (tasks || []).filter(t => t.status === 'completed').length;

      setStats({
        totalClients: clientsCount || 0,
        totalDocuments: docsCount || 0,
        pendingTasks: pending,
        completedTasks: completed,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (statsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card">
                <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: "Total Clients", value: stats.totalClients.toString(), icon: Users, clickAction: '/clients' },
    { label: "Documents", value: stats.totalDocuments.toString(), icon: FolderOpen, clickAction: '/documents' },
    { label: "Pending Tasks", value: stats.pendingTasks.toString(), icon: Clock, clickAction: '/clients' },
    { label: "Completed Tasks", value: stats.completedTasks.toString(), icon: CheckSquare, clickAction: '/clients' },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your firm.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="heroOutline" size="sm" asChild>
            <Link to="/clients">
              <Plus className="h-4 w-4" />
              Add Client
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <button
            key={stat.label}
            onClick={() => navigate(stat.clickAction)}
            className="stat-card text-left transition-all hover:shadow-md hover:border-accent/30 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-accent/10">
                <stat.icon className="h-5 w-5 text-accent" />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Quick Actions + Recent Clients */}
      {stats.totalClients === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Get started with VaultLedger
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Add your first client to start exchanging documents and assigning tasks securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" asChild>
              <Link to="/clients">
                <Users className="h-4 w-4" />
                Add Your First Client
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Add clients", desc: "Import your client list or add them one by one." },
              { step: "2", title: "Request documents", desc: "Create tasks and document requests for each client." },
              { step: "3", title: "Track progress", desc: "Monitor uploads, completions, and follow up as needed." },
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Clients</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/clients">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {recentClients.map((client) => (
              <Link
                key={client.id}
                to={`/clients/${client.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {client.first_name?.[0]}{client.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{client.first_name} {client.last_name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  client.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                }`}>
                  {client.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
