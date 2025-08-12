function viewXML() {
  const input = document.getElementById('xml-input').value.trim();
  const output = document.getElementById('xml-output');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(input, 'text/xml');
  if (xmlDoc.querySelector('parsererror')) {
    output.textContent = 'Invalid XML';
    return;
  }
  output.innerHTML = xmlToTree(xmlDoc.documentElement);
  makeCollapsible(output);
}

function xmlToTree(node) {
  let html = '<ul>';
  html += `<li class="collapse"><span class="tag">&lt;${node.nodeName}</span>`;
  if (node.attributes && node.attributes.length) {
    for (let attr of node.attributes) {
      html += ` <span class="attr">${attr.name}="${attr.value}"</span>`;
    }
  }
  html += '<span class="tag">&gt;</span>';
  Array.from(node.childNodes).forEach(child => {
    if (child.nodeType === 1) html += xmlToTree(child);
    else if (child.nodeType === 3 && child.nodeValue.trim())
      html += `<ul><li><span class="string">${child.nodeValue.trim()}</span></li></ul>`;
  });
  html += `<span class="tag">&lt;/${node.nodeName}&gt;</span></li></ul>`;
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

