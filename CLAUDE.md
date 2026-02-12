# CLAUDE.md — The Forge Marketplace

Claude Code plugin marketplace: 5 plugins, local-first markdown persistence. See [README.md](README.md) for full plugin descriptions and installation instructions.

## Repository Structure

```
the-forge-marketplace/
  .claude-plugin/
    marketplace.json          ← Root plugin catalog
  cognitive-forge/            ← v1.2.0 — Multi-agent debate & exploration
  product-forge-local/        ← v1.0.5 — Local-first product card management
  productivity/               ← v1.1.0 — Tasks, planning, organizational memory
  rovo-agent-forge/           ← v1.0.0 — Atlassian Rovo agent builders
  forge-shell/                ← v1.0.0 — Unified dashboard shell
    STYLE_GUIDE.md            ← Shared dashboard UI standards
  README.md
```

## Plugin Architecture Pattern

Every plugin follows this standard layout:

```
{plugin}/
  .claude-plugin/
    plugin.json               ← Plugin manifest (name, version, description, author)
  commands/                   ← User-invocable slash commands (one .md per command)
  skills/                     ← Internal knowledge skills (each in its own folder)
    {skill-name}/
      SKILL.md                ← Skill definition
      references/             ← Optional reference material
      templates/              ← Optional templates
  agents/                     ← Optional: agent definitions (cognitive-forge only)
  sessions/                   ← Optional: persisted session outputs (cognitive-forge only)
  hooks/                      ← Optional: hook definitions
```

Not every plugin has every directory. Cognitive Forge has `agents/` and `sessions/`. Product Forge Local and Productivity have `skills/` with multiple skill folders. Forge Shell has only `commands/`. Rovo Agent Forge has `skills/` and `sample-configs/`.

> **Note:** The `dashboard.json` files were removed in the Feb 2026 cleanup. The Forge Shell SPA uses a hardcoded `PLUGINS` array in `forge-shell/app/js/shell.js` and provides built-in view controllers in `forge-shell/app/js/` for each plugin.

## Naming Conventions

**Plugin folders:** `kebab-case` (e.g., `product-forge-local`, `cognitive-forge`)

**Command invocation:** `/plugin-name:command-name` (e.g., `/cognitive-forge:debate`)

**Command files:** `command-name.md` in `{plugin}/commands/` (e.g., `debate.md`, `setup-org.md`)

**Skill definitions:** Always `SKILL.md` (uppercase) inside a descriptive kebab-case folder (e.g., `skills/pm-methodology/SKILL.md`, `skills/cognitive-techniques/SKILL.md`)

**Agent files:** `forge-{role}.md` (e.g., `forge-challenger.md`, `forge-synthesizer.md`, `forge-explorer.md`)

**Session files:** `{YYYY-MM-DD}-{slug}.md` stored in `sessions/debates/` or `sessions/explorations/`

**Card filenames** (Product Forge Local, written to user's project `cards/` directory):

| Card Type    | Pattern                                  | Example                                            |
|--------------|------------------------------------------|----------------------------------------------------|
| Initiative   | `{kebab-case-title}.md`                  | `notification-system-overhaul.md`                  |
| Epic         | `{kebab-case-title}.md`                  | `email-notification-engine.md`                     |
| Story        | `story-NNN-{slug}.md`                    | `story-001-notification-template-builder.md`       |
| Intake       | `intake-{product}-{feature-name}.md`     | `intake-webapp-notification-system.md`             |
| Checkpoint   | `checkpoint-YYYY-MM-DD-{slug}.md`        | `checkpoint-2026-02-08-notification-architecture-decisions.md` |
| Decision     | `{kebab-case-title}.md`                  | `use-event-driven-notification-pipeline.md`        |
| Release Note | `release-notes-YYMMDD.md`               | `release-notes-260208.md`                          |

**Slug generation:** lowercase, spaces to hyphens, strip non-alphanumeric (except hyphens), collapse consecutive hyphens, trim leading/trailing hyphens.

**Rovo agent configs** (Rovo Agent Forge, written to user's project `rovo-agents/` directory):

- Agent folders: `{slugified-agent-name}/` inside `rovo-agents/`
- Agent config file: always `agent.md` inside the agent folder (e.g., `rovo-agents/ticket-triage-agent/agent.md`)
- Slug generation follows the same rules as above: lowercase, spaces to hyphens, strip non-alphanumeric (except hyphens), collapse consecutive hyphens, trim edges

## Config Files Reference

| File | Purpose |
|------|---------|
| `.claude-plugin/marketplace.json` | Root catalog listing all plugins |
| `{plugin}/.claude-plugin/plugin.json` | Plugin manifest (name, version, description, author) |
| `forge-shell/STYLE_GUIDE.md` | Shared toolbar and theming standards for all dashboards |

## File Format Patterns

### Command Frontmatter

```yaml
---
name: command-name
description: "What this command does"
arguments:                    # Optional
  - name: arg-name
    description: "..."
    required: true
---
```

Some commands omit `name` and include only `description`. Both patterns exist in the repo.

### Skill Frontmatter

```yaml
---
name: skill-name
description: "What this skill provides"
user_invocable: false         # Optional, defaults to true if omitted
---
```

### Agent Frontmatter

```yaml
---
name: forge-role-name
description: "Agent's role and purpose"
tools:
  - Read
  - Grep
  - Glob
skills:
  - skill-name
---
```

### Product Card Frontmatter

All persistent product cards require YAML frontmatter with at minimum: `type`, `status`, `created`, `updated`. Full schemas for each card type are defined in `product-forge-local/skills/local-routing/SKILL.md`.

## Formatting Rules

These rules apply to all product card content generated by Product Forge Local. They are enforced by the `pm-methodology` skill.

1. **No dashes as thought separators.** Never use dashes to separate thoughts in prose. Dashes are acceptable only in compound words (e.g., "read-only", "cross-platform"). Use periods, semicolons, or restructure sentences instead.

2. **No tables in product cards.** Use prose paragraphs or bullet points. Tables break on mobile and reduce readability in card interfaces.

3. **Substantive bullets.** Each bullet must contain 1 to 2 sentences minimum, unless listing system or module names. Avoid single-word or trivial bullets.

4. **Prose for narrative sections.** Background, Proposed Solution, Epic Scope, Context, and similar sections must be written as prose paragraphs, not bullet lists.

5. **Blank lines between major sections** for readability and visual hierarchy.

## Card Hierarchy (Product Forge Local)

Product Forge Local uses a three-level Jira-style hierarchy:

**Initiative** (top level) > **Epic** (team level) > **Story** (engineering level)

Relationships are bidirectional using filenames without the `.md` extension:
- Upward: child's `parent` field points to the parent filename
- Downward: parent's `children` array lists child filenames

**Creating a child card MUST update the parent card:**
1. Add the new child's filename to the parent's `children` array
2. Update the parent's `updated` date to today

**Status enums by card type:**
- Initiative: Draft, Submitted, Approved, Superseded
- Epic: Planning, In Progress, Complete, Cancelled
- Story: Draft, Ready, In Progress, Done
- Intake: Draft, Complete, Handed Off
- Checkpoint: Current, Superseded, Archived
- Decision: Active, Revised, Reversed
- Release Note: Draft, Published, Internal Only

## Rovo Agent Configs (Rovo Agent Forge)

Rovo Agent Forge saves agent configurations to the user's project root in `rovo-agents/{slug}/agent.md`. Each agent config uses YAML frontmatter with at minimum: `name`, `description`, `status`, `created`, `updated`.

**Status enums:** Draft, Ready, Deployed

The `rovo-agents/` directory lives at the user's project root, not inside the plugin folder. The path is `rovo-agents/{slug}/agent.md` relative to the working directory.

## Plugin Relationships

```
┌─────────────┐     taxonomy      ┌─────────────────────┐
│ Productivity │ ──────────────► │ Product Forge Local  │
│  (memory/    │  products,       │  (cards/, skills,    │
│   context/)  │  modules,        │   commands)          │
└─────────────┘  clients          └─────────────────────┘
                                           │
┌─────────────┐                            │
│  Cognitive   │   independent sessions    │
│    Forge     │   (debates/explorations)  │
└─────────────┘                            │
        │                                  │
┌─────────────────┐                        │
│  Rovo Agent     │  writes to             │
│    Forge        │  rovo-agents/          │
└─────────────────┘                        │
        │                                  │
        └──────────┐          ┌────────────┘
                   ▼          ▼
              ┌────────────────────┐
              │    Forge Shell     │
              │  (unified SPA with │
              │   built-in view    │
              │   controllers for  │
              │   each plugin)     │
              └────────────────────┘
```

- **Productivity** provides the organizational memory layer (`memory/context/` files with products, modules, clients, teams) consumed by Product Forge Local for taxonomy validation.
- **Cognitive Forge** operates independently, writing debate and exploration sessions to its own `sessions/` directory.
- **Product Forge Local** reads taxonomy from Productivity's memory files and writes product cards to the user's project `cards/` directory.
- **Rovo Agent Forge** provides interactive builders for Atlassian Rovo agents. Saves agent configurations to the user's project `rovo-agents/` directory. Has a dedicated view controller in the Forge Shell SPA for visualizing and editing agents.
- **Forge Shell** is a unified SPA with built-in view controllers for each plugin. Plugins register via the `PLUGINS` array in `forge-shell/app/js/shell.js`.

## Dashboard / UI Standards

See `forge-shell/STYLE_GUIDE.md` for the full specification. Key facts:

- Toolbar height: 48px
- Icon button size: 32x32px
- Icon library: Font Awesome (loaded via CDN)
- Theming: dark/light mode via CSS custom properties (`--bg-primary`, `--text-primary`, `--accent`, etc.) toggled by postMessage or button
- All plugins share the same CSS custom property names
- Reference implementation: Cognitive Forge SPA view controller in `forge-shell/app/js/`

## Checklists

### Adding a New Plugin

1. Create `{plugin-name}/` directory (kebab-case) at repo root
2. Create `{plugin-name}/.claude-plugin/plugin.json` with name, version, description, author
3. Create `{plugin-name}/commands/` with at least one command `.md` file
4. If the plugin has a dashboard view, add it to the `PLUGINS` array in `forge-shell/app/js/shell.js` and create a view controller in `forge-shell/app/js/`
5. Add the plugin entry to `.claude-plugin/marketplace.json` in the `plugins` array
6. Add the plugin to the table and descriptions in `README.md`
7. If the plugin has a dashboard, add it to the Implemented Plugins table in `forge-shell/STYLE_GUIDE.md`

### Adding a New Command

1. Create `{plugin}/commands/{command-name}.md`
2. Add YAML frontmatter with at minimum `description` (and optionally `name` and `arguments`)
3. Write the command instructions below the frontmatter
4. Document the command in the plugin's README and the root README

### Adding a New Skill

1. Create `{plugin}/skills/{skill-name}/SKILL.md` (folder in kebab-case, file in uppercase)
2. Add YAML frontmatter with `name`, `description`, and optionally `user_invocable: false`
3. Add optional `references/` or `templates/` subdirectories if needed
4. Reference the skill in any agent definitions that should use it (via the `skills` array in agent frontmatter)

### Adding a New Agent

1. Create `{plugin}/agents/forge-{role}.md`
2. Add YAML frontmatter with `name`, `description`, `tools` array, and `skills` array
3. Reference the agent from the command that spawns it

## Key Constraints

- **Never silently overwrite card files.** Always present a diff to the user before updating an existing card.
- **Taxonomy comes from `memory/context/` files.** If these files do not exist, accept freeform values and suggest the user run `/productivity:setup-org` to configure their taxonomy.
- **Story numbers are zero-padded 3-digit sequential** (001, 002, ...). Scan `cards/stories/` for the highest existing number and increment by one.
- **Cards directory lives at the user's project root**, not inside the plugin folder. The path is `cards/{type}s/{filename}.md` relative to the working directory.
- **Date format is ISO 8601:** `YYYY-MM-DD` for all frontmatter date fields.
- **Rovo agents directory lives at the user's project root**, not inside the plugin folder. The path is `rovo-agents/{slug}/agent.md` relative to the working directory.
