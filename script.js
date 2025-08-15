/* -------------------------
   Show only one panel + save choice
------------------------- */
function showOnly(type) {
  const panels = ['json', 'xml', 'graph', 'base64', 'jwt', 'url', 'hash', 'uuid', 'color', 'timestamp', 'qr', 'regex', 'text', 'api', 'markdown'];
  const buttons = ['btn-json', 'btn-xml', 'btn-graph', 'btn-base64', 'btn-jwt', 'btn-url', 'btn-hash', 'btn-uuid', 'btn-color', 'btn-timestamp', 'btn-qr', 'btn-regex', 'btn-text', 'btn-api', 'btn-markdown'];
  
  // Hide all panels and deactivate all buttons
  panels.forEach(panel => {
    const element = document.getElementById(`panel-${panel}`);
    if (element) element.classList.add('hidden');
  });
  
  buttons.forEach(button => {
    const element = document.getElementById(button);
    if (element) element.classList.remove('active');
  });

  // Show selected panel and activate button
  const targetPanel = document.getElementById(`panel-${type}`);
  const targetButton = document.getElementById(`btn-${type}`);
  
  if (targetPanel) targetPanel.classList.remove('hidden');
  if (targetButton) targetButton.classList.add('active');

  // Restore saved inputs for the current panel
  restorePanelInputs(type);

  // Remember last opened panel
  localStorage.setItem('last-panel', type);
}

/* -------------------------
   Panel Input Restoration
------------------------- */
function restorePanelInputs(panelType) {
  // Define which inputs to restore for each panel
  const panelInputs = {
    json: ['json-io-input'],
    xml: ['xml-io-input'],
    graph: ['graph-input'],
    base64: ['base64-input'],
    jwt: ['jwt-input', 'jwt-secret'],
    url: ['url-input'],
    hash: ['hash-input', 'hash-algorithm'],
    uuid: ['uuid-input'],
    color: ['color-input', 'color-format'],
    timestamp: ['timestamp-input'],
    qr: ['qr-input', 'qr-size'],
    regex: ['regex-pattern', 'regex-flags', 'regex-input'],
    text: ['text-input', 'text-operation'],
    api: ['api-input', 'api-format'],
    markdown: ['markdown-input']
  };
  
  // Restore inputs for the current panel
  if (panelInputs[panelType]) {
    panelInputs[panelType].forEach(inputId => {
      const element = document.getElementById(inputId);
      if (element) {
        const savedValue = LocalStorage.loadInput(panelType, inputId);
        if (savedValue && savedValue !== element.value) {
          element.value = savedValue;
          
          // Trigger any associated processing for restored values
          if (inputId === 'color-input' && savedValue.trim()) {
            setTimeout(() => convertColor(), 50);
          } else if (inputId === 'uuid-input' && savedValue.trim()) {
            setTimeout(() => validateUUID(), 50);
          } else if (inputId === 'markdown-input' && savedValue.trim()) {
            setTimeout(() => previewMarkdown(), 50);
          } else if (inputId === 'timestamp-input' && savedValue.trim()) {
            setTimeout(() => convertTimestamp(), 50);
          } else if (inputId === 'text-input' && savedValue.trim()) {
            setTimeout(() => transformText(), 50);
          }
        }
      }
    });
  }
}

/* -------------------------
   Local Storage Management for Input Persistence
------------------------- */
const LocalStorage = {
  // Save input value to localStorage
  saveInput: function(panelType, inputId, value) {
    try {
      const key = `${panelType}-${inputId}`;
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  // Load input value from localStorage
  loadInput: function(panelType, inputId) {
    try {
      const key = `${panelType}-${inputId}`;
      return localStorage.getItem(key) || '';
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return '';
    }
  },

  // Clear input from localStorage
  clearInput: function(panelType, inputId) {
    try {
      const key = `${panelType}-${inputId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear from localStorage:', error);
    }
  },

  // Clear all data for a panel
  clearPanel: function(panelType) {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`${panelType}-`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear panel data:', error);
    }
  },

  // Get storage usage info
  getStorageInfo: function() {
    let totalSize = 0;
    let itemCount = 0;
    
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
          itemCount++;
        }
      }
      
      return {
        totalSize: Math.round(totalSize / 1024 * 100) / 100, // KB
        itemCount: itemCount,
        available: 5120 - Math.round(totalSize / 1024) // Approximate 5MB limit
      };
    } catch (error) {
      return { totalSize: 0, itemCount: 0, available: 5120 };
    }
  }
};

/* -------------------------
   Full Screen Toggle
------------------------- */
function toggleFullScreen(id) {
  const element = document.getElementById(id);
  element.classList.toggle('full-screen');

  // Allow clicking anywhere OUTSIDE content to exit full screen
  element.onclick = function(e) {
    if (element.classList.contains('full-screen') && e.target === element) {
      element.classList.remove('full-screen');
    }
  }
}

/* -------------------------
   Copy / Paste / Clear
------------------------- */
function copyInput(id) {
  const value = document.getElementById(id).value;
  navigator.clipboard.writeText(value).catch(err => {
    console.error("Copy failed: ", err);
  });
}

async function pasteInput(id) {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById(id).value = text;
    localStorage.setItem(id, text); // store after pasting
  } catch (err) {
    console.error("Paste failed: ", err);
  }
}

function clearInput(id) {
  document.getElementById(id).value = '';
  localStorage.removeItem(id); // remove from storage as well
}

/* -------------------------
   Theme Toggle + save choice
------------------------- */
document.getElementById('themeToggle').addEventListener('click', () => {
  // Toggle theme classes on body
  if (document.body.classList.contains('light')) {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    localStorage.setItem('theme-mode', 'dark');
  } else {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('theme-mode', 'light');
  }
});

/* -------------------------
   Restore everything on load
------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved theme. Default to dark
  const savedTheme = localStorage.getItem('theme-mode') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  } else {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  }

  // Restore saved inputs
  const savedJSON = localStorage.getItem('json-input');
  const savedXML  = localStorage.getItem('xml-input');
  if (savedJSON) document.getElementById('json-input').value = savedJSON;
  if (savedXML)  document.getElementById('xml-input').value  = savedXML;

  document.getElementById('json-input').addEventListener('input', function() {
    localStorage.setItem('json-input', this.value);
  });

  document.getElementById('xml-input').addEventListener('input', function() {
    localStorage.setItem('xml-input', this.value);
  });

  // Restore last opened panel (default to JSON)
  const savedPanel = localStorage.getItem('last-panel') || 'json';
  showOnly(savedPanel);
});

/* -------------------------
   Optional Clear All Storage
------------------------- */
function clearAllSavedData() {
  localStorage.removeItem('json-input');
  localStorage.removeItem('xml-input');
  localStorage.removeItem('last-panel');
  localStorage.removeItem('theme-mode');
  document.getElementById('json-input').value = '';
  document.getElementById('xml-input').value  = '';
  // Reset to default panel and theme
  showOnly('json');
  document.body.classList.remove('light');
  document.body.classList.add('dark');
}
