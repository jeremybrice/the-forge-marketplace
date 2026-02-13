# Memory Plugin

**Version:** 1.0.0
**Author:** Jeremy Brice

Organizational memory and context management with two-tier storage: hot cache (CLAUDE.md) and deep memory directory (memory/).

## Features

### Two-Tier Memory System
- **CLAUDE.md** — Hot cache (~50-80 lines) for frequently referenced context
- **memory/** — Deep memory directory for comprehensive storage

### Progressive Disclosure
- Queries start with hot cache for speed
- Expand to deep memory as needed
- Cross-reference related entries

### Shorthand Decoding
- Learn workplace acronyms, nicknames, codenames
- Build decoder ring from actual work (tasks, messages, docs)
- Resolve internal terminology automatically

### Organizational Taxonomy
- Products, modules, systems
- Clients and customer accounts
- External integrations
- Teams and tools
- Used by Product Forge Local for validation

## Commands

### `/memory:start`
Initialize the memory system and open the dashboard.

**What it does:**
- Bootstraps memory from tasks or other activity sources
- Decodes workplace shorthand interactively
- Creates CLAUDE.md and memory/ directory
- Optional comprehensive scan (chat, email, calendar, docs)

**Usage:**
```bash
/memory:start
```

**Bootstrap workflow:**
1. Analyze task list for shorthand (names, acronyms, projects)
2. Decode each term interactively with user
3. Optional: scan messages, emails, docs for additional context
4. Write CLAUDE.md hot cache and memory/ files

**Result:**
```
Memory system ready:
- CLAUDE.md: 5 people, 8 terms, 3 projects
- Deep memory: 5 people profiles, 3 project files
- Dashboard: open in browser
```

### `/memory:setup-org`
Interactive interview to configure organizational taxonomy.

**What it does:**
- Collects products, modules, clients, integrations, teams
- Writes to memory/context/ files with YAML frontmatter
- Updates CLAUDE.md with org context summary
- Re-runnable — loads existing values and asks what to update

**Usage:**
```bash
/memory:setup-org
```

**Phases:**
1. Org identity (company name, what you do, terminology)
2. Products (main product lines)
3. Modules (functional areas like Auth, Billing, Notifications)
4. Clients (key customer accounts)
5. Systems (infrastructure components for "Affected Systems")
6. Integrations (external systems like Salesforce, Stripe)
7. Teams (who owns what)

**Output:**
- `memory/context/products.md` — products, modules, systems
- `memory/context/clients.md` — client relationships
- `memory/context/integrations.md` — external systems
- `memory/context/company.md` — org identity, teams, tools
- `CLAUDE.md` updated with summary

### `/memory:remember`
Store new entries in organizational memory.

**What it does:**
- Adds people, terms, projects, preferences
- Writes to appropriate memory files
- Updates CLAUDE.md hot cache
- Handles slug generation and file organization

**Usage:**
```bash
/memory:remember
```

**Interactive flow:**
```
What would you like me to remember?
> Maya is our lead designer

Tell me about Maya:
- Full name: Maya Rodriguez
- Role: Lead Designer
- Team: Product Design
- How you work with them: Reviews all UI/UX specs

Remembered: Maya Rodriguez

Added to:
- CLAUDE.md (People section)
- memory/people/maya-rodriguez.md
```

**Entry types:**
| Type | Storage |
|------|---------|
| Person | memory/people/{slug}.md + CLAUDE.md |
| Term | memory/glossary.md + CLAUDE.md |
| Project | memory/projects/{slug}.md + CLAUDE.md |
| Preference | CLAUDE.md (Preferences section) |

### `/memory:recall`
Query organizational memory interactively.

**What it does:**
- Searches memory with progressive disclosure
- Returns results from hot cache or deep memory
- Offers to remember if not found
- Suggests related entries

**Usage:**
```bash
/memory:recall
```

**Search flow:**
```
What would you like to recall?
> Who is Todd?

Searching memory...

Todd Martinez, Engineering Manager

Role: Engineering Manager
Team: Platform
Nickname: Todd

I work with him on architecture reviews and Phoenix project planning.

Source: memory/people/todd-martinez.md
```

**Search tiers:**
1. CLAUDE.md hot cache (People, Terms, Projects, Preferences)
2. memory/glossary.md
3. memory/people/, memory/projects/ directories
4. memory/context/ files (company, products, clients, integrations)

## Memory Structure

### CLAUDE.md (Hot Cache)

The hot cache contains frequently referenced context in ~50-80 lines:

```markdown
# Memory

## Me
Jeremy Brice, Senior Product Manager on Platform Team.

## People
| Who | Role |
|-----|------|
| **Todd** | Todd Martinez, Engineering Manager |
| **Maya** | Maya Rodriguez, Lead Designer |

## Terms
| Term | Meaning |
|------|---------|
| PSR | Pipeline Status Report |
| PFR | Phoenix Feature Request |

## Projects
| Name | What |
|------|------|
| **Phoenix** | API platform rewrite |
| **Starlight** | Mobile app v2 |

## Org Context
| Category | Values |
|----------|--------|
| Products | WebApp, MobileApp, API Platform |
| Modules | Authentication, Billing, Notifications |
| Clients | Acme Corp, Globex Industries |
> Full taxonomy: memory/context/

## Preferences
- Use "customers" not "clients" in product docs
- All dates in ISO 8601 format (YYYY-MM-DD)
```

### memory/ Directory (Deep Memory)

```
memory/
  glossary.md              ← Full decoder ring
  people/
    todd-martinez.md       ← Individual profiles
    maya-rodriguez.md
  projects/
    phoenix.md             ← Project details
    starlight.md
  context/
    company.md             ← Org identity, teams, tools
    products.md            ← Products, modules, systems (YAML + prose)
    clients.md             ← Client relationships
    integrations.md        ← External systems
```

### Person File Format

```markdown
# Todd Martinez

**Role:** Engineering Manager
**Team:** Platform
**Nickname:** Todd

## Context
I work with Todd on architecture reviews, technical planning for Phoenix project, and infrastructure decisions. He's been with the company 5 years and leads the platform engineering team.

## Related Projects
- Phoenix (lead engineer)
- Infrastructure modernization

## Links
- Email: todd.martinez@company.com
- Slack: @todd
```

### Project File Format

```markdown
# Phoenix

**Status:** In Progress

## What
API platform rewrite to support 10x scale and new developer experience. Replacing legacy monolith with microservices architecture.

## People
- Todd Martinez (lead engineer)
- Maya Rodriguez (UX for developer portal)
- Jeremy Brice (product owner)

## Timeline
- Started: 2025-10
- Target launch: 2026-Q2

## Links
- Design doc: https://docs.google.com/document/d/abc123
- GitHub: https://github.com/company/phoenix
- Slack channel: #phoenix
```

### Glossary Format

```markdown
# Glossary

## PSR
Pipeline Status Report — weekly summary of deployment pipeline health sent to engineering leadership every Friday.

## PFR
Phoenix Feature Request — standardized template for new features in the Phoenix API platform.

## DRI
Directly Responsible Individual — person accountable for a project or decision. Used in project docs and standups.
```

### Taxonomy Files (memory/context/)

**products.md:**
```yaml
---
products:
  - WebApp
  - MobileApp
  - API Platform
modules:
  - Authentication
  - Billing
  - Notifications
  - Reporting
systems:
  - WebApp
  - MobileApp
  - API Gateway
  - Data Warehouse
---

# Products

## WebApp
Core SaaS platform for enterprise customers. Handles billing, user management, reporting dashboard.

## MobileApp
Field operations app for iOS and Android. Used by frontline workers for data collection and task management.

## API Platform
Developer tools and APIs for third-party integrations. Supports webhooks, REST API, GraphQL.

# Modules

## Authentication
SSO, OAuth, SAML integration. Supports enterprise identity providers.

## Billing
Subscription management, invoicing, payment processing via Stripe.

# Systems

| System | Description |
|--------|-------------|
| WebApp | Primary web application |
| MobileApp | iOS and Android apps |
| API Gateway | Kong-based API gateway |
| Data Warehouse | Snowflake analytics database |
```

## Lookup Flow

When resolving a term, the memory system follows this flow:

```
Query: "Who is Todd?"
  ↓
1. Search CLAUDE.md People table
  ↓ Found: "Todd Martinez, Engineering Manager"
  ↓
2. Check if memory/people/todd-martinez.md exists
  ↓ Exists
  ↓
3. Return both:
   - Quick ref from CLAUDE.md
   - Full profile from memory/people/todd-martinez.md

Query: "What does PSR mean?"
  ↓
1. Search CLAUDE.md Terms table
  ↓ Found: "Pipeline Status Report"
  ↓
2. Check memory/glossary.md for full definition
  ↓ Exists
  ↓
3. Return both:
   - Quick ref from CLAUDE.md
   - Full definition from glossary.md

Query: "What products do we have?"
  ↓
1. Search CLAUDE.md Org Context
  ↓ Found summary
  ↓
2. Check memory/context/products.md for full list
  ↓ Exists
  ↓
3. Return full list with descriptions
```

## Taxonomy Integration

The memory system provides organizational taxonomy used by **Product Forge Local** for validation and auto-completion:

### Product Forge Local Reads:
- `memory/context/products.md` → validates product, module, system values
- `memory/context/clients.md` → validates client values

### Workflow:
1. User runs `/memory:setup-org` to configure taxonomy
2. Product Forge Local reads taxonomy from memory/context/ files
3. When creating cards, validates against taxonomy
4. If validation fails, accepts freeform and suggests running `/memory:setup-org`

### Example:
```yaml
# In a Product Forge Local epic card
product: "WebApp"           # Validated against memory/context/products.md
client: "Acme Corp"         # Validated against memory/context/clients.md
affected_systems:           # Validated against memory/context/products.md
  - "WebApp"
  - "API Gateway"
```

## Dashboard Features

The visual dashboard (`dashboard.html`) provides:

### Memory Browser
- Navigate people, terms, projects
- Quick search with autocomplete
- View full profiles and definitions

### Org Context View
- Visual org chart (if teams configured)
- Product/module hierarchy
- Client relationships

### Recent Activity
- Recently added entries
- Recently recalled entries
- Memory growth over time

### Quick Actions
- Add new memory entry
- Search and recall
- Update taxonomy

## Installation

The Memory plugin is included in The Forge Marketplace. To use it:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jeremybrice/the-forge-marketplace.git
   cd the-forge-marketplace
   ```

2. **Initialize the plugin:**
   ```bash
   /memory:start
   ```

3. **Configure taxonomy (optional but recommended):**
   ```bash
   /memory:setup-org
   ```

4. **Open the dashboard:**
   - Open `dashboard.html` in your browser
   - Bookmark it for quick access

## Integration with Other Plugins

### Tasks Plugin
Memory decodes shorthand in task files:
```yaml
title: "Send PSR to Todd re: Phoenix blockers"
# Memory resolves: PSR, Todd, Phoenix
```

### Product Forge Local
Memory provides taxonomy for card validation:
- Products, modules, systems from `memory/context/products.md`
- Clients from `memory/context/clients.md`

### Cognitive Forge
Memory provides context for debate and exploration sessions:
- People involved in decisions
- Project background and history
- Terminology and conventions

## Tips & Best Practices

### CLAUDE.md Hot Cache
- Keep it concise (~50-80 lines)
- Only most frequently referenced items
- Update regularly as context shifts

### Deep Memory
- Use for comprehensive details
- Cross-reference between files
- Include links to external resources

### Shorthand Learning
- Bootstrap from real work (tasks, messages)
- Decode interactively with user
- Grow organically over time

### Taxonomy Maintenance
- Run `/memory:setup-org` quarterly
- Update as products/teams change
- Keep YAML frontmatter valid

### Progressive Disclosure
- Start with hot cache for speed
- Expand to deep memory as needed
- Cross-reference related entries

## Troubleshooting

### Memory not found
Run `/memory:start` to initialize. If already initialized, check that CLAUDE.md and memory/ directory exist and are readable.

### Taxonomy validation failing
Run `/memory:setup-org` to configure products, modules, clients. Ensure memory/context/ files have valid YAML frontmatter.

### Shorthand not resolving
Add missing terms with `/memory:remember`. Check CLAUDE.md and memory/glossary.md for existing entries.

### Dashboard not loading
Ensure dashboard.html exists in working directory. If missing, run `/memory:start` to copy it from plugin.

## License

MIT License - see repository root for details.
