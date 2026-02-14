# Architecture Review Template

This template defines the structure for architecture-review report type. Synthesizer should follow this section organization when assembling the final report.

## Target Audience
Architects, senior engineers, technical leads

## Tone
Architectural thinking, system-level perspective, design-focused. Balance current state assessment with future vision.

## Length
4-8 pages

## Required Sections

### Current Architecture
**Purpose**: Document the as-is state of the system
**Content**: High-level architecture, major components, relationships, data flows, technologies
**Format**: Prose with subsections (use `###`) for different architectural aspects
**Guidance**: Describe the system's structure, not its implementation details. Focus on components, boundaries, interactions, and design patterns. Reference Investigator's structural findings.

**Suggested subsections**:
- System Overview
- Component Architecture
- Data Architecture
- Integration Points
- Technology Stack

### Strengths
**Purpose**: Identify what works well and should be preserved
**Content**: Architectural decisions that are working, patterns that are effective, areas of excellence
**Format**: Prose paragraphs, can use bullets for lists of specific strengths
**Guidance**: Every system has strengths. Identify them from Analyst's positive patterns. These guide what to preserve during evolution. Be specific about why each strength matters.

### Weaknesses
**Purpose**: Identify architectural issues and limitations
**Content**: Design problems, technical debt, scalability concerns, maintainability issues, coupling problems
**Format**: Prose paragraphs organized by category of weakness
**Guidance**: Draw from Analyst's risk assessment and anomalies. Categorize weaknesses (scalability, maintainability, complexity, coupling, etc.). Explain impact of each weakness.

**Suggested subsections**:
- Scalability Concerns
- Maintainability Issues
- Technical Debt
- Architectural Gaps
- Coupling and Cohesion

### Recommendations
**Purpose**: Propose architectural changes with rationale
**Content**: Specific architectural improvements, refactorings, or redesigns
**Format**: Numbered list with detailed explanations
**Guidance**: Each recommendation should describe the proposed change, explain why it's needed, and outline expected benefits. Prioritize recommendations (critical, important, nice-to-have).

### Migration Path
**Purpose**: Describe how to transition from current to future architecture
**Content**: Sequenced steps for implementing recommendations, dependencies, milestones
**Format**: Numbered phases or prose describing evolution strategy
**Guidance**: Architectural changes rarely happen all at once. Describe an evolutionary path. Identify which changes to make first, what depends on what, and how to minimize disruption.

**Suggested format**:
- Phase 1: [Foundational changes]
- Phase 2: [Building on Phase 1]
- Phase 3: [Final state]

Or use prose describing incremental improvement strategy (strangler fig, parallel run, etc.)

## Optional Sections

### Design Principles (if relevant)
**Purpose**: Articulate guiding principles for architecture decisions
**Format**: Bullet list with explanations
**When to include**: If the review identifies unclear or conflicting principles that need clarification

### Risks and Mitigations (if significant changes proposed)
**Purpose**: Identify risks in proposed changes and how to mitigate them
**Format**: Prose or bullets
**When to include**: If recommendations involve significant architectural shifts

### Architecture Decision Records (ADRs) (if applicable)
**Purpose**: Document key decisions made or recommended
**Format**: Structured ADR format
**When to include**: If the review involves making or documenting significant architectural decisions

### Reference Architecture (if helpful)
**Purpose**: Provide examples or patterns to follow
**Format**: Prose with references to industry patterns, other systems, or standards
**When to include**: If recommendations reference well-known patterns or external examples

## Formatting Rules
- Use `##` for major sections
- Use `###` for subsections
- Blank lines between major sections
- Substantive bullets (1-2 sentences minimum)
- No tables (use prose descriptions)
- No dashes as thought separators
- Reference specific components, modules, or systems by name
- Use architectural terminology appropriately (layers, tiers, boundaries, etc.)

## Example Structure

```markdown
## Current Architecture

[Introductory paragraph describing the system at a high level]

### System Overview

[Prose describing the overall system, its purpose, and major capabilities]

### Component Architecture

[Prose describing the major components, their responsibilities, and relationships. Reference specific modules or services found by Investigator.]

### Data Architecture

[Prose describing how data flows through the system, data models, persistence, caching]

### Integration Points

[Prose describing external systems, APIs, third-party services, and how they integrate]

### Technology Stack

[Prose listing and describing the key technologies, frameworks, and infrastructure]

## Strengths

[Introductory paragraph]

### [Strength Category 1]

[Prose explaining this architectural strength and why it matters]

### [Strength Category 2]

[Prose explaining this architectural strength and why it matters]

## Weaknesses

[Introductory paragraph]

### Scalability Concerns

[Prose describing scalability limitations, bottlenecks, or architectural constraints]

### Maintainability Issues

[Prose describing complexity, coupling, or maintenance challenges]

### Technical Debt

[Prose describing accumulated debt, workarounds, or deprecated patterns]

## Recommendations

1. **[Recommendation 1 title]**
   [Prose: what to change architecturally, why it's needed, expected benefits, effort level]

2. **[Recommendation 2 title]**
   [Prose: what to change architecturally, why it's needed, expected benefits, effort level]

3. **[Recommendation 3 title]**
   [Prose: what to change architecturally, why it's needed, expected benefits, effort level]

## Migration Path

### Phase 1: [Phase name - foundational changes]

[Prose describing initial architectural changes, what to build first, why]

### Phase 2: [Phase name - building on foundation]

[Prose describing next set of changes that depend on Phase 1 completion]

### Phase 3: [Phase name - reaching target state]

[Prose describing final changes to reach the recommended future architecture]

**Timeline**: [Rough estimate of time required, if assessable]

**Dependencies**: [Key dependencies, prerequisites, or external factors affecting migration]
```

## Synthesizer Guidance

When using this template:

1. **Think system-level** — Focus on components, boundaries, and interactions; not implementation details.
2. **Use architectural language** — Layers, tiers, services, boundaries, coupling, cohesion, modularity.
3. **Balance assessment** — Every architecture has strengths and weaknesses. Present both honestly.
4. **Be specific in weaknesses** — Not "it's too complex" but "the notification system tightly couples provider implementations to the service layer, making provider changes require service changes."
5. **Justify recommendations** — Explain why each architectural change is needed and what problem it solves.
6. **Make migration realistic** — Describe an evolutionary path, not a big-bang rewrite.
7. **Reference patterns** — If recommendations involve well-known patterns (CQRS, event sourcing, microservices, etc.), name them and explain why they fit.
8. **Preserve what works** — Use Strengths section to ensure good architectural decisions are maintained during evolution.
