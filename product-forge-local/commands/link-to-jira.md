---
name: link-to-jira
description: "Link a specific Product Forge card to a Jira issue (create new or link existing)"
arguments:
  - name: card
    description: "Filename or title of the card to link"
    required: true
  - name: --create-new
    description: "Skip search and directly create a new Jira issue"
    required: false
---

# Link to Jira Command

## Overview

The `/link-to-jira` command establishes a bidirectional link between a Product Forge card and a Jira issue. It supports two workflows: searching for and linking to an existing Jira issue, or creating a new Jira issue from the card.

This is the first step before using `/push-to-jira` or `/pull-from-jira`. Once linked, the card can be synchronized bidirectionally with Jira.

---

## Usage

### Link by searching for existing Jira issues

```
/link-to-jira notification-system-overhaul
```

Searches Jira for issues matching the card title and presents options to link to an existing issue or create a new one.

### Force creation of a new Jira issue

```
/link-to-jira notification-system-overhaul --create-new
```

Skips the search step and directly creates a new Jira issue for the card.

---

## Workflow

### Step 1: Accept Card Reference

The user must explicitly specify the card to link using either:
- The filename (with or without `.md` extension): `notification-system-overhaul`
- The card title: "Notification System Overhaul"
- Partial match (if unambiguous)

If the user provides ambiguous input, ask for clarification before proceeding.

### Step 2: Read the Card

Determine the card type from the user's input or search across card directories:
- `cards/initiatives/`
- `cards/epics/`
- `cards/stories/`
- `cards/intakes/`
- `cards/checkpoints/`
- `cards/decisions/`

Read the card file to extract:
- `title` (from frontmatter)
- `type` (from frontmatter)
- `description` (from frontmatter)
- `jira_key` or `jira_card` field (from frontmatter)
- Card body content (for description field when creating)

### Step 3: Check for Existing Link

Inspect the frontmatter for linking fields:
- **Epic cards:** `jira_key`
- **Initiative and Story cards:** `jira_card`

If a link already exists:
```
Card is already linked to Jira issue: {jira_key}
Jira URL: {jira_url}

Options:
[1] Keep existing link
[2] Re-link to a different issue
[c] Cancel

Your choice:
```

If the user chooses to re-link, proceed to Step 4. Otherwise, exit.

### Step 4: Search for Existing Jira Issues (unless --create-new)

If `--create-new` flag is present, skip directly to Step 5 (Create New Issue).

Build a JQL query using the card title:
```
summary ~ "{title}" AND issuetype = {mapped_type} ORDER BY created DESC
```

**Type mapping:**
- Initiative → `Initiative` (if available) or `Epic`
- Epic → `Epic`
- Story → `Story`
- Other types → `Task`

Call the MCP tool:
```
jira_search_issues(jql: <constructed query>, max_results: 5)
```

Reference the `jira-sync` skill for MCP tool usage and field mapping.

### Step 5: Present Options to User

Display search results (up to 5 matches) with clear indexing:

```
Found {N} matching Jira issues for "{card title}":

[1] Create new issue

--- Existing issues ---
[2] PROJ-123: Build notification system (Status: To Do, Created: 2026-01-15)
[3] PROJ-456: Notification overhaul (Status: In Progress, Created: 2026-01-10)
[4] PROJ-789: Email notification engine (Status: Done, Created: 2025-12-20)

[c] Cancel

Your choice:
```

If `--create-new` was specified, skip this step and proceed directly to create.

### Step 6: Handle User Selection

#### Option [1]: Create New Issue

Call the MCP tool to create a new Jira issue:
```
jira_create_issue(
  project_key: <from config>,
  summary: <card title>,
  description: <card body content or description>,
  issuetype: <mapped type>,
  parent: <parent card's jira_key or jira_card, if parent exists and card type is Story/Epic>
)
```

Extract the returned `key` and construct the `jira_url`:
```
jira_url = "https://{jira_domain}/browse/{key}"
```

Reference the `jira-sync` skill for MCP tool usage and field mapping.

#### Option [2-6]: Link to Existing Issue

Extract the Jira key from the selected result (e.g., `PROJ-123`).

Construct the `jira_url`:
```
jira_url = "https://{jira_domain}/browse/{key}"
```

#### Option [c]: Cancel

Exit without making changes.

### Step 7: Update Card Frontmatter

Add or update the following fields in the card's YAML frontmatter:

**For Epic cards:**
```yaml
jira_key: PROJ-123
jira_url: https://your-domain.atlassian.net/browse/PROJ-123
jira_last_synced: 2026-02-12T14:30:00Z
```

**For Initiative and Story cards:**
```yaml
jira_card: PROJ-123
jira_url: https://your-domain.atlassian.net/browse/PROJ-123
jira_last_synced: 2026-02-12T14:30:00Z
```

Update the `updated` date in frontmatter to today.

Write the updated card back to its original file path.

### Step 8: Confirm to User

Display a success message:

```
Linked to Jira: PROJ-123
Jira URL: https://your-domain.atlassian.net/browse/PROJ-123
Card updated: cards/{type}s/{filename}.md
```

---

## Error Handling

**Card not found:**
```
Could not find card matching "{user input}".
Please specify the filename or full title.
```

**Jira search fails:**
```
Jira search failed: {error message}
Falling back to create-new mode.
```

**Jira create fails:**
```
Failed to create Jira issue: {error message}
Please check your Jira MCP configuration and permissions.
```

**Parent card not linked:**
If the card has a parent (from frontmatter `parent` field) and the parent card is not yet linked to Jira, warn the user:
```
Warning: Parent card "{parent}" is not linked to Jira.
The new Jira issue will be created without a parent link.
Consider linking the parent card first using /link-to-jira.
```

Proceed with creation anyway (don't block), but omit the `parent` field from the Jira create call.

---

## Notes

- This command is non-destructive. It only adds linking fields to the card frontmatter. It does not modify card content.
- The `jira-sync` skill provides the MCP tool interface and field mapping logic.
- The `jira_last_synced` timestamp uses ISO 8601 format with timezone (e.g., `2026-02-12T14:30:00Z`).
- Epic cards use `jira_key` for backward compatibility with the original schema. Initiative and Story cards use `jira_card`.
- Always present the user with options. Never silently create a Jira issue without confirmation.
- If the user later unlinks the card (by manually removing the fields), they can re-run `/link-to-jira` to establish a new link.

---

## Examples

### Example 1: Link an Epic to an existing Jira issue

**User:**
```
/link-to-jira email-notification-engine
```

**Command:**
1. Reads `cards/epics/email-notification-engine.md`
2. Checks frontmatter: no `jira_key` field present
3. Searches Jira: `summary ~ "Email Notification Engine" AND issuetype = Epic`
4. Presents 3 matching issues to user
5. User selects option [3]: `PROJ-789`
6. Updates card frontmatter with `jira_key: PROJ-789`, `jira_url`, and `jira_last_synced`
7. Returns: `Linked to Jira: PROJ-789`

### Example 2: Create a new Jira issue for a Story

**User:**
```
/link-to-jira story-001-notification-template-builder --create-new
```

**Command:**
1. Reads `cards/stories/story-001-notification-template-builder.md`
2. Checks frontmatter: no `jira_card` field present
3. Skips search (due to `--create-new` flag)
4. Calls `jira_create_issue` with summary, description, and parent (from parent Epic's `jira_key`)
5. Receives `PROJ-890` as the new issue key
6. Updates card frontmatter with `jira_card: PROJ-890`, `jira_url`, and `jira_last_synced`
7. Returns: `Linked to Jira: PROJ-890`

### Example 3: Re-link a card to a different Jira issue

**User:**
```
/link-to-jira notification-system-overhaul
```

**Command:**
1. Reads `cards/initiatives/notification-system-overhaul.md`
2. Checks frontmatter: `jira_card: PROJ-100` already exists
3. Displays: "Card is already linked to PROJ-100. Re-link? [y/N]"
4. User selects: `y`
5. Searches Jira and presents options
6. User selects a different issue: `PROJ-200`
7. Updates card frontmatter with new `jira_card: PROJ-200`, `jira_url`, and `jira_last_synced`
8. Returns: `Linked to Jira: PROJ-200`
