// GitHub Pages serves /404.html for retired topic URLs. Aliases live in topics.json.
(() => {
  const path = location.pathname.replace(/\/index\.html$/, '/').replace(/\/?$/, '/');
  if (!path.startsWith('/thesis-topics/')) return;
  fetch('/thesis-topics/topics.json')
    .then(response => {
      if (!response.ok) throw new Error('Cannot load topic aliases');
      return response.json();
    })
    .then(data => {
      if (Object.prototype.hasOwnProperty.call(data.legacyPaths, path)) {
        const id = data.legacyPaths[path];
        location.replace('/thesis-topics/' + (id ? '?topic=' + encodeURIComponent(id) : ''));
      }
    })
    .catch(error => console.error('Thesis redirect:', error));
})();
