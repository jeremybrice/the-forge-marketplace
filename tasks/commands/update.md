---
description: Sync tasks from external sources and triage stale items
argument-hint: "[--comprehensive]"
---

# Update Command

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../CONNECTORS.md).

Keep your task folder current by syncing from external tools and triaging stale items. Two modes:

- **Default:** Sync tasks from external tools, triage overdue/stale items
- **`--comprehensive`:** Deep scan chat, email, calendar, docs — flag missed todos and suggest new tasks

## Usage

```bash
/tasks:update
/tasks:update --comprehensive
```

## Default Mode

### 1. Load Current State

Read all task files from `tasks/` directory. If it doesn't exist, suggest `/tasks:start` first.

Parse YAML frontmatter from each `task-NNN-{slug}.md` file to build current task inventory.

### 2. Sync Tasks from External Sources

Check for available task sources:
- **Project tracker** (e.g. Asana, Linear, Jira) (if MCP available)
- **GitHub Issues** (if in a repo): `gh issue list --assignee=@me`

If no sources are available, skip to Step 3.

**Fetch tasks assigned to the user** (open/in-progress). Compare against tasks/ folder:

| External task | tasks/ match? | Action |
|---------------|---------------|--------|
| Found, not in tasks/ | No match | Offer to add |
| Found, already in tasks/ | Match by title (fuzzy) | Sync status if changed |
| In tasks/, not in external | No match | Flag as potentially stale |
| Completed externally | In tasks/ as active | Offer to mark done |

Present diff and let user decide what to add/update/complete.

When adding from external source:
- Populate `external_link` and `external_id` fields
- Set status to match external status
- Generate next sequential task number

### 3. Triage Stale Items

Review task files with status "active" or "waiting" and flag:
- Tasks with `due_date` in the past
- Tasks with `created` date 30+ days ago and status still "active"
- Tasks with empty or minimal note content (no context)

Present each for triage: Mark done? Reschedule? Move to someday? Delete?

### 4. Update Task Files

For each task the user wants to update:
- Read the task file
- Update YAML frontmatter fields (status, due_date, updated, etc.)
- Write the file back
- Always update `updated` field to today's date

### 5. Report

```
Update complete:
- Tasks: +3 from Asana, 1 completed, 2 triaged
- X active, X waiting, X someday, X done
- All synced ✓
```

## Comprehensive Mode (`--comprehensive`)

Everything in Default Mode, plus a deep scan of recent activity.

### Extra Step: Scan Activity Sources

Gather data from available MCP sources:
- **Chat:** Search recent messages, read active channels
- **Email:** Search sent messages
- **Documents:** List recently touched docs
- **Calendar:** List recent + upcoming events

### Extra Step: Flag Missed Todos

Compare activity against tasks/ folder. Surface action items that aren't tracked:

```
## Possible Missing Tasks

From your activity, these look like todos you haven't captured:

1. From chat (Jan 18):
   "I'll send the updated mockups by Friday"
   → Add to tasks/?

2. From meeting "Phoenix Standup" (Jan 17):
   You have a recurring meeting but no Phoenix tasks active
   → Anything needed here?

3. From email (Jan 16):
   "I'll review the API spec this week"
   → Add to tasks/?
```

Let user pick which to add. For each new task:
- Generate next sequential task number
- Create task file with appropriate metadata
- Set creator, created date, status

### Extra Step: Suggest Cleanup

Surface tasks that may be outdated:

```
## Suggested Cleanup
- **task-012-horizon-planning.md** — No activity in 45 days. Mark completed or archive?
- **task-008-review-api-spec.md** — Created 60 days ago, still active. Still relevant?
```

Present grouped by age and likelihood of being stale.

## Notes

- Never auto-add or auto-complete tasks without user confirmation
- External source links (`external_link`, `external_id`) are preserved when available
- Fuzzy matching on task titles handles minor wording differences
- Safe to run frequently — only updates when there's new info
- `--comprehensive` always runs interactively
- Task file format documented in task-management skill
