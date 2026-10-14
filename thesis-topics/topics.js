(() => {
  'use strict';
  const base = '/thesis-topics/';
  const main = document.getElementById('thesis-content');
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  function safeUrl(value) {
    const url = new URL(value, location.origin + base);
    if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) throw new Error('Unsupported URL');
    return url.href;
  }
  // Only inline links are interpreted; all other content remains literal text.
  function rich(node, text) {
    const pattern = /\[([^\]]+)\]\(([^\s]+)\)/g;
    let end = 0;
    for (const match of text.matchAll(pattern)) {
      node.append(document.createTextNode(text.slice(end, match.index)));
      const a = el('a', '', match[1]);
      a.href = safeUrl(match[2]);
      node.append(a);
      end = match.index + match[0].length;
    }
    node.append(document.createTextNode(text.slice(end)));
    return node;
  }
  function german(tag, value, className = '') {
    const node = el(tag, className);
    if (value.de) node.append(el('span', '', value.de));

    return node;
  }
  const topicUrl = id => base + '?topic=' + encodeURIComponent(id);
  function credit(image) {
    const caption = el('span', 'thesis-image-credit');
    if (image.credit) {
      const link = el(image.credit.url ? 'a' : 'span', '', image.credit.text);
      if (image.credit.url) link.href = safeUrl(image.credit.url);
      caption.append(link);
    }
    return caption;
  }
  function picture(topic, thumbnail) {
    const image = thumbnail ? topic.cover || topic.image : topic.image;
    const img = el('img');
    img.src = base + 'images/' + image.file;
    img.alt = thumbnail ? '' : image.alt || topic.title.de;
    img.loading = 'lazy';
    img.decoding = 'async';
    if (thumbnail) { img.width = 280; img.height = 187; }
    return img;
  }
  function contact(data, topic) {
    const box = el('section', 'thesis-contact');
    box.append(german('h3', topic ? data.page.labels.contact : data.page.contactTitle));
    const a = el('a', '', data.page.contact.email);
    a.href = 'mailto:' + data.page.contact.email + '?subject=' + encodeURIComponent('Abschlussarbeit – ' + (topic ? topic.title.de : 'Anfrage'));
    box.append(a, german('p', data.page.contact));
    return box;
  }
  function topicTags(data, topic) {
    const tags = el('div', 'thesis-tags');
    topic.levels.forEach(level => {
      const badge = el('span', 'thesis-tag thesis-tag-degree', level);
      badge.dataset.tone = (data.degreeColors || {})[level] || 'slate';
      tags.append(badge);
    });
    (topic.tags || []).forEach(id => {
      const tag = data.tags.find(tag => tag.id === id);
      if (tag) {
        const badge = german('span', tag, 'thesis-tag');
        badge.dataset.tone = tag.color || 'slate';
        tags.append(badge);
      }
    });
    return tags;
  }
  function overview(data) {
    main.append(german('h1', data.page.title, 'thesis-caption'));
    if (data.page.invitation) {
      const invitation = el('aside', 'thesis-invitation');
      const heading = german('h2', data.page.invitation.title);
      heading.id = 'thesis-invitation-title';
      invitation.setAttribute('aria-labelledby', heading.id);
      invitation.append(heading, german('p', data.page.invitation.text));
      main.append(invitation);
    }
    main.append(german('p', data.page.intro, 'thesis-intro'));
    const controls = el('section', 'thesis-filters');
    const selected = { levels: new Set(), tags: new Set() };
    const buttons = [];
    const list = el('ol', 'thesis-topic-list');
    const status = el('p', 'thesis-filter-status');
    status.setAttribute('role', 'status');
    function group(key, label, choices) {
      const fieldset = el('fieldset');
      fieldset.append(german('legend', label));
      const options = el('div', 'thesis-filter-options');
      choices.forEach(choice => {
        const button = german('button', choice);
        button.type = 'button';
        button.dataset.tone = choice.color || 'slate';
        button.dataset.filter = key;
        button.dataset.value = choice.id;
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => {
          if (selected[key].has(choice.id)) selected[key].delete(choice.id);
          else selected[key].add(choice.id);
          update();
        });
        buttons.push(button);
        options.append(button);
      });
      fieldset.append(options);
      controls.append(fieldset);
    }
    group('levels', data.filters.degreeLabel, [...new Set(data.topics.flatMap(topic => topic.levels))].map(level => ({ id: level, de: level, color: (data.degreeColors || {})[level] })));
    group('tags', data.filters.tagLabel, data.tags);
    const reset = german('button', data.filters.reset, 'thesis-reset');
    reset.type = 'button';
    reset.addEventListener('click', () => {
      selected.levels.clear(); selected.tags.clear(); update();
    });
    controls.append(reset, german('p', data.filters.hint, 'thesis-filter-hint'));
    function update() {
      buttons.forEach(button => button.setAttribute('aria-pressed', String(selected[button.dataset.filter].has(button.dataset.value))));
      reset.disabled = !selected.levels.size && !selected.tags.size;
      list.replaceChildren();
      let count = 0;
      data.topics.forEach((topic, index) => {
        if (selected.levels.size && !topic.levels.some(level => selected.levels.has(level))) return;
        if (selected.tags.size && !(topic.tags || []).some(tag => selected.tags.has(tag))) return;
        count++;
        const row = el('li', 'thesis-topic-row');
        row.value = index + 1;
        const imageBox = el('div', 'thesis-image');
        if (topic.cover || topic.image) {
          const link = el('a', 'thesis-thumbnail');
          link.href = topicUrl(topic.id);
          link.tabIndex = -1;
          link.setAttribute('aria-hidden', 'true');
          link.append(picture(topic, true));
          imageBox.append(link, credit(topic.cover || topic.image));
        }
        const body = el('div', 'thesis-topic-body');
        const title = el('a');
        title.href = topicUrl(topic.id);
        title.append(el('span', 'thesis-number', `${index + 1}.`), el('strong', '', topic.title.de));
        body.append(title);

        body.append(topicTags(data, topic));
        row.append(imageBox, body);
        list.append(row);
      });
      status.replaceChildren(german('span', { de: `${count} / ${data.topics.length} ${data.filters.count.de}` }));
      if (!count) list.append(el('li', 'thesis-empty'));
      if (!count) list.lastChild.append(german('p', data.filters.empty));
    }
    update();
    main.append(controls, status, list, contact(data), german('p', data.page.note, 'thesis-open-note'));
    data.history.forEach(group => {
      main.append(german('h2', group.title, 'thesis-caption thesis-caption-spaced'));
      const list = el('div', 'thesis-history-list');
      group.entries.forEach(entry => {
        const row = el('div', 'thesis-history-row');
        const body = rich(el('div', 'thesis-entry'), entry.text);
        if (entry.award) {
          const award = el('p', 'thesis-publication thesis-award');
          const icon = el('span', 'thesis-publication-icon', '🏆');
          icon.setAttribute('role', 'img');
          icon.setAttribute('aria-label', 'Auszeichnung');
          award.append(icon, document.createTextNode(entry.award));
          body.append(award);
        }
        if (entry.publication) {
          const publication = entry.publication;
          const citation = el('p', 'thesis-publication');
          const icon = el('span', 'thesis-publication-icon', publication.icon || '📄');
          icon.setAttribute('role', 'img');
          icon.setAttribute('aria-label', publication.label);
          citation.append(icon, document.createTextNode(' '));
          if (publication.contribution) {
            citation.append(el('span', 'thesis-publication-contribution', publication.contribution));
          }
          citation.append(document.createTextNode(`${publication.authors} (${publication.year}). ${publication.title}. `));
          citation.append(el('em', '', `${publication.journal}, ${publication.volume}`));
          citation.append(document.createTextNode(`${publication.issue ? '(' + publication.issue + ')' : ''}, ${publication.article}. `));
          const doi = el('a', '', 'https://doi.org/' + publication.doi);
          doi.href = safeUrl('https://doi.org/' + publication.doi);
          citation.append(doi);
          body.append(citation);
        }
        row.append(el('span', 'thesis-year', entry.year), body, rich(el('span', 'thesis-meta-col'), entry.meta));
        list.append(row);
      });
      main.append(list);
    });
  }
  function detail(data, id) {
    const back = german('a', data.page.labels.back);
    back.href = base;
    main.append(back);
    const index = data.topics.findIndex(topic => topic.id === id);
    if (index < 0) {
      main.append(german('h1', data.page.labels.notFound));
      document.title = data.page.labels.notFound.de;
      return;
    }
    const topic = data.topics[index];
    document.title = topic.title.de + ' — Yu Feng';
    const title = german('h1', topic.title);
    title.prepend(el('span', 'thesis-number', `${index + 1}.`));
    main.append(title, el('p', '', topic.scopeNote || topic.levels.join(' / ')));
    main.append(topicTags(data, topic));
    if (topic.image) {
      const figure = el('figure', 'thesis-detail-image');
      figure.append(picture(topic, false), credit(topic.image));
      main.append(figure);
    }
    topic.sections.forEach(section => {
      const box = el('section', 'thesis-detail-section');
      box.lang = 'de';
      if (section.title) {
        box.append(german('h3', section.title));
      }
      section.blocks.forEach(block => {
        if (block.type === 'paragraph') box.append(rich(el('p'), block.text));
        if (block.type === 'video') {
          const video = el('video', 'thesis-video');
          video.src = base + 'images/' + block.file;
          video.controls = true;
          video.preload = 'metadata';
          video.setAttribute('playsinline', '');
          video.setAttribute('controlsList', 'nodownload');
          video.setAttribute('disableRemotePlayback', '');
          video.setAttribute('aria-label', block.label);
          video.append(document.createTextNode(block.fallback));
          box.append(video);
        }
        if (block.type === 'list') {
          const list = el('ul');
          block.items.forEach(item => list.append(rich(el('li'), item)));
          box.append(list);
        }
      });
      main.append(box);
    });
    main.append(contact(data, topic));
  }
  fetch(base + 'topics.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      main.replaceChildren();
      const id = new URLSearchParams(location.search).get('topic');
      if (id !== null) detail(data, id);
      else overview(data);
    })
    .catch(error => {
      main.replaceChildren(el('p', '', 'Die Themen konnten nicht geladen werden. Bitte versuchen Sie es erneut.'));
      console.error('Thesis topics:', error);
    });
})();
