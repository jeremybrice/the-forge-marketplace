---
description: "List and filter existing reports. Browse reports by type, category, status, or date range. Display summary table with key metadata."
arguments:
  - name: "--type"
    description: "Filter by report type (executive-summary, technical-deep-dive, etc.)"
    required: false
  - name: "--category"
    description: "Filter by category (architecture, performance, security, etc.)"
    required: false
  - name: "--status"
    description: "Filter by status (Draft, In Progress, Complete, Archived)"
    required: false
  - name: "--since"
    description: "Filter by creation date (reports created on or after this date, YYYY-MM-DD)"
    required: false
  - name: "--product"
    description: "Filter by related product name"
    required: false
  - name: "--module"
    description: "Filter by related module name"
    required: false
  - name: "--client"
    description: "Filter by related client name"
    required: false
---

# Report Forge — List Command

Lists all reports in the `reports/` directory with optional filtering. Displays a summary table with key metadata.

## Usage

```bash
# List all reports
/report-forge:list

# Filter by report type
/report-forge:list --type architecture-review

# Filter by category
/report-forge:list --category performance

# Filter by status
/report-forge:list --status Complete

# Filter by date (reports created on or after this date)
/report-forge:list --since 2026-01-01

# Filter by related entity
/report-forge:list --product webapp
/report-forge:list --module notification-engine
/report-forge:list --client enterprise-client-a

# Combine filters
/report-forge:list --type technical-deep-dive --category architecture --status Complete
```

## Implementation

### Step 1: Scan Reports Directory

1. Check if `reports/` directory exists
   - If not, display: "No reports found. Create your first report with /report-forge:generate"
   - Exit

2. Recursively scan all subdirectories in `reports/`:
   - `reports/executive-summaries/`
   - `reports/technical-deep-dives/`
   - `reports/competitive-analyses/`
   - `reports/architecture-reviews/`
   - `reports/performance-analyses/`
   - `reports/incident-postmortems/`
   - `reports/quarterly-reviews/`
   - `reports/feasibility-studies/`

3. For each `.md` file found:
   - Read the file
   - Parse YAML frontmatter
   - Extract: title, report_type, category, status, related_entities, created, updated, confidence

### Step 2: Apply Filters

Filter the list based on provided arguments:

**--type filter:**
- If provided, only include reports where `report_type` matches the provided value
- Case-insensitive comparison
- If no matches, display: "No reports found with type '{type}'"

**--category filter:**
- If provided, only include reports where `category` matches the provided value
- Case-insensitive comparison

**--status filter:**
- If provided, only include reports where `status` matches the provided value
- Valid values: Draft, In Progress, Complete, Archived
- Case-insensitive comparison

**--since filter:**
- If provided, only include reports where `created` date is on or after the provided date
- Parse date in YYYY-MM-DD format
- If invalid format, display error: "Invalid date format. Use YYYY-MM-DD (e.g., 2026-01-01)"

**--product filter:**
- If provided, only include reports where `related_entities.products` array contains the provided value
- Case-insensitive comparison

**--module filter:**
- If provided, only include reports where `related_entities.modules` array contains the provided value

**--client filter:**
- If provided, only include reports where `related_entities.clients` array contains the provided value

### Step 3: Sort Results

Sort the filtered list by `created` date, **most recent first** (descending).

### Step 4: Display Summary Table

Format the results as a readable table:

```
## Reports ([count] found)

[If filters applied, show active filters:]
Filters: type=architecture-review, category=architecture, status=Complete

| Title | Type | Category | Status | Created | Confidence |
|-------|------|----------|--------|---------|------------|
| Notification System Architecture | architecture-review | architecture | Complete | 2026-02-12 | High |
| Mobile App Performance Analysis | performance-analysis | performance | In Progress | 2026-02-08 | Medium |
| Q1 2026 Product Progress | executive-summary | business-metrics | Complete | 2026-01-15 | High |

View a report: /report-forge:update [filename]
Generate new report: /report-forge:generate <topic>
Open in desktop app: Launch Forge Shell → Report Forge
```

**Table columns:**
- **Title**: Truncate to 40 characters if longer (add "...")
- **Type**: Short label (e.g., "arch-review" instead of full "architecture-review")
- **Category**: Short label (e.g., "arch" for architecture, "perf" for performance)
- **Status**: Full status value
- **Created**: YYYY-MM-DD format
- **Confidence**: High, Medium, or Low

**Type abbreviations for table display:**
```
executive-summary    → exec-summary
technical-deep-dive  → tech-dive
competitive-analysis → competitive
architecture-review  → arch-review
performance-analysis → perf-analysis
incident-postmortem  → postmortem
quarterly-review     → quarterly
feasibility-study    → feasibility
```

**Category abbreviations for table display:**
```
architecture      → arch
performance       → perf
security          → security
integration       → integration
feature-analysis  → feature
operations        → ops
technical-debt    → tech-debt
competitive       → competitive
user-research     → user-research
business-metrics  → business
```

### Step 5: Additional Details (Optional Enhancement)

For each report, optionally display additional metadata on expansion:

```
## Notification System Architecture
  Type: architecture-review
  Category: architecture
  Status: Complete
  Created: 2026-02-12 | Updated: 2026-02-12
  Confidence: High
  Coverage: 2026-01-01 to 2026-02-12
  Related:
    - Products: WebApp
    - Modules: Notification Engine, Email Service
    - Cards: notification-system-overhaul
  File: reports/architecture-reviews/2026-02-12-notification-system-architecture.md

  View: /report-forge:update 2026-02-12-notification-system-architecture.md
```

## Empty State Handling

**No reports exist:**
```
No reports found.

Create your first report:
  /report-forge:generate <topic> --type <report-type>

Example:
  /report-forge:generate "notification system architecture" --type architecture-review
```

**No reports match filters:**
```
No reports found matching filters:
  --type: architecture-review
  --status: Complete
  --since: 2026-02-01

Try different filters or view all reports:
  /report-forge:list
```

## Error Handling

**Invalid --type value:**
```
Error: Invalid report type '[provided-value]'

Valid types: executive-summary, technical-deep-dive, competitive-analysis,
            architecture-review, performance-analysis, incident-postmortem,
            quarterly-review, feasibility-study
```

**Invalid --category value:**
```
Error: Invalid category '[provided-value]'

Valid categories: architecture, performance, security, integration, feature-analysis,
                 operations, technical-debt, competitive, user-research, business-metrics
```

**Invalid --status value:**
```
Error: Invalid status '[provided-value]'

Valid statuses: Draft, In Progress, Complete, Archived
```

**Invalid --since date:**
```
Error: Invalid date format for --since: '[provided-value]'

Use YYYY-MM-DD format (e.g., --since 2026-01-01)
```

## Performance Considerations

For large numbers of reports (100+):

1. **Pagination**: Consider displaying results in pages of 20
2. **Summary first**: Show count and summary stats before full table
3. **Lazy loading**: Parse frontmatter only for reports that pass filters (if filtering by filename pattern possible)

Example with pagination:
```
## Reports (47 found)

Showing 1-20 of 47 reports (sorted by most recent)

[Table with 20 rows]

View next page: /report-forge:list --page 2
```

## Example Output

```
## Reports (12 found)

| Title | Type | Category | Status | Created | Confidence |
|-------|------|----------|--------|---------|------------|
| Q1 2026 Product Progress | exec-summary | business | Complete | 2026-02-12 | High |
| Notification System Architecture | arch-review | arch | Complete | 2026-02-12 | High |
| Feb 8 API Outage Postmortem | postmortem | ops | Complete | 2026-02-09 | High |
| Mobile App Performance Issues | perf-analysis | perf | In Progress | 2026-02-08 | Medium |
| Payment Integration Feasibility | feasibility | integration | Complete | 2026-02-05 | Medium |
| Authentication Module Deep Dive | tech-dive | security | Draft | 2026-02-01 | Low |
| Competitor Feature Comparison | competitive | competitive | Complete | 2026-01-28 | High |
| Database Migration Architecture | arch-review | arch | Complete | 2026-01-25 | High |
| January 2026 Sprint Review | quarterly | business | Complete | 2026-01-20 | High |
| User Onboarding Flow Analysis | feature | user-research | Complete | 2026-01-15 | Medium |
| API Rate Limiting Performance | perf-analysis | perf | Archived | 2026-01-10 | High |
| 2026 Platform Strategy | exec-summary | business | Complete | 2026-01-05 | High |

💡 Tip: View a report by filename: /report-forge:update [filename]
💡 Tip: Open desktop app for visual browsing and search
```

## Integration with Desktop View

Remind users that the desktop app provides richer browsing:

```
📊 For visual browsing, filtering, and search:
   Launch Forge Shell → Navigate to Report Forge

   Desktop features:
   - Filter by multiple criteria simultaneously
   - Full-text search across report content
   - Clickable links to Product Forge cards
   - Rendered markdown preview
```
