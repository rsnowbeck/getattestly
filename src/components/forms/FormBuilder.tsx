import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Trash2,
  Eye,
  Save,
  Wand2,
  GripVertical,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { FormField, FIELD_TYPE_LABELS } from "./FormFieldTypes";

interface FormBuilderProps {
  requirementId: string;
  organizationId: string;
  pdfUrl: string;
  pdfName: string | null;
  templateId?: string;
  onPublish?: () => void;
  onClose?: () => void;
}

export function FormBuilder({
  requirementId,
  organizationId,
  pdfUrl,
  pdfName,
  templateId,
  onPublish,
  onClose,
}: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(templateId);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [templateStatus, setTemplateStatus] = useState("draft");

  useEffect(() => {
    if (templateId) {
      loadTemplate();
    } else {
      handleDetectFields();
    }
  }, [templateId]);

  const loadTemplate = async () => {
    if (!templateId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("form_templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (error) throw error;

      const fieldsData = typeof data.fields_json === "string"
        ? JSON.parse(data.fields_json)
        : data.fields_json;
      setFields(fieldsData || []);
      setTemplateStatus(data.status);
      setCurrentTemplateId(data.id);
    } catch (error) {
      console.error("Error loading template:", error);
      toast.error("Failed to load form template");
    } finally {
      setLoading(false);
    }
  };

  const handleDetectFields = async () => {
    setDetecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("detect-form-fields", {
        body: { pdfUrl, pdfName },
      });

      if (error) throw error;

      if (data.fields) {
        setFields(data.fields);
        toast.success(data.message || `Detected ${data.fields.length} fields`);
      }
    } catch (error: any) {
      console.error("Error detecting fields:", error);
      toast.error("Failed to detect fields. Adding default fields.");
      setFields(getDefaultFields());
    } finally {
      setDetecting(false);
    }
  };

  const getDefaultFields = (): FormField[] => [
    {
      id: crypto.randomUUID(),
      key: "full_name",
      label: "Full Name",
      type: "text",
      required: true,
      page: 1,
      x: 10,
      y: 70,
      width: 35,
      height: 4,
    },
    {
      id: crypto.randomUUID(),
      key: "signature",
      label: "Signature",
      type: "signature",
      required: true,
      page: 1,
      x: 10,
      y: 80,
      width: 40,
      height: 8,
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      if (currentTemplateId) {
        const { error } = await supabase
          .from("form_templates")
          .update({ fields_json: fields as any })
          .eq("id", currentTemplateId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("form_templates")
          .insert({
            requirement_id: requirementId,
            organization_id: organizationId,
            pdf_url: pdfUrl,
            pdf_name: pdfName,
            fields_json: fields as any,
            status: "draft",
          })
          .select("id")
          .single();
        if (error) throw error;
        setCurrentTemplateId(data.id);
      }
      toast.success("Form template saved");
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (fields.length === 0) {
      toast.error("Add at least one field before publishing");
      return;
    }

    setPublishing(true);
    try {
      // Save first
      let id = currentTemplateId;
      if (!id) {
        const { data, error } = await supabase
          .from("form_templates")
          .insert({
            requirement_id: requirementId,
            organization_id: organizationId,
            pdf_url: pdfUrl,
            pdf_name: pdfName,
            fields_json: fields as any,
            status: "published",
            published_at: new Date().toISOString(),
          })
          .select("id")
          .single();
        if (error) throw error;
        id = data.id;
      } else {
        const { error } = await supabase
          .from("form_templates")
          .update({
            fields_json: fields as any,
            status: "published",
            published_at: new Date().toISOString(),
          })
          .eq("id", id);
        if (error) throw error;
      }

      setCurrentTemplateId(id);
      setTemplateStatus("published");
      toast.success("Form template published!");
      onPublish?.();
    } catch (error: any) {
      console.error("Error publishing template:", error);
      toast.error("Failed to publish template");
    } finally {
      setPublishing(false);
    }
  };

  const addField = () => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      key: `field_${fields.length + 1}`,
      label: `New Field ${fields.length + 1}`,
      type: "text",
      required: false,
      page: 1,
      x: 10,
      y: 10 + fields.length * 8,
      width: 30,
      height: 4,
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  if (loading || detecting) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
        <p className="text-muted-foreground font-medium">
          {detecting ? "Detecting fields…" : "Loading template…"}
        </p>
        {detecting && (
          <p className="text-sm text-muted-foreground mt-1">
            AI is analyzing your document for fillable fields
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={templateStatus === "published" ? "default" : "secondary"}>
            {templateStatus === "published" ? "Published" : "Draft"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {fields.length} field{fields.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDetectFields} disabled={detecting}>
            <Wand2 className="h-4 w-4 mr-1" />
            Re-detect
          </Button>
          <Button variant="outline" size="sm" onClick={addField}>
            <Plus className="h-4 w-4 mr-1" />
            Add Field
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            Save
          </Button>
          <Button variant="hero" size="sm" onClick={handlePublish} disabled={publishing}>
            {publishing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PDF Preview with field overlays */}
        <div className="lg:col-span-2 card-elevated overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground text-sm">Document Preview</h3>
            <p className="text-xs text-muted-foreground">{pdfName || "Uploaded PDF"}</p>
          </div>
          <div className="relative bg-muted/30 min-h-[600px]">
            {/* PDF embed */}
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full h-[600px] border-0"
              title="PDF Preview"
            />
            {/* Field overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className={`absolute border-2 rounded cursor-pointer pointer-events-auto transition-all ${
                    selectedFieldId === field.id
                      ? "border-accent bg-accent/20 shadow-lg"
                      : "border-primary/40 bg-primary/10 hover:border-primary/60"
                  }`}
                  style={{
                    left: `${field.x}%`,
                    top: `${field.y}%`,
                    width: `${field.width}%`,
                    height: `${field.height}%`,
                  }}
                  onClick={() => setSelectedFieldId(field.id)}
                >
                  <span className="text-[10px] font-medium text-foreground px-1 truncate block">
                    {field.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Field List & Editor */}
        <div className="space-y-4">
          {/* Field list */}
          <div className="card-elevated">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm">Fields</h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {fields.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  No fields yet. Click "Add Field" or "Re-detect".
                </p>
              ) : (
                fields.map((field) => (
                  <div
                    key={field.id}
                    className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-b border-border last:border-0 transition-colors ${
                      selectedFieldId === field.id ? "bg-accent/10" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedFieldId(field.id)}
                  >
                    <GripVertical className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{field.label}</p>
                      <p className="text-xs text-muted-foreground">{FIELD_TYPE_LABELS[field.type]}</p>
                    </div>
                    {field.required && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">Required</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Field editor */}
          {selectedField && (
            <div className="card-elevated p-4 space-y-3">
              <h3 className="font-semibold text-foreground text-sm">Edit Field</h3>
              
              <div className="space-y-1.5">
                <Label className="text-xs">Label</Label>
                <Input
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Key</Label>
                <Input
                  value={selectedField.key}
                  onChange={(e) => updateField(selectedField.id, { key: e.target.value.replace(/\s/g, "_").toLowerCase() })}
                  className="h-8 text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Type</Label>
                <Select
                  value={selectedField.type}
                  onValueChange={(v) => updateField(selectedField.id, { type: v as FormField["type"] })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="field-required"
                  checked={selectedField.required}
                  onCheckedChange={(checked) => updateField(selectedField.id, { required: Boolean(checked) })}
                />
                <Label htmlFor="field-required" className="text-xs">Required</Label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px]">X %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={selectedField.x}
                    onChange={(e) => updateField(selectedField.id, { x: Number(e.target.value) })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Y %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={selectedField.y}
                    onChange={(e) => updateField(selectedField.id, { y: Number(e.target.value) })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Width %</Label>
                  <Input
                    type="number"
                    min={5}
                    max={90}
                    value={selectedField.width}
                    onChange={(e) => updateField(selectedField.id, { width: Number(e.target.value) })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Height %</Label>
                  <Input
                    type="number"
                    min={2}
                    max={15}
                    value={selectedField.height}
                    onChange={(e) => updateField(selectedField.id, { height: Number(e.target.value) })}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
