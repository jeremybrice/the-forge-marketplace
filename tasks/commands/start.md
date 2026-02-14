---
description: Initialize the task management system and migrate legacy TASKS.md
---

# Start Command

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../CONNECTORS.md).

Initialize the folder-based task management system, migrate legacy TASKS.md if present, then open the dashboard.

## Instructions

### 1. Check What Exists

Check the working directory for:
- `TASKS.md` — legacy single-file task list (will be migrated)
- `tasks/` — folder-based task storage
- `dashboard.html` — the visual UI

### 2. Migrate Legacy TASKS.md (If Present)

**If `TASKS.md` exists:** Migrate it to the new folder-based structure.

#### Migration Steps:

1. **Parse TASKS.md sections:**
   - `## Active` — tasks to migrate with status "active"
   - `## Waiting On` — tasks to migrate with status "waiting"
   - `## Someday` — tasks to migrate with status "someday"
   - `## Done` — tasks to migrate with status "done"

2. **Extract tasks using pattern:**
   ```
   - [ ] **Title** - note content
   - [x] ~~Title~~ (completed date) - note content
   ```

3. **Generate task files:**
   - Create `tasks/` directory if it doesn't exist
   - For each task, create `task-NNN-{slug}.md` with sequential numbers (001, 002, ...)
   - Slug generation: lowercase, spaces to hyphens, strip non-alphanumeric except hyphens, max 50 chars

4. **Task file format:**
   ```yaml
   ---
   title: "Task Title"
   type: "task"
   status: "active|waiting|someday|done"
   priority: "high|medium|low"
   assignee: ""
   creator: "{user's name if known}"
   created: "YYYY-MM-DD"
   updated: "YYYY-MM-DD"
   due_date: ""
   dependencies: []
   tags: []
   external_link: ""
   external_id: ""
   ---

   {note content if any}
   ```

5. **Parse due dates and other metadata:**
   - Extract "due [date]" from note → populate `due_date`
   - Extract "for [person]" from note → keep in note content
   - Extract "since [date]" from note → keep in note content
   - Completed tasks: use completion date as `updated` date

6. **Archive original:**
   - Move `TASKS.md` to `TASKS.md.legacy`

7. **Report results:**
   ```
   Migrated legacy TASKS.md:
   - X active tasks
   - X waiting tasks
   - X someday tasks
   - X completed tasks

   Original saved as TASKS.md.legacy
   Tasks now in tasks/ directory
   ```

### 3. Create What's Missing

**If `tasks/` directory doesn't exist and no TASKS.md:** Create empty `tasks/` directory.

**If `dashboard.html` doesn't exist:** Copy it from `${CLAUDE_PLUGIN_ROOT}/skills/dashboard.html` to the current working directory.

### 4. Open the Dashboard

Do NOT use `open` or `xdg-open` — in Cowork, the agent runs in a VM and shell open commands won't reach the user's browser. Instead, tell the user: "Dashboard is ready at `dashboard.html`. Open it from your file browser to get started."

### 5. Orient the User

```
Task system ready:
- Tasks: X items in tasks/ directory
- Dashboard: open dashboard.html in browser

Commands:
- /tasks:add to quickly add a new task
- /tasks:update to sync with external systems (Asana, Linear, Jira, GitHub)
- /tasks:update --comprehensive for deep triage and sync
```

## Notes

- Migration is one-time only — runs when TASKS.md exists but tasks/ doesn't
- After migration, the system uses folder-based storage exclusively
- Task numbers are sequential and never reused
- Safe to run multiple times — checks state and only creates what's needed
