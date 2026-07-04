# Corporate Deliverables Hub

A high-performance, responsive Single-Page Application (SPA) designed to manage corporate deliverables, track compliance, generate 5:00 PM End of Day (EOD) status reports, and sync month-year tabs with Google Sheets backing stores.

---

## 🚀 Features Implemented

1. **Month-Year Tab Synchronization**
   - Automatically parses files with sheets grouped by month and year (e.g., `May_2026`).
   - Exports all items into structured, multi-tab offline Excel files divided chronologically by Month & Year.

2. **Spreadsheet Import Validation Wizard**
   - Before applying updates, users can review parsed spreadsheet rows.
   - Automatically flags potential duplicate rows (same task name and date).
   - Supports dual sync policies: **Merge & Skip Duplicates** or **Clean Overwrite Board**.

3. **Centralized Google Sheet Backing Store Link**
   - A configuration banner at the top of the hub allows direct access to the corporate Google Sheet.
   - Easily modify the URL directly from the application and persist changes.

4. **Interactive Filters and Visual Analytics**
   - Filter items instantly by Status, POC, Priority, and Deadline status.
   - Dynamic Month-Year Tab-Bar at the top of the table lets you toggle views instantly.
   - Real-time analytics charts and performance metrics counters.

5. **Operational Audit Trail & Change Logging**
   - Complete state tracking logs containing details of what was changed, by whom, and why.
   - Requires mandatory text input representing change compliance reasons when editing rows.

6. **End of Day (EOD) 5:00 PM Status Generator**
   - Simulated or live clock trackers checking if outstanding deliverables are due.
   - Copy beautifully formatted Slack or Email reports to your clipboard with a single click.

---

## 📂 Local Setup Instructions (VS Code)

To download and run this application locally on your machine, follow these simple steps:

### 📥 Step 1: Export Project Folder from AI Studio
1. In the top-right corner of Google AI Studio, locate the **Export** menu or **Settings**.
2. Click **Export as ZIP** to download the complete codebase folder to your local drive.
3. Extract the downloaded `.zip` file into a directory of your choice.

---

### 💻 Step 2: Open and Run in VS Code

#### 1. Open the Project
- Open **VS Code**.
- Click **File > Open Folder...** and select the extracted folder.

#### 2. Install Node.js Dependencies
Open a terminal in VS Code (`Ctrl + ~` on Windows, `Cmd + ~` on Mac) and run the install command:
```bash
npm install
```
*This downloads React, Vite, Tailwind CSS, Lucide icons, and the SheetJS Excel utility library.*

#### 3. Run the Local Development Server
Launch the high-speed dev environment with:
```bash
npm run dev
```

#### 4. Access the Application
- Once started, the terminal will output local URLs.
- Open your browser to: **`http://localhost:3000`**

---

## 📋 Operational Guide (How to Use)

### 🔑 1. User Authentication
* **Admin Login**:
  - Employee ID: `EMP-ADMIN`
  - Password: `Shilpi@1234`
  - *Full administrative controls. Can add, edit, and delete rows directly.*
* **Standard User (Viewer/Editor)**:
  - Select your name or register a standard Employee account.
  - *Note: Standard users are restricted from direct row deletion. Direct deletion requires the Master Password `Shilpi@1234`.*

### 🛠️ 2. Add or Edit Deliverables
- Use the **Add New Deliverable** panel on the right.
- To update an existing row, click the **Edit (Pencil)** icon in the action column.
- Write a short compliance reason for editing. This reason will be recorded securely in the **Changes Audit Log** tab.

### 📊 3. Filter and Group by Month Tabs
- Click on any Month tab (e.g. `May 2026`) on the spreadsheet header to view deliverables due in that specific period.
- Press **All** to return to the global list view.

### 📥 4. Backup & Excel Synced Restores
- Press the **Export to Excel** button to download a master Excel copy, separated neatly into sheets.
- Click **Import Excel** to load a backup spreadsheet. Use the **Validation Wizard** to preview tickets and select your Merge or Overwrite sync policy.
- To edit your master Google Sheet URL, click **Configure Link** in the black backing bar at the top, paste your new sheets URL, and click **Save**.

---

*Generated for Corporate Operations Hub Compliance - June 2026.*
