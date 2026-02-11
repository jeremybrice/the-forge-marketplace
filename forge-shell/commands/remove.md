---
name: remove
description: Remove a plugin from the Forge Shell sidebar
arguments:
  - name: plugin-name
    description: Name of the plugin to remove
    required: true
---

# /shell:remove <plugin-name>

Remove a plugin dashboard from the Forge Shell.

## Steps

1. Read `src/shell-registry.json` from the work folder. If it doesn't exist, report that no plugins are registered.

2. Find the entry whose `name` matches `<plugin-name>`.
   - If not found, report an error listing currently registered plugins.

3. Delete the copied dashboard file at `src/<entry.dashboardUrl>`.

4. Remove the entry from the `plugins` array.

5. Write the updated `src/shell-registry.json`.

6. Confirm: "Removed **<plugin-name>** from Forge Shell. Run `/shell:open` to refresh."
