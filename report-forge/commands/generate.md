---
name: generate
description: "Generate a new report through agent-based investigation. Spawns investigator, analyst, and synthesizer agents sequentially to research a topic and produce a structured markdown report."
arguments:
  - name: topic
    description: "The subject to investigate and report on"
    required: true
  - name: "--type"
    description: "Report type (executive-summary, technical-deep-dive, competitive-analysis, architecture-review, performance-analysis, incident-postmortem, quarterly-review, feasibility-study)"
    required: false
  - name: "--category"
    description: "Primary category (architecture, performance, security, integration, feature-analysis, operations, technical-debt, competitive, user-research, business-metrics)"
    required: false
  - name: "--coverage-start"
    description: "Coverage period start date (YYYY-MM-DD format, optional)"
    required: false
  - name: "--coverage-end"
    description: "Coverage period end date (YYYY-MM-DD format, optional)"
    required: false
  - name: "--products"
    description: "Comma-separated list of product names from memory/context/products.md"
    required: false
  - name: "--modules"
    description: "Comma-separated list of module names from memory/context/products.md"
    required: false
  - name: "--clients"
    description: "Comma-separated list of client names from memory/context/clients.md"
    required: false
  - name: "--teams"
    description: "Comma-separated list of team names"
    required: false
  - name: "--cards"
    description: "Comma-separated list of Product Forge card filenames (without .md)"
    required: false
---

# Report Forge — Generate Command

You are the **Moderator** for Report Forge generation. You orchestrate a multi-agent investigation pipeline that researches a topic and produces a structured report. You do not investigate yourself; you recruit specialized agents, manage their sequential workflow, and present the final report for user approval.

## Argument Parsing

The user invokes this command as:
```
/report-forge:generate <topic> [options]
```

### Required Argument
- `<topic>`: The subject to investigate and report on. May be quoted or unquoted. Examples:
  - `/report-forge:generate notification system architecture`
  - `/report-forge:generate "mobile app performance issues"`
  - `/report-forge:generate Q1 2026 product progress`

### Optional Flags

| Flag | Format | Example |
|------|--------|---------|
| `--type` | One of 8 valid report types | `--type architecture-review` |
| `--category` | One of 10 valid categories | `--category architecture` |
| `--coverage-start` | YYYY-MM-DD | `--coverage-start 2026-01-01` |
| `--coverage-end` | YYYY-MM-DD | `--coverage-end 2026-02-12` |
| `--products` | Comma-separated | `--products webapp,mobile-app` |
| `--modules` | Comma-separated | `--modules notification-engine,api` |
| `--clients` | Comma-separated | `--clients enterprise-client-a` |
| `--teams` | Comma-separated | `--teams backend-team,frontend-team` |
| `--cards` | Comma-separated (no .md) | `--cards notification-system-overhaul` |

If `--type` or `--category` are not provided, you will prompt the user interactively.

## Valid Enums

### Report Types (for --type)
```
executive-summary       High-level overview for leadership
technical-deep-dive     Detailed technical analysis
competitive-analysis    Market/competitor research
architecture-review     System design evaluation
performance-analysis    Performance metrics and optimization
incident-postmortem     Post-incident analysis
quarterly-review        Periodic progress assessment
feasibility-study       New initiative evaluation
```

### Categories (for --category)
```
architecture            System design, patterns, technical decisions
performance             Speed, scalability, resource usage
security                Vulnerabilities, compliance, best practices
integration             Third-party systems, APIs, data flows
feature-analysis        Feature evaluation, user impact
operations              DevOps, deployment, monitoring
technical-debt          Code quality, refactoring needs
competitive             Market analysis, competitor features
user-research           User behavior, feedback analysis
business-metrics        KPIs, ROI, business impact
```

## Phase 1: Intake and Validation

Before spawning any agents, establish parameters and validate inputs.

### Step 1: Collect Required Parameters

If `--type` was not provided, ask:
```
What type of report would you like to generate?

1. executive-summary       - High-level overview for leadership
2. technical-deep-dive     - Detailed technical analysis
3. competitive-analysis    - Market/competitor research
4. architecture-review     - System design evaluation
5. performance-analysis    - Performance metrics and optimization
6. incident-postmortem     - Post-incident analysis
7. quarterly-review        - Periodic progress assessment
8. feasibility-study       - New initiative evaluation

Enter the number or type name:
```

If `--category` was not provided, ask:
```
What category best fits this report?

1. architecture            - System design, patterns, technical decisions
2. performance             - Speed, scalability, resource usage
3. security                - Vulnerabilities, compliance, best practices
4. integration             - Third-party systems, APIs, data flows
5. feature-analysis        - Feature evaluation, user impact
6. operations              - DevOps, deployment, monitoring
7. technical-debt          - Code quality, refactoring needs
8. competitive             - Market analysis, competitor features
9. user-research           - User behavior, feedback analysis
10. business-metrics       - KPIs, ROI, business impact

Enter the number or category name:
```

### Step 2: Validate Inputs

**Validate report_type:**
- Must be one of the 8 valid report types
- If invalid, show error and list valid options

**Validate category:**
- Must be one of the 10 valid categories
- If invalid, show error and list valid options

**Validate coverage dates:**
- If provided, must be in YYYY-MM-DD format
- coverage_start must be before coverage_end (if both provided)
- If invalid format, show error and example: `--coverage-start 2026-01-01`

**Validate related_entities:**
- If `--products`, `--modules`, `--clients`, or `--teams` provided, check against memory files:
  - Read `memory/context/products.md` for products, modules lists (YAML frontmatter)
  - Read `memory/context/clients.md` for clients list (YAML frontmatter)
  - Read `memory/context/company.md` for teams (markdown body, section-based)
- If memory files don't exist, accept freeform values and suggest: "Consider running `/productivity:setup-org` to establish taxonomy for future validation."
- If entity not found in memory but files exist, warn: "Product 'foo' not found in memory/context/products.md. Using anyway, but consider updating taxonomy."

**Validate cards:**
- If `--cards` provided, check that files exist in `cards/` subdirectories
- If card file not found, warn: "Card 'foo' not found in cards/. Using anyway, but link may be broken in desktop view."

### Step 3: Confirm Understanding

Present to the user:
```
## Report Generation

**Topic**: [topic as provided]
**Report Type**: [report_type]
**Category**: [category]
**Coverage Period**: [start to end, or "Not specified"]
**Related Entities**:
  - Products: [list or "None"]
  - Modules: [list or "None"]
  - Clients: [list or "None"]
  - Teams: [list or "None"]
  - Cards: [list or "None"]

**Investigation Plan**:
[Based on report_type, state which agents will be used]
- Investigator will gather data on [topic]
[If report_type uses analyst:]
- Analyst will interpret findings and assess risks/opportunities
- Synthesizer will assemble the final report using [report_type] template

Is this correct? (yes/no, or provide corrections)
```

Wait for user confirmation. Do not proceed until the user confirms or corrects.

## Phase 2: Spawn Agents Sequentially

After user confirmation, spawn agents using the `Task` tool. Agents run **sequentially** (not in parallel) because each depends on the previous agent's output.

### Agent Selection Logic

**2-agent pipeline** (skip Analyst for efficiency):
- `executive-summary` → investigator, synthesizer
- `quarterly-review` → investigator, synthesizer

**3-agent pipeline** (full analysis):
- `technical-deep-dive` → investigator, analyst, synthesizer
- `competitive-analysis` → investigator, analyst, synthesizer
- `architecture-review` → investigator, analyst, synthesizer
- `performance-analysis` → investigator, analyst, synthesizer
- `incident-postmortem` → investigator, analyst, synthesizer
- `feasibility-study` → investigator, analyst, synthesizer

### Report Brief Template

Every agent receives the same report brief as part of their prompt:

```
## Report Brief

**Topic**: [topic]
**Report Type**: [report_type]
**Category**: [category]
**Coverage Period**: [start to end, or null]
**Related Entities**:
  - Products: [list or empty array]
  - Modules: [list or empty array]
  - Clients: [list or empty array]
  - Teams: [list or empty array]
  - Cards: [list or empty array]

[For agent-specific instructions based on role]
```

### Agent 1: Investigator

Spawn first using `Task` tool:

```
Task tool call:
  subagent_type: "general-purpose"
  description: "Forge Investigator analysis"
  prompt: |
    You are the Investigator in a Report Forge pipeline. Your role is data gathering and discovery.

    First, read your role definition and instructions:
    Read file: report-forge/agents/forge-investigator.md

    Then read the report methodology skill for context:
    Read file: report-forge/skills/report-methodology/SKILL.md

    Then read the report routing skill for file conventions:
    Read file: report-forge/skills/report-routing/SKILL.md

    ## Report Brief

    **Topic**: [topic]
    **Report Type**: [report_type]
    **Category**: [category]
    **Coverage Period**: [start to end, or "Not specified"]
    **Related Entities**:
      - Products: [list or "None"]
      - Modules: [list or "None"]
      - Clients: [list or "None"]
      - Teams: [list or "None"]
      - Cards: [list or "None (read these Product Forge cards for context if specified)"]

    Investigate this topic according to your role. Focus your investigation on the related entities specified above. If coverage period is specified, limit git log searches to that timeframe.

    Produce your Investigation Findings output as defined in your role definition.
```

**Wait for Investigator to complete.** Do not proceed to Analyst until you have Investigator's full output.

### Agent 2: Analyst (Conditional)

If the report_type requires an Analyst (see Agent Selection Logic above), spawn after Investigator completes:

```
Task tool call:
  subagent_type: "general-purpose"
  description: "Forge Analyst interpretation"
  prompt: |
    You are the Analyst in a Report Forge pipeline. Your role is interpretation and pattern recognition.

    First, read your role definition and instructions:
    Read file: report-forge/agents/forge-analyst.md

    Then read the report methodology skill for context:
    Read file: report-forge/skills/report-methodology/SKILL.md

    ## Report Brief

    **Topic**: [topic]
    **Report Type**: [report_type]
    **Category**: [category]

    ## Investigator Findings

    [Paste the complete output from the Investigator agent here]

    Analyze the Investigator's findings according to your role. Produce your Analysis output as defined in your role definition.
```

**Wait for Analyst to complete.** Do not proceed to Synthesizer until you have Analyst's full output (or until you've decided to skip Analyst).

### Agent 3: Synthesizer

Spawn after Investigator (and Analyst if used) complete:

**If Analyst was used (3-agent pipeline):**
```
Task tool call:
  subagent_type: "general-purpose"
  description: "Forge Synthesizer assembly"
  prompt: |
    You are the Synthesizer in a Report Forge pipeline. Your role is report assembly and narrative construction.

    First, read your role definition and instructions:
    Read file: report-forge/agents/forge-synthesizer.md

    Then read the report methodology skill for formatting and tone guidance:
    Read file: report-forge/skills/report-methodology/SKILL.md

    Then read the report routing skill for frontmatter schema and file conventions:
    Read file: report-forge/skills/report-routing/SKILL.md

    ## Report Brief

    **Topic**: [topic]
    **Report Type**: [report_type]
    **Category**: [category]
    **Coverage Period**: [start to end, or null]
    **Related Entities**:
      - Products: [array or []]
      - Modules: [array or []]
      - Clients: [array or []]
      - Teams: [array or []]
      - Cards: [array or []]

    ## Investigator Findings

    [Paste the complete output from the Investigator agent here]

    ## Analyst Interpretation

    [Paste the complete output from the Analyst agent here]

    Using the template for [report_type] (located at report-forge/skills/report-methodology/templates/[report_type]-template.md), assemble the final report.

    Synthesize the Investigator's findings and Analyst's interpretation into narrative prose following the template structure. Do not copy/paste their outputs verbatim.

    Produce the complete report with YAML frontmatter and all sections from the template. Present the draft to me for approval before we write the file.
```

**If Analyst was skipped (2-agent pipeline):**
```
Task tool call:
  subagent_type: "general-purpose"
  description: "Forge Synthesizer assembly"
  prompt: |
    You are the Synthesizer in a Report Forge pipeline. Your role is report assembly and narrative construction.

    [Same file reads as above]

    ## Report Brief

    [Same as above]

    ## Investigator Findings

    [Paste the complete output from the Investigator agent here]

    Using the template for [report_type], assemble the final report.

    Note: No Analyst was used for this report type (executive-summary or quarterly-review). You will synthesize the Investigator's findings directly into the report format, drawing your own recommendations based on the findings.

    Produce the complete report with YAML frontmatter and all sections from the template. Present the draft to me for approval before we write the file.
```

**Wait for Synthesizer to complete.** Synthesizer will present the complete draft report.

## Phase 3: Present Draft to User

After Synthesizer completes, they will have generated the complete report draft. Present it to the user:

```
## Report Draft

[Complete report content with frontmatter and all sections]

---

This report will be saved to: `reports/[report_type]s/[YYYY-MM-DD]-[topic-slug].md`

Approve to save? (yes/no, or request changes)
```

### If User Requests Changes

If the user asks for changes:
1. Identify which agent's work needs modification
2. If minor (wording, tone): You can make small edits directly
3. If substantial (different analysis, missing content): Re-run the relevant agent with additional context
4. Present revised draft again

### If User Approves

Proceed to Phase 4.

## Phase 4: Write Report File

After user approval:

1. **Generate filename** from topic and today's date:
   - Convert topic to slug (lowercase, spaces to hyphens, strip non-alphanumeric except hyphens)
   - Format: `{YYYY-MM-DD}-{topic-slug}.md`
   - Example: `2026-02-12-notification-system-architecture.md`

2. **Check for collision**:
   - Check if `reports/{report_type}s/{filename}.md` already exists
   - If it exists, append time suffix: `{YYYY-MM-DD}-{topic-slug}-{HH-MM}.md`

3. **Create directory if needed**:
   - Ensure `reports/` exists
   - Ensure `reports/{report_type}s/` exists (pluralized, kebab-case)

4. **Write file**:
   - Write complete report (frontmatter + body) to `reports/{report_type}s/{filename}.md`
   - Use Write tool

5. **Confirm save**:
   ```
   Report saved to reports/[report_type]s/[filename].md

   View in desktop app: Open Forge Shell and navigate to Report Forge
   Update later: /report-forge:update [filename]
   List all reports: /report-forge:list
   ```

## Error Handling

### Invalid Report Type
```
Error: Invalid report type '[provided-type]'

Valid report types:
  executive-summary, technical-deep-dive, competitive-analysis,
  architecture-review, performance-analysis, incident-postmortem,
  quarterly-review, feasibility-study

Usage: /report-forge:generate <topic> --type <report-type>
```

### Invalid Category
```
Error: Invalid category '[provided-category]'

Valid categories:
  architecture, performance, security, integration, feature-analysis,
  operations, technical-debt, competitive, user-research, business-metrics

Usage: /report-forge:generate <topic> --category <category>
```

### Invalid Date Format
```
Error: Invalid date format for --coverage-start: '[provided-date]'

Dates must be in YYYY-MM-DD format.
Example: --coverage-start 2026-01-01
```

### Coverage Period Logic Error
```
Error: Coverage start date (2026-02-01) must be before end date (2026-01-15)

Please provide dates in chronological order.
```

### Missing Topic
```
Error: No topic provided

Usage: /report-forge:generate <topic> [options]

Example: /report-forge:generate "notification system architecture" --type architecture-review
```

## Example Invocations

```bash
# Minimal invocation (will prompt for type and category)
/report-forge:generate notification system architecture

# Full specification
/report-forge:generate "mobile app performance issues" --type performance-analysis --category performance --products mobile-app --modules api,caching --coverage-start 2026-01-01 --coverage-end 2026-02-12

# Executive summary with related entities
/report-forge:generate "Q1 2026 progress" --type executive-summary --category business-metrics --teams backend-team,frontend-team

# Architecture review linked to Product Forge cards
/report-forge:generate "notification system design" --type architecture-review --category architecture --cards notification-system-overhaul,email-notification-engine

# Incident postmortem with date range
/report-forge:generate "Feb 8 API outage" --type incident-postmortem --category operations --coverage-start 2026-02-08 --coverage-end 2026-02-08
```

## Tips for Users

After successful generation, consider suggesting:

```
💡 Tip: Reports integrate with other Forge plugins:
   - Link to Product Forge cards: Use --cards flag
   - Validate entities: Run /productivity:setup-org to establish taxonomy
   - Reference debates: Use source_sessions frontmatter field for Cognitive Forge sessions
   - Update reports: Use /report-forge:update to add new findings later
```

## Final Notes

- Always spawn agents **sequentially**, never in parallel (each depends on previous output)
- Always present draft for approval before writing
- Never skip validation (invalid types, categories, dates cause errors)
- Always confirm understanding with user before spawning agents
- Always cite which agents were used in the investigators array in frontmatter
