---
name: add
description: Register a plugin in the Forge Shell sidebar
arguments:
  - name: plugin-name
    description: Name of the plugin to add (must exist in marketplace.json and have a dashboard.json file)
    required: true
---

# /shell:add <plugin-name>

Register a plugin dashboard in the Forge Shell by copying its HTML into the project's `src/` folder.

## Steps

1. Read `../.claude-plugin/marketplace.json` and find the plugin entry matching `<plugin-name>`.
   - If not found, report an error listing available plugin names.

2. Read `../<plugin-name>/dashboard.json` and verify it contains `path`, `label`, `icon`, and `targetName` fields.
   - If `dashboard.json` doesn't exist or is missing required fields, report an error explaining the plugin has no dashboard configured.

3. Create the `src/` directory in the work folder if it doesn't already exist.

4. Copy `shell.html` into `src/`: read `../forge-shell/shell.html` and write it to `src/shell.html`. Always overwrite to ensure the latest version is deployed.

5. Copy the plugin dashboard: read `../<plugin-name>/<dashboard.path>` and write it to `src/<dashboard.targetName>`. Always overwrite to support updates.

6. Read `src/shell-registry.json`. If it doesn't exist, initialize it with `{"plugins": []}`.
   - If the plugin is already registered (by name), report "Already registered — dashboard file refreshed." and stop.

7. Append a new entry to the `plugins` array:
   ```json
   {
     "name": "<plugin-name>",
     "label": "<from dashboard.label>",
     "icon": "<from dashboard.icon>",
     "dashboardUrl": "<from dashboard.targetName>"
   }
   ```
   The `dashboardUrl` is just the filename since all dashboards are siblings in `src/`.

8. Write the updated `src/shell-registry.json`.

9. Confirm: "Added **\<label>** (\<icon>) to Forge Shell. Run `/shell:open` to view."
