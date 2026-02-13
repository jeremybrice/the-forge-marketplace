---
description: Store new entries in organizational memory
---

# Remember Command

Add new people, terms, projects, preferences, or other context to the organizational memory system.

## Instructions

### 1. Check Memory System

Check if `CLAUDE.md` and `memory/` directory exist. If not, suggest running `/memory:start` first.

### 2. Ask What to Remember

```
What would you like me to remember?

Examples:
- A person you work with
- An acronym or term
- A project or initiative
- A preference or convention
- Anything else relevant to your work
```

### 3. Determine Type

Based on the user's response, classify the entry:

| Type | Examples | Storage Location |
|------|----------|------------------|
| Person | "Maya is our lead designer" | memory/people/maya.md + CLAUDE.md |
| Term | "PSR means Pipeline Status Report" | memory/glossary.md + CLAUDE.md |
| Project | "Phoenix is our API rewrite" | memory/projects/phoenix.md + CLAUDE.md |
| Preference | "We use 'customers' not 'clients'" | CLAUDE.md (Preferences section) |
| Other | Context not fitting above | memory/glossary.md or CLAUDE.md |

### 4. Gather Details

**For a Person:**
```
Tell me about [Name]:
- Full name (if different from what you call them)
- Role or title
- Team
- How you work with them
- Any other details (optional)
```

**For a Term:**
```
Help me understand [Term]:
- What does it stand for / mean?
- Where is it used? (meetings, docs, code, etc.)
- Any related terms?
```

**For a Project:**
```
Tell me about [Project]:
- Full name or official name (if different)
- What is it? (one-liner description)
- Current status (planning, in progress, launched, etc.)
- Key people involved
- Any important links or docs
```

**For a Preference:**
```
What's the preference or convention?
- What should I do / not do?
- Why? (context helps)
```

### 5. Write to Memory Files

**For a Person:**
1. Create `memory/people/{slug}.md`:
   ```markdown
   # [Full Name]

   **Role:** [Title]
   **Team:** [Team name]
   **Nickname:** [How they're referred to]

   ## Context
   [How user works with them, relevant details]
   ```

2. Add to CLAUDE.md People table:
   ```markdown
   | **[Nickname]** | [Full Name], [role] |
   ```

**For a Term:**
1. Add to `memory/glossary.md`:
   ```markdown
   ## [Term]
   [Expansion / definition]

   [Usage context if provided]
   ```

2. Add to CLAUDE.md Terms table:
   ```markdown
   | [Term] | [Expansion] |
   ```

**For a Project:**
1. Create `memory/projects/{slug}.md`:
   ```markdown
   # [Project Name]

   **Status:** [Planning/In Progress/Launched/etc.]

   ## What
   [One-liner description]

   ## People
   - [Key people]

   ## Links
   - [Docs, repos, etc.]
   ```

2. Add to CLAUDE.md Projects table:
   ```markdown
   | **[Project Name]** | [description] |
   ```

**For a Preference:**
Add to CLAUDE.md Preferences section:
```markdown
- [Preference statement]
```

**For Other:**
Add to appropriate section in CLAUDE.md or memory/glossary.md based on best fit.

### 6. Confirm to User

```
Remembered: [Entry]

Added to:
- CLAUDE.md ([section])
- memory/[file path] (if applicable)

Use /memory:recall to look it up later.
```

## Notes

- **Slug generation** (for filenames): lowercase, spaces to hyphens, strip non-alphanumeric except hyphens, max 50 chars
- **CLAUDE.md hot cache** should stay concise (~50-80 lines) — only most frequently referenced items
- **Deep memory** (memory/ directory) holds full details
- **Progressive disclosure** — add to CLAUDE.md only if it's used often enough
- Safe to run multiple times — updates existing entries or adds new ones
- If entry already exists, offer to update it rather than duplicate
