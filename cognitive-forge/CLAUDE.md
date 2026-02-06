# Cognitive Forge Plugin

This plugin provides deep concept evaluation through multi-agent debate.

## How It Works

The Cognitive Forge spawns specialized agents that simultaneously analyze a concept from different angles, then synthesizes their perspectives into refined understanding. It is triggered exclusively via the `/cognitive-forge:forge` command — never auto-detect or auto-trigger.

## Agent Roster

### Core Agents (always spawned)
- **Challenger** (`forge-challenger`): Adversarial analysis — steel opposition, boundary mapping, pre-mortem, inversion
- **Explorer** (`forge-explorer`): Creative expansion — adjacent possibilities, constraint shaping, amplified vision, hybrid opportunities
- **Synthesizer** (`forge-synthesizer`): Integration — core thread identification, quality calibration, tension mapping, refinement

### Recruited Agents (conditional)
- **Decomposer** (`forge-decomposer`): Structural analysis for concepts with 4+ interacting components or nested dependencies
- **Evaluator** (`forge-evaluator`): Evidence grounding for concepts with checkable factual claims (has WebSearch/WebFetch access)

## Modes

- **Visible** (default): Full debate transparency — each agent's analysis is shown with Moderator narration
- **Quiet** (`--quiet` flag): Agents run silently, only the final synthesis is shown

## Concept Types

The forge classifies concepts into four types to guide agent technique selection:
- **Business**: Product ideas, strategies, market approaches
- **Philosophical**: Arguments, ethical stances, worldview claims
- **Framework**: Mental models, processes, methodologies
- **Creative**: Artistic choices, novel approaches, generative ideas

## Key Constraint

Subagents cannot spawn other subagents. The main Claude session acts as Moderator, spawning all debate agents via the `Task` tool. Cross-examination rounds are also spawned by the Moderator.
