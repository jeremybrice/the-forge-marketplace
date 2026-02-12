---
name: pull-from-jira
description: "One-way pull from Jira to Product Forge card"
arguments:
  - name: card
    description: "Filename, title, or Jira key"
    required: true
  - name: --force
    description: "Apply changes without prompt"
    required: false
---

# Pull from Jira Command

## Overview

The `/pull-from-jira` command performs a one-way sync from Jira to a Product Forge card. It retrieves the latest data from a Jira issue and updates the local card with changes detected in Jira.

This command is destructive to local card content. It overwrites the card's title, description, and metadata with data from Jira. Use this when Jira is the source of truth.

The command always presents a diff to the user before applying changes, unless the `--force` flag is specified.

---

## Usage

### Pull changes from Jira to a card (with diff approval)

```
/pull-from-jira notification-system-overhaul
```

Fetches the linked Jira issue, compares it to the local card, and presents a diff for user approval before applying changes.

### Pull by Jira key

```
/pull-from-jira PROJ-123
```

Searches for the local card linked to `PROJ-123`, fetches the Jira issue, and presents a diff for approval.

### Force pull without prompt

```
/pull-from-jira notification-system-overhaul --force
```

Skips the diff approval step and immediately applies all detected changes from Jira to the local card.

---

## Workflow

### Step 1: Accept Reference

The user must explicitly specify the card or Jira key using one of:
- **Filename** (with or without `.md`): `notification-system-overhaul`
- **Card title**: "Notification System Overhaul"
- **Jira key**: `PROJ-123`

If the user provides ambiguous input, ask for clarification before proceeding.

### Step 2: Resolve Card and Jira Key

**If user provided filename or title:**
1. Search for the card in `cards/` subdirectories
2. Read the card file
3. Extract `jira_key` (for Epic) or `jira_card` (for Initiative/Story) from frontmatter
4. If no linking field is present:
   ```
   Card is not linked to Jira.
   Use /link-to-jira first to establish a connection.
   ```
   Exit.

**If user provided Jira key (format: `PROJ-123`):**
1. Search all cards in `cards/` subdirectories for matching `jira_key` or `jira_card` field
2. If multiple matches found (unlikely but possible):
   ```
   Multiple cards linked to {jira_key}:
   [1] cards/epics/email-notification-engine.md
   [2] cards/stories/story-001-notification-template-builder.md

   Select card to update: [1/2/c]
   ```
3. If no matches found:
   ```
   No local card found linked to {jira_key}.
   Use /link-to-jira to create a link first.
   ```
   Exit.

### Step 3: Fetch Jira Issue

Call the MCP tool:
```
jira_get_issue(issue_key: <jira_key or jira_card>)
```

Extract the following fields from the response:
- `summary` (maps to card `title`)
- `description` (maps to card body content)
- `status.name` (maps to `jira_status` frontmatter field)
- `timeestimate` (maps to `estimate_hours` frontmatter field, converted from seconds)
- `updated` (Jira last updated timestamp, for reference)

Reference the `jira-sync` skill for MCP tool usage and field mapping.

### Step 4: Compare Jira Data to Local Card

Perform a semantic comparison to detect changes:

**Title changes:**
- Compare Jira `summary` to local frontmatter `title`

**Description changes:**
- Compare Jira `description` to local card body content (everything below frontmatter)
- Use line-by-line diff to identify added, removed, or modified sections

**Jira status changes:**
- Compare Jira `status.name` to local frontmatter `jira_status`
- Store Jira status in a separate `jira_status` field (do NOT map to local `status` field)

**Estimate changes:**
- Compare Jira `timeestimate` (in seconds) to local frontmatter `estimate_hours`
- Convert seconds to hours: `estimate_hours = timeestimate / 3600`
- Round to 1 decimal place

**No changes detected:**
If no changes are detected in any of the above fields:
```
No changes detected in Jira issue {jira_key}.
Local card is already up to date.
```
Exit without modifying the card.

### Step 5: Present Diff to User (unless --force)

If the `--force` flag is NOT present, display a detailed diff of detected changes:

```
Changes detected in Jira issue {jira_key}:

Title:
- Local:  "Build notification system"
+ Jira:   "Build notification preferences UI"

Description:
[Show line-by-line diff of changed sections, abbreviated if very long]

Jira Status:
- Local:  To Do
+ Jira:   In Progress
(Stored in jira_status field; local status field unchanged)

Estimate:
- Local:  null
+ Jira:   40 hours
(Stored in estimate_hours field)

Last updated in Jira: 2026-02-10T16:45:00Z

Apply these changes to local card? [y/N]
```

**Diff format notes:**
- Use `-` prefix for local values being replaced
- Use `+` prefix for Jira values being applied
- For description changes, show a concise summary or line diff
- If description is very long (>50 lines), show first 20 lines with "... (truncated)" message

If the user declines, exit. If the user accepts or `--force` is present, proceed.

### Step 6: Apply Changes to Local Card

Update the card file with the changes from Jira:

**Update frontmatter fields:**
```yaml
title: <Jira summary>
jira_status: <Jira status.name>
estimate_hours: <Jira timeestimate / 3600, rounded to 1 decimal>
jira_last_synced: <current timestamp in ISO 8601 format>
updated: <today's date in YYYY-MM-DD format>
```

**Update body content:**
- Replace the entire card body (everything below frontmatter) with Jira `description`

**Preserve unchanged fields:**
- `type`, `status`, `product`, `module`, `client`, `team`, `parent`, `children`, `created`, and all other frontmatter fields remain untouched
- Only update the fields listed above

Write the complete updated card back to its original file path.

### Step 7: Confirm to User

Display a success message:
```
Card updated from Jira: {jira_key}
Jira URL: {jira_url}
Local card: cards/{type}s/{filename}.md

Updated fields:
- title
- description
- jira_status
- estimate_hours
- jira_last_synced
```

Customize the "Updated fields" list to show only the fields that actually changed.

---

## Error Handling

**Card not found:**
```
Could not find card matching "{user input}".
Please specify the filename, title, or Jira key.
```

**Card not linked to Jira:**
```
Card is not linked to Jira.
Use /link-to-jira first to establish a connection.
```

**Jira fetch fails:**
```
Failed to fetch Jira issue {jira_key}: {error message}
Please check that the issue exists and you have view permissions.
```

**Jira key not found in local cards:**
```
No local card found linked to {jira_key}.
Use /link-to-jira to create a link first, or create a new card.
```

---

## Field Mapping Details

The following Jira fields are pulled and mapped to local card fields:

| Jira Field       | Local Card Field      | Notes                                                    |
|------------------|-----------------------|----------------------------------------------------------|
| `summary`        | `title` (frontmatter) | Overwrites local title                                   |
| `description`    | Card body content     | Overwrites entire body below frontmatter                 |
| `status.name`    | `jira_status`         | Stored separately; does NOT overwrite local `status`     |
| `timeestimate`   | `estimate_hours`      | Converted from seconds to hours (÷ 3600), rounded to 1dp |
| `updated`        | (reference only)      | Displayed in diff; not stored in card                    |

**Important notes:**
- **Jira status does NOT overwrite local status.** Local `status` follows Product Forge enums (e.g., Draft, Planning, In Progress). Jira `status.name` is stored in a separate `jira_status` field for reference.
- **Estimate is stored in hours.** Jira uses seconds (`timeestimate`). The command converts to hours for readability.
- **Parent and children are NOT updated.** Jira parent/subtask relationships are out of scope for this command.

Reference the `jira-sync` skill for complete field mapping details.

---

## Notes

- This command is destructive to local card content. It overwrites the card's title, description, and metadata with Jira data.
- Jira is the source of truth. Local content is replaced, not merged.
- The `jira-sync` skill provides the MCP tool interface and field mapping logic.
- The `jira_last_synced` timestamp uses ISO 8601 format with timezone (e.g., `2026-02-12T14:30:00Z`).
- Epic cards use `jira_key` for backward compatibility. Initiative and Story cards use `jira_card`.
- Always present a diff for user approval unless `--force` is specified.
- If no changes are detected, exit without modifying the card.
- Jira status is stored in `jira_status`, NOT in the local `status` field. This preserves the Product Forge status workflow.

---

## Examples

### Example 1: Pull changes from Jira to an Epic

**User:**
```
/pull-from-jira email-notification-engine
```

**Command:**
1. Reads `cards/epics/email-notification-engine.md`
2. Extracts `jira_key: PROJ-200` from frontmatter
3. Calls `jira_get_issue(PROJ-200)`
4. Compares Jira data to local card:
   - Title: "Email Notification Engine" → "Email Notification Preferences UI" (changed)
   - Description: 15 lines modified
   - Jira Status: "To Do" → "In Progress" (changed)
   - Estimate: null → 40 hours (changed)
5. Presents diff to user:
   ```
   Changes detected in Jira issue PROJ-200:

   Title:
   - Local:  "Email Notification Engine"
   + Jira:   "Email Notification Preferences UI"

   Description:
   [Shows diff of changed sections]

   Jira Status:
   - Local:  To Do
   + Jira:   In Progress

   Estimate:
   - Local:  null
   + Jira:   40 hours

   Apply these changes to local card? [y/N]
   ```
6. User confirms: `y`
7. Updates card frontmatter and body with Jira data
8. Returns: `Card updated from Jira: PROJ-200`

### Example 2: Pull by Jira key

**User:**
```
/pull-from-jira PROJ-200
```

**Command:**
1. Searches `cards/` for card with `jira_key: PROJ-200` or `jira_card: PROJ-200`
2. Finds `cards/epics/email-notification-engine.md`
3. Calls `jira_get_issue(PROJ-200)`
4. (Same workflow as Example 1)

### Example 3: No changes detected

**User:**
```
/pull-from-jira email-notification-engine
```

**Command:**
1. Reads `cards/epics/email-notification-engine.md`
2. Extracts `jira_key: PROJ-200` from frontmatter
3. Calls `jira_get_issue(PROJ-200)`
4. Compares Jira data to local card: no differences found
5. Returns: `No changes detected in Jira issue PROJ-200. Local card is already up to date.`

### Example 4: Force pull without confirmation

**User:**
```
/pull-from-jira email-notification-engine --force
```

**Command:**
1. Reads `cards/epics/email-notification-engine.md`
2. Extracts `jira_key: PROJ-200` from frontmatter
3. Calls `jira_get_issue(PROJ-200)`
4. Compares Jira data to local card: changes detected
5. Skips diff approval (due to `--force` flag)
6. Immediately updates card frontmatter and body with Jira data
7. Returns: `Card updated from Jira: PROJ-200`

### Example 5: Card not linked to Jira

**User:**
```
/pull-from-jira new-unlinked-epic
```

**Command:**
1. Reads `cards/epics/new-unlinked-epic.md`
2. Checks frontmatter: no `jira_key` field present
3. Returns: `Card is not linked to Jira. Use /link-to-jira first to establish a connection.`
