---
name: jira-sync
description: "Bidirectional sync between Product Forge cards and Jira using Atlassian MCP server. Handles field mapping, conflict resolution, relationship maintenance, and MCP tool interactions."
user_invocable: false
---

# Jira Sync Skill

This skill provides comprehensive logic for bidirectional synchronization between Product Forge Local cards and Atlassian Jira issues via the Atlassian MCP server.

## 1. MCP Tool Interface

### Required Tools

The following MCP tools must be available from the Atlassian MCP server:

#### `jira_create_issue`
Creates a new Jira issue.

**Parameters:**
```javascript
{
  project: "PROJ",              // Project key (required)
  issuetype: "Story",           // Issue type name (required)
  summary: "Issue title",       // Title/summary (required, max 255 chars)
  description: "Body text...",  // Description (optional)
  labels: ["label1", "label2"], // Array of labels (optional)
  parent: "PROJ-123",          // Parent issue key (optional, for Epic/Story)
  customfields: {}             // Custom field values (optional)
}
```

**Returns:** `{ key: "PROJ-123", self: "https://..." }`

#### `jira_update_issue`
Updates an existing Jira issue.

**Parameters:**
```javascript
{
  issueKey: "PROJ-123",        // Issue key (required)
  fields: {                    // Fields to update (required)
    summary: "New title",
    description: "New body..."
  }
}
```

**Returns:** Success confirmation or error

#### `jira_get_issue`
Retrieves a single Jira issue by key.

**Parameters:**
```javascript
{
  issueKey: "PROJ-123",        // Issue key (required)
  expand: "changelog"          // Additional data to expand (optional)
}
```

**Returns:** Full issue object with fields, status, timestamps, etc.

#### `jira_search_issues`
Searches for issues using JQL.

**Parameters:**
```javascript
{
  jql: "project = PROJ AND type = Story", // JQL query string (required)
  maxResults: 50                          // Result limit (optional, default 50)
}
```

**Returns:** Array of issue objects

#### `jira_link_issues` (Optional)
Creates a link between two issues.

**Parameters:**
```javascript
{
  sourceKey: "PROJ-123",       // Source issue key (required)
  linkType: "Parent",          // Link type name (required)
  targetKey: "PROJ-456"        // Target issue key (required)
}
```

**Returns:** Success confirmation or error

**Note:** Many MCP implementations use the `parent` field during issue creation instead of requiring explicit linking.

#### `jira_transition_issue` (Optional)
Moves an issue through workflow states.

**Parameters:**
```javascript
{
  issueKey: "PROJ-123",        // Issue key (required)
  transitionId: "21"           // Transition ID (required, not status name)
}
```

**Returns:** Success confirmation or error

**Note:** Transition IDs are workflow-specific. Use `jira_get_transitions(issueKey)` if available to discover valid transitions.

### Error Handling

Always wrap MCP tool calls with error handling:

```javascript
try {
  const result = await mcp.jira_create_issue(params);
  return result;
} catch (error) {
  if (error.message.includes("not found")) {
    // MCP server unavailable or tool not registered
    return { error: "MCP_UNAVAILABLE", message: "Atlassian MCP server is not available" };
  } else if (error.message.includes("authentication") || error.message.includes("401")) {
    // Authentication failure
    return { error: "AUTH_FAILED", message: "Jira authentication failed. Check credentials." };
  } else if (error.message.includes("permission") || error.message.includes("403")) {
    // Permission denied
    return { error: "PERMISSION_DENIED", message: "Insufficient permissions for this operation" };
  } else if (error.message.includes("not found") && error.issueKey) {
    // Issue not found
    return { error: "ISSUE_NOT_FOUND", message: `Issue ${error.issueKey} not found in Jira` };
  } else {
    // Unknown error
    return { error: "UNKNOWN", message: error.message };
  }
}
```

### Tool Name Variations

Different MCP server implementations may use different tool names. Check for these variations:

- `jira_create_issue` vs `createJiraIssue` vs `create_issue`
- `jira_update_issue` vs `updateJiraIssue` vs `update_issue`
- `jira_get_issue` vs `getJiraIssue` vs `get_issue`
- `jira_search_issues` vs `searchJiraIssues` vs `search_issues`

If the expected tool name is not found, attempt common variations before reporting an error.

## 2. Field Mapping Tables

### Product Forge → Jira (Push Operations)

| Forge Field | Jira Field | Notes | Direction |
|-------------|------------|-------|-----------|
| `title` | `summary` | Max 255 chars in Jira, truncate if needed | BIDIRECTIONAL |
| Body content | `description` | Render markdown as Jira wiki markup or plain text | BIDIRECTIONAL |
| `type` | `issuetype` | Initiative → Initiative, Epic → Epic, Story → Story | Creation only |
| `parent` | `parent` link | Resolve parent card's `jira_key` or `jira_card` field | Creation only |

**Title Truncation:**
```javascript
function truncateSummary(title) {
  if (title.length <= 255) return title;
  return title.substring(0, 252) + "...";
}
```

**Description Conversion:**
```javascript
function convertMarkdownToJira(markdown) {
  // Simple conversion: Jira wiki markup basics
  // Or use plain text if wiki markup is complex
  let text = markdown;

  // Convert headers
  text = text.replace(/^### (.*$)/gim, 'h3. $1');
  text = text.replace(/^## (.*$)/gim, 'h2. $1');
  text = text.replace(/^# (.*$)/gim, 'h1. $1');

  // Convert bold/italic
  text = text.replace(/\*\*(.*?)\*\*/g, '*$1*');
  text = text.replace(/\*(.*?)\*/g, '_$1_');

  // Convert lists (basic)
  text = text.replace(/^\* /gm, '* ');
  text = text.replace(/^- /gm, '* ');

  return text;
}
```

**For simplicity, you may choose to sync descriptions as plain text (strip markdown) to avoid formatting issues.**

### Jira → Product Forge (Pull Operations)

| Jira Field | Forge Field | Notes | Direction |
|------------|-------------|-------|-----------|
| `summary` | `title` | Direct mapping | BIDIRECTIONAL |
| `description` | Body content | Convert from Jira wiki markup to markdown (or plain text) | BIDIRECTIONAL |
| `key` | `jira_key` or `jira_card` | Store for bidirectional reference | Read-only |
| `self` URL | `jira_url` | Store full URL for easy access | Read-only |
| `status.name` | `jira_status` | Read-only, for reference only, never pushed back to Jira | Read-only |
| `timeestimate` | `estimate_hours` | Convert seconds to hours (÷ 3600) | Read-only |
| `updated` timestamp | Last sync timestamp | Used for conflict detection | Read-only |

**Description Conversion (Jira → Markdown):**
```javascript
function convertJiraToMarkdown(jiraWikiText) {
  // Simple conversion: Jira wiki markup to markdown
  // Or use plain text if conversion is complex
  let text = jiraWikiText || "";

  // Convert headers
  text = text.replace(/^h1\. (.*$)/gim, '# $1');
  text = text.replace(/^h2\. (.*$)/gim, '## $1');
  text = text.replace(/^h3\. (.*$)/gim, '### $1');

  // Convert bold/italic
  text = text.replace(/\*(.*?)\*/g, '**$1**');
  text = text.replace(/_(.*?)_/g, '*$1*');

  return text;
}
```

**Estimate Conversion:**
```javascript
function convertTimeEstimate(seconds) {
  if (!seconds) return null;
  return Math.round(seconds / 3600 * 10) / 10; // Round to 1 decimal
}
```

### Fields Not Synced

These fields are **local only** and never pushed to or pulled from Jira:

- `status` (local workflow state, independent of Jira status)
- `product` (local taxonomy)
- `module` (local taxonomy)
- `client` (local taxonomy)
- `team` (local taxonomy)
- `story_points` (deprecated, not used)
- `confidence` (Initiative-specific, local only)

These Jira fields are **not imported**:

- Labels (Jira labels not synced)
- Custom fields (not imported unless explicitly mapped)
- Comments (not synced)
- Attachments (not synced)
- Workflow transitions (Jira status is read-only reference)

## 3. Sync Operations

### Core Functions

#### `createInJira(card)`

Creates a new Jira issue from a Product Forge card.

**Input:** Product Forge card object (with frontmatter and body)

**Output:** Jira issue key and URL

**Algorithm:**

1. **Validate card has required fields:**
   - `type` must be Initiative, Epic, or Story
   - `title` must be present
   - Card must NOT already have `jira_key` or `jira_card`

2. **Map Forge type to Jira issue type:**
   ```javascript
   const issueTypeMap = {
     "Initiative": "Initiative",
     "Epic": "Epic",
     "Story": "Story"
   };
   const issueType = issueTypeMap[card.type];
   ```

3. **Resolve parent relationship (if present):**
   ```javascript
   let parentKey = null;
   if (card.parent) {
     // Read parent card file
     const parentCard = await readCard(card.parent);
     parentKey = parentCard.jira_key || parentCard.jira_card || null;

     if (!parentKey) {
       return { error: "PARENT_NOT_SYNCED", message: "Parent card must be synced to Jira first" };
     }
   }
   ```

4. **Prepare MCP parameters:**
   ```javascript
   const params = {
     project: getProjectKey(), // From config or inferred
     issuetype: issueType,
     summary: truncateSummary(card.title),
     description: convertMarkdownToJira(card.body || ""),
     parent: parentKey || undefined
   };
   ```

5. **Call MCP to create issue:**
   ```javascript
   try {
     const result = await mcp.jira_create_issue(params);
     return {
       jira_key: result.key,
       jira_url: result.self
     };
   } catch (error) {
     return handleMCPError(error);
   }
   ```

6. **Update card with Jira keys:**
   ```javascript
   card.jira_key = result.key;
   card.jira_url = result.self;
   card.last_synced = new Date().toISOString();
   await writeCard(card);
   ```

#### `updateInJira(card, jiraKey)`

Updates an existing Jira issue from a Product Forge card.

**Input:** Product Forge card object and Jira issue key

**Output:** Success confirmation

**Algorithm:**

1. **Validate card and Jira key:**
   ```javascript
   if (!jiraKey) {
     return { error: "MISSING_KEY", message: "Card does not have a Jira key" };
   }
   ```

2. **Prepare update payload (only changed fields):**
   ```javascript
   const fields = {
     summary: truncateSummary(card.title),
     description: convertMarkdownToJira(card.body || "")
   };
   ```

3. **Call MCP to update issue:**
   ```javascript
   try {
     await mcp.jira_update_issue({
       issueKey: jiraKey,
       fields: fields
     });
     return { success: true };
   } catch (error) {
     return handleMCPError(error);
   }
   ```

4. **Update sync timestamp:**
   ```javascript
   card.last_synced = new Date().toISOString();
   await writeCard(card);
   ```

#### `pullFromJira(jiraKey)`

Retrieves a Jira issue and maps it to Product Forge format.

**Input:** Jira issue key

**Output:** Transformed card data (partial)

**Algorithm:**

1. **Call MCP to retrieve issue:**
   ```javascript
   try {
     const issue = await mcp.jira_get_issue({
       issueKey: jiraKey,
       expand: "changelog"
     });
   } catch (error) {
     return handleMCPError(error);
   }
   ```

2. **Map Jira fields to Forge format:**
   ```javascript
   const transformed = {
     title: issue.fields.summary,
     body: convertJiraToMarkdown(issue.fields.description),
     jira_key: issue.key,
     jira_url: issue.self,
     jira_status: issue.fields.status.name,
     estimate_hours: convertTimeEstimate(issue.fields.timeestimate),
     jira_updated: issue.fields.updated
   };
   ```

3. **Return transformed data:**
   ```javascript
   return transformed;
   ```

#### `detectChanges(localCard, jiraIssue, lastSyncTime)`

Compares local and Jira timestamps to identify which system changed.

**Input:** Local card object, Jira issue object, last sync timestamp

**Output:** `{ localChanged: boolean, jiraChanged: boolean, conflict: boolean }`

**Algorithm:**

1. **Parse timestamps:**
   ```javascript
   const localUpdated = new Date(localCard.updated);
   const jiraUpdated = new Date(jiraIssue.fields.updated);
   const lastSync = new Date(lastSyncTime || 0);
   ```

2. **Detect changes:**
   ```javascript
   const localChanged = localUpdated > lastSync;
   const jiraChanged = jiraUpdated > lastSync;
   ```

3. **Check for content conflicts:**
   ```javascript
   let conflict = false;

   if (localChanged && jiraChanged) {
     // Check if title or description differ
     const titleDiffers = localCard.title !== jiraIssue.fields.summary;
     const bodyDiffers = localCard.body !== convertJiraToMarkdown(jiraIssue.fields.description);

     conflict = titleDiffers || bodyDiffers;
   }
   ```

4. **Return detection result:**
   ```javascript
   return {
     localChanged,
     jiraChanged,
     conflict
   };
   ```

#### `presentConflictDiff(localChanges, jiraChanges)`

Formats a side-by-side comparison of conflicting changes for user review.

**Input:** Local card changes, Jira issue changes

**Output:** Formatted diff string for display

**Algorithm:**

```javascript
function presentConflictDiff(localCard, jiraIssue) {
  let diff = "## Sync Conflict Detected\n\n";
  diff += "Both the local card and Jira issue have been modified since the last sync.\n\n";

  // Title comparison
  if (localCard.title !== jiraIssue.fields.summary) {
    diff += "### Title\n\n";
    diff += "**Local (Forge):**\n";
    diff += `${localCard.title}\n\n`;
    diff += "**Remote (Jira):**\n";
    diff += `${jiraIssue.fields.summary}\n\n`;
  }

  // Description comparison
  const jiraBody = convertJiraToMarkdown(jiraIssue.fields.description);
  if (localCard.body !== jiraBody) {
    diff += "### Description\n\n";
    diff += "**Local (Forge):**\n";
    diff += "```\n" + (localCard.body || "(empty)") + "\n```\n\n";
    diff += "**Remote (Jira):**\n";
    diff += "```\n" + (jiraBody || "(empty)") + "\n```\n\n";
  }

  // Status reference (no conflict, just information)
  diff += "### Status\n\n";
  diff += `**Local status:** ${localCard.status}\n`;
  diff += `**Jira status:** ${jiraIssue.fields.status.name}\n\n`;
  diff += "*Note: Local and Jira statuses are independent and do not conflict.*\n\n";

  // Resolution options
  diff += "### Resolution Options\n\n";
  diff += "1. **Keep Forge** - Overwrite Jira with local changes\n";
  diff += "2. **Accept Jira** - Overwrite local card with Jira changes\n";
  diff += "3. **Manual Merge** - Resolve conflicts manually then sync\n\n";

  return diff;
}
```

## 4. Validation Functions

### `validateJiraKey(key)`

Validates a Jira issue key format.

**Pattern:** `PROJECT-123` (uppercase letters, hyphen, numbers)

```javascript
function validateJiraKey(key) {
  if (!key || typeof key !== "string") return false;
  const pattern = /^[A-Z][A-Z0-9]+-\d+$/;
  return pattern.test(key);
}
```

### `validateIssueType(type)`

Ensures the issue type matches between systems.

**Valid types:** Initiative, Epic, Story

```javascript
function validateIssueType(type) {
  const validTypes = ["Initiative", "Epic", "Story"];
  return validTypes.includes(type);
}
```

### `validateWorkflowTransition(fromStatus, toStatus)`

Checks if a workflow transition is valid in Jira.

**Note:** This requires querying Jira for available transitions, which is workflow-specific.

```javascript
async function validateWorkflowTransition(issueKey, targetStatus) {
  try {
    // Retrieve available transitions for the issue
    const transitions = await mcp.jira_get_transitions({ issueKey });

    // Check if target status is available
    const validTransition = transitions.find(t => t.to.name === targetStatus);

    if (!validTransition) {
      return { valid: false, message: `Cannot transition to ${targetStatus}` };
    }

    return { valid: true, transitionId: validTransition.id };
  } catch (error) {
    return { valid: false, message: error.message };
  }
}
```

## 5. Conflict Resolution Strategy

### Simplified Conflict Model

Conflicts occur **only when both title OR description change in both systems since last sync**.

- **Local `status` and Jira status are independent** (no conflict)
- **Jira status always syncs to `jira_status`** (read-only reference field)
- **Resolution options:**
  1. **Keep Forge** - Push local changes to Jira, overwrite remote
  2. **Accept Jira** - Pull Jira changes to local, overwrite local
  3. **Manual Merge** - User resolves conflicts manually, then chooses direction

### Resolution Algorithm

```javascript
async function resolveConflict(localCard, jiraKey, resolution) {
  if (resolution === "keep_forge") {
    // Push local to Jira
    await updateInJira(localCard, jiraKey);

    // Pull Jira status for reference
    const jiraIssue = await pullFromJira(jiraKey);
    localCard.jira_status = jiraIssue.jira_status;
    localCard.last_synced = new Date().toISOString();
    await writeCard(localCard);

    return { success: true, message: "Local changes pushed to Jira" };

  } else if (resolution === "accept_jira") {
    // Pull Jira to local
    const jiraIssue = await pullFromJira(jiraKey);

    // Update local card (preserve local-only fields)
    localCard.title = jiraIssue.title;
    localCard.body = jiraIssue.body;
    localCard.jira_status = jiraIssue.jira_status;
    localCard.estimate_hours = jiraIssue.estimate_hours;
    localCard.updated = new Date().toISOString().split('T')[0];
    localCard.last_synced = new Date().toISOString();
    await writeCard(localCard);

    return { success: true, message: "Jira changes pulled to local card" };

  } else if (resolution === "manual") {
    return { success: false, message: "Manual resolution required. Edit the card, then sync again." };

  } else {
    return { success: false, message: "Invalid resolution option" };
  }
}
```

### Status Independence

**Key principle:** Local `status` and Jira status are independent workflows.

- Local `status` tracks Forge-specific workflow (Draft, Ready, In Progress, Done)
- Jira status tracks Jira-specific workflow (To Do, In Progress, Done, etc.)
- `jira_status` field in Forge cards is a **read-only reference** to Jira's current status
- Local status changes **never push to Jira**
- Jira status changes **never overwrite local status**
- Both statuses can differ without causing a conflict

## 6. Error Handling Patterns

### MCP Server Unavailable

**Error signature:** Tool not found, connection refused, timeout

**Handling:**
```javascript
if (error.message.includes("not found") || error.code === "ECONNREFUSED") {
  return {
    error: "MCP_UNAVAILABLE",
    message: "Atlassian MCP server is not available. Check that the server is running and configured.",
    recovery: "Run the MCP server and try again."
  };
}
```

### Authentication Failure

**Error signature:** 401 Unauthorized, authentication error

**Handling:**
```javascript
if (error.message.includes("authentication") || error.statusCode === 401) {
  return {
    error: "AUTH_FAILED",
    message: "Jira authentication failed. Check your credentials in the MCP server config.",
    recovery: "Verify your Jira API token and email in the MCP server configuration."
  };
}
```

### Issue Not Found

**Error signature:** 404 Not Found, issue does not exist

**Handling:**
```javascript
if (error.statusCode === 404 && error.issueKey) {
  return {
    error: "ISSUE_NOT_FOUND",
    message: `Issue ${error.issueKey} not found in Jira. It may have been deleted.`,
    recovery: "Remove the jira_key from the card or create a new issue in Jira."
  };
}
```

### Permission Denied

**Error signature:** 403 Forbidden, insufficient permissions

**Handling:**
```javascript
if (error.statusCode === 403) {
  return {
    error: "PERMISSION_DENIED",
    message: "Insufficient permissions for this operation in Jira.",
    recovery: "Check your Jira permissions for creating/updating issues in this project."
  };
}
```

### Invalid Workflow Transition

**Error signature:** 400 Bad Request, invalid transition

**Handling:**
```javascript
if (error.message.includes("transition") || error.message.includes("workflow")) {
  return {
    error: "INVALID_TRANSITION",
    message: "Cannot move issue to this status. The transition is not valid in the Jira workflow.",
    recovery: "Check the Jira workflow for valid transitions from the current status."
  };
}
```

### Partial Batch Failure

**Scenario:** Multiple cards syncing, some succeed, some fail

**Handling:**
```javascript
async function batchSync(cards) {
  const results = [];

  for (const card of cards) {
    try {
      const result = await syncCard(card);
      results.push({ card: card.title, success: true, result });
    } catch (error) {
      results.push({ card: card.title, success: false, error: error.message });
    }
  }

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    total: cards.length,
    succeeded,
    failed,
    results
  };
}
```

## Usage Example

```javascript
// Import the skill
const jiraSync = require('./jira-sync');

// Create a new issue in Jira from a local card
const card = await readCard('cards/stories/story-001-user-authentication.md');
const result = await jiraSync.createInJira(card);

if (result.error) {
  console.error(`Sync failed: ${result.message}`);
} else {
  console.log(`Created Jira issue: ${result.jira_key}`);
  console.log(`URL: ${result.jira_url}`);
}

// Pull updates from Jira
const jiraKey = card.jira_key;
const jiraData = await jiraSync.pullFromJira(jiraKey);

// Detect conflicts
const changes = await jiraSync.detectChanges(card, jiraData, card.last_synced);

if (changes.conflict) {
  const diff = jiraSync.presentConflictDiff(card, jiraData);
  console.log(diff);

  // Resolve conflict
  const resolution = await promptUser("Choose resolution: keep_forge, accept_jira, manual");
  await jiraSync.resolveConflict(card, jiraKey, resolution);
}
```

## Reference Implementation Notes

Commands that use this skill should:

1. **Always check for MCP server availability** before attempting sync operations
2. **Present clear error messages** with recovery instructions when operations fail
3. **Show diffs before overwriting** any existing card or issue
4. **Validate parent relationships** before creating child issues
5. **Handle partial failures gracefully** in batch operations
6. **Store sync timestamps** in card frontmatter for conflict detection
7. **Use consistent field naming** (`jira_key`, `jira_url`, `jira_status`, `last_synced`)

## Configuration Requirements

The following configuration is required (stored in `product-forge-local/config.json` or similar):

```json
{
  "jira": {
    "project_key": "PROJ",
    "mcp_server": "atlassian-mcp",
    "issue_types": {
      "Initiative": "Initiative",
      "Epic": "Epic",
      "Story": "Story"
    }
  }
}
```

Commands should read this configuration to determine the target Jira project and issue type mappings.
