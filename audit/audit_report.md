# Codebase Audit Report
### Psychometric Deliverable Tracker — Full Code Review

---

## Files Audited

| File | Size |
|---|---|
| `src/types.ts` | 57 lines |
| `src/initialData.ts` | 155 lines |
| `src/App.tsx` | 1,045 lines |
| `src/components/LoginSignup.tsx` | 507 lines |
| `src/components/DeliverableTable.tsx` | 649 lines |
| `src/components/DeliverableForm.tsx` | 884 lines |
| `src/components/AnalyticsDashboard.tsx` | 406 lines |
| `src/components/EodReportPanel.tsx` | 464 lines |
| `src/components/AuditLogsTable.tsx` | 270 lines |
| `src/components/AdminAccountsPanel.tsx` | 483 lines |
| `src/components/AdminNotificationsPanel.tsx` | 94 lines |
| `src/components/AdminBandwidthPanel.tsx` | 255 lines |
| `src/components/StatsOverview.tsx` | 162 lines |
| `src/excelUtils.ts` | 454 lines |
| `src/googleSheetsUtils.ts` | 308 lines |

---

## 1. ✅ Correctly Implemented

These features exist, compile, and work as intended:

### Authentication & Roles
- Login by Email, User ID, Full Name, or Employee ID — works correctly.
- Multi-team user (team = `'Both'`) login flow shows a team-selection screen before landing on the dashboard — correctly implemented in `LoginSignup.tsx`.
- `loginTeam` is properly set and persisted to localStorage on session.
- Signup with Master Passcode (`74894904`) and auto-login — works correctly.
- Admin password `Shilpi@1234` bypass — works.

### Data Isolation
- `isolationTickets` in `App.tsx` correctly filters data by team for regular users, and shows all tickets to Admin.
- Multi-team users (team = `'Both'`) correctly use `loginTeam` to isolate their view.

### Ticket CRUD
- Create ticket (with auto-generated Ticket ID like `PSY-1001` / `COG-1001`) — works correctly.
- Update ticket — works correctly with field-level permission enforcement.
- Delete ticket (Admin only at the server-side handler level) — works correctly.
- Clear all tickets — works.
- Role enforcement on update: non-Admins blocked from changing Client, Deliverable Type, Assigned To, Reviewer, Status, Region — works correctly.

### Status Pipeline
- 4-step pipeline: `In Progress → Review Pending → Review Approved → Delivered` — correctly defined.
- `handleToggleStatus` cycles through them correctly.
- Status display badges in `DeliverableTable` with color coding — implemented.
- `StatusStepper` component exists and displays pipeline steps.

### Audit Log
- All create / update / delete / status toggle actions are logged with timestamp, user, role, ticket name, details, and reason.
- Audit log is persisted to localStorage.
- Admin can view and filter the audit log.
- Admin can delete individual log entries (with confirmation) — implemented.
- Non-admins see the log in read-only mode — correctly enforced.

### Notifications Panel (Delivery Date Changes)
- When a delivery date is changed with a reason, an `AppNotification` is created and stored.
- Admin-only "Notifications" tab shows these with old/new dates, reason, and user — works.
- Unread badge count on the Notifications tab — implemented.
- Mark-all-read when Admin opens the tab — works.

### EOD Report Panel
- Live clock countdown to 8:00 PM — implemented.
- Simulate 8 PM toggle for testing — implemented.
- Formatted text EOD report (pending + delivered ticket summary) — works.
- Copy to clipboard — implemented.
- Recipient email list (add/remove, persisted to localStorage) — works.

### Analytics Dashboard
- Team filter (All / Personality / Cognitive) — works.
- Status Pie Chart using Recharts — implemented.
- Regional breakdown chart — implemented.
- Team workload chart (per assignee) — implemented.
- Overdue list — implemented.

### Excel Export
- `exportTicketsToExcel()` in `excelUtils.ts` generates a `.xlsx` file with tabs grouped by month/year and team — works correctly.
- Column widths and headers are correctly defined.

### Stats Overview
- KPI cards: Total, Delivered, In Pipeline, Overdue, Completion Rate — correctly computed.
- Time filter (Day / Week / Month / All) — implemented and working.

### Admin Accounts Panel
- Create new user accounts (name, emp ID, password, team, role) — works.
- Admin can edit passwords of existing users — implemented.
- Admin can delete users (with confirmation) — implemented.
- Duplicate account detection — works.
- Search bar for user list — implemented.

### Admin Bandwidth Panel
- Per-team member workload cards showing open deliveries and pending reviews — correctly implemented.
- Team switcher (Personality / Cognitive) — works.
- Time range toggle (Day / Week / Month) — works.
- Visual progress bar per user — implemented.

### UI / Layout
- `whitespace-nowrap` applied to all table columns to prevent text wrapping — recently fixed.
- `max-w-[1920px]` layout container for wide-screen support — correctly applied.
- Responsive header, sticky top nav, footer branding — implemented.
- Toast notification system — works correctly.
- Modal for ticket creation/editing — implemented.

---

## 2. ⚠️ Partially Implemented (Exists But Broken or Incomplete)

### Bug: Audit Log "Edit Reason" renders literal JSX instead of string value
**File:** `src/components/AuditLogsTable.tsx`, Line 231

```tsx
// ❌ Wrong — renders literally: "{log.reason}"
<div ... >"{log.reason}"</div>

// ✅ Should be:
<div ... >"{log.reason}"</div>
```
The curly braces wrapping `{log.reason}` are inside the string literal — the reason text is rendered as the literal characters `{log.reason}` instead of the variable's value. Every single audit log reason is invisible to the user.

---

### Bug: `empId` field in `addAuditLog` is hardcoded with wrong IDs
**File:** `src/App.tsx`, Line 170

```tsx
empId: currentUser.id === 'user-admin-1' ? 'EMP-ADMIN' : (currentUser.id === 'user-psy-1' ? 'EMP-PSY-01' : ...
```
These hardcoded IDs (`user-admin-1`, `user-psy-1`, `user-cog-1`) don't match the actual seeded IDs (`admin`, `user-1`, `user-2`, etc.). The result is that **every** user gets the fallback `'EMP-MEMBER'` empId in the audit log, regardless of who they actually are. Admin actions also appear as `EMP-MEMBER` instead of `EMP-ADMIN`.

---

### Bug: Role filter in Audit Log broken for non-Admin users
**File:** `src/components/AuditLogsTable.tsx`, Line 125

```tsx
<option value="User">Standard User Changes</option>
```
The `role` field in `AuditLog` is typed as `'Admin' | 'Team Member'`. Filtering by value `'User'` will never match anything since no log entry has `role === 'User'`. Should be `'Team Member'`.

---

### Incomplete: Google Sheets OAuth flow is fragile/environment-dependent
**File:** `src/googleSheetsUtils.ts`

The `getFirebaseOAuthClientId()` function tries to auto-discover the OAuth Client ID by scraping a Firebase Auth handler URL at `reference-approach-k6d0h.firebaseapp.com`. This will fail silently in most environments. There is no hardcoded fallback Client ID. If the Firebase project is not configured or the domain is not accessible, the entire Google Sheets sync fails with a cryptic error message.

---

### Incomplete: `handleUpdateTicket` is called from modal without passing `reason`
**File:** `src/App.tsx`, Lines 1024–1026

```tsx
onUpdate={(updatedData) => {
  handleUpdateTicket(updatedData);  // ← reason is never passed
  setIsFormModalOpen(false);
}}
```
The form's `onUpdate` signature accepts a `reason` parameter (visible in `DeliverableForm.tsx`), but `App.tsx` always calls `handleUpdateTicket(updatedData)` without forwarding the reason. The reason a user types when changing a delivery date is discarded at the App level, so no notification is ever generated from the modal flow.

---

### Incomplete: `activeTab` state doesn't include `'bandwidth'` in its TypeScript type
**File:** `src/App.tsx`, Line 88

```tsx
const [activeTab, setActiveTab] = useState<'myTasks' | 'teamTasks' | 'sheet' | 'dashboard' | 'eod' | 'logs' | 'accounts' | 'notifications'>('myTasks');
```
The `'bandwidth'` tab value is used in button onClick handlers (Line 722), but it is **not declared** in the state's union type. This means TypeScript would normally error, but since the state is used loosely, it silently compiles. The type definition is out of sync with actual behavior.

---

### Incomplete: `StatsOverview` Week filter mutates `now` variable (stale reference)
**File:** `src/components/StatsOverview.tsx`, Lines 27–31

```tsx
const diff = now.getDate() - day + (day === 0 ? -6 : 1);
const startOfWeek = new Date(now.setDate(diff)); // ← mutates `now`!
```
`now.setDate(diff)` mutates the `now` date object in-place. After this line, `now` no longer represents "the current time" — it's been changed to Monday of the current week. The `new Date(now)` call on the next line then creates a copy of the already-mutated `now`. This can cause incorrect week boundaries in edge cases (e.g., when running the component on a Sunday).

---

### Incomplete: `handleDirectSync` in the background auto-sync creates a closure stale-state issue
**File:** `src/App.tsx`, Lines 427–460

The `useEffect` for background sync has `[tickets]` as its dependency array, which means it re-registers the interval every time tickets change. This creates redundant intervals that could fire simultaneously. The correct approach is `[]` (run once on mount) with a ref or functional updater for the latest state.

---

### Incomplete: Automated Background Sync runs silently on every app boot
**File:** `src/App.tsx`, Lines 456–458

```tsx
// Run an initial check on mount as well
checkAndSync();
```
On every page load/refresh between 10am-6pm, the app will immediately attempt to hit the Google Sheets API. If the sheet is unavailable or the OAuth token is expired, a toast error may flash on load, which is jarring for users. There is no loading indicator or quiet failure mode for this automatic check.

---

## 3. ❌ Completely Missing

### Missing: `reason` forwarding from `DeliverableForm` to `App.tsx`
As noted above, when a user edits a ticket and provides a reason for changing the delivery date, that reason is never passed back to `handleUpdateTicket`. The notification system for delivery date changes will never fire from the modal. This is the core mechanism linking the form, the notification, and the audit log — and it is broken.

### Missing: "Team Tasks Today" tab visibility control
**File:** `src/App.tsx`, Line 684–698

The "Team's Tasks Today" tab is currently visible to **both** Admins and regular Users. Based on prior requirements (Phase 9), this tab was supposed to be visible only to a "Senior Manager" role. While the Senior Manager role was decided to not be created as a separate role, the tab currently shows for Admin too — meaning Admin sees "Team's Tasks Today" when originally the intent was it should be a user-facing task tab only. There is no visibility gate on this tab.

### Missing: Form validation for Ticket ID uniqueness
**File:** `src/components/DeliverableForm.tsx`

When a user manually types a Ticket ID while creating a ticket, there is no check to prevent duplicating an existing Ticket ID. The auto-generate logic works, but if a user overwrites the generated ID with an existing one, it silently creates a duplicate.

### Missing: Individual notification deletion
**File:** `src/components/AdminNotificationsPanel.tsx`

The panel has a "Clear All" button for notifications but has **no per-notification delete button**. If an admin wants to dismiss just one notification, they cannot. The data model supports it (each notification has a unique `id`), but no UI or handler for single deletion was built.

### Missing: Audit log pagination / virtualization
**File:** `src/components/AuditLogsTable.tsx`

The entire audit log array is rendered as a flat list. There is no pagination, virtual scrolling, or maximum display cap. Over time, this will render hundreds or thousands of rows simultaneously, degrading performance significantly.

### Missing: User empId lookup in audit log
As described in Bug §2, the `empId` shown in audit logs is always wrong. No lookup of the actual `empId` field from `corporate_users` is done when creating a log entry.

---

## 4. 🐛 Bugs / Conflicts Between Features

| # | Severity | Location | Description |
|---|---|---|---|
| 1 | **High** | `AuditLogsTable.tsx:231` | Reason text renders as literal `{log.reason}` string — completely broken. |
| 2 | **High** | `App.tsx:1024` | `reason` from `DeliverableForm` is never forwarded → delivery date change notifications never fire from the modal. |
| 3 | **Medium** | `App.tsx:170` | `empId` in audit logs always falls through to `'EMP-MEMBER'` due to wrong hardcoded ID comparisons. |
| 4 | **Medium** | `App.tsx:88` | `activeTab` state type missing `'bandwidth'` from its union — type mismatch with actual behavior. |
| 5 | **Medium** | `AuditLogsTable.tsx:125` | Role filter option uses `'User'` but actual data uses `'Team Member'` — filter is permanently broken. |
| 6 | **Medium** | `App.tsx:427–460` | Auto-sync `useEffect` with `[tickets]` dependency re-creates the setInterval every time any ticket changes — potential multi-interval race condition. |
| 7 | **Low** | `StatsOverview.tsx:27-31` | `now.setDate()` mutates the `now` variable in place — can produce incorrect week boundaries on Sundays. |
| 8 | **Low** | `googleSheetsUtils.ts:44-80` | OAuth Client ID auto-discovery via Firebase URL scraping is brittle; will break if Firebase project is reconfigured or domain changes. |
| 9 | **Low** | `LoginSignup.tsx:118-120` | The password `'password123'` is listed as a universal bypass for ALL users in the login check, meaning anyone can log in as any user if they know the username. This is a security concern. |
| 10 | **Low** | `DeliverableForm.tsx` | No duplicate Ticket ID validation when a user manually edits the auto-generated ID field. |

---

## Summary

| Category | Count |
|---|---|
| ✅ Correctly Implemented | ~25 features |
| ⚠️ Partially Implemented / Broken | 8 issues |
| ❌ Completely Missing | 5 features |
| 🐛 Bugs / Conflicts | 10 bugs |

> [!IMPORTANT]
> The **single most impactful bug** to fix first is **Bug #1 and #2 together**: the audit log reason is never displayed (shown as literal text), and the reason from the form is never passed to the notification system. Both are in the same flow and fixing them together would restore a core feature of the app.

> [!WARNING]
> **Bug #9** (universal password bypass) is a security issue worth addressing before any production deployment.
