// Dependency-free data and renderer checks: node scripts/check-thesis-topics.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'thesis-topics/topics.json')));
const source = fs.readFileSync(path.join(root, 'thesis-topics/topics.js'), 'utf8');
const tags = new Set(data.tags.map(tag => tag.id));
assert.equal(tags.size, data.tags.length, 'Tag IDs must be unique');
assert.equal(new Set(data.topics.map(topic => topic.id)).size, data.topics.length, 'Topic IDs must be unique');
for (const topic of data.topics) {
  assert.match(topic.id, /^[a-z0-9-]+$/);
  assert.ok(topic.title.de && topic.levels.length && topic.sections.length);
  assert.ok(topic.tags.every(tag => tags.has(tag)), `Unknown tag in ${topic.id}`);
  if (topic.image) assert.ok(fs.existsSync(path.join(root, 'thesis-topics/images', topic.image.file)), topic.image.file);
  if (topic.cover) assert.ok(fs.existsSync(path.join(root, 'thesis-topics/images', topic.cover.file)), topic.cover.file);
  for (const section of topic.sections) {
    assert.ok(section.blocks.length);
    for (const block of section.blocks) {
      assert.ok(['paragraph', 'list', 'video'].includes(block.type));
      if (block.type === 'video') {
        assert.ok(fs.existsSync(path.join(root, 'thesis-topics/images', block.file)));
        assert.ok(block.label && block.fallback);
        continue;
      }
      for (const text of block.type === 'list' ? block.items : [block.text]) {
        assert.equal(typeof text, 'string');
        for (const match of text.matchAll(/\]\((\/[^\s]+)\)/g)) {
          assert.ok(fs.existsSync(path.join(root, decodeURIComponent(match[1]))), match[1]);
        }
      }
    }
  }
}
for (const id of Object.values(data.legacyPaths)) assert.ok(!id || data.topics.some(topic => topic.id === id));
class Element {
  constructor(tag) { this.tagName = tag; this.children = []; this.dataset = {}; this.attrs = {}; this.events = {}; this.className = ''; this.textContent = ''; }
  append(...children) { this.children.push(...children); }
  prepend(...children) { this.children.unshift(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attrs[name] = value; }
  addEventListener(name, fn) { this.events[name] = fn; }
  get lastChild() { return this.children[this.children.length - 1]; }
  all(predicate) { return this.children.flatMap(child => typeof child === 'object' ? [...(predicate(child) ? [child] : []), ...child.all(predicate)] : []); }
}
async function render(search = '', dataset = data, fail = false) {
  const main = new Element('main');
  const errors = [];
  const document = { getElementById: () => main, createElement: tag => new Element(tag), createTextNode: text => { const n = new Element('#text'); n.textContent = text; return n; } };
  vm.runInNewContext(source, { document, location: { origin: 'https://example.org', search }, URL, URLSearchParams, console: { error: (...args) => errors.push(args) }, fetch: async () => ({ ok: !fail, status: 503, json: async () => dataset }) });
  await new Promise(resolve => setImmediate(resolve));
  return { main, document, errors };
}
const byClass = (main, name) => main.all(node => node.className.split(' ').includes(name));
(async () => {
  const { main, errors } = await render();
  assert.equal(errors.length, 0);
  assert.equal(byClass(main, 'thesis-topic-row').length, data.topics.length);
  const thumbnails = byClass(main, 'thesis-thumbnail');
  data.topics.forEach((topic, index) => {
    assert.equal(thumbnails[index].children[0].src, '/thesis-topics/images/' + (topic.cover || topic.image).file);
  });
  const awards = byClass(main, 'thesis-award');
  assert.equal(awards.length, 1);
  assert.equal(awards[0].children[1].textContent, 'DVW Next Generation Award');
  const press = (key, value) => main.all(n => n.dataset.filter === key && n.dataset.value === value)[0].events.click();
  press('levels', 'Bachelor');
  assert.equal(byClass(main, 'thesis-topic-row').length, data.topics.filter(t => t.levels.includes('Bachelor')).length);
  press('tags', 'geometric-dl');
  assert.equal(byClass(main, 'thesis-topic-row').length, 0);
  press('tags', 'llm'); // OR within tag group
  assert.equal(byClass(main, 'thesis-topic-row').length, 2);
  byClass(main, 'thesis-reset')[0].events.click();
  assert.equal(byClass(main, 'thesis-topic-row').length, data.topics.length);
  press('levels', 'Master'); press('tags', 'geometric-dl');
  assert.equal(byClass(main, 'thesis-topic-row').length, 1);
  assert.equal(byClass(main, 'thesis-number')[0].textContent, String(data.topics.findIndex(t => t.id === 'thema4') + 1) + '.', 'Filter must preserve topic number');
  for (const topic of data.topics) {
    const result = await render('?topic=' + topic.id);
    assert.equal(result.errors.length, 0, topic.id);
    assert.equal(byClass(result.main, 'thesis-detail-section').length, topic.sections.length);
    assert.ok(result.document.title.includes(topic.title.de));
    if (topic.image) {
      const figure = byClass(result.main, 'thesis-detail-image')[0];
      assert.equal(figure.children[0].src, '/thesis-topics/images/' + topic.image.file, 'Detail must preserve original image');
    }
  }
  const railway = await render('?topic=db-verspaetungsausbreitung');
  const video = byClass(railway.main, 'thesis-video')[0];
  assert.ok(video.controls);
  assert.equal(video.attrs.controlsList, 'nodownload');
  assert.equal(railway.main.all(n => n.tagName === 'a' && (n.href || '').endsWith('.mov')).length, 0);
  const unknown = await render('?topic=missing');
  assert.equal(unknown.document.title, data.page.labels.notFound.de);
  const failed = await render('', data, true);
  assert.equal(failed.errors.length, 1);
  assert.match(failed.main.children[0].textContent, /nicht geladen/);
  const extended = JSON.parse(JSON.stringify(data));
  extended.topics.push({ ...extended.topics[0], id: 'new-topic' });
  const added = await render('', extended);
  assert.equal(byClass(added.main, 'thesis-topic-row').length, data.topics.length + 1);
  assert.equal(byClass(added.main, 'thesis-number').slice(-1)[0].textContent, String(data.topics.length + 1) + '.');
  byClass(main, 'thesis-reset')[0].events.click();
  press('tags', 'visualization');
  assert.equal(byClass(main, 'thesis-topic-row').length, 1);
  assert.equal(byClass(main, 'thesis-number')[0].textContent, '1.');
  assert.equal(main.all(n => n.lang === 'en' || n.className === 'translation').length, 0);
  // Empty selection result and reset.
  const emptyData = JSON.parse(JSON.stringify(data));
  emptyData.tags.push({ id: 'future', de: 'Zukünftig' });
  const empty = await render('', emptyData);
  empty.main.all(n => n.dataset.value === 'future')[0].events.click();
  assert.equal(byClass(empty.main, 'thesis-topic-row').length, 0);
  assert.equal(byClass(empty.main, 'thesis-empty').length, 1);
  // Every legacy URL resolves, while unrelated 404s stay unchanged.
  const legacySource = fs.readFileSync(path.join(root, 'thesis-topics/legacy.js'), 'utf8');
  for (const [oldPath, id] of Object.entries(data.legacyPaths)) {
    for (const suffix of ['', 'index.html']) {
      let target;
      vm.runInNewContext(legacySource, { location: { pathname: oldPath + suffix, replace: url => { target = url; } }, fetch: async () => ({ ok: true, json: async () => data }), console });
      await new Promise(resolve => setImmediate(resolve));
      assert.equal(target, '/thesis-topics/' + (id ? '?topic=' + id : ''));
    }
  }
  console.log('Passed: data/assets, all detail pages, degree/tag filters, multi-select, reset, empty results, stable numbering, JSON-only topic addition, load failure, missing topic and legacy redirects.');
})().catch(error => { console.error(error); process.exitCode = 1; });
