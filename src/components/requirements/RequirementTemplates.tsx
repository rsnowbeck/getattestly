import { FileText, Shield, BookOpen, AlertTriangle, Users, Lock, Heart, Briefcase } from "lucide-react";

export interface RequirementTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  suggestedFrequency: "one-time" | "annual";
  sampleDocLabel?: string;
  sampleDocContent?: string[];
}

export const requirementTemplates: RequirementTemplate[] = [
  {
    id: "nda",
    title: "Non-Disclosure Agreement (NDA)",
    description: "Acknowledgment of confidentiality obligations for handling sensitive company information, trade secrets, and proprietary data.",
    category: "Legal",
    icon: Lock,
    suggestedFrequency: "one-time",
    sampleDocLabel: "Download sample NDA",
    sampleDocContent: [
      "NON-DISCLOSURE AGREEMENT",
      "",
      "This Non-Disclosure Agreement (the \"Agreement\") is entered into as of [DATE]",
      "by and between [COMPANY NAME] (\"Company\") and the undersigned (\"Recipient\").",
      "",
      "1. CONFIDENTIAL INFORMATION",
      "\"Confidential Information\" means any non-public information disclosed by Company,",
      "including but not limited to trade secrets, business plans, financial data, customer",
      "lists, technical specifications, and proprietary processes.",
      "",
      "2. OBLIGATIONS",
      "Recipient agrees to:",
      "  a) Hold all Confidential Information in strict confidence",
      "  b) Not disclose Confidential Information to any third party",
      "  c) Use Confidential Information solely for authorized business purposes",
      "  d) Return or destroy all Confidential Information upon request",
      "",
      "3. DURATION",
      "This Agreement remains in effect for [DURATION] from the date of signing.",
      "",
      "4. EXCEPTIONS",
      "This Agreement does not apply to information that:",
      "  a) Is publicly available through no fault of Recipient",
      "  b) Was known to Recipient prior to disclosure",
      "  c) Is independently developed by Recipient",
      "  d) Is required to be disclosed by law",
      "",
      "ACKNOWLEDGED AND AGREED:",
      "",
      "Signature: ___________________________",
      "Name: ________________________________",
      "Date: ________________________________",
    ],
  },
  {
    id: "code-of-conduct",
    title: "Code of Conduct",
    description: "Acknowledgment of company values, ethical guidelines, and expected professional behavior standards.",
    category: "Policy",
    icon: BookOpen,
    suggestedFrequency: "annual",
    sampleDocLabel: "Download sample Code of Conduct",
    sampleDocContent: [
      "CODE OF CONDUCT",
      "",
      "[COMPANY NAME]",
      "",
      "PURPOSE",
      "This Code of Conduct outlines the standards of behavior expected of all employees,",
      "contractors, and representatives of [COMPANY NAME].",
      "",
      "1. INTEGRITY AND ETHICS",
      "  - Act honestly and ethically in all business dealings",
      "  - Avoid conflicts of interest",
      "  - Report any violations promptly",
      "",
      "2. RESPECT AND INCLUSION",
      "  - Treat all individuals with dignity and respect",
      "  - Foster an inclusive and diverse workplace",
      "  - Zero tolerance for discrimination or harassment",
      "",
      "3. CONFIDENTIALITY",
      "  - Protect company and client confidential information",
      "  - Follow data handling and privacy policies",
      "",
      "4. COMPLIANCE",
      "  - Follow all applicable laws and regulations",
      "  - Adhere to company policies and procedures",
      "  - Complete required training on time",
      "",
      "5. REPORTING VIOLATIONS",
      "  - Report concerns to your manager or HR",
      "  - Anonymous reporting available via [REPORTING CHANNEL]",
      "  - No retaliation for good-faith reports",
      "",
      "ACKNOWLEDGMENT:",
      "I have read and understand this Code of Conduct and agree to abide by its terms.",
      "",
      "Signature: ___________________________",
      "Name: ________________________________",
      "Date: ________________________________",
    ],
  },
  {
    id: "employee-handbook",
    title: "Employee Handbook",
    description: "Confirmation of receipt and understanding of the employee handbook covering policies, benefits, and procedures.",
    category: "HR",
    icon: Briefcase,
    suggestedFrequency: "annual",
    sampleDocLabel: "Download sample Employee Handbook",
    sampleDocContent: [
      "EMPLOYEE HANDBOOK ACKNOWLEDGMENT",
      "",
      "[COMPANY NAME]",
      "",
      "I acknowledge that I have received and reviewed the [COMPANY NAME] Employee",
      "Handbook. I understand that:",
      "",
      "1. The handbook outlines company policies, procedures, and benefits",
      "2. I am responsible for reading and understanding its contents",
      "3. The handbook may be updated from time to time",
      "4. I will be notified of any significant changes",
      "5. The handbook does not constitute an employment contract",
      "",
      "KEY SECTIONS COVERED:",
      "  - Employment policies and procedures",
      "  - Compensation and benefits",
      "  - Time off and leave policies",
      "  - Workplace conduct expectations",
      "  - Safety and security procedures",
      "  - Technology and communication policies",
      "  - Grievance and complaint procedures",
      "",
      "I agree to comply with the policies outlined in the Employee Handbook.",
      "",
      "Signature: ___________________________",
      "Name: ________________________________",
      "Date: ________________________________",
    ],
  },
  {
    id: "data-privacy",
    title: "Data Privacy Policy",
    description: "Acknowledgment of data handling practices, GDPR/CCPA compliance requirements, and privacy obligations.",
    category: "Compliance",
    icon: Shield,
    suggestedFrequency: "annual",
    sampleDocLabel: "Download sample Data Privacy Policy",
    sampleDocContent: [
      "DATA PRIVACY POLICY ACKNOWLEDGMENT",
      "",
      "[COMPANY NAME]",
      "",
      "As an employee or contractor, I acknowledge my responsibility to protect personal",
      "and sensitive data in accordance with applicable privacy laws including GDPR,",
      "CCPA, and company policy.",
      "",
      "I UNDERSTAND AND AGREE TO:",
      "",
      "1. DATA HANDLING",
      "  - Collect only necessary personal data",
      "  - Store data securely using approved systems",
      "  - Never share personal data without authorization",
      "",
      "2. DATA SUBJECT RIGHTS",
      "  - Individuals have the right to access their data",
      "  - Requests must be forwarded to the Privacy Officer",
      "  - Response deadlines must be met",
      "",
      "3. BREACH REPORTING",
      "  - Report any suspected data breach immediately",
      "  - Contact: [PRIVACY OFFICER EMAIL]",
      "  - Do not attempt to investigate independently",
      "",
      "4. CONSEQUENCES",
      "  - Violations may result in disciplinary action",
      "  - Legal penalties may apply for willful violations",
      "",
      "Signature: ___________________________",
      "Name: ________________________________",
      "Date: ________________________________",
    ],
  },
  {
    id: "security-awareness",
    title: "Security Awareness Training",
    description: "Confirmation of completing cybersecurity training covering phishing, password security, and safe computing practices.",
    category: "Security",
    icon: AlertTriangle,
    suggestedFrequency: "annual",
    sampleDocLabel: "Download sample Security Training doc",
    sampleDocContent: [
      "SECURITY AWARENESS TRAINING ACKNOWLEDGMENT",
      "",
      "[COMPANY NAME]",
      "",
      "I confirm that I have completed the annual Security Awareness Training and",
      "understand my responsibilities regarding information security.",
      "",
      "TOPICS COVERED:",
      "",
      "1. PHISHING AND SOCIAL ENGINEERING",
      "  - How to identify suspicious emails and links",
      "  - Reporting procedures for phishing attempts",
      "",
      "2. PASSWORD SECURITY",
      "  - Use strong, unique passwords for all accounts",
      "  - Enable multi-factor authentication where available",
      "  - Never share credentials",
      "",
      "3. DEVICE SECURITY",
      "  - Lock devices when unattended",
      "  - Keep software and systems updated",
      "  - Use only approved software and tools",
      "",
      "4. DATA PROTECTION",
      "  - Classify and handle data according to policy",
      "  - Use encryption for sensitive data",
      "  - Follow clean desk policy",
      "",
      "5. INCIDENT REPORTING",
      "  - Report security incidents to IT immediately",
      "  - Contact: [IT SECURITY EMAIL]",
      "",
      "Signature: ___________________________",
      "Name: ________________________________",
      "Date: ________________________________",
    ],
  },
  {
    id: "anti-harassment",
    title: "Anti-Harassment Policy",
    description: "Acknowledgment of workplace harassment prevention policies and reporting procedures.",
    category: "HR",
    icon: Users,
    suggestedFrequency: "annual",
    sampleDocLabel: "Download sample Anti-Harassment Policy",
    sampleDocContent: [
      "ANTI-HARASSMENT POLICY ACKNOWLEDGMENT",
      "",
      "[COMPANY NAME]",
      "",
      "[COMPANY NAME] is committed to maintaining a workplace free from harassment,",
      "discrimination, and retaliation.",
      "",
      "1. PROHIBITED CONDUCT",
      "  - Sexual harassment of any kind",
      "  - Discrimination based on protected characteristics",
      "  - Bullying or intimidation",
      "  - Retaliation against those who report",
      "",
      "2. REPORTING PROCEDURES",
      "  - Report to your supervisor, HR, or anonymously",
      "  - All reports will be investigated promptly",
      "  - Confidentiality maintained to the extent possible",
      "",
      "3. CONSEQUENCES",
      "  - Violations may result in disciplinary action up to termination",
      "  - Legal action may be pursued where applicable",
      "",
      "4. SUPPORT RESOURCES",
      "  - HR Department: [HR CONTACT]",
      "  - Employee Assistance Program: [EAP CONTACT]",
      "  - Anonymous Hotline: [HOTLINE NUMBER]",
      "",
      "I acknowledge that I have read and understand this policy.",
      "",
      "Signature: ___________________________",
      "Name: ________________________________",
      "Date: ________________________________",
    ],
  },
  {
    id: "health-safety",
    title: "Health & Safety Policy",
    description: "Acknowledgment of workplace health and safety guidelines, emergency procedures, and reporting requirements.",
    category: "Compliance",
    icon: Heart,
    suggestedFrequency: "annual",
    sampleDocLabel: "Download sample Health & Safety Policy",
    sampleDocContent: [
      "HEALTH & SAFETY POLICY ACKNOWLEDGMENT",
      "",
      "[COMPANY NAME]",
      "",
      "I acknowledge my responsibility to maintain a safe and healthy workplace.",
      "",
      "1. GENERAL SAFETY",
      "  - Follow all safety procedures and guidelines",
      "  - Use personal protective equipment as required",
      "  - Keep work areas clean and organized",
      "",
      "2. EMERGENCY PROCEDURES",
      "  - Know the location of emergency exits and equipment",
      "  - Follow evacuation procedures during drills and emergencies",
      "  - Report emergencies immediately to [EMERGENCY CONTACT]",
      "",
      "3. INCIDENT REPORTING",
      "  - Report all workplace injuries immediately",
      "  - Report unsafe conditions or near-misses",
      "  - Cooperate with incident investigations",
      "",
      "4. HEALTH AND WELLNESS",
      "  - Report any conditions that affect your ability to work safely",
      "  - Follow ergonomic guidelines",
      "  - Utilize wellness programs and resources",
      "",
      "Signature: ___________________________",
      "Name: ________________________________",
      "Date: ________________________________",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use Policy",
    description: "Agreement to acceptable use guidelines for company technology, internet access, and digital resources.",
    category: "IT",
    icon: FileText,
    suggestedFrequency: "annual",
    sampleDocLabel: "Download sample Acceptable Use Policy",
    sampleDocContent: [
      "ACCEPTABLE USE POLICY",
      "",
      "[COMPANY NAME]",
      "",
      "This policy governs the use of company technology resources, including computers,",
      "networks, email, internet access, and software.",
      "",
      "1. PERMITTED USE",
      "  - Company resources are provided for business purposes",
      "  - Limited personal use is acceptable if it does not interfere with work",
      "",
      "2. PROHIBITED ACTIVITIES",
      "  - Installing unauthorized software",
      "  - Accessing inappropriate or illegal content",
      "  - Using company resources for personal business ventures",
      "  - Attempting to bypass security controls",
      "  - Sharing account credentials",
      "",
      "3. EMAIL AND COMMUNICATION",
      "  - Use professional language in all communications",
      "  - Do not open suspicious attachments or links",
      "  - Company may monitor communications on its systems",
      "",
      "4. DATA AND STORAGE",
      "  - Store business data on approved systems only",
      "  - Do not use personal cloud storage for company data",
      "  - Follow data retention and disposal policies",
      "",
      "5. CONSEQUENCES",
      "  - Violations may result in loss of access privileges",
      "  - Disciplinary action up to and including termination",
      "",
      "Signature: ___________________________",
      "Name: ________________________________",
      "Date: ________________________________",
    ],
  },
];

export function getTemplateById(id: string): RequirementTemplate | undefined {
  return requirementTemplates.find((t) => t.id === id);
}

export function getTemplatesByCategory(): Record<string, RequirementTemplate[]> {
  return requirementTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, RequirementTemplate[]>);
}

export function generateSamplePdf(template: RequirementTemplate) {
  if (!template.sampleDocContent) return;
  
  import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 25;
    const lineHeight = 6;
    const pageHeight = doc.internal.pageSize.height;

    template.sampleDocContent!.forEach((line) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 25;
      }

      // Title lines (all caps or short) get bold
      if (line === line.toUpperCase() && line.length > 0 && !line.startsWith(" ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(line === template.sampleDocContent![0] ? 16 : 11);
      } else if (line.match(/^\d+\./)) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
      }

      if (line === "") {
        y += lineHeight * 0.5;
      } else {
        const lines = doc.splitTextToSize(line, doc.internal.pageSize.width - margin * 2);
        lines.forEach((l: string) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 25;
          }
          doc.text(l, margin, y);
          y += lineHeight;
        });
      }
    });

    doc.save(`${template.id}-sample.pdf`);
  });
}
