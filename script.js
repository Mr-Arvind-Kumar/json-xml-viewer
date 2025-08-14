/* -------------------------
   Show only one panel + save choice
------------------------- */
function showOnly(type) {
  document.getElementById('panel-json').classList.add('hidden');
  document.getElementById('panel-xml').classList.add('hidden');
  document.getElementById('btn-json').classList.remove('active');
  document.getElementById('btn-xml').classList.remove('active');

  document.getElementById(`panel-${type}`).classList.remove('hidden');
  document.getElementById(`btn-${type}`).classList.add('active');

  // Remember last opened panel
  localStorage.setItem('last-panel', type);
}

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
