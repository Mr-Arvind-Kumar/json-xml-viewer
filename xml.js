// Parse, validate, count, and render XML structure
function viewXML() {
  const input = document.getElementById('xml-input').value.trim();
  const output = document.getElementById('xml-output');
  const summary = document.getElementById('xml-summary');

  // Clear any previous data
  summary.textContent = '';
  output.textContent = '';

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(input, 'text/xml');

  // Validate XML
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    output.textContent = '❌ Invalid XML: ' + parserError.textContent;
    output.style.color = 'red';
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
  output.innerHTML = xmlToTree(xmlDoc.documentElement);
  makeCollapsible(output);
}

// Convert XML to HTML tree
function xmlToTree(node) {
  let html = '<ul>';

  // Opening tag
  html += `<li class="collapse"><span class="tag">&lt;${node.nodeName}</span>`;

  // Attributes
  if (node.attributes && node.attributes.length) {
    for (let attr of node.attributes) {
      html += ` <span class="attr">${attr.name}="<span class="attr-value">${escapeHtml(attr.value)}</span>"</span>`;
    }
  }
  html += '<span class="tag">&gt;</span>';

  // Child nodes
  Array.from(node.childNodes).forEach(child => {
    if (child.nodeType === 1) {
      html += xmlToTree(child);
    } else if (child.nodeType === 3 && child.nodeValue.trim()) {
      html += `<ul><li><span class="string">${escapeHtml(child.nodeValue.trim())}</span></li></ul>`;
    }
  });

  // Closing tag
  html += `<span class="tag">&lt;/${node.nodeName}&gt;</span></li></ul>`;
  return html;
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
