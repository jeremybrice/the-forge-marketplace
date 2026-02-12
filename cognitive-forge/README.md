# Cognitive Forge

**v1.1.0**

Deep concept evaluation through multi-agent debate and interactive exploration for Claude Code.

The Cognitive Forge provides two modes of concept examination: **`/debate`** spawns specialized agents that simultaneously analyze your concept from adversarial, creative, and integrative angles — then synthesizes their perspectives. **`/explore`** leads you through iterative dialogue as an active co-explorer, applying cognitive techniques conversationally with selective agent recruitment.

## Usage

### `/cognitive-forge:debate` — Multi-Agent Debate

```
/cognitive-forge:debate <your concept here>
```

Spawns parallel agents to examine your concept from every angle. You observe the debate and receive a synthesis.

**Examples:**
```
/cognitive-forge:debate a subscription model for AI consulting
/cognitive-forge:debate the argument that AI systems should have legal personhood
/cognitive-forge:debate using OKRs for personal goal-setting
```

**Quiet Mode** — skip debate narration, see only the final synthesis:
```
/cognitive-forge:debate "my concept" --quiet
```

### `/cognitive-forge:explore` — Interactive Exploration

```
/cognitive-forge:explore <your concept here>
```

Engages you in iterative dialogue, applying cognitive techniques conversationally. You're an active participant shaping the exploration.

**Examples:**
```
/cognitive-forge:explore the ethics of AI-generated training data
/cognitive-forge:explore whether microservices are right for our architecture
/cognitive-forge:explore a documentary series told entirely through AI-generated imagery
```

### When to Use Which

| | `/debate` | `/explore` |
|---|-----------|------------|
| **Mode** | Breadth — parallel perspectives | Depth — iterative collaboration |
| **Your role** | Observer (review + approve intake) | Active co-explorer |
| **Agents** | 3 core + up to 2 recruited | Guide + up to 2 recruited on demand |
| **Best for** | Getting multiple independent viewpoints fast | Deep-diving into a concept with guided dialogue |
| **Pace** | Single pass with optional cross-examination | Multi-turn conversation at your pace |

## How `/debate` Works

When you invoke `/cognitive-forge:debate`, the system:

1. **Intake**: Classifies your concept (Business, Philosophical, Framework, or Creative) and confirms understanding
2. **Recruit**: Spawns 3 core agents in parallel, plus optional specialists based on complexity
3. **Analyze**: Each agent examines the concept through its unique lens simultaneously
4. **Present**: Shows each perspective with narration of agreements and tensions (visible mode)
5. **Cross-examine**: If agents sharply disagree, feeds critiques across for response (optional)
6. **Synthesize**: Integrates all perspectives into refined understanding with actionable next steps

## How `/explore` Works

When you invoke `/cognitive-forge:explore`, the Guide:

1. **Intake**: Conversational exchange to understand the concept, your relationship to it, and what success looks like
2. **Decompose**: Breaks the concept into components, shares the map, invites your correction
3. **Examine**: Applies 2-3 cognitive techniques based on concept type, pausing after each for your response
4. **Stress-test**: Adversarial testing — pre-mortem, inversion, stress scenarios — framed collaboratively
5. **Expand**: Adjacent possibilities, constraint removal, hybrid forms (optional — skipped if not needed)
6. **Synthesize**: Draws threads together in a format shaped by the concept type and dialogue trajectory

The Guide recruits specialist agents (Decomposer, Evaluator) mid-dialogue only when complexity genuinely demands it, always explaining why before spawning.

## The Agents

| Agent | Role | Techniques | Used By |
|-------|------|------------|---------|
| **Challenger** | Adversarial analysis | Steel Opposition, Boundary Mapping, Pre-Mortem, Inversion | `/debate` only |
| **Explorer** | Creative expansion | Possibility Expansion, Constraint Shaping, Perspective Synthesis | `/debate` only |
| **Synthesizer** | Integration | Iterative Refinement, Quality Calibration, Tension Mapping | `/debate` only |
| **Decomposer** | Structural analysis (recruited) | Cognitive Decomposition, Sequential Deepening | Both commands |
| **Evaluator** | Evidence grounding (recruited) | Evidence Anchoring, Excellence Calibration | Both commands |

The Decomposer is recruited for structurally complex concepts (4+ interacting components). The Evaluator is recruited for concepts with checkable factual claims (and has web search access).

### Concept Types

Both commands adapt technique emphasis based on concept type:

- **Business**: Stakeholder perspectives, failure modes, evidence anchoring
- **Philosophical**: Logic, steel opposition, boundary mapping, tensions
- **Framework**: Structural integrity, edge cases, comparative analysis
- **Creative**: Possibility expansion, excellence calibration, constraint shaping

## Key Constraints

- Both commands are explicit invocation only — never auto-detect or auto-trigger
- Subagents cannot spawn other subagents
- The main Claude session acts as Moderator (debate) or Guide (explore), spawning agents via the `Task` tool

## Session Persistence

Both `/debate` and `/explore` automatically save completed sessions to local markdown files with YAML frontmatter.

### Directory Structure

```
cognitive-forge/
  sessions/
    debates/         ← Debate session records
    explorations/    ← Exploration session records
```

### Filename Convention

`{YYYY-MM-DD}-{concept-slug}.md`

- Date is the session date
- Slug is the concept title lowercased, spaces replaced by hyphens, non-alphanumeric characters removed

### Frontmatter Schemas

**Debate sessions:** `title`, `type` (debate), `category`, `concept`, `agents` (array), `cross_examination` (bool), `status`, `created`

**Exploration sessions:** `title`, `type` (explore), `category`, `concept`, `relationship`, `agents_recruited` (array), `techniques_applied` (array), `status`, `created`

## Dashboard

The Cognitive Forge dashboard (`dashboard.html`) is a single-file HTML viewer for browsing saved debate and exploration sessions. It uses the File System Access API to read from the `sessions/` directory.

View sessions in the built-in Forge Shell dashboard. Run `/forge-shell:open` to launch.

## Architecture

```
cognitive-forge/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── commands/
│   ├── debate.md             # /debate command (Moderator protocol)
│   └── explore.md            # /explore command (Guide protocol)
├── skills/
│   └── cognitive-techniques/
│       ├── SKILL.md          # Foundation knowledge for agents
│       └── references/
│           └── techniques.md # 10 cognitive techniques
├── agents/
│   ├── forge-challenger.md   # Adversarial analysis
│   ├── forge-explorer.md     # Creative expansion
│   ├── forge-synthesizer.md  # Integration
│   ├── forge-decomposer.md   # Structural analysis (recruited)
│   └── forge-evaluator.md    # Evidence grounding (recruited)
└── hooks/
    └── hooks.json            # Empty for v2
```

## Local Development

Test the plugin locally without installing from GitHub:

```bash
claude --plugin-dir ./cognitive-forge
```

Validate the plugin structure:

```bash
claude plugin validate .
```

## Credits

Built on the Cognitive Forge concept evaluation framework — 10 cognitive techniques for deep concept examination, adapted from a single-agent skill into a multi-agent debate system and interactive exploration guide.
