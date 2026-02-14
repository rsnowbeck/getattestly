export interface FormField {
  id: string;
  key: string;
  label: string;
  type: "text" | "checkbox" | "signature" | "date" | "email" | "number";
  required: boolean;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FormTemplate {
  id: string;
  requirement_id: string;
  organization_id: string;
  version: number;
  pdf_url: string;
  pdf_name: string | null;
  fields_json: FormField[];
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface FormSubmission {
  id: string;
  template_id: string;
  signing_request_id: string | null;
  organization_id: string;
  signer_email: string;
  signer_name: string | null;
  responses_json: Record<string, any>;
  snapshot_url: string | null;
  snapshot_status: string;
  submitted_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export const FIELD_TYPE_LABELS: Record<FormField["type"], string> = {
  text: "Text Input",
  checkbox: "Checkbox",
  signature: "Signature",
  date: "Date",
  email: "Email",
  number: "Number",
};
