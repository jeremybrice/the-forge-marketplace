---
name: report-methodology
description: "Encodes report structure standards, formatting directives, category taxonomy, template selection logic, and integration with Productivity memory. Auto-invoked on every report generation to ensure consistent standards."
---

# Report Methodology Skill

This skill embeds report generation standards into every output. When invoked, it ensures all report creation follows formatting rules, uses appropriate templates, and integrates with organizational taxonomy.

## Report Types and Purpose

Each report type serves a distinct purpose and uses a specific template structure. The `report_type` field determines which agents are used and how findings are presented.

### Executive Summary
**Purpose:** High-level overview for leadership and non-technical stakeholders
**Audience:** Executives, product leaders, business stakeholders
**Length:** 2-3 pages
**Tone:** Business-focused, clear, concise, minimal technical jargon
**Agents:** investigator, synthesizer (analyst skipped for efficiency)
**Template:** `executive-summary-template.md`

**Key sections:**
- Executive Summary (one paragraph overview)
- Key Findings (3-5 bullet points)
- Recommendations (actionable next steps)
- Next Steps (timeline and ownership)

### Technical Deep Dive
**Purpose:** Detailed technical analysis for engineering teams
**Audience:** Engineers, architects, technical leads
**Length:** 5-10 pages
**Tone:** Technical, thorough, analytical
**Agents:** investigator, analyst, synthesizer
**Template:** `technical-deep-dive-template.md`

**Key sections:**
- Overview (context and scope)
- Technical Analysis (detailed findings)
- Implementation Details (how it works)
- Trade-offs (pros, cons, alternatives)
- Recommendations (technical direction)

### Competitive Analysis
**Purpose:** Market and competitor research
**Audience:** Product managers, executives, strategy team
**Length:** 3-5 pages
**Tone:** Strategic, comparative, insight-driven
**Agents:** investigator, analyst, synthesizer
**Template:** `competitive-analysis-template.md`

**Key sections:**
- Market Context (landscape overview)
- Competitor Comparison (feature/capability analysis)
- Strengths & Gaps (our position)
- Strategic Recommendations (what to build/prioritize)

### Architecture Review
**Purpose:** System design evaluation and recommendations
**Audience:** Architects, senior engineers, technical leads
**Length:** 4-8 pages
**Tone:** Architectural, evaluative, forward-looking
**Agents:** investigator, analyst, synthesizer
**Template:** `architecture-review-template.md`

**Key sections:**
- Current Architecture (as-is state)
- Strengths (what works well)
- Weaknesses (what needs improvement)
- Recommendations (proposed changes)
- Migration Path (how to get there)

### Performance Analysis
**Purpose:** Performance metrics, bottlenecks, and optimization opportunities
**Audience:** Engineers, SREs, technical leads
**Length:** 3-6 pages
**Tone:** Data-driven, metrics-focused, actionable
**Agents:** investigator, analyst, synthesizer
**Template:** `performance-analysis-template.md`

**Key sections:**
- Performance Metrics (baseline measurements)
- Bottlenecks (identified issues)
- Root Causes (why bottlenecks exist)
- Optimization Opportunities (potential improvements)
- Implementation Plan (how to optimize)

### Incident Postmortem
**Purpose:** Post-incident analysis and learning
**Audience:** Engineering teams, leadership, SREs
**Length:** 3-5 pages
**Tone:** Objective, blameless, learning-focused
**Agents:** investigator, analyst, synthesizer
**Template:** `incident-postmortem-template.md`

**Key sections:**
- Incident Summary (what happened)
- Timeline (sequence of events)
- Root Cause Analysis (why it happened)
- Impact Assessment (business/user impact)
- Action Items (preventive measures)

### Quarterly Review
**Purpose:** Periodic progress assessment
**Audience:** Teams, leadership, stakeholders
**Length:** 4-6 pages
**Tone:** Reflective, progress-focused, forward-looking
**Agents:** investigator, synthesizer (analyst skipped for efficiency)
**Template:** `quarterly-review-template.md`

**Key sections:**
- Period Summary (timeframe and scope)
- Achievements (what was delivered)
- Metrics (quantitative progress)
- Challenges (obstacles encountered)
- Outlook (next quarter priorities)

### Feasibility Study
**Purpose:** Evaluation of new initiative viability
**Audience:** Product managers, executives, engineering leads
**Length:** 5-8 pages
**Tone:** Evaluative, balanced, recommendation-driven
**Agents:** investigator, analyst, synthesizer
**Template:** `feasibility-study-template.md`

**Key sections:**
- Proposal Overview (what's being evaluated)
- Technical Feasibility (can we build it?)
- Resource Requirements (what it needs)
- Risk Assessment (what could go wrong)
- Recommendation (go/no-go with rationale)

## Category Taxonomy

Categories organize reports by domain for filtering, search, and discoverability. Each report has exactly one primary category.

| Category | Domain | Typical Report Types |
|----------|--------|---------------------|
| `architecture` | System design, patterns, technical decisions | Architecture Review, Technical Deep Dive, Feasibility Study |
| `performance` | Speed, scalability, resource usage | Performance Analysis, Technical Deep Dive |
| `security` | Vulnerabilities, compliance, best practices | Technical Deep Dive, Architecture Review |
| `integration` | Third-party systems, APIs, data flows | Architecture Review, Technical Deep Dive |
| `feature-analysis` | Feature evaluation, user impact | Feasibility Study, Competitive Analysis |
| `operations` | DevOps, deployment, monitoring | Incident Postmortem, Performance Analysis |
| `technical-debt` | Code quality, refactoring needs | Technical Deep Dive, Architecture Review |
| `competitive` | Market analysis, competitor features | Competitive Analysis, Feasibility Study |
| `user-research` | User behavior, feedback analysis | Executive Summary, Feasibility Study |
| `business-metrics` | KPIs, ROI, business impact | Executive Summary, Quarterly Review |

## Formatting Directives (Critical)

These rules are enforced on every report:

1. **No dashes as thought separators**: Never use dashes (—, –, or -) to separate thoughts in prose text. Dashes are acceptable only in compound words (e.g., "real-time," "cross-platform," "user-facing"). Use periods, semicolons, or restructure sentences instead.

2. **No tables in report body**: Reports must never use table format in the main content body. Tables reduce readability and break on mobile. Use prose paragraphs or bullet points instead. Exception: Simple data presentation in appendices (if needed) may use tables, but prefer charts/lists.

3. **Substantive bullets**: Use bullets only for true lists within sections. Each bullet should be substantive, containing 1-2 sentences minimum unless listing system, module, or metric names. Avoid single-word bullets or trivial lists.

4. **Prose for narrative sections**: Sections like Background, Analysis, Recommendations, and Context must be written as prose paragraphs, not bullet lists. Prose supports narrative flow and executive readability.

5. **Section spacing**: Use a blank line between major sections in report body content to improve readability and visual hierarchy.

6. **Heading hierarchy**: Section headers use `##` (Heading 2), subsections use `###` (Heading 3). Never skip levels (don't jump from `##` to `####`).

7. **Metrics and data**: When presenting metrics, provide context. Don't just state numbers; explain what they mean and why they matter.

8. **Actionable recommendations**: Every report should end with clear, actionable recommendations. Avoid vague suggestions like "consider improving" – be specific about what to do and why.

## Template Selection Logic

The `/report-forge:generate` command determines which template to use based on the `report_type` field. The mapping is:

| report_type | Template File |
|-------------|---------------|
| `executive-summary` | `skills/report-methodology/templates/executive-summary-template.md` |
| `technical-deep-dive` | `skills/report-methodology/templates/technical-deep-dive-template.md` |
| `competitive-analysis` | `skills/report-methodology/templates/competitive-analysis-template.md` |
| `architecture-review` | `skills/report-methodology/templates/architecture-review-template.md` |
| `performance-analysis` | `skills/report-methodology/templates/performance-analysis-template.md` |
| `incident-postmortem` | `skills/report-methodology/templates/incident-postmortem-template.md` |
| `quarterly-review` | `skills/report-methodology/templates/quarterly-review-template.md` |
| `feasibility-study` | `skills/report-methodology/templates/feasibility-study-template.md` |

Templates are located in the plugin at: `report-forge/skills/report-methodology/templates/`

The synthesizer agent reads the appropriate template and uses it to structure the final report output.

## Integration with Productivity Memory System

Reports integrate with the Productivity plugin's organizational memory for taxonomy validation.

### Memory Files

Read taxonomy from these files if they exist:
- `memory/context/products.md` → products, modules, systems (YAML frontmatter keys)
- `memory/context/clients.md` → clients (YAML frontmatter key)
- `memory/context/company.md` → teams (section in markdown body)

### Validation Behavior

**If memory files exist:**
- Validate `related_entities.products` against `products` list in `memory/context/products.md`
- Validate `related_entities.modules` against `modules` list in `memory/context/products.md`
- Validate `related_entities.clients` against `clients` list in `memory/context/clients.md`
- Validate `related_entities.teams` against teams mentioned in `memory/context/company.md`
- Warn the user if an entity name doesn't match taxonomy (suggest corrections)

**If memory files don't exist:**
- Accept freeform entity names without validation
- Suggest the user run `/productivity:setup-org` to establish taxonomy
- Never block report generation on missing taxonomy

### Cross-References to Product Forge Cards

Reports can reference Product Forge cards in `related_entities.cards[]`:
- Use card filename without `.md` extension
- Validate that referenced cards exist in `cards/` subdirectories
- Desktop view will show these as clickable links to navigate to Product Forge
- This creates a one-way reference (report → card, but cards don't automatically link back)

**Example:**
```yaml
related_entities:
  cards: [notification-system-overhaul, email-notification-engine]
```

### Source Session References

Reports can reference Cognitive Forge debate/exploration sessions in `source_sessions[]`:
- Use session filename without `.md` extension
- Validate that referenced sessions exist in `cognitive-forge/sessions/debates/` or `sessions/explorations/`
- Use when report builds on conceptual analysis from a previous debate
- Desktop view will show these as metadata references

**Example:**
```yaml
source_sessions: [2026-02-10-microservices-payment-architecture]
```

## Agent Recruitment Logic

Different report types use different combinations of agents:

**investigator + synthesizer only** (skip analyst for efficiency):
- `executive-summary` – straightforward assembly, minimal interpretation needed
- `quarterly-review` – progress report, straightforward data collection

**investigator + analyst + synthesizer** (full pipeline):
- `technical-deep-dive` – needs detailed interpretation
- `competitive-analysis` – needs strategic interpretation
- `architecture-review` – needs pattern analysis and evaluation
- `performance-analysis` – needs metric interpretation and root cause analysis
- `incident-postmortem` – needs root cause analysis and learning extraction
- `feasibility-study` – needs risk/opportunity assessment

The generate command spawns agents sequentially based on this logic.

## Confidence Level Guidance

Set confidence levels based on data availability and investigation completeness:

**High Confidence:**
- Comprehensive data available
- All relevant sources examined
- Clear patterns identified
- Minimal assumptions or unknowns
- Findings validated across multiple sources

**Medium Confidence:**
- Moderate data availability
- Some gaps in information
- Patterns identified but with caveats
- Some assumptions necessary
- Findings partially validated

**Low Confidence:**
- Limited data available
- Significant information gaps
- Tentative patterns or unclear findings
- Many assumptions required
- Findings not fully validated

Always include a confidence level in the frontmatter. If the Investigator identifies significant gaps, the Synthesizer should set confidence to Medium or Low.

## Tone and Style by Report Type

Adopt the appropriate tone for each report type:

**Executive Summary**: Business language, clear value statements, avoid technical jargon, focus on outcomes and decisions.

**Technical Deep Dive**: Technical precision, detailed explanations, appropriate use of technical terms, focus on implementation.

**Competitive Analysis**: Strategic perspective, comparative framing, market context, focus on positioning and differentiation.

**Architecture Review**: Architectural thinking, system-level view, design patterns, focus on structure and evolution.

**Performance Analysis**: Data-driven, metrics-focused, quantitative, focus on measurements and optimization.

**Incident Postmortem**: Objective, blameless, timeline-based, focus on learning and prevention.

**Quarterly Review**: Reflective, balanced (achievements + challenges), progress-oriented, focus on trajectory.

**Feasibility Study**: Evaluative, risk-aware, recommendation-oriented, focus on viability and go/no-go decision.

## Content Depth by Audience

Match content depth to the intended audience:

**Leadership (Executives, Product Managers):**
- Start with high-level summary
- Focus on business impact and strategic implications
- Minimize technical details
- Emphasize actionable recommendations
- Use analogies and examples to explain complex concepts

**Technical Teams (Engineers, Architects):**
- Provide technical depth and specifics
- Include code examples, architecture diagrams (described in prose)
- Explain implementation considerations
- Discuss trade-offs and alternatives
- Reference specific systems, APIs, libraries

**Cross-functional (Mixed Audiences):**
- Layer information (summary first, details follow)
- Define technical terms when first used
- Balance business context with technical reality
- Use clear section headings for navigation
- Provide both strategic view and tactical details

## Report Body Structure

Reports follow a consistent structure:

```markdown
---
[YAML frontmatter here]
---

## [First Major Section]

[Prose paragraph introducing the section and its purpose.]

[Additional prose paragraphs with analysis, context, or narrative.]

### [Subsection if needed]

[More detailed content within the subsection.]

## [Second Major Section]

[Content continues...]

## Recommendations

[Every report should end with actionable recommendations.]
```

Use blank lines between major `##` sections. Subsections `###` should be indented under their parent sections.

## Quality Checklist

Before presenting a report to the user, verify:

1. ✓ Frontmatter complete with all required fields
2. ✓ report_type matches one of the eight valid types
3. ✓ category matches one of the ten valid categories
4. ✓ All dates in ISO 8601 format (YYYY-MM-DD)
5. ✓ related_entities validated against memory files (if they exist)
6. ✓ No dashes used as thought separators
7. ✓ No tables in report body
8. ✓ Substantive bullets (1-2 sentences minimum)
9. ✓ Prose used for narrative sections
10. ✓ Blank lines between major sections
11. ✓ Recommendations section present and actionable
12. ✓ Confidence level set appropriately
13. ✓ investigators array lists agents used
14. ✓ Template structure followed for report_type

If any checklist item fails, correct before presenting to user.
