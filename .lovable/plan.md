
# Fix Step 01 in "How It Works" Section

## Summary
Update the first step in the How It Works section to match the requested copy.

## Changes

### File: `src/components/landing/HowItWorks.tsx`

**Update Step 01 (lines 6-8):**

| Field | Current | New |
|-------|---------|-----|
| description | "Import employees, contractors, or vendors. Add names, emails, and optional details like department or role." | "Import employees, contractors, or vendors. Add names and emails manually, or bulk import via CSV." |
| details[0] | "Bulk import via CSV" | "Add recipients manually or import via CSV" |
| details[1] | "Organize by groups" | "Organize by groups or roles" |
| details[2] | "No recipient limits on Pro plan" | (unchanged) |

## Technical Details
This is a simple text update to the `steps` array in `HowItWorks.tsx`. No structural changes needed - just updating the string values for the first step object.
