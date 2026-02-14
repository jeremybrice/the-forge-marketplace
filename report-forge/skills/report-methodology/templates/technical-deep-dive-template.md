# Technical Deep Dive Template

This template defines the structure for technical-deep-dive report type. Synthesizer should follow this section organization when assembling the final report.

## Target Audience
Engineers, architects, technical leads

## Tone
Technical precision, detailed explanations, appropriate use of technical terms. Focus on implementation.

## Length
5-10 pages

## Required Sections

### Overview
**Purpose**: Context and scope for the investigation
**Content**: What system/feature was investigated, why it was investigated, what time period or scope was covered
**Format**: 2-3 prose paragraphs
**Guidance**: Set the stage for readers. Explain the motivation for this deep dive and what boundaries were set.

### Technical Analysis
**Purpose**: Detailed examination of the system/feature
**Content**: Architecture, implementation patterns, code structure, data flows, key components
**Format**: Prose with subsections for different aspects (use `###` for subsections)
**Guidance**: This is the heart of the report. Dive deep into how things work. Reference specific files, functions, classes, or modules. Cite line numbers if relevant.

**Suggested subsections** (adapt based on findings):
- Architecture and Structure
- Key Components and Their Interactions
- Data Models and Schemas
- Implementation Patterns
- Dependencies and Integrations

### Implementation Details
**Purpose**: Explain how the system actually works
**Content**: Specific implementation choices, algorithms, code patterns, configuration
**Format**: Prose with code examples (described in prose, not literal code blocks unless necessary)
**Guidance**: Walk through the implementation. Explain specific technical decisions. Reference Investigator's file observations and Analyst's pattern interpretations.

### Trade-offs
**Purpose**: Evaluate pros, cons, and alternatives
**Content**: Benefits of current approach, drawbacks, alternative approaches considered or possible
**Format**: Prose paragraphs organized by trade-off category
**Guidance**: Every technical decision involves trade-offs. Identify them. Explain why the current approach was chosen (if evident) and what was sacrificed.

**Suggested subsections**:
- Strengths
- Weaknesses
- Alternative Approaches

### Recommendations
**Purpose**: Technical improvements with rationale
**Content**: Specific technical changes, refactorings, optimizations, or next steps
**Format**: Numbered list with detailed explanations
**Guidance**: Each recommendation should include: what to change, why to change it, expected impact, rough effort estimate (if assessable).

## Optional Sections

### Performance Characteristics (if applicable)
**Purpose**: Describe performance behavior
**Format**: Prose with metrics from Investigator
**When to include**: If performance is relevant to the investigation

### Testing and Quality (if applicable)
**Purpose**: Describe test coverage, quality assurance practices
**Format**: Prose or bullet list
**When to include**: If testing is a focus area or gap

### Security Considerations (if applicable)
**Purpose**: Identify security-relevant aspects
**Format**: Prose paragraphs
**When to include**: If security is relevant to the investigation

### Migration/Evolution Path (if applicable)
**Purpose**: How to transition from current to future state
**Format**: Prose or numbered steps
**When to include**: If recommendations require significant changes

## Formatting Rules
- Use `##` for major sections
- Use `###` for subsections
- Blank lines between major sections
- Substantive bullets (1-2 sentences minimum)
- No tables (use prose descriptions)
- No dashes as thought separators
- Reference specific files with paths (e.g., "src/modules/notification/EmailProvider.js")
- Cite specific observations from Investigator and Analyst outputs

## Example Structure

```markdown
## Overview

[2-3 paragraphs: what was investigated, why, scope/timeframe]

## Technical Analysis

[Prose introduction to the analysis]

### Architecture and Structure

[Prose describing the overall architecture, file organization, component relationships]

### Key Components

[Prose describing the major components and how they interact]

### Implementation Patterns

[Prose describing the coding patterns, design patterns, architectural approaches]

## Implementation Details

[Prose walking through how the system actually works. Reference specific files, functions, classes.]

### [Subsection for specific aspect]

[Detailed implementation explanation]

## Trade-offs

### Strengths

[Prose explaining what works well about the current approach]

### Weaknesses

[Prose explaining limitations, technical debt, or problematic aspects]

### Alternative Approaches

[Prose describing other ways this could have been implemented, with pros/cons of each]

## Recommendations

1. **[Recommendation 1 title]**
   [Prose explanation: what to change, why, expected impact, rough effort]

2. **[Recommendation 2 title]**
   [Prose explanation: what to change, why, expected impact, rough effort]

3. **[Recommendation 3 title]**
   [Prose explanation: what to change, why, expected impact, rough effort]
```

## Synthesizer Guidance

When using this template:

1. **Reference specifics** — Cite file paths, function names, class names, configuration files from Investigator findings.
2. **Explain patterns** — Use Analyst's pattern interpretations to connect individual observations into higher-level understanding.
3. **Balance depth and readability** — Technical readers want details, but still need narrative flow.
4. **Use subsections** — Break long sections into digestible subsections with `###` headers.
5. **Connect to context** — Explain why technical choices matter (performance, maintainability, scalability).
6. **Be honest about trade-offs** — No technical decision is perfect. Acknowledge both benefits and costs.
7. **Make recommendations actionable** — Technical readers need specifics: what to refactor, what to add, what to remove.
