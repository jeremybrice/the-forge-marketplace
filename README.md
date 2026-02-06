# Cognitive Forge

Deep concept evaluation through multi-agent debate for Claude Code.

The Cognitive Forge spawns specialized agents that simultaneously analyze your concept from adversarial, creative, and integrative angles — then synthesizes their perspectives into understanding stronger than any single evaluation could produce.

## Installation

### Via Claude Code UI

1. Open the plugin browser in Claude Code
2. Add marketplace URL: `https://github.com/jeremybrice/cognitive-forge-plugin.git`
3. Click **Sync**, then install **cognitive-forge**

### Via CLI

```bash
/plugin marketplace add jeremybrice/cognitive-forge-plugin
/plugin install cognitive-forge@cognitive-forge-marketplace
```

### Via Project Settings

Add to your project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "cognitive-forge-marketplace": {
      "source": {
        "source": "github",
        "repo": "jeremybrice/cognitive-forge-plugin"
      }
    }
  },
  "enabledPlugins": {
    "cognitive-forge@cognitive-forge-marketplace": true
  }
}
```

## Usage

```
/cognitive-forge:forge <your concept here>
```

### Examples

```
/cognitive-forge:forge a subscription model for AI consulting
/cognitive-forge:forge the argument that AI systems should have legal personhood
/cognitive-forge:forge using OKRs for personal goal-setting
/cognitive-forge:forge a documentary series told entirely through AI-generated imagery
```

### Quiet Mode

To skip the debate narration and see only the final synthesis:

```
/cognitive-forge:forge "my concept" --quiet
```

## How It Works

### The Debate

When you invoke `/cognitive-forge:forge`, the system:

1. **Intake**: Classifies your concept (Business, Philosophical, Framework, or Creative) and confirms understanding
2. **Recruit**: Spawns 3 core agents in parallel, plus optional specialists based on complexity
3. **Analyze**: Each agent examines the concept through its unique lens simultaneously
4. **Present**: Shows each perspective with narration of agreements and tensions (visible mode)
5. **Cross-examine**: If agents sharply disagree, feeds critiques across for response (optional)
6. **Synthesize**: Integrates all perspectives into refined understanding with actionable next steps

### The Agents

| Agent | Role | Techniques |
|-------|------|------------|
| **Challenger** | Adversarial analysis | Steel Opposition, Boundary Mapping, Pre-Mortem, Inversion |
| **Explorer** | Creative expansion | Possibility Expansion, Constraint Shaping, Perspective Synthesis |
| **Synthesizer** | Integration | Iterative Refinement, Quality Calibration, Tension Mapping |
| **Decomposer** | Structural analysis (recruited) | Cognitive Decomposition, Sequential Deepening |
| **Evaluator** | Evidence grounding (recruited) | Evidence Anchoring, Excellence Calibration |

The Decomposer is recruited for structurally complex concepts (4+ interacting components). The Evaluator is recruited for concepts with checkable factual claims (and has web search access).

### Concept Types

The forge adapts its technique emphasis based on concept type:

- **Business**: Stakeholder perspectives, failure modes, evidence anchoring
- **Philosophical**: Logic, steel opposition, boundary mapping, tensions
- **Framework**: Structural integrity, edge cases, comparative analysis
- **Creative**: Possibility expansion, excellence calibration, constraint shaping

## Architecture

```
cognitive-forge-plugin/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace catalog
├── cognitive-forge/
│   ├── .claude-plugin/
│   │   └── plugin.json           # Plugin manifest
│   ├── CLAUDE.md                 # Ambient plugin context
│   ├── commands/
│   │   └── forge.md              # /forge command (Moderator protocol)
│   ├── skills/
│   │   └── cognitive-techniques/
│   │       ├── SKILL.md          # Foundation knowledge for agents
│   │       └── references/
│   │           └── techniques.md # 10 cognitive techniques
│   ├── agents/
│   │   ├── forge-challenger.md   # Adversarial analysis
│   │   ├── forge-explorer.md     # Creative expansion
│   │   ├── forge-synthesizer.md  # Integration
│   │   ├── forge-decomposer.md   # Structural analysis (recruited)
│   │   └── forge-evaluator.md    # Evidence grounding (recruited)
│   └── hooks/
│       └── hooks.json            # Empty for v1
├── .gitignore
└── README.md
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

Built on the Cognitive Forge concept evaluation framework — 10 cognitive techniques for deep concept examination, adapted from a single-agent skill into a multi-agent debate system.
