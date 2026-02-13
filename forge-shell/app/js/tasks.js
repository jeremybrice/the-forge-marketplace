/* ═══════════════════════════════════════════════════════════════
   Tasks View Controller
   Folder-based task management with Board/List views inside #view-tasks.
   Uses ForgeUtils.FS for file access, ForgeUtils.Toast for
   notifications.
   ═══════════════════════════════════════════════════════════════ */

window.TasksView = (function () {
  'use strict';

  const esc = ForgeUtils.escapeHTML;

  /* ══════════════════════════════════════════════════════════
     State
     ══════════════════════════════════════════════════════════ */
  let rootHandle = null;
  let initialized = false;

  /* Tasks state */
  let tasksDirHandle = null;
  let tasks = [];
  let hasChanges = false;
  let currentView = 'board';      // 'board' | 'list'
  let saveTimeout = null;
  let taskWatchInterval = null;
  let isSaving = false;
  let taskRefreshRunning = false;
  let taskSignature = '';

  /* ══════════════════════════════════════════════════════════
     DOM helpers — all queries scoped to #view-tasks
     ══════════════════════════════════════════════════════════ */
  function $(sel) {
    return document.querySelector('#view-tasks ' + sel);
  }

  function $$(sel) {
    return document.querySelectorAll('#view-tasks ' + sel);
  }

  /* ══════════════════════════════════════════════════════════
     Status Bar (local toast-style within view)
     ══════════════════════════════════════════════════════════ */
  function showStatus(msg) {
    var el = $('[data-ref="status-bar"]');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('prod-visible');
    setTimeout(function () { el.classList.remove('prod-visible'); }, 2000);
  }

  /* ══════════════════════════════════════════════════════════
     Scaffold — build initial DOM inside #view-tasks
     ══════════════════════════════════════════════════════════ */
  function scaffold() {
    var view = document.getElementById('view-tasks');
    view.innerHTML =
      '<div class="prod-layout">' +
        /* Toolbar */
        '<div class="plugin-toolbar">' +
          '<span class="toolbar-title"><i class="fa-solid fa-list-check"></i> Tasks</span>' +
          '<div class="folder-path hidden" data-ref="folder-path">' +
            '<i class="fa-solid fa-folder-open"></i>' +
            '<span data-ref="folder-name"></span>' +
          '</div>' +
          '<div class="view-toggle" data-ref="task-view-toggle">' +
            '<button class="active" data-task-view="board">Board</button>' +
            '<button data-task-view="list">List</button>' +
          '</div>' +
          '<span class="spacer"></span>' +
          '<span class="refresh-indicator" data-ref="refresh-indicator"></span>' +
          '<button class="btn-icon" data-action="refresh" title="Refresh"><i class="fa-solid fa-rotate"></i></button>' +
        '</div>' +

        /* Tasks Panel */
        '<div class="prod-tab-panel prod-active" data-ref="tasks-panel">' +
          '<div class="prod-board" data-ref="board"></div>' +
          '<div class="prod-list-view" data-ref="list-view" style="display:none;"></div>' +
        '</div>' +

        /* Status bar */
        '<div class="prod-status-bar" data-ref="status-bar"></div>' +
      '</div>';

    bindToolbarEvents();
  }

  /* ══════════════════════════════════════════════════════════
     Event Binding
     ══════════════════════════════════════════════════════════ */
  function bindToolbarEvents() {
    var view = document.getElementById('view-tasks');

    view.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.dataset.action;

      if (action === 'refresh') handleRefresh();
    });

    /* Task view toggle */
    view.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-task-view]');
      if (!btn) return;
      switchTaskView(btn.dataset.taskView);
    });
  }

  /* ══════════════════════════════════════════════════════════
     View Switching
     ══════════════════════════════════════════════════════════ */
  function switchTaskView(view) {
    currentView = view;
    var boardEl = $('[data-ref="board"]');
    var listEl = $('[data-ref="list-view"]');
    if (view === 'list') {
      listEl.style.display = 'block';
      boardEl.style.display = 'none';
    } else {
      listEl.style.display = 'none';
      boardEl.style.display = 'flex';
    }
    $$('[data-task-view]').forEach(function (b) {
      b.classList.toggle('active', b.dataset.taskView === view);
    });
    renderTasks();
  }

  function updateFolderBadge() {
    var pathEl = $('[data-ref="folder-path"]');
    var nameEl = $('[data-ref="folder-name"]');
    if (tasksDirHandle) {
      nameEl.textContent = typeof tasksDirHandle === 'string'
        ? tasksDirHandle.split('/').pop() || tasksDirHandle.split('\\').pop() || tasksDirHandle
        : 'tasks';
      pathEl.classList.remove('hidden');
    } else {
      pathEl.classList.add('hidden');
    }
  }

  /* ══════════════════════════════════════════════════════════
     YAML Parser (simple key-value parser)
     ══════════════════════════════════════════════════════════ */
  function parseYAML(yamlStr) {
    var result = {};
    var lines = yamlStr.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      var colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;

      var key = line.substring(0, colonIdx).trim();
      var value = line.substring(colonIdx + 1).trim();

      // Handle null
      if (value === 'null' || value === '~' || value === '') {
        result[key] = null;
      }
      // Handle arrays (simple bracket notation)
      else if (value.startsWith('[') && value.endsWith(']')) {
        var inner = value.substring(1, value.length - 1).trim();
        if (inner === '') {
          result[key] = [];
        } else {
          result[key] = inner.split(',').map(function (v) { return v.trim(); });
        }
      }
      // Handle strings
      else {
        result[key] = value;
      }
    }
    return result;
  }

  /* ══════════════════════════════════════════════════════════
     Task File Parser & Serializer
     ══════════════════════════════════════════════════════════ */
  async function parseTaskFiles() {
    if (!tasksDirHandle) return [];

    var resultTasks = [];

    try {
      var entries = await ForgeFS.readDir(tasksDirHandle, '.');

      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];

        if (entry.kind === 'file' && /^task-\d{3}-.*\.md$/.test(entry.name)) {
          try {
            var content = await ForgeFS.readFile(tasksDirHandle, entry.name);
            var task = parseTaskFile(entry.name, content);
            if (task) resultTasks.push(task);
          } catch (e) {
            console.warn('Failed to parse task file:', entry.name, e);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to read tasks directory:', e);
    }

    // Sort by filename (task number)
    resultTasks.sort(function (a, b) {
      return a.filename.localeCompare(b.filename);
    });

    return resultTasks;
  }

  function parseTaskFile(filename, content) {
    var parts = content.split('---\n');
    if (parts.length < 3) return null;

    var yamlStr = parts[1];
    var body = parts.slice(2).join('---\n').trim();

    var frontmatter = parseYAML(yamlStr);

    return {
      filename: filename,
      title: frontmatter.title || '',
      status: frontmatter.status || 'active',
      priority: frontmatter.priority || 'Medium',
      assignee: frontmatter.assignee || null,
      tags: frontmatter.tags || [],
      created: frontmatter.created || '',
      updated: frontmatter.updated || '',
      body: body
    };
  }

  function serializeTaskFile(task) {
    var yaml = '---\n';
    yaml += 'title: ' + task.title + '\n';
    yaml += 'status: ' + task.status + '\n';
    yaml += 'priority: ' + task.priority + '\n';
    yaml += 'assignee: ' + (task.assignee || 'null') + '\n';

    if (task.tags && task.tags.length > 0) {
      yaml += 'tags: [' + task.tags.join(', ') + ']\n';
    } else {
      yaml += 'tags: []\n';
    }

    yaml += 'created: ' + task.created + '\n';
    yaml += 'updated: ' + task.updated + '\n';
    yaml += '---\n\n';

    return yaml + (task.body || '');
  }

  /* ══════════════════════════════════════════════════════════
     Auto-Save & File Watching (Tasks)
     ══════════════════════════════════════════════════════════ */
  function markChanged(task) {
    hasChanges = true;
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(function () { autoSave(task); }, 500);
  }

  async function autoSave(task) {
    if (!tasksDirHandle || !hasChanges || isSaving) return;
    isSaving = true;
    try {
      // Update the updated date
      task.updated = new Date().toISOString().split('T')[0];

      var content = serializeTaskFile(task);
      await ForgeFS.writeFile(tasksDirHandle, task.filename, content);

      hasChanges = false;
      showStatus('Saved');
    } catch (e) {
      showStatus('Save failed: ' + e.message);
    }
    isSaving = false;
  }

  async function buildTaskSignature() {
    if (!tasksDirHandle) return '';

    var entries = [];
    try {
      var files = await ForgeFS.readDir(tasksDirHandle, '.');

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.kind === 'file' && /^task-\d{3}-.*\.md$/.test(file.name)) {
          try {
            var meta = await ForgeFS.getFileMeta(tasksDirHandle, file.name);
            entries.push(file.name + ':' + meta.modified);
          } catch (e) { /* skip */ }
        }
      }
    } catch (e) { /* skip */ }

    entries.sort();
    return entries.join('|');
  }

  async function checkForExternalChanges() {
    if (!tasksDirHandle || hasChanges || isSaving || taskRefreshRunning) return;
    taskRefreshRunning = true;
    try {
      var newSignature = await buildTaskSignature();
      if (newSignature !== taskSignature) {
        taskSignature = newSignature;
        tasks = await parseTaskFiles();
        renderTasks();
      }
    } catch (e) {
      /* ignore */
    } finally {
      taskRefreshRunning = false;
    }
  }

  function startTaskWatching() {
    stopTaskWatching();
    taskWatchInterval = setInterval(checkForExternalChanges, 5000);
  }

  function stopTaskWatching() {
    if (taskWatchInterval) { clearInterval(taskWatchInterval); taskWatchInterval = null; }
  }

  /* ══════════════════════════════════════════════════════════
     Refresh Handler
     ══════════════════════════════════════════════════════════ */
  async function handleRefresh() {
    await checkForExternalChanges();
    showStatus('Tasks refreshed');
    var indicator = $('[data-ref="refresh-indicator"]');
    if (indicator) {
      var now = new Date();
      indicator.textContent = 'Refreshed · ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  }

  /* ══════════════════════════════════════════════════════════
     Render Tasks — dispatches to board or list
     ══════════════════════════════════════════════════════════ */
  function renderTasks() {
    if (currentView === 'board') renderBoard();
    else renderList();
  }

  /* ══════════════════════════════════════════════════════════
     Board View Renderer
     ══════════════════════════════════════════════════════════ */
  function renderBoard() {
    var board = $('[data-ref="board"]');
    if (!board) return;
    board.innerHTML = '';

    if (!tasksDirHandle) {
      board.innerHTML =
        '<div class="prod-not-active" style="width:100%;">' +
          '<div class="prod-state-icon"><i class="fa-solid fa-list-check"></i></div>' +
          '<h2>No tasks directory found</h2>' +
          '<p>The <code>tasks/</code> directory was not found in your project root.</p>' +
        '</div>';
      return;
    }

    // Group tasks by status
    var statuses = ['active', 'waiting', 'someday', 'done'];
    var statusLabels = {
      'active': 'Active',
      'waiting': 'Waiting On',
      'someday': 'Someday',
      'done': 'Done'
    };
    var statusIcons = {
      'active': 'fa-regular fa-square-caret-right',
      'waiting': 'fa-regular fa-circle-pause',
      'someday': 'fa-regular fa-calendar',
      'done': 'fa-regular fa-square-check'
    };
    var tasksByStatus = {};
    statuses.forEach(function (status) { tasksByStatus[status] = []; });

    tasks.forEach(function (task) {
      var status = task.status || 'active';
      if (!tasksByStatus[status]) tasksByStatus[status] = [];
      tasksByStatus[status].push(task);
    });

    statuses.forEach(function (status) {
      var statusTasks = tasksByStatus[status] || [];
      board.appendChild(createColumn(status, statusLabels[status], statusIcons[status], statusTasks));
    });
  }

  function createColumn(colId, label, icon, items) {
    var col = document.createElement('div');
    col.className = 'prod-column';
    col.innerHTML =
      '<div class="prod-column-header">' +
        '<span class="prod-column-title" data-status="' + esc(colId) + '"><i class="' + icon + '"></i> ' + esc(label) + '</span>' +
        '<span class="prod-count">' + items.length + '</span>' +
      '</div>' +
      '<div class="prod-cards" data-column="' + esc(colId) + '"></div>' +
      '<div class="prod-add-card"><button data-add="' + esc(colId) + '">+ Add task</button></div>';

    /* Populate cards */
    var cardsContainer = col.querySelector('.prod-cards');
    items.forEach(function (task) { cardsContainer.appendChild(createCard(task)); });

    /* Card drag-and-drop into column */
    var getDropPosition = function (e) {
      var allCards = Array.from(cardsContainer.querySelectorAll('.prod-task-card'));
      var visibleCards = allCards.filter(function (c) { return !c.classList.contains('prod-dragging'); });
      var insertBeforeCard = null;
      var dropIndex = visibleCards.length;
      for (var i = 0; i < visibleCards.length; i++) {
        var rect = visibleCards[i].getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
          insertBeforeCard = visibleCards[i];
          dropIndex = i;
          break;
        }
      }
      return { insertBeforeCard: insertBeforeCard, dropIndex: dropIndex };
    };

    var showDropIndicator = function (e) {
      col.querySelectorAll('.prod-drop-indicator').forEach(function (el) { el.remove(); });
      var pos = getDropPosition(e);
      var indicator = document.createElement('div');
      indicator.className = 'prod-drop-indicator';
      if (pos.insertBeforeCard) cardsContainer.insertBefore(indicator, pos.insertBeforeCard);
      else cardsContainer.appendChild(indicator);
    };

    col.addEventListener('dragover', function (e) {
      e.preventDefault();
      cardsContainer.classList.add('prod-drag-over');
      showDropIndicator(e);
    });

    col.addEventListener('dragleave', function (e) {
      if (!col.contains(e.relatedTarget)) {
        cardsContainer.classList.remove('prod-drag-over');
        col.querySelectorAll('.prod-drop-indicator').forEach(function (el) { el.remove(); });
      }
    });

    col.addEventListener('drop', function (e) {
      e.preventDefault();
      cardsContainer.classList.remove('prod-drag-over');
      col.querySelectorAll('.prod-drop-indicator').forEach(function (el) { el.remove(); });
      var taskFilename = e.dataTransfer.getData('text/plain');
      if (!taskFilename) return;
      moveTaskToStatus(taskFilename, colId);
    });

    /* Add task button */
    col.querySelector('[data-add="' + colId + '"]').addEventListener('click', function () {
      addNewTask(colId);
    });

    return col;
  }

  /* ══════════════════════════════════════════════════════════
     Task Card (Board)
     ══════════════════════════════════════════════════════════ */
  function createCard(task) {
    var card = document.createElement('div');
    card.className = 'prod-task-card';
    card.draggable = true;
    card.dataset.filename = task.filename;

    var priorityColor = task.priority === 'High' ? '#e74c3c' : task.priority === 'Low' ? '#95a5a6' : '#f39c12';

    var html =
      '<button class="prod-delete-btn" data-action="delete" title="Delete">&times;</button>' +
      '<div style="display:flex;align-items:flex-start;gap:12px;">' +
        '<span class="prod-priority-indicator" style="background:' + priorityColor + ';"></span>' +
        '<div class="prod-card-title" data-action="edit-title">' + esc(task.title) + '</div>' +
      '</div>';

    if (task.assignee) {
      html += '<div class="prod-card-note" style="margin-left:30px;">👤 ' + esc(task.assignee) + '</div>';
    }

    if (task.tags && task.tags.length > 0) {
      html += '<div class="prod-card-tags" style="margin-left:30px;">';
      task.tags.forEach(function (tag) {
        html += '<span class="prod-tag">' + esc(tag) + '</span>';
      });
      html += '</div>';
    }

    card.innerHTML = html;

    card.addEventListener('dragstart', function (e) {
      card.classList.add('prod-dragging');
      e.dataTransfer.setData('text/plain', task.filename);
    });

    card.addEventListener('dragend', function () {
      card.classList.remove('prod-dragging');
    });

    card.addEventListener('click', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;
      var action = target.dataset.action;
      if (action === 'edit-title') {
        startInlineEdit(target, task.title, function (val) {
          if (val && val !== task.title) { task.title = val; markChanged(task); }
          renderTasks();
        });
      } else if (action === 'delete') {
        deleteTask(task);
      }
    });

    return card;
  }

  /* ══════════════════════════════════════════════════════════
     Inline Editing Helper
     ══════════════════════════════════════════════════════════ */
  function startInlineEdit(el, value, callback, placeholder) {
    var input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    if (placeholder) input.placeholder = placeholder;
    input.style.cssText = 'width:100%;background:var(--bg-card);border:2px solid var(--accent);border-radius:6px;padding:4px 8px;color:var(--text-primary);font-size:13px;font-family:inherit;outline:none;';

    el.replaceWith(input);
    input.focus();
    if (value) input.select();

    var saved = false;
    var finish = function () {
      if (saved) return;
      saved = true;
      callback(input.value.trim());
    };

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); finish(); }
      else if (e.key === 'Escape') { saved = true; renderTasks(); }
    });
    input.addEventListener('blur', finish);
  }

  /* ══════════════════════════════════════════════════════════
     Add Task / Move / Delete
     ══════════════════════════════════════════════════════════ */
  async function addNewTask(status) {
    if (!tasksDirHandle) return;

    // Find next task number
    var maxNum = 0;
    tasks.forEach(function (t) {
      var match = t.filename.match(/^task-(\d{3})-/);
      if (match) {
        var num = parseInt(match[1]);
        if (num > maxNum) maxNum = num;
      }
    });

    var newNum = maxNum + 1;
    var newFilename = 'task-' + String(newNum).padStart(3, '0') + '-new-task.md';
    var today = new Date().toISOString().split('T')[0];

    var newTask = {
      filename: newFilename,
      title: 'New Task',
      status: status,
      priority: 'Medium',
      assignee: null,
      tags: [],
      created: today,
      updated: today,
      body: ''
    };

    try {
      var content = serializeTaskFile(newTask);
      await ForgeFS.writeFile(tasksDirHandle, newFilename, content);
      tasks.push(newTask);
      taskSignature = await buildTaskSignature();
      renderTasks();
      showStatus('Task created');
    } catch (e) {
      showStatus('Error creating task: ' + e.message);
    }
  }

  async function moveTaskToStatus(filename, newStatus) {
    var task = tasks.find(function (t) { return t.filename === filename; });
    if (!task) return;

    task.status = newStatus;
    markChanged(task);
    renderTasks();
  }

  async function deleteTask(task) {
    if (!confirm('Delete "' + task.title + '"?')) return;

    try {
      await ForgeFS.deleteFile(tasksDirHandle, task.filename);
      var idx = tasks.findIndex(function (t) { return t.filename === task.filename; });
      if (idx !== -1) tasks.splice(idx, 1);
      taskSignature = await buildTaskSignature();
      renderTasks();
      showStatus('Task deleted');
    } catch (e) {
      showStatus('Error deleting task: ' + e.message);
    }
  }

  /* ══════════════════════════════════════════════════════════
     List View Renderer
     ══════════════════════════════════════════════════════════ */
  function renderList() {
    var listEl = $('[data-ref="list-view"]');
    if (!listEl) return;
    listEl.innerHTML = '';

    if (!tasksDirHandle) {
      listEl.innerHTML =
        '<div class="prod-not-active">' +
          '<div class="prod-state-icon"><i class="fa-solid fa-list-check"></i></div>' +
          '<h2>No tasks directory found</h2>' +
          '<p>The <code>tasks/</code> directory was not found in your project root.</p>' +
        '</div>';
      return;
    }

    // Group tasks by status
    var statuses = ['active', 'waiting', 'someday', 'done'];
    var statusLabels = {
      'active': 'Active',
      'waiting': 'Waiting On',
      'someday': 'Someday',
      'done': 'Done'
    };
    var statusIcons = {
      'active': 'fa-regular fa-square-caret-right',
      'waiting': 'fa-regular fa-circle-pause',
      'someday': 'fa-regular fa-calendar',
      'done': 'fa-regular fa-square-check'
    };
    var tasksByStatus = {};
    statuses.forEach(function (status) { tasksByStatus[status] = []; });

    tasks.forEach(function (task) {
      var status = task.status || 'active';
      if (!tasksByStatus[status]) tasksByStatus[status] = [];
      tasksByStatus[status].push(task);
    });

    /* Sections */
    statuses.forEach(function (status) {
      var statusTasks = tasksByStatus[status] || [];
      var sectionEl = document.createElement('div');
      sectionEl.className = 'prod-list-section';
      sectionEl.dataset.status = status;

      var header = document.createElement('div');
      header.className = 'prod-list-section-header';
      header.innerHTML =
        '<span class="prod-section-title"><i class="' + statusIcons[status] + '"></i> ' + esc(statusLabels[status]) + '</span>' +
        '<span class="prod-count">' + statusTasks.length + '</span>';

      sectionEl.appendChild(header);

      var tasksContainer = document.createElement('div');
      tasksContainer.className = 'prod-list-tasks-container';
      tasksContainer.dataset.status = status;

      statusTasks.forEach(function (task) {
        tasksContainer.appendChild(createListItem(task));
      });

      sectionEl.appendChild(tasksContainer);

      /* Drag target for list items */
      var getDropPos = function (e) {
        var items = Array.from(tasksContainer.querySelectorAll('.prod-list-item:not(.prod-dragging)'));
        var insertBefore = null;
        var dropIndex = items.length;
        for (var i = 0; i < items.length; i++) {
          var rect = items[i].getBoundingClientRect();
          if (e.clientY < rect.top + rect.height / 2) {
            insertBefore = items[i];
            dropIndex = i;
            break;
          }
        }
        return { insertBefore: insertBefore, dropIndex: dropIndex };
      };

      sectionEl.addEventListener('dragover', function (e) {
        e.preventDefault();
        sectionEl.classList.add('prod-drag-over');
        tasksContainer.querySelectorAll('.prod-list-drop-indicator').forEach(function (el) { el.remove(); });
        var pos = getDropPos(e);
        var indicator = document.createElement('div');
        indicator.className = 'prod-list-drop-indicator';
        if (pos.insertBefore) tasksContainer.insertBefore(indicator, pos.insertBefore);
        else tasksContainer.appendChild(indicator);
      });

      sectionEl.addEventListener('dragleave', function (e) {
        if (!sectionEl.contains(e.relatedTarget)) {
          sectionEl.classList.remove('prod-drag-over');
          tasksContainer.querySelectorAll('.prod-list-drop-indicator').forEach(function (el) { el.remove(); });
        }
      });

      sectionEl.addEventListener('drop', function (e) {
        e.preventDefault();
        sectionEl.classList.remove('prod-drag-over');
        tasksContainer.querySelectorAll('.prod-list-drop-indicator').forEach(function (el) { el.remove(); });
        var taskFilename = e.dataTransfer.getData('text/plain');
        if (!taskFilename) return;
        moveTaskToStatus(taskFilename, status);
      });

      listEl.appendChild(sectionEl);
    });
  }

  function createListItem(task) {
    var item = document.createElement('div');
    item.className = 'prod-list-item';
    item.draggable = true;
    item.dataset.filename = task.filename;

    item.addEventListener('dragstart', function (e) {
      item.classList.add('prod-dragging');
      e.dataTransfer.setData('text/plain', task.filename);
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', function () {
      item.classList.remove('prod-dragging');
      $$('.prod-list-drop-indicator').forEach(function (el) { el.remove(); });
      $$('.prod-list-section.prod-drag-over').forEach(function (el) { el.classList.remove('prod-drag-over'); });
    });

    var priorityColor = task.priority === 'High' ? '#e74c3c' : task.priority === 'Low' ? '#95a5a6' : '#f39c12';
    var priorityDot = document.createElement('span');
    priorityDot.className = 'prod-priority-indicator';
    priorityDot.style.cssText = 'background:' + priorityColor + ';width:12px;height:12px;border-radius:50%;min-width:12px;';

    var content = document.createElement('div');
    content.className = 'prod-list-item-content';

    var titleEl = document.createElement('div');
    titleEl.className = 'prod-list-item-title';
    titleEl.textContent = task.title;
    titleEl.addEventListener('click', function (e) {
      e.stopPropagation();
      startInlineEdit(titleEl, task.title, function (val) {
        if (val && val !== task.title) { task.title = val; markChanged(task); }
        renderTasks();
      });
    });
    content.appendChild(titleEl);

    if (task.assignee) {
      var assigneeEl = document.createElement('div');
      assigneeEl.className = 'prod-list-item-note';
      assigneeEl.textContent = '👤 ' + task.assignee;
      content.appendChild(assigneeEl);
    }

    if (task.tags && task.tags.length > 0) {
      var tagsEl = document.createElement('div');
      tagsEl.className = 'prod-card-tags';
      task.tags.forEach(function (tag) {
        var tagSpan = document.createElement('span');
        tagSpan.className = 'prod-tag';
        tagSpan.textContent = tag;
        tagsEl.appendChild(tagSpan);
      });
      content.appendChild(tagsEl);
    }

    var actions = document.createElement('div');
    actions.className = 'prod-list-item-actions';
    actions.innerHTML = '<button title="Delete task">&times;</button>';
    actions.querySelector('button').addEventListener('click', function (e) {
      e.stopPropagation();
      deleteTask(task);
    });

    item.appendChild(priorityDot);
    item.appendChild(content);
    item.appendChild(actions);
    return item;
  }

  /* ══════════════════════════════════════════════════════════
     Public API — init / destroy / refresh
     ══════════════════════════════════════════════════════════ */
  async function init(handle) {
    rootHandle = handle;

    if (!initialized) {
      scaffold();
      initialized = true;
    }

    /* Reset state */
    tasksDirHandle = null;
    tasks = [];
    hasChanges = false;

    /* Reset UI */
    currentView = 'board';
    switchTaskView('board');

    if (!rootHandle) {
      renderTasks();
      return;
    }

    /* Try loading tasks/ directory */
    try {
      var tasksPath = typeof rootHandle === 'string'
        ? rootHandle + '/tasks'
        : 'tasks';

      // Check if tasks directory exists
      var entries = await ForgeFS.readDir(rootHandle, 'tasks');

      tasksDirHandle = tasksPath;
      tasks = await parseTaskFiles();
      taskSignature = await buildTaskSignature();
      updateFolderBadge();
      renderTasks();
      startTaskWatching();
    } catch (e) {
      /* tasks/ directory does not exist — that's OK */
      renderTasks();
    }
  }

  function destroy() {
    stopTaskWatching();
    if (saveTimeout) { clearTimeout(saveTimeout); saveTimeout = null; }
  }

  async function refresh() {
    await handleRefresh();
  }

  return {
    init: init,
    destroy: destroy,
    refresh: refresh
  };
})();

Shell.registerController('tasks', window.TasksView);
