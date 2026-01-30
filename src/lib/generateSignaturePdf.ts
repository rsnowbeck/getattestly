import { jsPDF } from "jspdf";
import { format } from "date-fns";

interface SignatureData {
  recipientName: string;
  recipientEmail: string;
  requirementTitle: string;
  signedName: string;
  sentAt: string | null;
  completedAt: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  signingRequestId: string;
}

export function generateSignaturePdf(data: SignatureData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor: [number, number, number] = [59, 130, 246]; // Blue
  const textColor: [number, number, number] = [31, 41, 55]; // Dark gray
  const mutedColor: [number, number, number] = [107, 114, 128]; // Gray

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Certificate of Acknowledgment", pageWidth / 2, 25, { align: "center" });

  // Document ID
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Document ID: ${data.signingRequestId}`, pageWidth / 2, 35, { align: "center" });

  // Main content area
  let yPos = 60;

  // Requirement title
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Requirement:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(data.requirementTitle, 20, yPos + 8);
  
  yPos += 30;

  // Divider
  doc.setDrawColor(229, 231, 235);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 15;

  // Signer Information Section
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(20, yPos, pageWidth - 40, 50, 3, 3, "F");
  
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Signer Information", 30, yPos + 12);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...mutedColor);
  
  doc.text("Name:", 30, yPos + 25);
  doc.setTextColor(...textColor);
  doc.text(data.recipientName, 70, yPos + 25);
  
  doc.setTextColor(...mutedColor);
  doc.text("Email:", 30, yPos + 35);
  doc.setTextColor(...textColor);
  doc.text(data.recipientEmail, 70, yPos + 35);
  
  doc.setTextColor(...mutedColor);
  doc.text("Signed As:", 30, yPos + 45);
  doc.setTextColor(...textColor);
  doc.text(data.signedName, 70, yPos + 45);

  yPos += 65;

  // Signature Details Section
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(20, yPos, pageWidth - 40, 40, 3, 3, "F");
  
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Signature Details", 30, yPos + 12);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const sentDate = data.sentAt 
    ? format(new Date(data.sentAt), "MMMM d, yyyy 'at' h:mm a") 
    : "—";
  const completedDate = data.completedAt 
    ? format(new Date(data.completedAt), "MMMM d, yyyy 'at' h:mm a") 
    : "—";
  
  doc.setTextColor(...mutedColor);
  doc.text("Sent:", 30, yPos + 25);
  doc.setTextColor(...textColor);
  doc.text(sentDate, 70, yPos + 25);
  
  doc.setTextColor(...mutedColor);
  doc.text("Signed:", 30, yPos + 35);
  doc.setTextColor(...textColor);
  doc.text(completedDate, 70, yPos + 35);

  yPos += 55;

  // Audit Trail Section
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(20, yPos, pageWidth - 40, 40, 3, 3, "F");
  
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Audit Trail", 30, yPos + 12);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  doc.setTextColor(...mutedColor);
  doc.text("IP Address:", 30, yPos + 25);
  doc.setTextColor(...textColor);
  doc.text(data.ipAddress || "Not recorded", 80, yPos + 25);
  
  doc.setTextColor(...mutedColor);
  doc.text("User Agent:", 30, yPos + 35);
  doc.setTextColor(...textColor);
  const userAgentDisplay = data.userAgent 
    ? (data.userAgent.length > 60 ? data.userAgent.substring(0, 60) + "..." : data.userAgent)
    : "Not recorded";
  doc.text(userAgentDisplay, 80, yPos + 35);

  yPos += 55;

  // Verification Statement
  doc.setDrawColor(229, 231, 235);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 15;
  
  doc.setTextColor(...mutedColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const verificationText = "This document certifies that the above-named individual has electronically acknowledged the specified requirement. The signature was captured through a secure, tokenized link and includes audit metadata for verification purposes.";
  const splitText = doc.splitTextToSize(verificationText, pageWidth - 40);
  doc.text(splitText, 20, yPos);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(229, 231, 235);
  doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);
  
  doc.setTextColor(...mutedColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`,
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  // Download the PDF
  const fileName = `signature-certificate-${data.signingRequestId.substring(0, 8)}.pdf`;
  doc.save(fileName);
}
