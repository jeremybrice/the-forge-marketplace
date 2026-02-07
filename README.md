<p align="left">
  <img src="the-forge-logo.jpg" alt="The Forge Marketplace" width="200">
</p>

# The Forge Marketplace

A curated collection of Claude Code plugins for reasoning, analysis, and creative exploration.

The Forge Marketplace is a plugin catalog for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Each plugin provides specialized slash commands that extend Claude's capabilities — from multi-agent debate to guided concept exploration.

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

## Available Plugins

| Plugin | Description | Version | Category |
|--------|-------------|---------|----------|
| [**Cognitive Forge**](./cognitive-forge/) | Multi-agent concept evaluation through structured debate (`/debate`) and interactive guided exploration (`/explore`) | 1.1.0 | Reasoning |

More plugins coming soon.

## Contributing

Interested in adding a plugin to The Forge Marketplace? Each plugin lives in its own directory with a `.claude-plugin/plugin.json` manifest, commands, and optional agents/skills. Open a PR with your plugin directory and an entry in `.claude-plugin/marketplace.json`.

## License

See individual plugin directories for licensing details.
