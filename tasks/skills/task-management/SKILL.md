---
name: task-management
description: Folder-based task management with rich metadata and external sync. Reference this when the user asks about their tasks, wants to add/complete tasks, or needs help tracking commitments.
---

# Task Management

Tasks are tracked in individual markdown files in the `tasks/` directory, each with YAML frontmatter for metadata.

## File Location

**Always use `tasks/` directory in the current working directory.**

Task files follow the pattern: `task-NNN-{slug}.md`

Examples:
- `tasks/task-001-review-api-spec.md`
- `tasks/task-042-send-psr-to-todd.md`
- `tasks/task-123-update-jira-tickets.md`

**Task numbering:**
- Zero-padded 3-digit sequential (001, 002, ..., 999)
- Numbers are never reused
- To find next number: scan directory for highest NNN and add 1

**Slug generation:**
- From task title
- Lowercase, spaces to hyphens
- Strip non-alphanumeric except hyphens
- Collapse consecutive hyphens
- Trim leading/trailing hyphens
- Max 50 characters

## Format & Template

### YAML Frontmatter Schema

Every task file must have this frontmatter:

```yaml
---
title: "Task title"
type: "task"
status: "active|waiting|someday|done"
priority: "high|medium|low"
assignee: ""
creator: "User's Name"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
due_date: "YYYY-MM-DD"
dependencies: []
tags: []
external_link: ""
external_id: ""
---
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Task title/summary |
| `type` | string | Yes | Always "task" |
| `status` | enum | Yes | One of: active, waiting, someday, done |
| `priority` | enum | Yes | One of: high, medium, low |
| `assignee` | string | No | Person responsible (empty if user) |
| `creator` | string | No | Who created the task |
| `created` | date | Yes | ISO 8601 date (YYYY-MM-DD) |
| `updated` | date | Yes | ISO 8601 date (YYYY-MM-DD) |
| `due_date` | date | No | ISO 8601 date or empty string |
| `dependencies` | array | No | List of other task filenames (without .md) |
| `tags` | array | No | Free-form tags |
| `external_link` | string | No | URL to external system (Asana, Linear, etc.) |
| `external_id` | string | No | ID in external system |

### Body Content

After frontmatter, the file body contains:
- Notes and context
- Sub-tasks or checklist items
- Links to related resources
- Any other prose

Example full file:

```markdown
---
title: "Review API spec for Phoenix project"
type: "task"
status: "active"
priority: "high"
assignee: ""
creator: "Jeremy Brice"
created: "2026-02-10"
updated: "2026-02-12"
due_date: "2026-02-14"
dependencies: []
tags: ["phoenix", "api", "review"]
external_link: "https://linear.app/acme/issue/ENG-1234"
external_id: "ENG-1234"
---

Todd requested review of the new Phoenix API spec before Friday standup.

Focus areas:
- Authentication flow
- Rate limiting strategy
- Backwards compatibility

Spec doc: https://docs.google.com/document/d/abc123
```

## How to Interact

### Reading Tasks

**When user asks "what's on my plate" / "my tasks":**
1. Use Glob to find all `tasks/task-*.md` files
2. Read each file and parse YAML frontmatter
3. Filter by status: "active" and "waiting" are current work
4. Summarize by priority and due date
5. Highlight anything overdue

**When user asks "what am I waiting on":**
1. Filter tasks where status = "waiting"
2. Sort by created date (oldest first)
3. Note how long each has been waiting

**When user asks for specific task:**
1. Search by title match (fuzzy)
2. Or by task number if provided
3. Present full task details including body content

### Writing Tasks

**When user says "add a task" / "remind me to":**
1. Use `/tasks:add` command for interactive creation
2. Or directly create task file with next sequential number
3. Always populate required frontmatter fields
4. Set status to "active" by default

**When user says "done with X" / "finished X":**
1. Find the task file by title match
2. Update frontmatter: `status: "done"`
3. Update `updated` field to today
4. Keep file in tasks/ directory (don't delete)

**When updating any task:**
1. Read the task file
2. Parse and update YAML frontmatter
3. Write back with updated fields
4. **Always update `updated` field to today's date**

### YAML Frontmatter Parsing

When reading task files:
```javascript
// Conceptual example
const content = readFile('tasks/task-001-example.md');
const [, frontmatter, body] = content.match(/^---\n(.*?)\n---\n(.*)$/s);
const metadata = parseYAML(frontmatter);
```

When writing task files:
```javascript
// Conceptual example
const yamlString = stringifyYAML(metadata);
const content = `---\n${yamlString}---\n\n${body}`;
writeFile('tasks/task-NNN-slug.md', content);
```

## Status Workflow

Tasks progress through statuses:

```
active → done
active → waiting → active → done
active → someday → active → done
```

**Status definitions:**
- `active` — Current work, should be worked on soon
- `waiting` — Blocked on someone else or external dependency
- `someday` — Backlog, not prioritized yet
- `done` — Completed

## Conventions

- Use `priority: "high"` sparingly (only truly urgent/important)
- Default new tasks to `priority: "medium"`
- `assignee` is empty if the task is for the user
- `creator` helps track who requested the task
- Always update `updated` date when making any changes
- `dependencies` array uses task filenames without `.md` extension
- `tags` are free-form but keep them consistent (lowercase, singular)

## External System Integration

When syncing from external sources (Asana, Linear, Jira, GitHub):
1. Populate `external_link` with full URL
2. Populate `external_id` with the external system's ID
3. Use external status to set local `status` field
4. Preserve these fields when updating — never overwrite
5. On subsequent syncs, use `external_id` for matching

## Dashboard Setup (First Run)

A visual dashboard is available for managing tasks. **On first interaction with tasks:**

1. Check if `dashboard.html` exists in the current working directory
2. If not, copy it from `${CLAUDE_PLUGIN_ROOT}/skills/dashboard.html` to the current working directory
3. Inform the user: "I've added the dashboard. Run `/tasks:start` to open it."

The task board:
- Reads and writes task files from `tasks/` directory
- Auto-saves changes to individual files
- Watches for external changes (syncs when you edit via CLI)
- Supports drag-and-drop, filtering, sorting

## Migration from Legacy TASKS.md

If user has a legacy `TASKS.md` file, the `/tasks:start` command handles migration automatically:
- Parses sections (Active, Waiting On, Someday, Done)
- Extracts tasks with checkboxes
- Creates individual task files with sequential numbers
- Archives original as `TASKS.md.legacy`

## Notes

- Never delete task files — mark as done instead
- Task numbers are permanent — never renumber existing tasks
- Due dates are optional — many tasks are aspirational
- The folder structure allows git tracking, external tools, search
- Completed tasks stay in the folder for historical reference
- Users can archive old completed tasks manually if desired
