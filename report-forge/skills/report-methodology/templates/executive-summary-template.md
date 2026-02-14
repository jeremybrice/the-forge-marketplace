# Executive Summary Template

This template defines the structure for executive-summary report type. Synthesizer should follow this section organization when assembling the final report.

## Target Audience
Executives, product leaders, business stakeholders (non-technical)

## Tone
Business-focused, clear, concise, minimal technical jargon. Focus on outcomes and decisions.

## Length
2-3 pages

## Required Sections

### Executive Summary
**Purpose**: One paragraph overview of the entire report
**Content**: What was investigated, why it matters, key finding (the "so what"), primary recommendation
**Format**: Single prose paragraph, 4-6 sentences
**Example opening**: "This report evaluates [topic] to assess [goal]. Our investigation reveals..."

### Key Findings
**Purpose**: Highlight the 3-5 most important discoveries
**Content**: Critical insights, discoveries, or concerns that stakeholders need to know
**Format**: Bullet list with substantive bullets (1-2 sentences each)
**Guidance**: Each bullet should state a finding and its implication. Not just "Tests are missing" but "Tests are missing, creating regression risk during future changes."

### Recommendations
**Purpose**: Actionable next steps with clear direction
**Content**: Specific actions to take based on findings, prioritized by impact
**Format**: Numbered list with substantive descriptions
**Guidance**: Each recommendation should be actionable and specific. Not "Improve monitoring" but "Implement failure alerting for notification delivery with threshold of 5% failure rate."
**Prioritization**: Mark recommendations as High/Medium/Low priority or Critical/Important/Nice-to-have

### Next Steps
**Purpose**: Immediate actions and timeline
**Content**: What happens next, who owns it, when it happens
**Format**: Bullet list or short prose paragraph
**Guidance**: Include ownership and timeframe. "Engineering team to implement monitoring (target: 2 weeks)" or "Product to evaluate feasibility study recommendations (by end of quarter)"

## Optional Sections

### Background (if context needed)
**Purpose**: Provide context for non-technical readers
**Format**: 1-2 prose paragraphs
**When to include**: If the topic requires business context or historical background

### Impact Assessment (if quantifiable)
**Purpose**: Quantify business impact (cost, time, risk, opportunity)
**Format**: Prose paragraph or bullet list with metrics
**When to include**: If findings have measurable business implications (revenue, cost, user impact)

## Formatting Rules
- Start with Executive Summary (always first section)
- Use blank lines between major sections
- Substantive bullets only (1-2 sentences minimum)
- No tables
- No dashes as thought separators
- Define technical terms when first used

## Example Structure

```markdown
## Executive Summary

[One paragraph: what, why, key finding, primary recommendation]

## Key Findings

- [Finding 1 with implication]
- [Finding 2 with implication]
- [Finding 3 with implication]
- [Optional: Finding 4]
- [Optional: Finding 5]

## Recommendations

1. **[Recommendation 1]** (Priority: High)
   [1-2 sentences explaining the recommendation and expected outcome]

2. **[Recommendation 2]** (Priority: Medium)
   [1-2 sentences explaining the recommendation and expected outcome]

3. **[Recommendation 3]** (Priority: Low)
   [1-2 sentences explaining the recommendation and expected outcome]

## Next Steps

- [Immediate action 1 with owner and timeline]
- [Immediate action 2 with owner and timeline]
- [Follow-up or decision point]
```

## Synthesizer Guidance

When using this template:

1. **Extract the essential insight** — What is the one thing executives need to understand? Put it in the Executive Summary.
2. **Prioritize ruthlessly** — Not all findings belong in Key Findings. Choose the 3-5 that matter most to business outcomes.
3. **Be specific in recommendations** — Vague suggestions don't help decision-makers. Every recommendation should be actionable.
4. **Show impact** — Connect findings to business impact (user experience, revenue, cost, risk) whenever possible.
5. **Keep it concise** — Executives value brevity. If a section can be one paragraph instead of three, use one.
6. **Avoid technical depth** — Save implementation details for technical reports. Focus on what and why, not how.
