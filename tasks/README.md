# Tasks Plugin

**Version:** 1.0.0
**Author:** Jeremy Brice

Folder-based task management with rich metadata, external system sync, and automatic migration from legacy TASKS.md format.

## Features

### Folder-Based Storage
- Each task is an individual markdown file: `task-NNN-{slug}.md`
- Sequential 3-digit task numbers (001, 002, 003...)
- YAML frontmatter for structured metadata
- Prose body for context and notes

### Rich Metadata
- Status tracking (active, waiting, someday, done)
- Priority levels (high, medium, low)
- Due dates, dependencies, tags
- Creator and assignee tracking
- External system integration (link, ID)

### External Sync
- Sync with Asana, Linear, Jira (via MCP)
- Sync with GitHub Issues (via gh CLI)
- Bi-directional status updates
- Preserve external links and IDs

### Visual Dashboard
- Browser-based task board UI
- Drag-and-drop reordering
- Filter by status, priority, tags
- Auto-save and live sync with CLI edits

### Automatic Migration
- Detects legacy TASKS.md format
- Parses sections (Active, Waiting On, Someday, Done)
- Generates task files with sequential numbers
- Archives original as TASKS.md.legacy

## Commands

### `/tasks:start`
Initialize the task system and open the dashboard.

**What it does:**
- Checks for legacy TASKS.md and migrates if present
- Creates `tasks/` directory if needed
- Copies dashboard.html to working directory
- Opens the visual task board

**Usage:**
```bash
/tasks:start
```

**First-time migration:**
If TASKS.md exists, it will:
1. Parse all task sections
2. Create individual task files
3. Move TASKS.md to TASKS.md.legacy
4. Report results

### `/tasks:add`
Quick add a new task with interactive prompts.

**What it does:**
- Prompts for title, note, due date, priority
- Generates next sequential task number
- Creates task file with proper metadata
- Confirms creation

**Usage:**
```bash
/tasks:add
```

**Interactive prompts:**
```
Let's add a new task.

Title: Review API spec for Phoenix
Note (optional details): Focus on auth flow and rate limiting
Due date (YYYY-MM-DD or relative): friday
Priority (high/medium/low): high
```

**Result:**
```
Task added: task-043-review-api-spec-for-phoenix.md
- Title: Review API spec for Phoenix
- Priority: high
- Due: 2026-02-14
```

### `/tasks:update`
Sync tasks from external systems and triage stale items.

**Default mode:**
- Sync from Asana, Linear, Jira, GitHub Issues
- Flag overdue tasks
- Flag tasks active for 30+ days
- Suggest cleanup for stale items

**Comprehensive mode:**
- All default features
- Scan chat, email, calendar, docs
- Flag missed todos from activity
- Suggest new tasks based on commitments

**Usage:**
```bash
/tasks:update
/tasks:update --comprehensive
```

**Example output:**
```
Update complete:
- Tasks: +3 from Linear, 1 completed, 2 triaged
- 12 active, 3 waiting, 5 someday, 28 done
- All synced ✓
```

## Task File Format

### File Naming
Pattern: `task-NNN-{slug}.md`

Examples:
- `task-001-review-api-spec.md`
- `task-042-send-psr-to-todd.md`
- `task-123-update-jira-tickets.md`

### YAML Frontmatter Schema

```yaml
---
title: "Task title"
type: "task"
status: "active"
priority: "medium"
assignee: ""
creator: "Your Name"
created: "2026-02-10"
updated: "2026-02-12"
due_date: "2026-02-14"
dependencies: []
tags: ["phoenix", "api"]
external_link: "https://linear.app/acme/issue/ENG-1234"
external_id: "ENG-1234"
---

Task notes and context go here.

You can include:
- Detailed requirements
- Links to related docs
- Checklists
- Status updates
```

### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✓ | Task title/summary |
| `type` | string | ✓ | Always "task" |
| `status` | enum | ✓ | active, waiting, someday, done |
| `priority` | enum | ✓ | high, medium, low |
| `assignee` | string | | Person responsible (empty if you) |
| `creator` | string | | Who created the task |
| `created` | date | ✓ | YYYY-MM-DD |
| `updated` | date | ✓ | YYYY-MM-DD (auto-updated) |
| `due_date` | date | | YYYY-MM-DD or empty |
| `dependencies` | array | | Other task filenames (no .md) |
| `tags` | array | | Free-form tags |
| `external_link` | string | | URL to external system |
| `external_id` | string | | ID in external system |

## Status Enums

Tasks progress through these statuses:

```
active    → Current work, should be done soon
waiting   → Blocked on someone/something
someday   → Backlog, not prioritized
done      → Completed
```

Status workflow:
```
active → done
active → waiting → active → done
active → someday → active → done
```

## Priority Enums

```
high      → Urgent and important (use sparingly)
medium    → Default priority
low       → Nice to have, low urgency
```

## Migration from TASKS.md

If you have an existing `TASKS.md` file (from Productivity plugin or custom format), `/tasks:start` will automatically migrate it.

### Legacy Format Detected
```markdown
# Tasks

## Active
- [ ] **Review API spec** - for Todd, due Friday
- [ ] **Update Jira tickets** - sync Phoenix status

## Waiting On
- [ ] **Design feedback** - sent to Maya on Monday

## Someday
- [ ] **Refactor auth module** - when time permits

## Done
- [x] ~~Send PSR~~ (2026-02-10)
```

### Migration Process
1. Parse each section (Active, Waiting On, Someday, Done)
2. Extract task title and note from each checkbox line
3. Create individual task files with sequential numbers
4. Set status based on section (Active → active, etc.)
5. Parse dates from notes (due dates, completion dates)
6. Archive original as `TASKS.md.legacy`

### Migrated Result
```
tasks/
  task-001-review-api-spec.md
  task-002-update-jira-tickets.md
  task-003-design-feedback.md
  task-004-refactor-auth-module.md
  task-005-send-psr.md
```

## Dashboard Features

The visual dashboard (`dashboard.html`) provides:

### Task Board View
- Column layout by status (Active, Waiting, Someday, Done)
- Drag-and-drop between columns
- Click to edit task details
- Visual priority indicators

### Filtering & Sorting
- Filter by status, priority, tags
- Sort by due date, priority, created date
- Search by title or content

### Quick Actions
- Add new task (inline form)
- Mark task done (checkbox)
- Change priority (dropdown)
- Set due date (date picker)

### Live Sync
- Auto-saves changes to task files
- Watches for external edits (CLI, git pull)
- Syncs changes without refresh

## Installation

The Tasks plugin is included in The Forge Marketplace. To use it:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jeremybrice/the-forge-marketplace.git
   cd the-forge-marketplace
   ```

2. **Initialize the plugin:**
   ```bash
   /tasks:start
   ```

3. **Open the dashboard:**
   - Open `dashboard.html` in your browser
   - Bookmark it for quick access

## Integration with Other Plugins

### Product Forge Local
Tasks can reference product cards:
```yaml
tags: ["epic-notification-system", "story-001"]
```

### Memory Plugin
Task notes can use organizational shorthand decoded by Memory:
```
Send PSR to Todd re: Phoenix blockers
```
Memory plugin provides context for "PSR", "Todd", "Phoenix".

### Cognitive Forge
Task planning can leverage debate sessions:
```yaml
external_link: "sessions/debates/2026-02-10-architecture-decision.md"
```

## Tips & Best Practices

### Task Numbering
- Numbers are sequential and permanent
- Never renumber existing tasks
- Gaps are okay (if tasks deleted/archived)

### Status Management
- Mark done rather than delete
- Use "waiting" for blocked items
- Use "someday" for backlog

### Priority Discipline
- Reserve "high" for truly urgent items
- Most tasks should be "medium"
- "low" for optional nice-to-haves

### External Sync
- Run `/tasks:update` daily for fresh sync
- Use `--comprehensive` weekly for deep triage
- External links preserved across syncs

### Task Context
- Add detailed notes for context
- Link to related docs/specs
- Tag related tasks for grouping

## Troubleshooting

### Task numbers skipped
This is normal if tasks were deleted or manually renumbered. The system always uses the next available number.

### Dashboard not syncing
Refresh the browser or check that task files are valid YAML. Use `/tasks:update` to verify integrity.

### Migration didn't work
Check that TASKS.md follows the expected format (sections with `## Active`, etc.). Manual intervention may be needed for custom formats.

### External sync failing
Verify MCP connectors are configured. See `CONNECTORS.md` in plugin root for setup instructions.

## License

MIT License - see repository root for details.
