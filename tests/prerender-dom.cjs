// Hydrate generated HTML with the actual browser loader; do not just test source templates.
const {JSDOM} = require(process.env.EXALCO_JSDOM_PATH || 'jsdom');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'build/catalog-manifest.json')));
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
(async () => {
    let tested = 0;
    for (const [series, code, lang] of [['w55','1039','en'], ['w60','1044','sr'], ['ex74','50030','en']]) {
        const item = manifest.find(x => x.series === series && x.code === code &&
            x.file === (lang === 'sr' ? 'product-detail-sr.html' : 'product-detail.html'));
        const html = read('build/public' + item.target);
        const dom = new JSDOM(html, {url:item.url, runScripts:'outside-only'});
        await new Promise(resolve => dom.window.document.addEventListener('DOMContentLoaded', resolve, {once:true}));
        const errors = [];
        dom.window.console.error = (...args) => errors.push(args.join(' '));
        dom.window.fetch = async input => {
            assert.equal(new URL(input, item.url).pathname, '/data/' + series + '.json');
            return {ok:true, json:async () => JSON.parse(read('data/' + series + '.json'))};
        };
        for (const script of dom.window.document.head.querySelectorAll('script:not([src]):not([type])')) {
            dom.window.eval(script.textContent);
        }
        dom.window.eval(read('js/catalog-assets.js'));
        dom.window.eval(read('js/detail-loader.js'));
        dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
        await new Promise(setImmediate); await new Promise(setImmediate);
        const d = dom.window.document;
        assert.deepEqual(errors, []);
        assert.equal(d.querySelectorAll('link[rel="canonical"]').length, 1);
        assert.equal(d.querySelector('link[rel="canonical"]').href, item.url);
        assert.equal(d.querySelectorAll('link[hreflang]').length, 3);
        const gallery = d.getElementById('main-product-img');
        const initialImage = gallery.src;
        d.getElementById('next-pic').click();
        assert.notEqual(gallery.src, initialImage, item.url);
        assert.ok(/tehnički crtež|technical drawing/.test(gallery.alt), item.url);
        assert.ok(d.getElementById('back-link').href.includes('series=' + series));
        dom.window.close(); tested++;
    }
    console.log(JSON.stringify({prerenderedPagesHydrated:tested, canonicalAndGallery:'passed'}));
})().catch(error => { console.error(error); process.exitCode = 1; });
