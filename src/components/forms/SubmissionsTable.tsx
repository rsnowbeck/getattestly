import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Eye, Loader2, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { FormSubmission, FormField } from "./FormFieldTypes";

interface SubmissionsTableProps {
  templateId: string;
  fields: FormField[];
}

export function SubmissionsTable({ templateId, fields }: SubmissionsTableProps) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [templateId]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("form_submissions")
        .select("*")
        .eq("template_id", templateId)
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      
      const typed = (data || []).map((d: any) => ({
        ...d,
        responses_json: typeof d.responses_json === "string" ? JSON.parse(d.responses_json) : d.responses_json,
      })) as FormSubmission[];
      
      setSubmissions(typed);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (submissions.length === 0) return;

    const fieldKeys = fields.map((f) => f.key);
    const headers = ["Submitted At", "Signer Email", "Signer Name", ...fields.map((f) => f.label), "IP Address"];

    const rows = submissions.map((s) => [
      format(new Date(s.submitted_at), "yyyy-MM-dd HH:mm"),
      s.signer_email,
      s.signer_name || "",
      ...fieldKeys.map((key) => {
        const val = s.responses_json[key];
        if (typeof val === "boolean") return val ? "Yes" : "No";
        return String(val || "");
      }),
      s.ip_address || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
        </p>
        {submissions.length > 0 && (
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Signer</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Snapshot</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No submissions yet.
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{sub.signer_name || "—"}</p>
                    <p className="text-sm text-muted-foreground">{sub.signer_email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(sub.submitted_at), "MMM d, yyyy h:mm a")}
                </TableCell>
                <TableCell>
                  {sub.snapshot_status === "completed" && sub.snapshot_url ? (
                    <a href={sub.snapshot_url} target="_blank" rel="noopener noreferrer">
                      <Badge className="bg-success/10 text-success border-success/20 cursor-pointer">
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Badge>
                    </a>
                  ) : sub.snapshot_status === "pending" ? (
                    <Badge variant="outline" className="text-warning">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Generating
                    </Badge>
                  ) : (
                    <Badge variant="secondary">—</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSubmission(sub)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Submission Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Signer</p>
                  <p className="text-sm font-medium">{selectedSubmission.signer_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{selectedSubmission.signer_email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-sm">{format(new Date(selectedSubmission.submitted_at), "MMM d, yyyy h:mm a")}</p>
                </div>
                {selectedSubmission.ip_address && (
                  <div>
                    <p className="text-xs text-muted-foreground">IP Address</p>
                    <p className="text-sm font-mono">{selectedSubmission.ip_address}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold mb-3">Responses</h4>
                <div className="space-y-3">
                  {fields.map((field) => {
                    const val = selectedSubmission.responses_json[field.key];
                    return (
                      <div key={field.key} className="flex justify-between items-start gap-4">
                        <span className="text-sm text-muted-foreground">{field.label}</span>
                        <span className="text-sm font-medium text-foreground text-right">
                          {field.type === "checkbox"
                            ? val ? "✓ Yes" : "✗ No"
                            : val || "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedSubmission.snapshot_url && (
                <div className="pt-2">
                  <a href={selectedSubmission.snapshot_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF Snapshot
                    </Button>
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
