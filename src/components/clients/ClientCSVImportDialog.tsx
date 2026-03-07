import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileText, AlertCircle, CheckCircle2, Download, Loader2, X } from "lucide-react";
import { parseClientsCSV, generateClientSampleCSV, type ParsedClient, type ClientCSVParseResult } from "@/lib/csvImportClients";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientCSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firmId: string;
  existingEmails: Set<string>;
  onSuccess: () => void;
  clientLimit: number;
  currentCount: number;
}

export function ClientCSVImportDialog({
  open,
  onOpenChange,
  firmId,
  existingEmails,
  onSuccess,
  clientLimit,
  currentCount,
}: ClientCSVImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ClientCSVParseResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "complete">("upload");
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }

    setFile(selectedFile);

    try {
      const content = await selectedFile.text();
      const result = parseClientsCSV(content);

      const newClients = result.valid.filter((c) => !existingEmails.has(c.email.toLowerCase()));
      const duplicateCount = result.valid.length - newClients.length;

      if (duplicateCount > 0) {
        result.errors.push({
          row: 0,
          message: `${duplicateCount} client(s) already exist and will be skipped`,
        });
      }

      setParseResult({ valid: newClients, errors: result.errors });
      setStep("preview");
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast.error("Failed to parse CSV file");
    }
  };

  const handleImport = async () => {
    if (!parseResult?.valid.length) return;

    const availableSlots = clientLimit === -1 ? Infinity : clientLimit - currentCount;
    const toImport = parseResult.valid.slice(0, availableSlots);

    if (toImport.length < parseResult.valid.length) {
      toast.error(`Can only import ${availableSlots} of ${parseResult.valid.length} clients due to plan limits`);
    }

    if (toImport.length === 0) {
      toast.error("No clients can be imported due to plan limits");
      return;
    }

    setImporting(true);

    try {
      const clients = toImport.map((c) => ({
        firm_id: firmId,
        first_name: c.first_name,
        last_name: c.last_name,
        email: c.email,
        notes: c.notes,
      }));

      const { error } = await supabase.from("clients").insert(clients);
      if (error) throw error;

      setImportedCount(clients.length);
      setStep("complete");
      toast.success(`Successfully imported ${clients.length} client(s)`);
      onSuccess();
    } catch (error: any) {
      console.error("Error importing clients:", error);
      toast.error(error.message || "Failed to import clients");
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadSample = () => {
    const csv = generateClientSampleCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "clients-template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Sample CSV downloaded");
  };

  const handleClose = () => {
    setFile(null);
    setParseResult(null);
    setStep("upload");
    setImportedCount(0);
    onOpenChange(false);
  };

  const resetToUpload = () => {
    setFile(null);
    setParseResult(null);
    setStep("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === "upload" && "Import Clients from CSV"}
            {step === "preview" && "Review Import"}
            {step === "complete" && "Import Complete"}
          </DialogTitle>
          <DialogDescription>
            {step === "upload" && "Upload a CSV file with client information"}
            {step === "preview" && "Review the clients before importing"}
            {step === "complete" && `Successfully imported ${importedCount} clients`}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Click to select CSV file</p>
              <p className="text-xs text-muted-foreground">or drag and drop</p>
            </div>

            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Need a template?</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleDownloadSample}>
                <Download className="h-4 w-4 mr-1" />
                Download Sample
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Required columns:</strong> First Name, Last Name, Email (or Full Name, Email)</p>
              <p><strong>Optional columns:</strong> Notes</p>
            </div>
          </div>
        )}

        {step === "preview" && parseResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <FileText className="h-5 w-5 text-accent" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file?.name}</p>
                <p className="text-xs text-muted-foreground">{parseResult.valid.length} valid, {parseResult.errors.length} issues</p>
              </div>
              <Button variant="ghost" size="sm" onClick={resetToUpload}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {parseResult.errors.length > 0 && (
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-warning mb-2">
                  <AlertCircle className="h-4 w-4" />
                  Issues Found
                </div>
                <ScrollArea className="max-h-24">
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {parseResult.errors.slice(0, 10).map((err, i) => (
                      <li key={i}>{err.row > 0 ? `Row ${err.row}: ` : ""}{err.message}</li>
                    ))}
                    {parseResult.errors.length > 10 && <li>...and {parseResult.errors.length - 10} more</li>}
                  </ul>
                </ScrollArea>
              </div>
            )}

            {parseResult.valid.length > 0 && (
              <div className="rounded-lg border border-border">
                <div className="p-3 border-b border-border bg-muted/30">
                  <p className="text-sm font-medium text-foreground">Clients to Import ({parseResult.valid.length})</p>
                </div>
                <ScrollArea className="max-h-48">
                  <div className="divide-y divide-border">
                    {parseResult.valid.slice(0, 20).map((c, i) => (
                      <div key={i} className="px-3 py-2 text-sm">
                        <p className="font-medium text-foreground">{c.first_name} {c.last_name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}{c.notes ? ` • ${c.notes}` : ""}</p>
                      </div>
                    ))}
                    {parseResult.valid.length > 20 && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">...and {parseResult.valid.length - 20} more</div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
              <Button variant="hero" className="flex-1" onClick={handleImport} disabled={importing || parseResult.valid.length === 0}>
                {importing ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Importing...</>
                ) : (
                  `Import ${parseResult.valid.length} Clients`
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center py-4">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
            <p className="text-foreground mb-6">{importedCount} client{importedCount !== 1 ? "s" : ""} have been added to your firm.</p>
            <Button variant="hero" onClick={handleClose}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
