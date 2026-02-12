---
name: local-routing
description: "Backbone skill providing folder structure, filename conventions, YAML frontmatter schemas, relationship logic, and read/write patterns for all Product Forge Local card types. Auto-invoked by every command that reads from or writes to the local cards directory."
---

# Local Routing Skill

Provides the complete local file architecture blueprint for Product Forge Local. Every command depends on this routing foundation.

## Cards Directory

The `cards/` directory lives at the project root (the same level as the plugin folder). All card types are stored as markdown files with YAML frontmatter in type-specific subdirectories.

```
cards/
  initiatives/       ← Initiative cards (top-level parent)
  epics/             ← Epic cards (children of Initiatives)
  stories/           ← Story cards (children of Epics)
  intakes/           ← Intake interview outputs
  checkpoints/       ← Knowledge checkpoint snapshots
  decisions/         ← Decision log entries
  release-notes/     ← Release note documents
```

If the `cards/` directory does not exist, instruct the user to run `/init` to create it.

## Filename Conventions

All filenames are lowercase kebab-case. The filename (without `.md`) serves as the card's unique identifier and is used in all relationship fields.

| Card Type | Pattern | Example |
|-----------|---------|---------|
| Initiative | `{kebab-case-title}.md` | `notification-system-overhaul.md` |
| Epic | `{kebab-case-title}.md` | `email-notification-engine.md` |
| Story | `story-NNN-{slug}.md` | `story-001-notification-template-builder.md` |
| Intake | `intake-{product}-{feature-name}.md` | `intake-webapp-notification-system.md` |
| Checkpoint | `checkpoint-YYYY-MM-DD-{slug}.md` | `checkpoint-2026-02-08-notification-architecture-decisions.md` |
| Decision | `{kebab-case-title}.md` | `use-event-driven-notification-pipeline.md` |
| Release Note | `release-notes-YYMMDD.md` | `release-notes-260208.md` |

**Story numbering:** Stories use zero-padded 3-digit sequential numbers (001, 002, ... 999). When creating a new story, scan the `cards/stories/` directory for the highest existing number and increment by one.

**Slug generation:** Convert the card title to lowercase, replace spaces and special characters with hyphens, remove consecutive hyphens, and trim leading/trailing hyphens.

## YAML Frontmatter Schemas

Every card file begins with YAML frontmatter delimited by `---`. Below are the complete schemas for each card type.

### Initiative

```yaml
---
title: "Initiative Title"
type: initiative
status: Draft                    # Draft | Submitted | Approved | Superseded
product: ""                      # From memory/context/products.md
module: ""                       # From memory/context/products.md
client: ""                       # From memory/context/clients.md
team: ""
confidence: Medium               # High | Medium | Low
estimate_hours: null
jira_card: null                  # Jira issue key (e.g., "PROJ-123") - legacy field, use jira_key for new integrations
jira_url: null                   # Full URL to Jira issue
jira_last_synced: null           # ISO 8601 timestamp of last sync
jira_status: null                # Last known Jira status
source_intake: null              # filename of originating intake (without .md)
children:                        # filenames of child Epics (without .md)
  - epic-filename-here
description: "Brief summary"
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---
```

### Epic

```yaml
---
title: "Epic Title"
type: epic
status: Planning                 # Planning | In Progress | Complete | Cancelled
product: ""                      # From memory/context/products.md
module: ""                       # From memory/context/products.md
client: ""                       # From memory/context/clients.md
team: ""
parent: initiative-filename      # filename of parent Initiative (without .md)
children:                        # filenames of child Stories (without .md)
  - story-001-slug
jira_key: null                   # Jira issue key (e.g., "PROJ-123")
jira_url: null                   # Full URL to Jira issue
jira_last_synced: null           # ISO 8601 timestamp of last sync
jira_status: null                # Last known Jira status
description: "Brief summary"
source_intake: null
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---
```

### Story

```yaml
---
title: "Story Title"
type: story
status: Draft                    # Draft | Ready | In Progress | Done
product: ""                      # From memory/context/products.md
module: ""                       # From memory/context/products.md
client: ""                       # From memory/context/clients.md
team: ""
parent: epic-filename            # filename of parent Epic (without .md)
story_points: null
jira_card: null                  # Jira issue key (e.g., "PROJ-123") - legacy field, use jira_key for new integrations
jira_url: null                   # Full URL to Jira issue
jira_last_synced: null           # ISO 8601 timestamp of last sync
jira_status: null                # Last known Jira status
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---
```

### Intake

```yaml
---
title: "INTAKE-Product-FeatureName"
type: intake
status: Draft                    # Draft | Complete | Handed Off
product: ""                      # From memory/context/products.md
module: ""                       # From memory/context/products.md
client: ""                       # From memory/context/clients.md
generated_initiatives:           # filenames of spawned Initiatives (without .md)
  - initiative-filename
generated_epics:                 # filenames of spawned Epics (without .md)
  - epic-filename
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---
```

### Knowledge Checkpoint

```yaml
---
title: "Checkpoint Title"
type: checkpoint
checkpoint_date: 2026-02-08
product: ""                      # From memory/context/products.md
module: ""                       # From memory/context/products.md
client: ""                       # From memory/context/clients.md
domain: Architecture             # Integration | Operations | Configuration | Reporting | Mobile | Feature Scope | Architecture | Requirements | Technical Spec | Stakeholder Context
status: Current                  # Current | Superseded | Archived
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---
```

### Decision

```yaml
---
title: "Decision Title"
type: decision
decision_date: 2026-02-08
product: ""                      # From memory/context/products.md
module: ""                       # From memory/context/products.md
client: ""                       # From memory/context/clients.md
decision_type: Architecture      # Architecture | Scope | Priority | Technical | Stakeholder Commitment
status: Active                   # Active | Revised | Reversed
stakeholders: "Name1, Name2"
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---
```

### Release Note

```yaml
---
title: "{Product} {Version} YYMMDD"
type: release-note
release_date: 2026-02-08
product: ""                      # From memory/context/products.md
status: Draft                    # Draft | Published | Internal Only
version: "{product}-YYMMDD"
related_stories:                 # filenames of Stories shipped in this release (without .md)
  - story-001-slug
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---
```

## Relationship Model

Relationships are expressed bidirectionally using filenames (without `.md` extension) as foreign keys.

### Hierarchy Links

- **Upward (child → parent):** The `parent` field points from a child card to its parent card.
  - Story → Epic: `parent: epic-filename`
  - Epic → Initiative: `parent: initiative-filename`

- **Downward (parent → children):** The `children` array lists child filenames.
  - Initiative → Epics: `children: [epic-1, epic-2]`
  - Epic → Stories: `children: [story-001-slug, story-002-slug]`

### Cross-Type Links

- **Intake → Generated Cards:** `generated_initiatives` and `generated_epics` arrays on Intake cards
- **Card → Source Intake:** `source_intake` field on Initiative and Epic cards
- **Release Note → Stories:** `related_stories` array on Release Note cards

### Bidirectional Maintenance Rule

**Creating a child card MUST update the parent card:**
1. Add the new child's filename to the parent's `children` array
2. Update the parent's `updated` date to today

**Creating cards from an intake MUST update the intake card:**
1. Add generated Initiative filenames to `generated_initiatives`
2. Add generated Epic filenames to `generated_epics`
3. Update the intake's `updated` date and set status to `Handed Off`

## Read Patterns

### Find a Card by Title or Filename

1. If a filename is provided, read directly: `cards/{type}s/{filename}.md`
2. If a title is provided, scan the relevant subfolder and check frontmatter `title` fields for a match
3. If a search term is provided, scan across all subfolders for frontmatter matches

### List Cards by Type

Read all `.md` files in the relevant subfolder (e.g., `cards/initiatives/`) and parse their frontmatter for summary display.

### Query Cards by Property

Scan files in the relevant subfolder and filter by frontmatter field values (e.g., find all stories with `status: Draft` and `product: WebApp`).

## Write Patterns

### Create a New Card

1. **Generate filename** from the card title following the filename conventions above
2. **Build YAML frontmatter** using the schema for the card type, populating all required fields
3. **Write card body** below the frontmatter using `##` headings for sections, with blank lines between major sections
4. **Save the file** to the correct subfolder: `cards/{type}s/{filename}.md`
5. **Update parent card** if applicable: add this card's filename to the parent's `children` array and update the parent's `updated` date
6. **Update intake card** if this card was generated from an intake: add filename to the appropriate `generated_*` array

### Update an Existing Card

1. **Read the existing file** and parse frontmatter and body separately
2. **Apply changes** to the affected sections only
3. **Present a diff** to the user showing what will change (mandatory; never silently overwrite)
4. **On approval**, write the updated file with the new `updated` date
5. **Update related cards** if relationship fields changed

### Delete a Card

Deletion is not supported through commands. Users can manually remove files if needed.

## Content Formatting Rules

### Page Structure

1. Use blank lines between major sections for readability
2. Section headers use `##` (Heading 2)
3. Prose for narrative sections, bullet points for lists
4. Never use tables in card body content
5. Never use `<empty-block/>` tags; use blank lines instead

### Required Fields on Every Write

- **Taxonomy:** product, module, client
- **Dates:** `created` and `updated` fields on every card
- **Status:** Always set appropriate status from the schema options
- **Type:** Always set the `type` field matching the card type

### Date Field Format

All dates use ISO 8601 format: `YYYY-MM-DD` (e.g., `2026-02-08`)

## Output Protocol

### After Successful Write

Display only:
```
[Card Type] saved to cards/{type}s/{filename}.md
```

Example:
```
Initiative saved to cards/initiatives/notification-system-overhaul.md
```

### After Successful Update

Display only:
```
[Card Type] updated: cards/{type}s/{filename}.md
```

### On Write Failure

- Preserve the card content in conversation
- Offer retry with corrected properties
- Do not clear the content

### Never Display

- Full card properties in conversation after save
- Card body content summaries after save
- Taxonomy selections (unless specifically requested for verification)

## Config Resolution Protocol

### Reading Taxonomy Values
When a command or schema needs product, module, client, or system values:
1. Read the corresponding file from `memory/context/`
2. Parse the YAML frontmatter for the enum list
3. Use those values for validation and card generation

### Config Files
| Need | Memory File | Frontmatter Key |
|------|-------------|-----------------|
| Products | memory/context/products.md | products |
| Modules | memory/context/products.md | modules |
| Systems | memory/context/products.md | systems |
| Clients | memory/context/clients.md | clients |
| Integrations | memory/context/integrations.md | integrations |

### Missing Config
If memory/context files don't exist:
1. Accept freeform values (don't reject)
2. Inform user: "Run `/productivity:setup-org` to configure your taxonomy"
3. After workflow, offer to add used values to memory

### Unknown Values
When a user mentions a value not in the config:
1. Flag: "I don't see '[value]' in your taxonomy. Should I add it?"
2. On confirmation, append to the appropriate memory file
3. Update both the YAML frontmatter list and markdown body

**Statuses by Card Type:**
- Initiatives: Draft, Submitted, Approved, Superseded
- Epics: Planning, In Progress, Complete, Cancelled
- Stories: Draft, Ready, In Progress, Done
- Intakes: Draft, Complete, Handed Off
- Checkpoints: Current, Superseded, Archived
- Decisions: Active, Revised, Reversed
- Release Notes: Draft, Published, Internal Only
