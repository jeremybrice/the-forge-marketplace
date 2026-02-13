---
description: Query organizational memory interactively
---

# Recall Command

Search organizational memory to recall people, terms, projects, or other context.

## Instructions

### 1. Check Memory System

Check if `CLAUDE.md` and `memory/` directory exist. If not, suggest running `/memory:start` first.

### 2. Ask What to Recall

```
What would you like to recall?

Examples:
- "Who is Todd?"
- "What does PSR mean?"
- "Tell me about the Phoenix project"
- "What are our naming conventions?"
```

### 3. Progressive Disclosure Search

Use a multi-tier search strategy, starting with the hot cache and expanding as needed:

#### Tier 1: CLAUDE.md Hot Cache
1. Read CLAUDE.md
2. Search for the query term in:
   - People table (match by nickname or full name)
   - Terms table (match by acronym or keyword)
   - Projects table (match by project name or codename)
   - Preferences section (keyword match)

If found, return the result and stop. If not found, continue to Tier 2.

#### Tier 2: Glossary
1. Read `memory/glossary.md`
2. Search for the query term as a heading or in content
3. If found, return the full entry

If found, return the result and stop. If not found, continue to Tier 3.

#### Tier 3: Deep Memory Directories
1. Search `memory/people/` directory for matching person files
2. Search `memory/projects/` directory for matching project files
3. Use fuzzy matching on filenames (slugs)

Examples:
- "Todd" → search for `memory/people/todd*.md` or `memory/people/*todd*.md`
- "Phoenix" → search for `memory/projects/phoenix*.md`

If found, read and return the full file content.

#### Tier 4: Context Files
1. Search `memory/context/` directory:
   - `company.md` for teams, tools, org info
   - `products.md` for products, modules, systems
   - `clients.md` for client relationships
   - `integrations.md` for external systems

If found, return the relevant section.

### 4. Present Results

**If found in CLAUDE.md:**
```
[Term/Person/Project]: [Quick reference from table]

Source: CLAUDE.md
```

**If found in glossary:**
```
[Term]:
[Full definition from glossary]

Source: memory/glossary.md
```

**If found in deep memory:**
```
[Full content of the memory file]

Source: memory/[path]
```

**If found in context files:**
```
[Relevant section from context file]

Source: memory/context/[file]
```

### 5. Handle Not Found

If the query term isn't found in any memory source:

```
I don't have that in memory yet.

Would you like me to remember it? I can add it to the memory system.

[Proceed to /memory:remember workflow if user says yes]
```

### 6. Suggest Related Entries (Optional)

If the search found a partial match or related entries, suggest them:

```
I found these related entries:
- [Entry 1]
- [Entry 2]

Did you mean one of these, or should I keep searching?
```

## Search Strategies

### Fuzzy Matching
- Match partial words (e.g., "phoen" matches "Phoenix")
- Case-insensitive matching
- Match nicknames and full names for people
- Match acronyms and expansions for terms

### Keyword Extraction
Extract key terms from natural language queries:
- "Who is Todd?" → search for "Todd"
- "What does PSR mean?" → search for "PSR"
- "Tell me about Phoenix" → search for "Phoenix"

### Cross-References
When presenting a result, check for related entries:
- If a person file mentions a project, note it
- If a term is used in project descriptions, note it
- If a preference references a team or product, note it

## Examples

### Example 1: Person Lookup
User asks: "Who is Maya?"

1. Search CLAUDE.md People table
2. Found: `| **Maya** | Maya Rodriguez, Lead Designer |`
3. Check if `memory/people/maya.md` exists for more details
4. Present both:
   ```
   Maya Rodriguez, Lead Designer

   [Full profile from memory/people/maya.md if available]

   Sources:
   - CLAUDE.md (hot cache)
   - memory/people/maya.md (full profile)
   ```

### Example 2: Term Lookup
User asks: "What does PSR mean?"

1. Search CLAUDE.md Terms table
2. Found: `| PSR | Pipeline Status Report |`
3. Check `memory/glossary.md` for additional context
4. Present:
   ```
   PSR: Pipeline Status Report

   [Additional context from glossary if available]

   Source: CLAUDE.md
   ```

### Example 3: Project Lookup
User asks: "Tell me about Phoenix"

1. Search CLAUDE.md Projects table
2. Found: `| **Phoenix** | API platform rewrite |`
3. Read `memory/projects/phoenix.md` for full details
4. Present:
   ```
   Phoenix: API platform rewrite

   [Full project details from memory/projects/phoenix.md]

   Source: memory/projects/phoenix.md
   ```

### Example 4: Context Lookup
User asks: "What products do we have?"

1. Search CLAUDE.md for Org Context
2. If not found, check `memory/context/products.md`
3. Present:
   ```
   Products:
   - WebApp — Core SaaS platform
   - MobileApp — Field operations app
   - API Platform — Developer tools

   Source: memory/context/products.md
   ```

## Notes

- **Progressive disclosure** — start with hot cache, expand to deep memory as needed
- **Multi-source results** — if found in both CLAUDE.md and deep memory, present both
- **Suggest related** — if a query is ambiguous, offer options
- **Offer to remember** — if not found, seamlessly transition to /memory:remember
- **Cross-reference** — when presenting a result, note related entries if relevant
- Safe to run frequently — read-only operation, no side effects
