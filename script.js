/* -------------------------
   Show only one panel
------------------------- */
function showOnly(type) {
  document.getElementById('panel-json').classList.add('hidden');
  document.getElementById('panel-xml').classList.add('hidden');
  document.getElementById('btn-json').classList.remove('active');
  document.getElementById('btn-xml').classList.remove('active');

  document.getElementById(`panel-${type}`).classList.remove('hidden');
  document.getElementById(`btn-${type}`).classList.add('active');
}

/* -------------------------
   Full Screen Toggle
------------------------- */
function toggleFullScreen(id) {
  const element = document.getElementById(id);
  element.classList.toggle('full-screen');

  // Allow clicking anywhere OUTSIDE content to exit full screen
  element.onclick = function(e) {
    if (element.classList.contains('full-screen') &&
        e.target === element) {
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
   Theme Toggle
------------------------- */
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');

  document.getElementById('themeToggle').textContent =
    document.body.classList.contains('light')
      ? '🌞 Light Mode'
      : '🌙 Dark Mode';
});

/* -------------------------
   Local Storage Persistence
------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved inputs
  const savedJSON = localStorage.getItem('json-input');
  const savedXML  = localStorage.getItem('xml-input');

  if (savedJSON) document.getElementById('json-input').value = savedJSON;
  if (savedXML)  document.getElementById('xml-input').value  = savedXML;

  // Save JSON as user types
  document.getElementById('json-input').addEventListener('input', function() {
    localStorage.setItem('json-input', this.value);
  });

  // Save XML as user types
  document.getElementById('xml-input').addEventListener('input', function() {
    localStorage.setItem('xml-input', this.value);
  });
});

/* -------------------------
   Optional Clear All Storage
------------------------- */
function clearAllSavedData() {
  localStorage.removeItem('json-input');
  localStorage.removeItem('xml-input');
  document.getElementById('json-input').value = '';
  document.getElementById('xml-input').value  = '';
}
