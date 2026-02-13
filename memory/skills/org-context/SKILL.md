---
name: org-context
description: "Defines how organizational taxonomy (products, modules, clients, integrations, teams) is stored in the productivity memory system. Provides the Config Resolution Protocol used by product management plugins to read validated enum lists from memory/context/ files."
---

# Org Context

Organizational taxonomy — products, modules, clients, integrations, and teams — stored in the productivity memory system so commands can validate values and Claude can resolve shorthand like "the mobile app" or "Acme" to their canonical names.

## The Goal

Give every command access to your org's vocabulary:

```
User: "write a story for the billing module in WebApp"
              ↓ Claude resolves
Product: WebApp (Core SaaS platform)
Module: Billing (Payment processing and invoicing)
```

Without org context, Claude guesses. With it, Claude validates against your actual taxonomy and fills in rich descriptions automatically.

## Storage

Org context lives in the existing `memory/context/` directory, alongside `company.md`:

```
memory/context/
  company.md        ← Teams, tools, processes (already exists)
  products.md       ← Products, modules, systems
  clients.md        ← Key client relationships
  integrations.md   ← External systems and protocols
```

**CLAUDE.md hot cache** includes a summary of top items from each category for quick reference.

| Data | Memory File | CLAUDE.md Hot Cache |
|------|-------------|---------------------|
| Products & modules | memory/context/products.md | Products table in CLAUDE.md |
| Clients | memory/context/clients.md | Clients table in CLAUDE.md |
| Integrations | memory/context/integrations.md | Key integrations in CLAUDE.md |
| Teams | memory/context/company.md (teams section) | Already handled |
| Org identity | memory/context/company.md (extends existing) | Already handled |

## File Format

Each context file uses **YAML frontmatter for machine-readable enum lists** and **markdown body for rich descriptions**. The frontmatter is the source of truth for validation; the body provides context for shorthand resolution.

**memory/context/products.md:**
```markdown
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
Core SaaS platform. Web-based management system for enterprise customers.

## MobileApp
Mobile application for field operations. iOS and Android.

## API Platform
REST and GraphQL APIs consumed by partners and internal services.

# Modules

## Authentication
Login, SSO, MFA, session management. Shared across all products.

## Billing
Payment processing, invoicing, subscription management. WebApp only.

## Notifications
Email, push, in-app alerts. Shared across WebApp and MobileApp.

## Reporting
Dashboards, scheduled reports, data export. WebApp and API Platform.

# Systems

Standard names for "Affected Systems" references in cards and documentation.

| System | Description |
|--------|-------------|
| WebApp | Core web platform |
| MobileApp | Mobile applications |
| API Gateway | External-facing API layer |
| Data Warehouse | Analytics and reporting backend |
```

**memory/context/clients.md:**
```markdown
---
clients:
  - Acme Corp
  - Globex Industries
  - Initech
---

# Clients

## Acme Corp
Enterprise tier. 500+ users. Primary contact: Dana Wilson.
Key driver: compliance and audit reporting.

## Globex Industries
Mid-market. 120 users. Primary contact: Sam Torres.
Key driver: mobile field operations.

## Initech
Enterprise tier. 800+ users. Primary contact: Mike Bolton.
Key driver: API integrations with their ERP.
```

**memory/context/integrations.md:**
```markdown
---
integrations:
  - Salesforce
  - SAP
  - Stripe
  - Twilio
---

# Integrations

## Salesforce
CRM sync. Bi-directional contact and deal data. REST API.

## SAP
ERP integration for enterprise clients. File-based batch import.

## Stripe
Payment processing. Webhooks for subscription events.

## Twilio
SMS notifications. Used by the Notifications module.
```

## Lookup Flow

Org context integrates with the existing tiered lookup (see memory-management skill):

```
User: "write a story for billing in the mobile app"

1. CLAUDE.md (hot cache)
   → "billing" → Billing module ✓
   → "mobile app" → MobileApp ✓

2. memory/context/products.md
   → Confirm Billing is a valid module
   → Confirm MobileApp is a valid product
   → Pull rich descriptions for the card

3. If not found → accept freeform, suggest setup
   → "I don't see 'mobile app' in your taxonomy.
      Run /productivity:setup-org to configure."
```

## Config Resolution Protocol

### Reading Taxonomy Values

When a command or schema needs product, module, client, or system values:
1. Read the corresponding file from `memory/context/`
2. Parse the YAML frontmatter for the enum list
3. Use those values for validation and card generation

### Config Files

| Need | Memory File | Frontmatter Key |
|------|-------------|-----------------|
| Products | memory/context/products.md | `products` |
| Modules | memory/context/products.md | `modules` |
| Systems | memory/context/products.md | `systems` |
| Clients | memory/context/clients.md | `clients` |
| Integrations | memory/context/integrations.md | `integrations` |

### Missing Config

If `memory/context/` files don't exist:
1. Accept freeform values (don't reject)
2. Inform user: "Run `/productivity:setup-org` to configure your taxonomy"
3. After workflow, offer to add used values to memory

### Unknown Values

When a user mentions a value not in the config:
1. Flag: "I don't see '[value]' in your taxonomy. Should I add it?"
2. On confirmation, append to the appropriate memory file
3. Update both the YAML frontmatter list and markdown body

## How to Interact

### When a Command Needs Taxonomy

Commands that reference products, modules, clients, or systems should:
1. Read the relevant `memory/context/` file
2. Parse frontmatter for the enum list
3. Validate or suggest values from the list
4. Fall back to freeform if no config exists

### When User References Org Entities

Use the same progressive disclosure as other memory:
1. **CLAUDE.md** for quick resolution ("WebApp" = Core SaaS platform)
2. **memory/context/** for full detail when needed for execution
3. **Ask user** if something is genuinely unknown

### Updating Org Context

When new products, modules, clients, or integrations come up:
1. Add to the appropriate `memory/context/` file
2. Update both YAML frontmatter and markdown body
3. If frequently referenced, promote to CLAUDE.md hot cache

## Bootstrapping

Use `/productivity:setup-org` to populate org context through an interactive interview. Safe to re-run — it loads existing values first and asks what to update.

## Conventions

- YAML frontmatter keys are lowercase, values use the canonical display name
- Markdown body uses `## Name` headings for each entry
- Keep CLAUDE.md hot cache to top 5-10 items per category
- Filenames: `products.md`, `clients.md`, `integrations.md` (fixed names, not per-entity)
- Teams stay in `company.md` — no separate file
