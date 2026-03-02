# Attestly Pivot: Secure Client Portal for Accounting & Tax Firms

## Overview
Transform Attestly from a general compliance/HR document collection tool into a specialized **Secure Client Portal for solo and boutique accounting/tax firms**. The portal enables accountants to securely exchange documents with clients, assign tasks, and manage client relationships — all with a "Powered by Attestly" viral loop.

## Key Concepts
- **Two user roles**: Accountant (manages firm, clients, documents) and Client (uploads docs, completes tasks)
- **Firm**: An accounting/tax practice. Accountants create firms; clients belong to firms.
- **Folders & Documents**: Hierarchical file organization per client with secure upload/download via storage
- **Tasks**: Accountants assign tasks to clients (e.g., "Upload W-2", "Sign engagement letter")
- **Comments**: Communication on tasks or documents
- **Notifications**: In-app alerts for document uploads, task assignments, comments
- **"Powered by Attestly"**: Viral branding on client-facing portal and emails

## Architecture Decisions
- **Auth**: Keep existing auth system (email/password via Lovable Cloud). Adapt `profiles` table to include role info. Keep `user_roles` table for admin/owner, add new role enum values.
- **DB**: Create new tables (firms, clients, folders, documents, tasks, comments, notifications). Old compliance tables (requirements, signing_requests, recipients, form_templates, form_submissions, reminder_logs) will be left in place but unused — no routes will point to them.
- **Storage**: Reuse existing storage infrastructure. Create a new `client-documents` bucket for secure file storage.
- **Frontend**: Remove old compliance pages/routes. Build new accountant dashboard and client portal pages. Keep shared infrastructure (auth, layout, UI components, settings).

---

## Phase 1: Database Schema & Auth Updates
**Goal**: New tables with RLS, updated auth to support accountant/client roles.

### 1.1 Database Migration
Create new tables adapted for Lovable Cloud (no direct FK to auth.users — reference profiles.id instead):

**Table: firms**
- id, name, subdomain (unique), logo_url, owner_id (profile who created it), created_at, updated_at

**Table: firm_members** (replaces accountant_firm_associations)
- id, firm_id, profile_id, role ('owner', 'accountant', 'staff'), created_at

**Table: clients**
- id, firm_id, email, first_name, last_name, status ('active', 'inactive', 'onboarding'), notes, profile_id (nullable — linked when client creates account), created_at, updated_at

**Table: folders**
- id, client_id, name, parent_folder_id (self-ref), created_at, updated_at
- Unique constraint: (client_id, name, parent_folder_id)

**Table: documents**
- id, client_id, folder_id (nullable), uploaded_by (profile id), file_name, file_type, file_size_bytes, storage_path, created_at, updated_at

**Table: tasks**
- id, client_id, assigned_by (profile id), title, description, due_date, status ('pending', 'in_progress', 'completed'), priority ('low', 'medium', 'high'), created_at, updated_at

**Table: comments**
- id, task_id (nullable), document_id (nullable), user_id (profile id), content, created_at
- CHECK: at least one of task_id or document_id must be set

**Table: notifications**
- id, user_id (profile id), type, message, is_read (default false), related_entity_id, created_at

### 1.2 RLS Policies
- Firm members can CRUD within their firm
- Clients can only see their own data (documents, tasks, folders)
- Accountants can see all clients in their firm
- Owner role retains global read access

### 1.3 Storage
- Create `client-documents` bucket (private, not public)
- RLS on storage: firm members and the associated client can access files

### 1.4 Auth Updates
- Update `handle_new_user()` trigger: accountants get a firm created automatically (like current org behavior)
- Client signup flow: clients are invited by accountants (no self-signup initially)
- Add 'accountant' and 'client' to app_role enum or handle via firm_members role

---

## Phase 2: Landing Page Re-skin
**Goal**: Update all public-facing pages to target accounting/tax firms.

### 2.1 Landing Page (Index/Landing.tsx)
- **Hero**: "Secure Client Portal for Accountants" / "Simplify Tax Season Document Exchange"
- **Features**: Secure document exchange, client task management, organized folders, "Powered by Attestly" branding
- **How It Works**: 1) Create your firm portal, 2) Invite clients, 3) Exchange documents securely
- **Pricing**: Reframe for accounting firms (solo practitioner / small firm / growing firm)
- **Use Cases**: Tax document collection, engagement letters, client onboarding
- **FAQ**: Accounting-specific questions
- **Testimonials**: Placeholder accounting testimonials

### 2.2 SEO Pages
- Remove or redirect old compliance SEO pages
- Create new pages: `/secure-client-portal-accountants`, `/tax-document-collection-software`

### 2.3 Footer, Header, Meta
- Update all copy, meta titles/descriptions, structured data for accounting keywords

---

## Phase 3: Accountant Dashboard
**Goal**: Build the accountant's management interface.

### 3.1 Firm Setup
- Firm settings page (name, logo, subdomain)
- Team management (invite other accountants/staff to firm)

### 3.2 Client Management
- Client list page with search, filter by status
- Add client dialog (name, email, notes)
- Client detail page with tabs: Documents, Tasks, Profile

### 3.3 Document Management (Accountant View)
- Folder tree navigation per client
- Upload documents to client folders
- Download/delete documents
- Bulk upload support

### 3.4 Task Management (Accountant View)
- Create tasks for clients (title, description, due date, priority)
- Task list with status filters
- Mark tasks complete

### 3.5 Dashboard Overview
- Metrics: clients with outstanding documents, pending tasks, recent activity
- Quick actions: add client, upload document, create task

---

## Phase 4: Client Portal
**Goal**: Build the client-facing experience.

### 4.1 Client Invitation & Onboarding
- Accountant sends invite email → client creates account with token
- Client sees onboarding flow explaining the portal

### 4.2 Client Dashboard
- "Welcome, [Name]" with firm branding
- Outstanding tasks list
- Recent documents
- "Powered by Attestly" footer badge

### 4.3 Client Document View
- Browse folders, upload documents
- Download documents shared by accountant
- File type icons, upload progress

### 4.4 Client Task View
- See assigned tasks with due dates
- Mark tasks as complete (e.g., "I've uploaded my W-2")
- Add comments to tasks

---

## Phase 5: Communication & Notifications
**Goal**: Enable in-app communication and alerts.

### 5.1 Comments
- Comment threads on tasks and documents
- Real-time updates via Lovable Cloud realtime

### 5.2 Notifications
- In-app notification bell with unread count
- Notification types: document_uploaded, task_assigned, task_completed, comment_added
- Mark as read

### 5.3 Email Notifications
- Edge function to send email when: client uploads document, task assigned, task overdue
- Use existing Resend integration

---

## Phase 6: Cleanup & Polish
**Goal**: Remove old features, optimize, polish.

### 6.1 Remove Old Routes & Pages
- Remove: Requirements, Signatures, Recipients, Sign, RequirementDetail pages
- Remove: FormBuilder, SignerFormView, SubmissionsTable components
- Remove: Old SEO/blog/use-case pages
- Remove: Old edge functions (detect-form-fields, send-signing-email, verify-signing-token, send-auto-reminders)
- Clean up unused imports and components

### 6.2 Update Settings
- Rename "Organization" to "Firm" in settings
- Remove compliance-specific settings (auto-reminders for signing, etc.)
- Add firm branding settings (subdomain, logo)

### 6.3 Mobile Optimization
- Ensure client portal is fully mobile-responsive (clients often upload from phones)

### 6.4 "Powered by Attestly" Implementation
- Subtle badge on client portal
- Link in automated emails
- Badge links to landing page with UTM params

---

## File Mapping (Old → New)

| Old | New | Action |
|-----|-----|--------|
| pages/Dashboard.tsx | pages/accountant/Dashboard.tsx | Rebuild for accounting metrics |
| pages/Recipients.tsx | pages/accountant/Clients.tsx | Rebuild as client management |
| pages/Requirements.tsx | — | Remove |
| pages/RequirementDetail.tsx | pages/accountant/ClientDetail.tsx | Rebuild as client detail |
| pages/Signatures.tsx | — | Remove |
| pages/Sign.tsx | pages/client/Portal.tsx | Rebuild as client portal |
| pages/Settings.tsx | pages/Settings.tsx | Adapt for firm settings |
| pages/Landing.tsx | pages/Landing.tsx | Re-skin for accounting |
| components/layout/DashboardLayout.tsx | Update nav items | Adapt |
| — | pages/client/Dashboard.tsx | New |
| — | pages/client/Documents.tsx | New |
| — | pages/client/Tasks.tsx | New |
| — | pages/accountant/ClientDetail.tsx | New |

## Implementation Order
Start with **Phase 1** (DB + Auth), then **Phase 2** (Landing), then **Phase 3** (Accountant Dashboard), then **Phase 4** (Client Portal), then **Phase 5** (Notifications), then **Phase 6** (Cleanup).

Each phase should be implemented incrementally with user approval at each step.
