---
description: "Update an existing report with new findings. Re-runs investigation agents with additional context and presents a diff before updating."
arguments:
  - name: filename
    description: "Report filename (with or without .md extension)"
    required: false
---

# Report Forge — Update Command

Updates an existing report with new findings. Re-runs relevant agents based on the scope of changes, merges new content with existing report, and presents a diff for approval before writing.

## Usage

```bash
# Update by filename
/report-forge:update 2026-02-12-notification-system-architecture.md

# Update by filename (without extension)
/report-forge:update 2026-02-12-notification-system-architecture

# Interactive selection (no filename provided)
/report-forge:update
```

## Implementation

### Step 1: Locate Report

**If filename provided:**
1. Check if filename includes `.md` extension; if not, append it
2. Search for the file across all `reports/` subdirectories:
   - Scan `reports/executive-summaries/`, `reports/technical-deep-dives/`, etc.
   - Match on exact filename
3. If found in multiple locations (unlikely), ask user to specify which one
4. If not found, display error: "Report not found: {filename}. List reports with /report-forge:list"

**If no filename provided:**
1. Scan all `reports/` subdirectories
2. Parse frontmatter from all reports
3. Display interactive selection menu:
   ```
   Select a report to update:

   1. [2026-02-12] Notification System Architecture (arch-review, Complete)
   2. [2026-02-08] Mobile App Performance Issues (perf-analysis, In Progress)
   3. [2026-02-05] Payment Integration Feasibility (feasibility, Complete)
   ...

   Enter number or 'q' to quit:
   ```
4. Wait for user selection

### Step 2: Read Existing Report

1. Read the report file
2. Parse YAML frontmatter and markdown body separately
3. Extract key metadata:
   - title, report_type, category, topic
   - related_entities, coverage_period
   - status, confidence, investigators
   - created, updated dates

4. Display current report summary:
   ```
   ## Current Report

   **Title**: Notification System Architecture
   **Type**: architecture-review
   **Category**: architecture
   **Status**: Complete
   **Created**: 2026-02-12 | **Updated**: 2026-02-12
   **Confidence**: High
   **Coverage**: 2026-01-01 to 2026-02-12
   **Related Entities**:
     - Products: WebApp
     - Modules: Notification Engine

   **File**: reports/architecture-reviews/2026-02-12-notification-system-architecture.md
   ```

### Step 3: Determine Update Scope

Ask the user what type of update they want:

```
What would you like to update?

1. Add new findings (re-run investigation with new context)
2. Update metadata only (change status, confidence, related entities, etc.)
3. Edit content manually (open for editing)

Enter number:
```

### Update Type 1: Add New Findings (Re-run Investigation)

**Step 3a: Gather Update Context**

Ask the user:
```
What new context or scope should the investigation include?

Examples:
  - "Focus on retry logic and error handling"
  - "Investigate changes since Feb 8"
  - "Add analysis of push notification provider"
  - "Include performance metrics from new logs"

New context:
```

**Step 3b: Determine Which Agents to Re-run**

Based on the original report's `investigators` array and the scope of changes:

- **Minor updates** (narrow focus, additive only): Re-run Investigator only
  - Example: "Check test coverage for new provider"
  - Investigator adds new findings, Synthesizer merges into existing report

- **Moderate updates** (new analysis needed): Re-run Investigator + Analyst
  - Example: "Investigate changes since last report"
  - Full re-analysis with new data, Synthesizer merges interpretations

- **Major updates** (significant scope change): Re-run full pipeline
  - Example: "Complete re-evaluation with new requirements"
  - Equivalent to generating a new report, but preserving metadata

Ask user to confirm scope assessment:
```
Based on your update context, I recommend re-running: [Investigator only / Investigator + Analyst / Full pipeline]

This will [gather new data / re-analyze findings / complete re-investigation].

Proceed with this approach? (yes/no, or suggest different scope)
```

**Step 3c: Spawn Agents**

Spawn agents using the same pattern as generate command, but with update context:

**Investigator prompt additions:**
```
## Update Context

You are UPDATING an existing report. The original investigation covered:
[Summary of original findings from existing report]

The user wants to add new findings focused on:
[New context from user input]

Focus your investigation on this new context. You may reference existing files/data, but prioritize new information or areas not covered in the original report.
```

**Analyst prompt additions:**
```
## Update Context

You are analyzing NEW findings to be added to an existing report.

Original Analysis Summary:
[Summary of original analyst interpretation from existing report]

New Investigator Findings:
[New findings from re-run]

Analyze the new findings. How do they relate to the original analysis? Do they confirm, contradict, or extend the original interpretation?
```

**Synthesizer prompt additions:**
```
## Update Context

You are UPDATING an existing report with new findings.

Existing Report Content:
[Full markdown body of existing report]

New Findings to Integrate:
[New Investigator output]

New Analysis (if applicable):
[New Analyst output]

Merge the new content into the existing report structure. Do NOT replace the entire report; integrate the new findings into the appropriate sections.

Update the `updated` field to today's date (2026-02-12).
Update the `investigators` array if new agents were used.
Adjust `confidence` if new findings change the assessment.

Present the COMPLETE updated report for approval, with changes clearly indicated.
```

**Step 3d: Present Diff**

After Synthesizer completes, present a **diff** of changes:

```
## Proposed Changes

### Frontmatter Changes:
- updated: 2026-02-12 → 2026-02-13
- confidence: High → Medium (new gaps identified)

### Content Changes:

**Section: Technical Analysis**
Added:
> Recent investigation of the retry logic reveals that email notifications lack the same resilience mechanisms found in push notifications. The email provider does not implement exponential backoff, leading to rapid retry exhaustion during transient failures.

**Section: Recommendations**
Added:
> 4. Implement exponential backoff for email notification retries, matching the pattern used in the push provider.

---

Approve these changes? (yes/no, or request revisions)
```

**Step 3e: Write Updated Report**

On approval:
1. Write the complete updated report to the same file path (overwrite)
2. Confirm: "Report updated: reports/architecture-reviews/2026-02-12-notification-system-architecture.md"

### Update Type 2: Update Metadata Only

**Step 3a: Display Current Metadata**

```
Current metadata:

1. Status: Complete
2. Confidence: High
3. Coverage Period: 2026-01-01 to 2026-02-12
4. Related Entities:
     Products: [WebApp]
     Modules: [Notification Engine]
     Clients: []
     Teams: []
     Cards: []

Which field would you like to update? (Enter number, or 'done' to finish)
```

**Step 3b: Interactive Updates**

For each field the user wants to change:

**Status:**
```
Current status: Complete
New status? (Draft, In Progress, Complete, Archived)
```

**Confidence:**
```
Current confidence: High
New confidence? (High, Medium, Low)
```

**Coverage Period:**
```
Current coverage: 2026-01-01 to 2026-02-12
Update coverage period? (yes/no)
  If yes:
    Start date (YYYY-MM-DD, or 'null'):
    End date (YYYY-MM-DD, or 'null'):
```

**Related Entities:**
```
Current products: [WebApp]
New products (comma-separated, or 'same' to keep):
```

Validate new values against enums and memory files (same validation as generate command).

**Step 3c: Present Metadata Diff**

```
## Proposed Metadata Changes

- status: Complete → In Progress
- updated: 2026-02-12 → 2026-02-13
- related_entities.modules: [Notification Engine] → [Notification Engine, Email Service, Push Service]

Approve these changes? (yes/no)
```

**Step 3d: Update Frontmatter Only**

On approval:
1. Update YAML frontmatter with new values
2. Update `updated` field to today
3. Leave markdown body unchanged
4. Write to same file path
5. Confirm: "Report metadata updated: [filepath]"

### Update Type 3: Edit Content Manually

Display message:
```
Manual editing is best done in your IDE or text editor.

File location: reports/architecture-reviews/2026-02-12-notification-system-architecture.md

After editing:
  - Ensure YAML frontmatter is valid
  - Update the 'updated' field to today's date
  - Refresh desktop app to see changes

Alternatively, use /report-forge:update with option 1 to add findings via agents.
```

## Error Handling

**Report not found:**
```
Error: Report not found: 2026-02-12-notification-system.md

List all reports: /report-forge:list
Search by topic: /report-forge:list --topic notification
```

**Invalid filename format:**
```
Error: Invalid filename format. Expected: YYYY-MM-DD-slug.md

Example: 2026-02-12-notification-system-architecture.md
```

**Corrupted frontmatter:**
```
Error: Unable to parse YAML frontmatter in report file.

File: reports/architecture-reviews/2026-02-12-notification-system.md

Please check the file for YAML syntax errors:
  - Ensure frontmatter is delimited by '---' on both sides
  - Ensure proper indentation (2 spaces per level)
  - Ensure valid YAML syntax
```

**Write permission error:**
```
Error: Unable to write to report file. Check file permissions.

File: reports/architecture-reviews/2026-02-12-notification-system.md
```

## Advanced: Partial Section Updates

For more granular control, optionally support section-specific updates:

```
Which section would you like to update?

1. Technical Analysis
2. Risks and Gaps
3. Recommendations
4. All sections (full re-investigation)

Enter number:
```

If section-specific:
1. Only spawn Investigator + Synthesizer
2. Investigator focuses on that section's scope
3. Synthesizer updates only that section
4. Faster and more targeted than full update

## Example Session

```
User: /report-forge:update 2026-02-12-notification-system-architecture.md