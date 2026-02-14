---
name: report-routing
description: "Backbone skill providing folder structure, filename conventions, YAML frontmatter schema, and read/write patterns for all Report Forge report types. Auto-invoked by every command that reads from or writes to the local reports directory."
---

# Report Routing Skill

Provides the complete local file architecture blueprint for Report Forge. Every command depends on this routing foundation.

## Reports Directory

The `reports/` directory lives at the project root (the same level as the plugin folder). All reports are stored as markdown files with YAML frontmatter in type-specific subdirectories organized by report type.

```
reports/
  executive-summaries/       ← High-level overview reports
  technical-deep-dives/      ← Detailed technical analysis
  competitive-analyses/      ← Market/competitor research
  architecture-reviews/      ← System design evaluation
  performance-analyses/      ← Performance metrics and optimization
  incident-postmortems/      ← Post-incident analysis
  quarterly-reviews/         ← Periodic progress assessment
  feasibility-studies/       ← New initiative evaluation
```

If the `reports/` directory does not exist, it will be created automatically when the first report is generated.

## Filename Conventions

All filenames follow the pattern: `{YYYY-MM-DD}-{topic-slug}.md`

The date represents the report creation date (not the coverage period). The filename (without `.md`) serves as the report's unique identifier.

**Examples:**
- `2026-02-12-notification-system-architecture-review.md`
- `2026-01-15-mobile-app-performance-analysis.md`
- `2026-02-08-q1-2026-product-progress-review.md`

**Slug generation:** Convert the report topic to lowercase, replace spaces and special characters with hyphens, remove consecutive hyphens, and trim leading/trailing hyphens.

**Collision handling:** If a report with the same date and slug already exists, append a time suffix: `{YYYY-MM-DD}-{slug}-{HH-MM}.md`

## YAML Frontmatter Schema

Every report file begins with YAML frontmatter delimited by `---`. Below is the complete schema for all reports.

### Report (All Types)

```yaml
---
title: "Report Title"
type: report                                 # Always 'report' for all report types
report_type: architecture-review             # See Report Types section below
status: Draft                                # Draft | In Progress | Complete | Archived
category: architecture                       # See Categories section below
topic: "Primary subject of report"
related_entities:
  products: []                               # From memory/context/products.md (optional)
  modules: []                                # From memory/context/products.md (optional)
  clients: []                                # From memory/context/clients.md (optional)
  teams: []                                  # Team names from memory (optional)
  cards: []                                  # Product Forge card filenames without .md (optional)
coverage_period:
  start: 2026-01-01                         # ISO date (optional, null if not applicable)
  end: 2026-02-12                           # ISO date or null for ongoing
investigators: []                            # Agent names used: investigator, analyst, synthesizer
confidence: High                             # High | Medium | Low
source_sessions: []                          # Cognitive Forge session filenames without .md (optional)
source_conversation: null                    # Optional conversation reference
created: 2026-02-12                         # ISO date
updated: 2026-02-12                         # ISO date
---
```

## Report Types

The `report_type` field determines the investigation approach, template structure, and which agents are used.

| Report Type | Use Case | Primary Agents |
|-------------|----------|----------------|
| `executive-summary` | High-level overview for leadership | investigator, synthesizer |
| `technical-deep-dive` | Detailed technical analysis | investigator, analyst, synthesizer |
| `competitive-analysis` | Market/competitor research | investigator, analyst, synthesizer |
| `architecture-review` | System design evaluation | investigator, analyst, synthesizer |
| `performance-analysis` | Performance metrics and optimization | investigator, analyst, synthesizer |
| `incident-postmortem` | Post-incident analysis | investigator, analyst, synthesizer |
| `quarterly-review` | Periodic progress assessment | investigator, synthesizer |
| `feasibility-study` | New initiative evaluation | investigator, analyst, synthesizer |

## Categories

The `category` field organizes reports by domain for filtering and search.

| Category | Description |
|----------|-------------|
| `architecture` | System design, patterns, technical decisions |
| `performance` | Speed, scalability, resource usage |
| `security` | Vulnerabilities, compliance, best practices |
| `integration` | Third-party systems, APIs, data flows |
| `feature-analysis` | Feature evaluation, user impact |
| `operations` | DevOps, deployment, monitoring |
| `technical-debt` | Code quality, refactoring needs |
| `competitive` | Market analysis, competitor features |
| `user-research` | User behavior, feedback analysis |
| `business-metrics` | KPIs, ROI, business impact |

## Status Values

```
Draft         - Initial creation, not yet complete
In Progress   - Investigation/analysis underway
Complete      - Report finalized and ready for distribution
Archived      - Historical reference, superseded by newer report
```

## Confidence Levels

```
High          - High confidence in findings, comprehensive data
Medium        - Moderate confidence, some gaps or assumptions
Low           - Limited data, significant unknowns or assumptions
```

## Related Entities

Reports can link to the organizational taxonomy from Productivity's memory system:

```yaml
related_entities:
  products: [webapp, mobile-app]              # From memory/context/products.md
  modules: [notification-engine, api]         # From memory/context/products.md
  clients: [enterprise-client-a]              # From memory/context/clients.md
  teams: [backend-team, frontend-team]        # Team names
  cards: [notification-system-overhaul]       # Product Forge card filenames (without .md)
```

**Integration behavior:**
- Validate entity names against `memory/context/products.md`, `clients.md`, and `teams.md` if these files exist
- If memory files don't exist, accept freeform values and suggest the user run `/productivity:setup-org`
- Links to Product Forge cards create one-way references (reports → cards, but cards do not automatically link back)

## Read Patterns

### Find a Report by Filename

1. If a filename is provided, read directly: `reports/{report_type}s/{filename}.md`
2. The report_type subdirectory is determined from the filename pattern or by scanning all subdirectories

### List Reports by Type

Read all `.md` files in the relevant subfolder (e.g., `reports/architecture-reviews/`) and parse their frontmatter for summary display.

### Query Reports by Property

Scan files across all report subdirectories and filter by frontmatter field values (e.g., find all reports with `status: Complete` and `category: architecture`).

### Search Reports by Content

Scan frontmatter `title` and `topic` fields, optionally extend to full-text search of report bodies.

## Write Patterns

### Create a New Report

1. **Generate filename** from the report topic and current date following the `{YYYY-MM-DD}-{topic-slug}.md` pattern
2. **Check for collisions**: if a file with the same name exists, append time suffix `{HH-MM}`
3. **Build YAML frontmatter** using the schema above, populating all required fields
4. **Write report body** below the frontmatter using `##` headings for sections, with blank lines between major sections
5. **Determine output subdirectory** from `report_type` (e.g., `architecture-review` → `reports/architecture-reviews/`)
6. **Save the file** to the correct subfolder: `reports/{report_type}s/{filename}.md`
7. **Present the complete report** to the user for approval before writing
8. **On approval**, write the file and confirm the save location

### Update an Existing Report

1. **Read the existing file** and parse frontmatter and body separately
2. **Apply changes** to the affected sections only
3. **Update the `updated` date** to today
4. **Present a diff** to the user showing what will change (mandatory; never silently overwrite)
5. **On approval**, write the updated file

### Never Silently Overwrite

CRITICAL: Always present a diff or preview to the user before writing to an existing file. User approval is required for all writes.

## Content Formatting Rules

### Page Structure

1. Use blank lines between major sections for readability
2. Section headers use `##` (Heading 2)
3. Prose for narrative sections (Background, Analysis, Recommendations)
4. Bullet points for lists (Key Findings, Metrics, Action Items)
5. No tables in report content (breaks mobile readability)
6. No dashes as thought separators (use periods, semicolons, or restructure sentences)
7. Substantive bullets (1-2 sentences minimum unless listing system/module names)

### Required Fields on Every Write

- **Core metadata:** `title`, `type`, `report_type`, `status`, `category`, `topic`
- **Dates:** `created` and `updated` fields on every report
- **Investigators:** List of agent names used (e.g., `[investigator, analyst, synthesizer]`)
- **Confidence:** Always set appropriate level (`High`, `Medium`, `Low`)

### Date Field Format

All dates use ISO 8601 format: `YYYY-MM-DD` (e.g., `2026-02-12`)

Coverage period dates can be null if not applicable: `start: null`, `end: null`

## Output Protocol

### After Successful Write

Display:
```
Report saved to reports/{report_type}s/{filename}.md
```

### After Update

Display:
```
Report updated: reports/{report_type}s/{filename}.md
```

### Error Handling

If validation fails (e.g., invalid report_type, missing required fields), explain the error clearly and suggest corrections.

## Path Resolution

All paths are relative to the user's project root (current working directory), not the plugin folder.

**Example paths:**
- Absolute: `/Users/user/project/reports/architecture-reviews/2026-02-12-notification-system.md`
- Relative: `reports/architecture-reviews/2026-02-12-notification-system.md`

Always use relative paths when displaying to the user.
