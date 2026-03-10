import { jsPDF } from "jspdf";

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const PRIMARY: [number, number, number] = [49, 46, 129];
const ACCENT: [number, number, number] = [79, 70, 229];
const WHITE: [number, number, number] = [255, 255, 255];
const SUCCESS: [number, number, number] = [22, 163, 74];

const TRIAL_URL = "https://ledgerstash.com/signup";

export async function generateMigrationGuidePdf(
  competitor: "SmartVault" | "TaxDome" = "SmartVault"
): Promise<void> {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  const shieldBase64 = await loadImageAsBase64(
    `${window.location.origin}/images/ledgerstash-shield.png`
  );

  // ===== PAGE 1: Title =====
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pw, ph, "F");

  // Logo
  if (shieldBase64) {
    try {
      doc.setFillColor(...WHITE);
      doc.roundedRect(pw / 2 - 12, 55, 24, 24, 4, 4, "F");
      doc.addImage(shieldBase64, "PNG", pw / 2 - 10, 56, 20, 20);
    } catch {}
  }
  doc.setTextColor(...WHITE);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("LedgerStash", pw / 2, 95, { align: "center" });

  // Title
  doc.setFontSize(30);
  doc.text("60-Second Migration Guide", pw / 2, 125, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(`How to Move From ${competitor} to LedgerStash`, pw / 2, 145, {
    align: "center",
  });

  doc.setFontSize(11);
  doc.setTextColor(200, 200, 220);
  doc.text("4 steps. No downtime. No weekend sacrifice.", pw / 2, 160, {
    align: "center",
  });

  // Accent stripe
  doc.setFillColor(...ACCENT);
  doc.rect(0, ph - 30, pw, 4, "F");

  // Footer text
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 180);
  doc.text(
    "Ledger Stash — The Private Vault for Your Accounting Firm",
    pw / 2,
    ph - 14,
    { align: "center" }
  );

  // ===== PAGE 2: Steps + CTA =====
  doc.addPage();
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pw, ph, "F");

  // Section header
  doc.setTextColor(...WHITE);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Your 4-Step Migration Plan", pw / 2, 25, { align: "center" });

  let y = 40;

  const steps = [
    {
      num: "1",
      title: "The Export",
      body: `Log into ${competitor} and hit "Export All" to download your files as a local zip. This gives you a portable copy of everything — ready to move.`,
      time: "~2 minutes",
    },
    {
      num: "2",
      title: "The Branding",
      body: "Upload your firm's logo to LedgerStash. It takes about 10 seconds and instantly white-labels your entire client portal.",
      time: "~10 seconds",
    },
    {
      num: "3",
      title: "The Import",
      body: "Use our Bulk Folder Upload. Drag your client folders into LedgerStash. We automatically map the folder names to client accounts.",
      time: "~30 seconds",
    },
    {
      num: "4",
      title: "The Invite",
      body: 'Send a "Welcome" Magic Link to your clients. No passwords for them to reset, no onboarding for you to manage. They click and they\'re in.',
      time: "~20 seconds",
    },
  ];

  for (const step of steps) {
    doc.setFontSize(9);
    const bodyLines = doc.splitTextToSize(step.body, pw - 85);
    const cardH = 16 + bodyLines.length * 4;

    // Number circle
    doc.setFillColor(...ACCENT);
    doc.circle(28, y + cardH / 2, 7, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(step.num, 28, y + cardH / 2 + 4, { align: "center" });

    // Card
    doc.setFillColor(70, 67, 150);
    doc.roundedRect(42, y, pw - 58, cardH, 3, 3, "F");

    // Title
    doc.setTextColor(...WHITE);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(step.title, 48, y + 9);

    // Time
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 255, 180);
    doc.text(step.time, pw - 22, y + 9, { align: "right" });

    // Body
    doc.setTextColor(210, 210, 230);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(bodyLines, 48, y + 16);

    y += cardH + 10;
  }

  // CTA
  y += 8;
  doc.setFillColor(...SUCCESS);
  doc.roundedRect(pw / 2 - 55, y, 110, 16, 3, 3, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Start Your 14-Day Free Trial", pw / 2, y + 11, {
    align: "center",
  });
  doc.link(pw / 2 - 55, y, 110, 16, { url: TRIAL_URL });

  y += 24;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 220);
  doc.text("No credit card required. No user minimums.", pw / 2, y, {
    align: "center",
  });

  y += 12;
  const savingsText =
    competitor === "SmartVault"
      ? "Save $2,172+ per year vs. SmartVault"
      : "Save $452+ per year vs. TaxDome";
  doc.setFontSize(11);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.text(savingsText, pw / 2, y, { align: "center" });

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 180);
  doc.text(
    "Ledger Stash — The Private Vault for Your Accounting Firm",
    pw / 2,
    ph - 12,
    { align: "center" }
  );

  // Download
  const fileName = `LedgerStash_Migration_Guide_${competitor}.pdf`;
  const pdfBlob = doc.output("blob");
  const blobUrl = URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}
