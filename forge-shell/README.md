# Forge Shell

Unified shell plugin that provides a navbar-driven index page for switching between plugin dashboards using iframes.

## Commands

- `/shell:add <plugin-name>` — Register a plugin in the shell sidebar. Reads marketplace.json and the plugin's dashboard manifest field.
- `/shell:remove <plugin-name>` — Remove a plugin from the shell sidebar.
- `/shell:open` — Open shell.html in the browser.

## Key Files

- `shell.html` — The unified shell page with sidebar nav and iframe content area. Uses the File System Access API to read `shell-registry.json` from the user's work folder at runtime.

## Architecture

- **Registry lives in the work folder** — `/shell:add` writes `shell-registry.json` to the user's project root (the only writable location). `shell.html` reads it dynamically via the File System Access API.
- **IndexedDB persistence** — The selected directory handle is saved in IndexedDB (`ForgeShell` DB) so it persists across page reloads without re-prompting.
- **iframes** for full isolation — existing plugin dashboards work unmodified inside the shell.
- **Shell owns the theme** and broadcasts to iframes via `postMessage({ type: 'forge-shell:theme', theme: 'dark' | 'light' })`.
- Participating plugins listen for the `forge-shell:theme` message and apply the theme via `data-theme` attribute.
- Hash routing (`shell.html#plugin-name`) preserves the active plugin across page reloads.
- **Version-aware paths** — `dashboardUrl` values use the format `../../<plugin>/<version>/<path>` to resolve correctly from `forge-shell/<version>/shell.html`.

## Registry Format

The `shell-registry.json` file is created in the user's work folder by `/shell:add`:

```json
{
  "plugins": [
    {
      "name": "productivity",
      "label": "Productivity",
      "icon": "📋",
      "dashboardUrl": "../../productivity/1.1.0/skills/dashboard.html"
    }
  ]
}
```

## Theme Protocol

The shell broadcasts theme changes to all iframes:
```js
postMessage({ type: 'forge-shell:theme', theme: 'dark' | 'light' })
```
Each participating dashboard listens for this message and applies the theme using the `data-theme` attribute on `document.documentElement`, which matches their existing CSS variable system.
