function showOnly(type) {
  document.getElementById('panel-json').classList.add('hidden');
  document.getElementById('panel-xml').classList.add('hidden');
  document.getElementById('btn-json').classList.remove('active');
  document.getElementById('btn-xml').classList.remove('active');
  document.getElementById('panel-' + type).classList.remove('hidden');
  document.getElementById('btn-' + type).classList.add('active');
}

function toggleFullScreen(id) {
  const element = document.getElementById(id);
  element.classList.toggle('full-screen');
  element.onclick = function(e) {
    if (e.target === element && element.classList.contains('full-screen')) {
      element.classList.remove('full-screen');
    }
  }
}

function copyInput(id) {
  navigator.clipboard.writeText(document.getElementById(id).value);
}

async function pasteInput(id) {
  const text = await navigator.clipboard.readText();
  document.getElementById(id).value = text;
}

function clearInput(id) {
  document.getElementById(id).value = '';
}

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');
  document.getElementById('themeToggle').textContent =
    document.body.classList.contains('light') ? '🌞 Light Mode' : '🌙 Dark Mode';
});

