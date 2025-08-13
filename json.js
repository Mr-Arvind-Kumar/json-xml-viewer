// Convert JSON to CSV and show in JSON output window
function convertJSONtoCSV() {
  const input = document.getElementById('json-input').value;
  const output = document.getElementById('json-output');
  try {
    const obj = JSON.parse(input);
    let csv = jsonToCSV(obj);
    output.innerHTML = `<pre style="white-space:pre;overflow:auto;">${escapeHtml(csv)}</pre>`;
  } catch (e) {
    output.textContent = 'Invalid JSON: ' + e.message;
  }
}

// Helper: Convert array of objects or single object to CSV string
function jsonToCSV(obj) {
  let arr = Array.isArray(obj) ? obj : [obj];
  if (!arr.length || typeof arr[0] !== 'object') return '';
  // Collect all unique keys
  const keys = Array.from(arr.reduce((set, row) => {
    Object.keys(row).forEach(k => set.add(k));
    return set;
  }, new Set()));
  // Header
  const header = keys.join(',');
  // Rows
  const rows = arr.map(row => keys.map(k => csvEscape(flattenValue(row[k]))).join(','));
  return [header, ...rows].join('\n');
}

// Helper: Flatten nested objects/arrays to JSON string, otherwise return as is
function flattenValue(val) {
  if (val == null) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return val;
}

function csvEscape(val) {
  if (val == null) return '';
  let str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
// Collapse all JSON nodes
function collapseAllJSON() {
  document.querySelectorAll('#json-output .collapse').forEach(el => {
    el.classList.add('collapsed');
    const arrow = el.querySelector('.json-arrow');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  });
}

// Expand all JSON nodes
function expandAllJSON() {
  document.querySelectorAll('#json-output .collapse').forEach(el => {
    el.classList.remove('collapsed');
    const arrow = el.querySelector('.json-arrow');
    if (arrow) arrow.style.transform = 'rotate(90deg)';
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
window.convertJSONtoCSV = convertJSONtoCSV;
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
window.beautifyJSON = beautifyJSON;
function beautifyJSON() {
  const input = document.getElementById('json-input').value;
  const output = document.getElementById('json-output');
  try {
    const obj = JSON.parse(input);
    output.innerHTML = jsonToTree(obj);
    setTimeout(() => makeCollapsible(output), 0); // Ensure DOM is ready
  } catch (e) {
    output.textContent = 'Invalid JSON: ' + e.message;
  }
}
window.beautifyJSON = beautifyJSON;
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
window.expandAllJSON = expandAllJSON;
function expandAllJSON() {
  document.querySelectorAll('#json-output .collapse').forEach(el => {
    el.classList.remove('collapsed');
    const arrow = el.querySelector('.json-arrow');
    if (arrow) arrow.style.transform = 'rotate(90deg)';
  });
}
window.expandAllJSON = expandAllJSON;
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      children += jsonToXml(obj[key], key);
    } else {
      children += `<${key}>${escapeXml(String(obj[key]))}</${key}>`;
    }
  }
window.collapseAllJSON = collapseAllJSON;
function collapseAllJSON() {
  document.querySelectorAll('#json-output .collapse').forEach(el => {
    el.classList.add('collapsed');
    const arrow = el.querySelector('.json-arrow');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  });
}
window.collapseAllJSON = collapseAllJSON;
  xml += `>${children}</${nodeName}>`;
  return xml;
}

function escapeXml(str) {
  return str.replace(/[<>&"']/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
window.removeSpaces = removeSpaces;
function removeSpaces(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.value = el.value.replace(/\s+/g, '');
  // Store updated value in localStorage
  try {
    localStorage.setItem(inputId, el.value);
  } catch (e) {}
}
window.removeSpaces = removeSpaces;
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&#39;';
    }
  });
}

// Pretty print XML
function formatXml(xml) {
window.convertJSONtoXML = convertJSONtoXML;
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
window.convertJSONtoXML = convertJSONtoXML;
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
window.openFullJSONModal = openFullJSONModal;
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
window.openFullJSONModal = openFullJSONModal;
  const input = document.getElementById('json-input').value;
  const output = document.getElementById('json-output');
  try {
    const obj = JSON.parse(input);
    output.innerHTML = jsonToTree(obj);
    setTimeout(() => makeCollapsible(output), 0); // Ensure DOM is ready
  } catch (e) {
    output.textContent = 'Invalid JSON: ' + e.message;
  }
}

function openFullJSONModal() {
  const input = document.getElementById('json-input').value;
window.closeFullJSONModal = closeFullJSONModal;
function closeFullJSONModal() {
  document.getElementById('jsonModal').style.display = 'none';
}
window.closeFullJSONModal = closeFullJSONModal;
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


function jsonToTree(obj, isRoot = true) {
  if (typeof obj !== 'object' || obj === null) {
    let type = typeof obj;
    let cls = type === 'string' ? 'string' : 'number';
    return `<span class="${cls}">${JSON.stringify(obj)}</span>`;
  }
  let html = '<ul class="json-tree">';
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (isRoot) {
        html += `<li class="collapse expanded"><span class="json-arrow">&#9654;</span><span class="key">"${key}"</span>: ${jsonToTree(obj[key], false)}</li>`;
      } else {
        html += `<li class="collapse collapsed"><span class="json-arrow">&#9654;</span><span class="key">"${key}"</span>: ${jsonToTree(obj[key], false)}</li>`;
      }
    } else {
      let type = typeof obj[key];
      let cls = type === 'string' ? 'string' : 'number';
      html += `<li><span style="display:inline-block;width:1.2em;"></span><span class="key">"${key}"</span>: <span class="${cls}">${JSON.stringify(obj[key])}</span></li>`;
    }
  }
  html += '</ul>';
  return html;
}

function makeCollapsible(container) {
  var collapses = container.querySelectorAll('.collapse');
  collapses.forEach(function(el, idx) {
    const arrow = el.querySelector('.json-arrow');
    if (arrow) {
      arrow.style.cursor = 'pointer';
      arrow.onclick = function(e) {
        e.stopPropagation();
        if (el.classList.contains('collapsed')) {
          el.classList.remove('collapsed');
          el.classList.add('expanded');
          arrow.style.transform = 'rotate(90deg)';
        } else {
          el.classList.add('collapsed');
          el.classList.remove('expanded');
          arrow.style.transform = 'rotate(0deg)';
        }
      };
    }
    el.onclick = function(e) {
      if (e.target.classList.contains('json-arrow')) return;
      if (el.classList.contains('collapsed')) {
        el.classList.remove('collapsed');
        el.classList.add('expanded');
        if (arrow) arrow.style.transform = 'rotate(90deg)';
      } else {
        el.classList.add('collapsed');
        el.classList.remove('expanded');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    };
  });

  // Fallback: event delegation for .json-tree
  const tree = container.querySelector('.json-tree');
  if (tree && !tree._delegationAttached) {
    tree.addEventListener('click', function(e) {
      const arrow = e.target.closest('.json-arrow');
      if (arrow) {
        const li = arrow.closest('.collapse');
        if (li) {
          if (li.classList.contains('collapsed')) {
            li.classList.remove('collapsed');
            li.classList.add('expanded');
            arrow.style.transform = 'rotate(90deg)';
          } else {
            li.classList.add('collapsed');
            li.classList.remove('expanded');
            arrow.style.transform = 'rotate(0deg)';
          }
        }
      }
    });
    tree._delegationAttached = true;
  }
}
// Attach to window for global access
window.jsonToTree = jsonToTree;
window.makeCollapsible = makeCollapsible;
window.expandAllJSON = expandAllJSON;
window.collapseAllJSON = collapseAllJSON;

