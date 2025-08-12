function beautifyJSON() {
  const input = document.getElementById('json-input').value;
  const output = document.getElementById('json-output');
  try {
    const obj = JSON.parse(input);
    output.innerHTML = jsonToTree(obj);
    makeCollapsible(output);
  } catch (e) {
    output.textContent = 'Invalid JSON: ' + e.message;
  }
}

function openFullJSONModal() {
  const input = document.getElementById('json-input').value;
  const modal = document.getElementById('jsonModal');
  const content = document.getElementById('json-modal-content');
  try {
    const obj = JSON.parse(input);
    content.textContent = JSON.stringify(obj, null, 2);
  } catch (e) {
    content.textContent = 'Invalid JSON: ' + e.message;
  }
  modal.style.display = 'block';
}

function closeFullJSONModal() {
  document.getElementById('jsonModal').style.display = 'none';
}

window.addEventListener('keydown', (e) => {
  if (e.key === "Escape") closeFullJSONModal();
});
window.addEventListener('click', (e) => {
  if (e.target.id === 'jsonModal') closeFullJSONModal();
});

function jsonToTree(obj) {
  if (typeof obj !== 'object' || obj === null) {
    let type = typeof obj;
    let cls = type === 'string' ? 'string' : 'number';
    return `<span class="${cls}">${JSON.stringify(obj)}</span>`;
  }
  let html = '<ul>';
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      html += `<li class="collapse"><span class="key">"${key}"</span>: ${jsonToTree(obj[key])}</li>`;
    } else {
      let type = typeof obj[key];
      let cls = type === 'string' ? 'string' : 'number';
      html += `<li><span class="key">"${key}"</span>: <span class="${cls}">${JSON.stringify(obj[key])}</span></li>`;
    }
  }
  html += '</ul>';
  return html;
}

function makeCollapsible(container) {
  container.querySelectorAll('.collapse').forEach(function(el) {
    el.classList.add('collapsed');
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      el.classList.toggle('collapsed');
    });
  });
}

