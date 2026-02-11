# Forge Shell

Unified shell plugin that provides a navbar-driven index page for switching between plugin dashboards using iframes.

## Commands

- `/shell:add <plugin-name>` — Register a plugin in the shell sidebar. Copies the plugin's dashboard HTML into `src/` alongside `shell.html` and `shell-registry.json`.
- `/shell:remove <plugin-name>` — Remove a plugin from the shell sidebar and delete its copied dashboard file.
- `/shell:open` — Open `src/shell.html` in the browser.

## Key Files

- `shell.html` — The unified shell page with sidebar nav and iframe content area. Supports dual-mode loading: auto-fetches the registry over HTTP when served, or uses the File System Access API when opened via `file://`.

## Architecture

- **Copy-to-src model** — `/shell:add` copies `shell.html` and each plugin's dashboard HTML into a `src/` folder in the user's project. All dashboards become siblings, and `dashboardUrl` values are simple filenames (e.g., `"cognitive-viewer.html"`). This makes the UI self-contained and portable.
- **Dual-mode loading** — When served over HTTP (e.g., `python3 -m http.server` in `src/`), the shell auto-fetches `shell-registry.json` without any directory picker. When opened via `file://`, it falls back to the File System Access API with IndexedDB handle persistence.
- **IndexedDB persistence** — The selected directory handle is saved in IndexedDB (`ForgeShell` DB) so it persists across `file://` reloads without re-prompting.
- **iframes** for full isolation — existing plugin dashboards work unmodified inside the shell.
- **Shell owns the theme** and broadcasts to iframes via `postMessage({ type: 'forge-shell:theme', theme: 'dark' | 'light' })`.
- Participating plugins listen for the `forge-shell:theme` message and apply the theme via `data-theme` attribute.
- Hash routing (`shell.html#plugin-name`) preserves the active plugin across page reloads.

## Target Structure

After running `/shell:add` for each plugin, the user's project contains:

```
my-project/
└── src/
    ├── shell.html
    ├── shell-registry.json
    ├── cognitive-viewer.html
    ├── product-viewer.html
    └── memory-viewer.html
```

## Registry Format

The `src/shell-registry.json` file is created in the user's `src/` folder by `/shell:add`:

```json
{
  "plugins": [
    {
      "name": "productivity",
      "label": "Productivity",
      "icon": "<i class=\"fa-solid fa-brain\"></i>",
      "dashboardUrl": "memory-viewer.html"
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
