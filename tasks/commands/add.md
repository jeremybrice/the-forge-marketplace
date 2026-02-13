---
description: Quick add a new task
---

# Add Command

Quickly add a new task to the folder-based task system with an interactive prompt.

## Instructions

### 1. Check Prerequisites

Check if `tasks/` directory exists. If not, suggest running `/tasks:start` first.

### 2. Gather Task Information

Prompt the user interactively for:

```
Let's add a new task.

Title: [wait for input]
Note (optional details): [wait for input]
Due date (YYYY-MM-DD or relative like "friday", "next week"): [wait for input]
Priority (high/medium/low): [wait for input, default to "medium"]
```

### 3. Generate Task Number

Scan `tasks/` directory for all `task-NNN-*.md` files. Extract the highest NNN number and increment by one.

Examples:
- If highest is `task-042-review-api.md`, next is `043`
- If directory is empty, start with `001`

### 4. Generate Slug

From the title, create a slug:
- Convert to lowercase
- Replace spaces with hyphens
- Strip all non-alphanumeric characters except hyphens
- Collapse consecutive hyphens to single hyphen
- Trim leading/trailing hyphens
- Truncate to 50 characters max

Examples:
- "Review API spec" → "review-api-spec"
- "Send PSR to Todd (Phoenix)" → "send-psr-to-todd-phoenix"
- "Update JIRA & sync w/ team!!!" → "update-jira-sync-w-team"

### 5. Parse Due Date

If due date is relative (e.g., "friday", "next week"), convert to ISO 8601 date (YYYY-MM-DD).

If empty or user skips, leave `due_date` as empty string.

### 6. Create Task File

Write `tasks/task-{NNN}-{slug}.md` with this format:

```yaml
---
title: "{user's title}"
type: "task"
status: "active"
priority: "{high|medium|low}"
assignee: ""
creator: "{user's name if known, else empty}"
created: "{today's date YYYY-MM-DD}"
updated: "{today's date YYYY-MM-DD}"
due_date: "{YYYY-MM-DD or empty}"
dependencies: []
tags: []
external_link: ""
external_id: ""
---

{note content if provided}
```

### 7. Confirm to User

```
Task added: task-{NNN}-{slug}.md
- Title: {title}
- Priority: {priority}
- Due: {due_date or "none"}

Your task is now tracked in tasks/
```

## Notes

- Always creates task with status "active"
- Task numbers are zero-padded 3-digit sequential (001, 002, ...)
- Slug generation ensures valid filenames
- Safe to run multiple times — each task gets unique number
- User can edit the file directly after creation
