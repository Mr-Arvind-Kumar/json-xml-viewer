// Collapse all JSON nodes
function collapseAllJSON() {
  document.querySelectorAll('#json-output .collapse').forEach(el => {
    el.classList.add('collapsed');
  });
}

// Expand all JSON nodes
function expandAllJSON() {
  document.querySelectorAll('#json-output .collapse').forEach(el => {
    el.classList.remove('collapsed');
  });
}
// Remove all spaces from a given input area
function removeSpaces(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.value = el.value.replace(/\s+/g, '');
  // Store updated value in localStorage
  try {
    localStorage.setItem(inputId, el.value);
  } catch (e) {}
}
// Convert JSON to XML and put result in XML input
function convertJSONtoXML() {
  const jsonInput = document.getElementById('json-input').value.trim();
  let xml = '';
  try {
    const obj = JSON.parse(jsonInput);
    xml = jsonToXml(obj, 'root');
    document.getElementById('xml-input').value = formatXml(xml);
    // Optionally switch to XML panel
    showOnly('xml');
  } catch (e) {
    alert('Invalid JSON: ' + e.message);
  }
}

// Helper: Convert JS object to XML string
function jsonToXml(obj, nodeName) {
  if (typeof obj !== 'object' || obj === null) {
    return `<${nodeName}>${escapeXml(String(obj))}</${nodeName}>`;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => jsonToXml(item, nodeName)).join('');
  }
  let xml = `<${nodeName}`;
  let children = '';
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      children += jsonToXml(obj[key], key);
    } else {
      children += `<${key}>${escapeXml(String(obj[key]))}</${key}>`;
    }
  }
  xml += `>${children}</${nodeName}>`;
  return xml;
}

function escapeXml(str) {
  return str.replace(/[<>&"']/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&#39;';
    }
  });
}

// Pretty print XML
function formatXml(xml) {
  let formatted = '', indent = '';
  xml.split(/\r?\n/).join('').replace(/(>)(<)(\/*)/g, '$1\n$2$3').split('\n').forEach(function(node) {
    let match = node.match(/^(\s*)<\/?\w/);
    if (match) {
      if (node.match(/^<\//)) indent = indent.substring(2);
      formatted += indent + node + '\n';
      if (node.match(/^<[^!?/]/) && !node.match(/\/>$/)) indent += '  ';
    } else {
      formatted += indent + node + '\n';
    }
  });
  return formatted.trim();
}
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

