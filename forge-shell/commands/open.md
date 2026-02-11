---
name: open
description: Open the Forge Shell in a browser
---

# /shell:open

Open the Forge Shell in the default browser.

## Steps

1. Check if `src/shell.html` exists in the work folder.
   - If not found, tell the user: "No shell found. Run `/shell:add <plugin-name>` first to set up the `src/` folder."

2. **Do NOT** attempt to open the file via bash commands (`open`, `xdg-open`, `start`, etc.) or any browser automation. These fail in many environments and cause unnecessary errors.

3. Provide the user with a clickable link to the file so they can open it themselves:
   - Example: "Open Forge Shell: [src/shell.html](src/shell.html)"

4. Follow up with: "If opening from a file browser, select the `src/` folder when prompted."
