---
description: Interactive interview to collect organizational taxonomy (products, modules, clients, integrations, teams) and write to the productivity memory system.
---

# Setup Org Command

Configure your organizational taxonomy — products, modules, clients, integrations, and teams — so commands can validate values and Claude can resolve your internal shorthand.

## Instructions

### 1. Check What Exists

Check the working directory for:
- `memory/context/products.md` — products, modules, systems
- `memory/context/clients.md` — client relationships
- `memory/context/integrations.md` — external systems
- `memory/context/company.md` — org identity, teams, tools

If any of these exist, load current values. This command is re-runnable — show current state and ask what to update.

**If `memory/` directory doesn't exist at all:** Suggest running `/productivity:start` first to initialize the full productivity system. If the user wants to proceed anyway, create the `memory/context/` directory.

### 2. Explain What We're Doing

```
I'm going to walk through your org's taxonomy so I can use the right
names for products, modules, clients, and systems in your workflows.

This takes about 5 minutes. I'll ask a few questions per section,
and you can skip anything that doesn't apply.
```

If existing config was found:
```
I found existing org context. I'll show you what's there and you can
tell me what to add, update, or remove.
```

### 3. Phase 1 — Org Identity

Update `memory/context/company.md` with org-level context.

**Ask:**
```
Let's start with the basics.

1. What's your company/org name?
2. In a sentence, what does your company do?
3. Any terminology conventions I should know? (e.g., you say
   "customers" not "clients", or "features" not "modules")
```

Write answers to the top of `memory/context/company.md`, preserving any existing teams/tools sections.

### 4. Phase 2 — Products

**Ask:**
```
What are your main products or product lines?

For each one, give me:
- The name (how your team refers to it)
- A one-liner describing what it is and who uses it

Example:
- WebApp — Core SaaS platform for enterprise customers
- MobileApp — Field operations app for iOS and Android
```

Confirm the list before moving on:
```
Here's what I have for products:

| Product | Description |
|---------|-------------|
| WebApp | Core SaaS platform for enterprise customers |
| MobileApp | Field operations app for iOS and Android |

Look right? Anything to add or change?
```

### 5. Phase 3 — Modules

**Ask:**
```
What are the main functional areas or modules in your products?

These are the building blocks — things like Authentication, Billing,
Notifications, Reporting. They might span multiple products or be
specific to one.

List as many as are useful for categorizing work.
```

Confirm the list, noting which products each module applies to if the user mentions it.

### 6. Phase 4 — Clients / Customers

**Ask:**
```
Do you have key clients or customer accounts that come up regularly
in your work? These would be names your team references when
discussing features, bugs, or priorities.

For each, give me:
- The name
- A quick note on what drives their requests (optional)

If this doesn't apply (e.g., you're B2C or internal-only), just
say "skip" and we'll move on.
```

### 7. Phase 5 — Systems

**Ask:**
```
When you document what parts of your infrastructure are affected by
a change, what system names do you use?

These show up in "Affected Systems" sections — things like:
- WebApp, MobileApp, API Gateway, Data Warehouse
- Or whatever names your team uses

List the standard set your team would recognize.
```

If the user already listed products and the systems overlap significantly, pre-populate from the products list and ask what else to add.

### 8. Phase 6 — Integrations (Optional)

**Ask:**
```
Do you integrate with external systems? Things like:
- CRMs (Salesforce, HubSpot)
- ERPs (SAP, Oracle)
- Payment processors (Stripe, Adyen)
- Communication (Twilio, SendGrid)

For each, a one-liner on what the integration does is helpful.

If not applicable, say "skip".
```

### 9. Phase 7 — Teams (Optional)

Check if `memory/context/company.md` already has a Teams section (likely populated by `/productivity:start`).

**If teams exist:**
```
I already have your team structure from setup:

| Team | What they do |
|------|--------------|
| Platform | Infrastructure and DevOps |
| Product | Feature development |

Anything to update, or should we keep this as-is?
```

**If no teams exist:**
```
Last one — what teams do you work with regularly?

For each:
- Team name
- What they own or do
- Key people (optional)

If you'd rather skip this, we can always add it later.
```

### 10. Write Memory Files

Write each section to the appropriate file with YAML frontmatter and markdown body.

**memory/context/products.md:**
```markdown
---
products:
  - [Product1]
  - [Product2]
modules:
  - [Module1]
  - [Module2]
systems:
  - [System1]
  - [System2]
---

# Products

## [Product1]
[Description from interview]

## [Product2]
[Description from interview]

# Modules

## [Module1]
[Description from interview]

# Systems

| System | Description |
|--------|-------------|
| [System1] | [Description] |
```

**memory/context/clients.md:**
```markdown
---
clients:
  - [Client1]
  - [Client2]
---

# Clients

## [Client1]
[Description from interview]
```

**memory/context/integrations.md:**
```markdown
---
integrations:
  - [Integration1]
  - [Integration2]
---

# Integrations

## [Integration1]
[Description from interview]
```

**memory/context/company.md** — update the existing file (or create it) with org identity at the top, preserving existing sections:
```markdown
# Company Context

## Identity
[Company name]. [What they do]. [Terminology notes.]

## Teams
[Existing or new team table]

## Tools & Systems
[Existing content preserved]
```

### 11. Update CLAUDE.md Hot Cache

Add a summary section to CLAUDE.md with top items from each category:

```markdown
## Org Context
| Category | Values |
|----------|--------|
| Products | WebApp, MobileApp, API Platform |
| Modules | Authentication, Billing, Notifications |
| Clients | Acme Corp, Globex Industries |
> Full taxonomy: memory/context/
```

If CLAUDE.md already has an Org Context section, replace it with the updated version.

### 12. Report Results

```
Org context configured:
- Products: X defined (memory/context/products.md)
- Modules: X defined
- Systems: X defined
- Clients: X defined (memory/context/clients.md)
- Integrations: X defined (memory/context/integrations.md)
- Teams: [updated / unchanged] (memory/context/company.md)
- CLAUDE.md hot cache updated

Your taxonomy is now available to all commands. Values will be
validated and shorthand resolved automatically.

To update later, run /productivity:setup-org again.
```

## Notes

- Re-runnable: loads existing values and asks what to update
- Skippable sections: clients, integrations, and teams are all optional
- Batch questions 2-3 per message to keep the interview conversational
- Confirm each section before writing to avoid corrections after the fact
- If the user provides partial info, accept it and note gaps for later
- Never reject freeform values — the taxonomy grows organically
