import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { escapeHtml, escapeAttr } from "../_shared/escape-html.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type EmailType = "initial" | "reminder" | "escalated" | "overdue";

interface SigningEmailRequest {
  recipientName: string;
  recipientEmail: string;
  requirementTitle: string;
  signingUrl: string;
  organizationName?: string;
  senderName?: string;
  senderEmail?: string;
  logoUrl?: string;
  emailType?: EmailType;
  dueDate?: string;
  daysUntilDue?: number;
  sendCount?: number;
  isPro?: boolean;
  customMessage?: string;
  isReminder?: boolean;
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function buildIntroLine(
  senderName: string | undefined,
  organizationName: string | undefined
): string {
  const hasRequester = senderName && senderName.trim().length > 0;
  const hasOrg = organizationName && organizationName.trim().length > 0;

  if (hasRequester && hasOrg) {
    return `${escapeHtml(senderName)} from ${escapeHtml(organizationName)} has requested the following documents:`;
  } else if (hasRequester) {
    return `${escapeHtml(senderName)} has requested the following documents:`;
  } else if (hasOrg) {
    return `${escapeHtml(organizationName)} has requested the following documents:`;
  } else {
    return `Your accountant has requested the following documents:`;
  }
}

function buildClosingStatement(organizationName: string | undefined): string {
  if (organizationName && organizationName.trim().length > 0) {
    return `This request is part of your document preparation process with ${escapeHtml(organizationName)}.`;
  }
  return `This request is part of your document preparation process.`;
}

function getEmailContent(
  emailType: EmailType,
  requirementTitle: string,
  senderName: string | undefined,
  organizationName: string | undefined,
  dueDate?: string,
  daysUntilDue?: number
): { subject: string; intro: string; buttonText: string; dueText: string; consequence: string; closing: string } {
  const formattedDueDate = dueDate ? formatDueDate(dueDate) : null;
  
  const intro = buildIntroLine(senderName, organizationName);
  const closing = buildClosingStatement(organizationName);
  
  switch (emailType) {
    case "initial":
      return {
        subject: `Action required: Please upload your documents — ${requirementTitle}`,
        intro,
        buttonText: "Upload Documents",
        dueText: formattedDueDate 
          ? `Please submit your documents by ${formattedDueDate}.`
          : `Please submit your documents as soon as possible.`,
        consequence: ``,
        closing,
      };
    
    case "reminder":
      return {
        subject: `Reminder: Your documents are still needed — ${requirementTitle}`,
        intro,
        buttonText: "Upload Documents",
        dueText: formattedDueDate
          ? `Please submit your documents by ${formattedDueDate}.`
          : `Please submit your documents as soon as possible.`,
        consequence: ``,
        closing,
      };
    
    case "escalated":
      const daysText = daysUntilDue !== undefined && daysUntilDue > 0
        ? `${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"}`
        : "soon";
      return {
        subject: `Urgent: ${requirementTitle} documents due in ${daysText}`,
        intro,
        buttonText: "Upload Documents",
        dueText: formattedDueDate
          ? `⏰ Due in ${daysText} (${formattedDueDate})`
          : `Please submit as soon as possible.`,
        consequence: `Missing this deadline may delay your tax filing.`,
        closing,
      };
    
    case "overdue":
      return {
        subject: formattedDueDate 
          ? `Final notice: ${requirementTitle} documents were due ${formattedDueDate}`
          : `Final notice: ${requirementTitle} documents are overdue`,
        intro,
        buttonText: "Upload Documents",
        dueText: formattedDueDate
          ? `The due date was ${formattedDueDate}.`
          : `These documents are now overdue.`,
        consequence: `These documents are overdue. Please submit them as soon as possible to avoid delays.`,
        closing,
      };
    
    default:
      return {
        subject: `Action required: Please upload your documents — ${requirementTitle}`,
        intro,
        buttonText: "Upload Documents",
        dueText: formattedDueDate
          ? `Please submit your documents by ${formattedDueDate}.`
          : `Please submit your documents as soon as possible.`,
        consequence: ``,
        closing,
      };
  }
}

function determineEmailType(
  explicitType?: EmailType,
  daysUntilDue?: number,
  sendCount?: number,
  isReminder?: boolean
): EmailType {
  if (explicitType) return explicitType;
  
  if (daysUntilDue !== undefined) {
    if (daysUntilDue < 0) return "overdue";
    if (daysUntilDue <= 5 || (sendCount && sendCount >= 3)) return "escalated";
  }
  
  if (isReminder || (sendCount && sendCount > 1)) return "reminder";
  
  return "initial";
}

function buildCustomMessageHtml(customMessage?: string): string {
  if (!customMessage || customMessage.trim().length === 0) {
    return "";
  }
  
  const sanitized = escapeHtml(customMessage);
  
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px; margin-bottom: 16px;">
      <tr>
        <td style="padding: 12px 16px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #0369a1; font-weight: 600;">Note from sender</p>
          <p style="margin: 0; font-size: 14px; color: #0c4a6e; line-height: 1.5;">${sanitized}</p>
        </td>
      </tr>
    </table>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const internalSecret = req.headers.get('x-internal-secret');
    const expectedSecret = Deno.env.get('INTERNAL_FUNCTION_SECRET');

    const hasValidSecret = expectedSecret && internalSecret === expectedSecret;

    let hasValidJwt = false;
    if (!hasValidSecret) {
      if (authHeader?.startsWith('Bearer ')) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_ANON_KEY')!,
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data, error } = await supabase.auth.getUser();
        hasValidJwt = !error && !!data?.user;
      }

      if (!hasValidJwt) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const { 
      recipientName, 
      recipientEmail, 
      requirementTitle, 
      signingUrl,
      organizationName,
      senderName,
      senderEmail,
      logoUrl,
      emailType: explicitEmailType,
      dueDate,
      daysUntilDue,
      sendCount,
      isPro = false,
      customMessage,
      isReminder
    }: SigningEmailRequest = await req.json();

    if (!recipientName || !recipientEmail || !requirementTitle || !signingUrl) {
      console.error("Missing required fields:", { recipientName, recipientEmail, requirementTitle, signingUrl });
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailType = determineEmailType(explicitEmailType, daysUntilDue, sendCount, isReminder);
    const { subject, intro, buttonText, dueText, consequence, closing } = getEmailContent(
      emailType,
      requirementTitle,
      senderName,
      organizationName,
      dueDate,
      daysUntilDue
    );

    // Escape all user-controlled values for HTML context
    const safeRecipientName = escapeHtml(recipientName);
    const safeRequirementTitle = escapeHtml(requirementTitle);
    const safeSigningUrl = escapeAttr(signingUrl);
    const safeLogoUrl = escapeAttr(logoUrl);

    // Build due date display HTML
    let dueDateHtml = "";
    if (dueText) {
      const isOverdue = emailType === "overdue";
      const isEscalated = emailType === "escalated";
      
      if (isOverdue || isEscalated) {
        const bgColor = isOverdue ? "#fef2f2" : "#fffbeb";
        const borderColor = isOverdue ? "#ef4444" : "#f59e0b";
        const textColor = isOverdue ? "#dc2626" : "#d97706";
        
        dueDateHtml = `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px; margin-bottom: 16px;">
            <tr>
              <td style="padding: 12px 16px; background-color: ${bgColor}; border-radius: 8px; border-left: 4px solid ${borderColor};">
                <p style="margin: 0; font-size: 14px; color: ${textColor}; font-weight: 500;">${dueText}</p>
              </td>
            </tr>
          </table>
        `;
      } else {
        dueDateHtml = `<p style="margin: 16px 0; font-size: 14px; color: #3f3f46;">${dueText}</p>`;
      }
    }

    const customMessageHtml = buildCustomMessageHtml(customMessage);

    // Build logo HTML
    const ledgerStashLogoUrl = "https://urpqjnoowsdehvkrqxmy.supabase.co/storage/v1/object/public/email-assets/attestly-logo.png?v=1";
    let logoHtml = "";
    if (isPro && logoUrl) {
      const logoAlt = organizationName ? `${escapeHtml(organizationName)} logo` : "Organization logo";
      logoHtml = `
        <img src="${safeLogoUrl}" alt="${logoAlt}" style="height: 40px; max-width: 160px; object-fit: contain; margin-bottom: 12px;" />
      `;
    } else {
      logoHtml = `
        <img src="${ledgerStashLogoUrl}" alt="LedgerStash" style="height: 48px; width: 48px; object-fit: contain; margin-bottom: 12px; border-radius: 8px;" />
      `;
    }

    // Build footer with escaped values
    const safeFooterSender = escapeHtml(senderName || "the requester");
    const safeFooterOrg = escapeHtml(organizationName);
    const footerText = organizationName
      ? `If you have questions, please contact ${safeFooterSender} or your primary contact at ${safeFooterOrg}.`
      : `If you have questions, please contact ${safeFooterSender}.`;

    console.log(`Sending ${emailType} email to ${recipientEmail} for "${requirementTitle}" via Brevo`);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 32px 32px 24px; text-align: center;">
                    ${logoHtml}
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #18181b;">LedgerStash</h1>
                    <hr style="margin-top: 20px; border: none; border-top: 1px solid #e4e4e7;" />
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 32px;">
                    <p style="margin: 0 0 16px; font-size: 16px; color: #3f3f46;">
                      Hi ${safeRecipientName},
                    </p>
                    <p style="margin: 0 0 24px; font-size: 16px; color: #3f3f46; line-height: 1.6;">
                      ${intro}
                    </p>
                    
                    <!-- Document Card -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border-radius: 8px; border: 1px solid #e4e4e7; margin-bottom: 8px;">
                      <tr>
                        <td style="padding: 16px;">
                          <p style="margin: 0; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Document</p>
                          <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #18181b;">${safeRequirementTitle}</p>
                        </td>
                      </tr>
                    </table>

                    ${dueDateHtml}

                    ${customMessageHtml}

                    ${consequence ? `<p style="margin: 0 0 16px; font-size: 13px; color: #71717a; font-style: italic; line-height: 1.5;">${consequence}</p>` : ""}
                    
                    ${closing ? `<p style="margin: 0 0 24px; font-size: 14px; color: #52525b; line-height: 1.5;">${closing}</p>` : ""}
                    
                    <!-- CTA Button -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <a href="${safeSigningUrl}" style="display: inline-block; padding: 14px 32px; background-color: #18181b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 8px;">
                            ${buttonText}
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 24px 0 0; font-size: 14px; color: #71717a; line-height: 1.6;">
                      ${footerText}
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                      If you didn't expect this email, you can safely ignore it.
                    </p>
                    <p style="margin: 8px 0 0; font-size: 12px; color: #a1a1aa;">
                      Need help? Contact <a href="mailto:hello@ledgerstash.com" style="color: #71717a;">hello@ledgerstash.com</a>
                    </p>
                    <p style="margin: 12px 0 0; font-size: 11px; color: #d4d4d8;">
                      Powered by <a href="https://ledgerstash.com" style="color: #a1a1aa; text-decoration: none;">LedgerStash</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "LedgerStash", email: "notifications@ledgerstash.com" },
        replyTo: senderEmail ? { email: senderEmail } : undefined,
        to: [{ email: recipientEmail, name: recipientName }],
        subject,
        htmlContent: emailHtml,
      }),
    });

    if (!brevoResponse.ok) {
      const errBody = await brevoResponse.text();
      console.error("Brevo error:", errBody);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send email. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const brevoData = await brevoResponse.json();
    console.log("Email sent successfully via Brevo:", brevoData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-signing-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
