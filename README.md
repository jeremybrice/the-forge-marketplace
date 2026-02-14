<p align="left">
  <img src="the-forge-logo.jpg" alt="The Forge Marketplace" width="300">
</p>

# The Forge Marketplace

A curated collection of Claude Code plugins for reasoning, product management, productivity, and unified dashboard orchestration.

The Forge Marketplace is a plugin catalog for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and [Claude Cowork](https://claude.com/blog/cowork-plugins).

## Plugins

### Cognitive Forge v1.2.0

Deep concept evaluation through multi-agent debate and interactive guided exploration. Spawns specialized agents (Challenger, Explorer, Synthesizer) for parallel analysis or leads iterative dialogue with selective agent recruitment.

**Commands:**
- `/cognitive-forge:debate` — Multi-agent parallel concept evaluation with cross-examination and synthesis
- `/cognitive-forge:explore` — Interactive guided exploration with iterative dialogue and agent recruitment

Sessions are automatically persisted to `sessions/debates/` and `sessions/explorations/` and viewable in the built-in dashboard.

### Product Forge Local v1.0.5

Local-first product management for structured card generation. Automates Initiative, Epic, and Story card creation following the Jira hierarchy, with all outputs stored as local markdown files with YAML frontmatter.

**Commands:**
- `/product-forge-local:intake` — Structured interview for gathering product requirements
- `/product-forge-local:initiative` — Generate, update, or review Initiative cards
- `/product-forge-local:epic` — Generate, update, or review Epic cards
- `/product-forge-local:story` — Generate, update, or review Story cards
- `/product-forge-local:release-notes` — Generate product release notes
- `/product-forge-local:checkpoint` — Capture a knowledge checkpoint
- `/product-forge-local:decision` — Log a decision to the Decision Log

### Tasks v1.0.0

Task management with folder-based structure. Each task is an individual markdown file with YAML frontmatter stored in `tasks/` directory. Syncs with external task trackers (Asana, Linear, Jira, GitHub Issues).

**Commands:**
- `/tasks:start` — Initialize tasks system and open dashboard
- `/tasks:update` — Sync tasks from external sources and triage stale items
- `/tasks:add` — Quick add a new task

**Migration:** Automatically migrates legacy TASKS.md single-file format to folder-based structure on first run.

### Memory v1.0.0

Organizational memory and context management. Two-tier system with CLAUDE.md hot cache (~50-80 lines) and memory/ directory for full knowledge base. Decodes shorthand, acronyms, nicknames, and internal language so Claude understands requests like a colleague would.

**Commands:**
- `/memory:start` — Initialize memory system with bootstrap workflow
- `/memory:setup-org` — Configure organizational taxonomy (products, modules, clients, teams)
- `/memory:remember` — Store new entries in memory
- `/memory:recall` — Query memory interactively

### Rovo Agent Forge v1.0.0

Interactive builders for Atlassian Rovo agents. Guides through Jira and Confluence agent configuration via adaptive interview and outputs copy-ready sections for Rovo Studio. Agent configurations are saved to `rovo-agents/` in your project root and can be visualized and edited in the Forge Shell dashboard.

**Commands:**
- `/rovo-agent-forge:jira-agent` — Build a Jira-focused Rovo agent configuration
- `/rovo-agent-forge:confluence-agent` — Build a Confluence-focused Rovo agent configuration

### Forge Shell v1.0.0

**Desktop visualization app** for browsing project data created by Forge Marketplace plugins. Provides a unified single-page application with built-in view controllers for all plugin views (Cognitive Forge, Product Forge, Productivity, Rovo Agent Forge, Roadmap). No iframes.

> **Note:** Forge Shell is a standalone desktop application built with Tauri, not a Claude Code plugin. Install and run it separately from the CLI plugins.

**Installation:**
```bash
cd forge-shell
npm install
npm run tauri:dev  # Development mode
npm run tauri:build  # Production build
```

## How They Work Together

The five Claude Code plugins create content, and the Forge Shell desktop app visualizes it:

1. **Memory** provides the organizational memory layer (products, modules, clients, teams) that Product Forge Local uses for taxonomy validation.
2. **Tasks** manages individual task tracking with external sync capabilities (Asana, Linear, Jira, GitHub Issues).
3. **Cognitive Forge** offers deep reasoning tools for evaluating product concepts, architectural decisions, or strategic directions before they become cards.
4. **Product Forge Local** turns approved concepts into structured work items (Initiatives, Epics, Stories) with full hierarchy tracking.
5. **Rovo Agent Forge** builds Atlassian Rovo agent configurations through guided interviews, saving them to `rovo-agents/` in your project root.
6. **Forge Shell** (desktop app) provides a visual interface for browsing all plugin data in a unified single-page application.

Plugins write to dedicated directories in your project root: `cards/` (Product Forge Local), `sessions/` (Cognitive Forge), `tasks/` (Tasks), and `rovo-agents/` (Rovo Agent Forge). The Forge Shell desktop app reads these directories and provides a browsing interface.

## Installation

Add the marketplace to your project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "the-forge-marketplace": {
      "source": {
        "source": "github",
        "repo": "jeremybrice/the-forge-marketplace"
      }
    }
  }
}
```

Then install any plugin from the catalog:

```bash
/plugin install <plugin-name>@the-forge-marketplace
```

Or add it directly to your settings:

```json
{
  "enabledPlugins": {
    "<plugin-name>@the-forge-marketplace": true
  }
}
```

## Setting Up the Desktop Visualization App

After installing the Claude Code plugins, you can optionally set up the Forge Shell desktop app for visual browsing:

```bash
cd forge-shell
npm install
npm run tauri:dev  # Launch in development mode
```

All plugin views (Cognitive Forge, Product Forge Local, Tasks, Memory, and Rovo Agent Forge) are built into the desktop app. Select your project root directory when prompted to browse all plugin data.

## Available Plugins

| Plugin | Description | Version | Category |
|--------|-------------|---------|----------|
| [**Cognitive Forge**](./cognitive-forge/) | Multi-agent concept evaluation through structured debate and interactive exploration | 1.2.0 | Reasoning |
| [**Product Forge Local**](./product-forge-local/) | Local-first product management with structured card generation | 1.0.5 | Product Management |
| [**Tasks**](./tasks/) | Folder-based task management with external sync capabilities | 1.0.0 | Productivity |
| [**Memory**](./memory/) | Organizational memory and context management with two-tier system | 1.0.0 | Productivity |
| [**Rovo Agent Forge**](./rovo-agent-forge/) | Atlassian Rovo agent builders with dashboard visualization | 1.0.0 | Agents |

## Desktop App

| Tool | Description | Version | Category |
|------|-------------|---------|----------|
| [**Forge Shell**](./forge-shell/) | Desktop visualization app for browsing all plugin data (not a CLI plugin) | 1.0.0 | Desktop App |

## Contributing

Interested in adding a plugin to The Forge Marketplace? Each plugin lives in its own directory with a `.claude-plugin/plugin.json` manifest, commands, and optional agents/skills. Open a PR with your plugin directory and an entry in `.claude-plugin/marketplace.json`.

## License

See individual plugin directories for licensing details.
