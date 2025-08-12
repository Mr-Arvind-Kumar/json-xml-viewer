// Updated viewXML with validation, counts, and summary display
function viewXML() {
  const input = document.getElementById('xml-input').value.trim();
  const output = document.getElementById('xml-output');
  const summary = document.getElementById('xml-summary');
  summary.textContent = '';  // Clear previous summary
  output.textContent = '';   // Clear previous output

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(input, 'text/xml');

  // Check for parse errors
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    output.textContent = 'Invalid XML: ' + parserError.textContent;
    summary.textContent = 'XML is not valid. Please fix errors.';
    output.style.color = 'red';
    return;
  }
  output.style.color = ''; // reset color if valid

  // Compute counts for elements, attributes, and text nodes
  const counts = { elements: 0, attributes: 0, textNodes: 0 };
  function countNodes(node) {
    if (node.nodeType === 1) { // Element
      counts.elements++;
      if (node.attributes) {
        counts.attributes += node.attributes.length;
      }
      Array.from(node.childNodes).forEach(countNodes);
    } else if (node.nodeType === 3) { // Text
      if (node.nodeValue.trim()) counts.textNodes++;
    }
  }
  countNodes(xmlDoc.documentElement);

  // Show summary info
  summary.textContent =
    `Elements: ${counts.elements} | Attributes: ${counts.attributes} | Text nodes: ${counts.textNodes}`;

  // Render collapsible tree with highlight
  output.innerHTML = xmlToTree(xmlDoc.documentElement);

  // Make tree collapsible
  makeCollapsible(output);
}

// xmlToTree with enhanced highlighting
function xmlToTree(node) {
  let html = '<ul>';
  html += `<li class="collapse"><span class="tag">&lt;${node.nodeName}</span>`;
  if (node.attributes && node.attributes.length) {
    for (let attr of node.attributes) {
      html += ` <span class="attr">${attr.name}="<span class="attr-value">${escapeHtml(attr.value)}</span>"</span>`;
    }
  }
  html += '<span class="tag">&gt;</span>';

  Array.from(node.childNodes).forEach(child => {
    if (child.nodeType === 1) { // Element
      html += xmlToTree(child);
    } else if (child.nodeType === 3 && child.nodeValue.trim()) { // Text
      html += `<ul><li><span class="string">${escapeHtml(child.nodeValue.trim())}</span></li></ul>`;
    }
  });

  html += `<span class="tag">&lt;/${node.nodeName}&gt;</span></li></ul>`;
  return html;
}

// Escape HTML for safety in output
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

function makeCollapsible(container) {
  container.querySelectorAll('.collapse').forEach(function(el) {
    el.classList.add('collapsed');
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      el.classList.toggle('collapsed');
    });
  });
}
