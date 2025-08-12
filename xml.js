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
// Convert XML to JSON and put result in JSON input
function convertXMLtoJSON() {
  const xmlInput = document.getElementById('xml-input').value.trim();
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, 'text/xml');
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) throw new Error(parserError.textContent);
    const obj = xmlToJson(xmlDoc.documentElement);
    document.getElementById('json-input').value = JSON.stringify(obj, null, 2);
    // Optionally switch to JSON panel
    showOnly('json');
  } catch (e) {
    alert('Invalid XML: ' + e.message);
  }
}

// Helper: Convert XML DOM to JS object
function xmlToJson(node) {
  // If text node
  if (node.nodeType === 3) {
    return node.nodeValue.trim();
  }
  let obj = {};
  // Attributes
  if (node.attributes && node.attributes.length > 0) {
    obj['@attributes'] = {};
    for (let attr of node.attributes) {
      obj['@attributes'][attr.name] = attr.value;
    }
  }
  // Child nodes
  let hasElementChild = false;
  for (let child of node.childNodes) {
    if (child.nodeType === 1) {
      hasElementChild = true;
      const childObj = xmlToJson(child);
      if (obj[child.nodeName]) {
        if (!Array.isArray(obj[child.nodeName])) {
          obj[child.nodeName] = [obj[child.nodeName]];
        }
        obj[child.nodeName].push(childObj);
      } else {
        obj[child.nodeName] = childObj;
      }
    } else if (child.nodeType === 3 && child.nodeValue.trim()) {
      obj['#text'] = child.nodeValue.trim();
    }
  }
  if (!hasElementChild && obj['#text']) return obj['#text'];
  return obj;
}
// Parse, validate, count, and render XML structure
function viewXML() {
  const input = document.getElementById('xml-input').value.trim();
  const output = document.getElementById('xml-output');
  const summary = document.getElementById('xml-summary');

  // Clear any previous data
  summary.textContent = '';
  output.textContent = '';

  // Add search bar if not present
  if (!document.getElementById('xml-search-bar')) {
    const searchBar = document.createElement('div');
    searchBar.innerHTML = `
      <input id="xml-search-bar" type="text" placeholder="Search tag or attribute..." style="margin-bottom:8px;width:70%"> 
      <button onclick="clearXMLSearch()">Clear</button>
    `;
    output.parentNode.insertBefore(searchBar, output);
    document.getElementById('xml-search-bar').addEventListener('input', filterXMLTree);
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(input, 'text/xml');

  // Validate XML
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    output.innerHTML = `<div style="color:#fff;background:#c62828;padding:8px;border-radius:4px;font-weight:bold;">❌ Invalid XML:<br>${parserError.textContent}</div>`;
    output.style.color = '';
    summary.textContent = 'XML is not valid. Please fix errors.';
    return;
  }
  output.style.color = ''; // reset color

  // Count structure
  const counts = { elements: 0, attributes: 0, textNodes: 0 };
  function countNodes(node) {
    if (node.nodeType === 1) { // Element
      counts.elements++;
      if (node.attributes) counts.attributes += node.attributes.length;
      Array.from(node.childNodes).forEach(countNodes);
    } else if (node.nodeType === 3) { // Text
      if (node.nodeValue.trim()) counts.textNodes++;
    }
  }
  countNodes(xmlDoc.documentElement);

  // Display summary
  summary.textContent =
    `✅ Elements: ${counts.elements} | Attributes: ${counts.attributes} | Text nodes: ${counts.textNodes}`;

  // Render the tree
  output.innerHTML = xmlToTree(xmlDoc.documentElement, '0');
  makeCollapsible(output);
  addCopyListeners();
}

// Convert XML to HTML tree
function xmlToTree(node, path) {
  let html = '<ul>';
  // Opening tag with copy button
  html += `<li class="collapse" data-xml-path="${path}"><span class="tag">&lt;${node.nodeName}</span>`;
  // Attributes
  if (node.attributes && node.attributes.length) {
    for (let attr of node.attributes) {
      html += ` <span class="attr">${attr.name}="<span class="attr-value">${escapeHtml(attr.value)}</span>"</span>`;
    }
  }
  html += '<span class="tag">&gt;</span>';
  html += `<button class="xml-copy-btn" title="Copy this node" style="margin-left:6px;font-size:12px;vertical-align:middle;">📋</button>`;
  // Child nodes
  Array.from(node.childNodes).forEach((child, idx) => {
    if (child.nodeType === 1) {
      html += xmlToTree(child, path + '-' + idx);
    } else if (child.nodeType === 3 && child.nodeValue.trim()) {
      html += `<ul><li><span class="string">${escapeHtml(child.nodeValue.trim())}</span></li></ul>`;
    }
  });
  // Closing tag
  html += `<span class="tag">&lt;/${node.nodeName}&gt;</span></li></ul>`;
  return html;
}
// Add copy-to-clipboard listeners to XML nodes
function addCopyListeners() {
  document.querySelectorAll('.xml-copy-btn').forEach(btn => {
    btn.onclick = function(e) {
      e.stopPropagation();
      const li = btn.closest('li[data-xml-path]');
      if (!li) return;
      // Get XML string for this node
      const xmlStr = getXMLStringFromNode(li);
      navigator.clipboard.writeText(xmlStr).then(() => {
        btn.textContent = '✅';
        setTimeout(() => { btn.textContent = '📋'; }, 1000);
      });
    };
  });
}

// Get XML string for a node (by traversing DOM tree)
function getXMLStringFromNode(li) {
  // Find the path
  const path = li.getAttribute('data-xml-path');
  // Re-parse the XML input
  const input = document.getElementById('xml-input').value.trim();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(input, 'text/xml');
  let node = xmlDoc.documentElement;
  if (path && path !== '0') {
    const idxs = path.split('-').slice(1).map(Number);
    for (let i = 0; i < idxs.length; i++) {
      let children = Array.from(node.childNodes).filter(n => n.nodeType === 1);
      node = children[idxs[i]];
    }
  }
  return new XMLSerializer().serializeToString(node);
}

// Filter XML tree by search
function filterXMLTree() {
  const q = document.getElementById('xml-search-bar').value.trim().toLowerCase();
  document.querySelectorAll('#xml-output li[data-xml-path]').forEach(li => {
    const text = li.textContent.toLowerCase();
    if (!q || text.includes(q)) {
      li.style.background = q ? '#333a' : '';
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  });
}

function clearXMLSearch() {
  document.getElementById('xml-search-bar').value = '';
  filterXMLTree();
}

// Escape HTML special chars
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function (m) {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}

// Make collapsible tree
function makeCollapsible(container) {
  container.querySelectorAll('.collapse').forEach(function(el) {
    el.classList.add('collapsed'); // start collapsed
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      el.classList.toggle('collapsed');
    });
  });
}

// Collapse all XML nodes
function collapseAllXML() {
  document.querySelectorAll('#xml-output .collapse').forEach(el => {
    el.classList.add('collapsed');
  });
}

// Expand all XML nodes
function expandAllXML() {
  document.querySelectorAll('#xml-output .collapse').forEach(el => {
    el.classList.remove('collapsed');
  });
}
