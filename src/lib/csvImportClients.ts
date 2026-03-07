export interface ParsedClient {
  first_name: string;
  last_name: string;
  email: string;
  notes: string | null;
}

export interface ClientCSVParseResult {
  valid: ParsedClient[];
  errors: { row: number; message: string }[];
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseClientsCSV(content: string): ClientCSVParseResult {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());

  if (lines.length < 2) {
    return {
      valid: [],
      errors: [{ row: 0, message: "CSV must have a header row and at least one data row" }],
    };
  }

  const headers = parseCSVLine(lines[0]).map(normalizeHeader);

  const firstNameIdx = headers.findIndex((h) =>
    h === "firstname" || h === "first"
  );
  const lastNameIdx = headers.findIndex((h) =>
    h === "lastname" || h === "last"
  );
  const fullNameIdx = headers.findIndex((h) =>
    h === "fullname" || h === "name" || h === "clientname"
  );
  const emailIdx = headers.findIndex((h) =>
    h === "email" || h === "emailaddress"
  );
  const notesIdx = headers.findIndex((h) =>
    h === "notes" || h === "note" || h === "comments"
  );

  const hasNameParts = firstNameIdx !== -1 && lastNameIdx !== -1;
  const hasFullName = fullNameIdx !== -1;

  if (!hasNameParts && !hasFullName) {
    return {
      valid: [],
      errors: [{ row: 1, message: "Missing required columns: First Name + Last Name, or Full Name" }],
    };
  }

  if (emailIdx === -1) {
    return {
      valid: [],
      errors: [{ row: 1, message: "Missing required column: Email" }],
    };
  }

  const valid: ParsedClient[] = [];
  const errors: { row: number; message: string }[] = [];
  const seenEmails = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const rowNum = i + 1;

    let firstName = "";
    let lastName = "";

    if (hasNameParts) {
      firstName = values[firstNameIdx]?.trim() || "";
      lastName = values[lastNameIdx]?.trim() || "";
    } else if (hasFullName) {
      const full = values[fullNameIdx]?.trim() || "";
      const parts = full.split(/\s+/);
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || "";
    }

    const email = values[emailIdx]?.trim().toLowerCase() || "";
    const notes = values[notesIdx]?.trim() || null;

    if (!firstName) {
      errors.push({ row: rowNum, message: "Missing first name" });
      continue;
    }
    if (!lastName) {
      errors.push({ row: rowNum, message: "Missing last name" });
      continue;
    }
    if (!email) {
      errors.push({ row: rowNum, message: "Missing email" });
      continue;
    }
    if (!isValidEmail(email)) {
      errors.push({ row: rowNum, message: `Invalid email: ${email}` });
      continue;
    }
    if (seenEmails.has(email)) {
      errors.push({ row: rowNum, message: `Duplicate email: ${email}` });
      continue;
    }

    seenEmails.add(email);
    valid.push({ first_name: firstName, last_name: lastName, email, notes });
  }

  return { valid, errors };
}

export function generateClientSampleCSV(): string {
  return `First Name,Last Name,Email,Notes
John,Smith,john.smith@example.com,Annual tax client
Jane,Doe,jane.doe@example.com,Business returns
Bob,Wilson,bob@example.com,`;
}
