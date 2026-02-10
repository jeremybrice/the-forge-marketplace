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

1. Read `shell-registry.json` from the **work folder root** (the user's project directory). If it doesn't exist, report that no plugins are registered.

2. Find and remove the entry whose `name` matches `<plugin-name>`.
   - If not found, report an error listing currently registered plugins.

3. Write the updated `shell-registry.json` to the **work folder root**.

4. Confirm: "Removed **<plugin-name>** from Forge Shell. Run `/shell:open` to refresh."
