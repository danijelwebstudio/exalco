/* Build-time rendering only. Existing public query URLs and catalog facts stay unchanged. */
const {JSDOM} = require(process.env.EXALCO_JSDOM_PATH || 'jsdom');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = path.resolve(root, 'build');
const publicDir = path.join(output, 'public');
const origin = 'https://exalcoaluminium.com';
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const catalog = Object.fromEntries(fs.readdirSync(path.join(root, 'data'))
    .filter(f => f.endsWith('.json') && fs.statSync(path.join(root, 'data', f)).size)
    .map(f => [f.slice(0, -5), JSON.parse(read('data/' + f))]));
const cache = Object.fromEntries(['js/catalog-assets.js', 'js/detail-loader.js', 'js/loader.js',
    'pages/product-detail.html', 'pages/product-detail-sr.html',
    'pages/products-list.html', 'pages/products-list-sr.html'].map(p => [p, read(p)]));

// Quote an nginx regex safely. These are generated from repository records, never request input.
const nginxRegex = value => JSON.stringify('~^' + value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/%20/g, '(?:%20|\\+)') + '$');

async function render(file, series, code) {
    const query = 'series=' + encodeURIComponent(series) +
        (code === undefined ? '' : '&code=' + encodeURIComponent(code));
    const url = origin + '/pages/' + file + '?' + query;
    const dom = new JSDOM(cache['pages/' + file], {url, runScripts: 'outside-only'});
    try {
        await new Promise(resolve => dom.window.document.addEventListener('DOMContentLoaded', resolve, {once:true}));
        const errors = [];
        dom.window.console.error = (...args) => errors.push(args.join(' '));
        dom.window.fetch = async input => {
            assert.equal(new URL(input, url).href, origin + '/data/' + series + '.json');
            return {ok:true, json:async () => catalog[series]};
        };
        dom.window.eval(cache['js/catalog-assets.js']);
        dom.window.eval(cache['js/' + (code === undefined ? 'loader.js' : 'detail-loader.js')]);
        dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
        await new Promise(setImmediate);
        await new Promise(setImmediate);
        const d = dom.window.document;
        assert.deepEqual(errors, [], url);
        assert.equal(d.querySelectorAll('link[rel="canonical"]').length, 1, url);
        assert.equal(d.querySelector('link[rel="canonical"]').href, url, url);
        assert.equal(d.querySelectorAll('link[hreflang]').length, 3, url);
        assert.ok(!d.querySelector('meta[name="robots"]')?.content.includes('noindex'), url);
        if (code === undefined) {
            assert.equal(d.querySelectorAll('#product-grid .profile-card').length, Object.keys(catalog[series]).length, url);
        } else {
            assert.ok(d.querySelector('h1.detail-title')?.textContent.trim(), url);
            assert.ok(d.getElementById('detail-container').textContent.includes(code), url);
        }
        for (const im of d.querySelectorAll('#detail-container img, #product-grid img')) {
            const u = new URL(im.src);
            assert.equal(u.origin, origin);
            assert.ok(fs.existsSync(path.join(root, decodeURIComponent(u.pathname))), im.src);
        }
        // Initial tags are now literal HTML. Do not run the template's head script a second time.
        d.head.querySelectorAll('script:not([src]):not([type])').forEach(script => script.remove());
        const target = '/_catalog/' + crypto.createHash('sha256').update(url).digest('hex') + '.html';
        fs.writeFileSync(path.join(publicDir, target), dom.serialize());
        return {url, file, series, code, target};
    } finally {
        dom.window.close();
    }
}

(async () => {
    fs.mkdirSync(publicDir, {recursive:true});
    // Only public site files enter the image; no repository metadata, audit reports, or tooling.
    for (const name of ['assets', 'css', 'js', 'data', 'pages']) {
        fs.cpSync(path.join(root, name), path.join(publicDir, name), {recursive:true});
    }
    for (const name of ['index.html', 'index-en.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest']) {
        fs.copyFileSync(path.join(root, name), path.join(publicDir, name));
    }
    const snapshots = path.join(publicDir, '_catalog');
    fs.mkdirSync(snapshots, {recursive:true});
    // Remove stale generated snapshots only; all output is confined to build/public/_catalog.
    for (const name of fs.readdirSync(snapshots)) {
        if (/^[a-f0-9]{64}\.html$/.test(name)) fs.unlinkSync(path.join(snapshots, name));
    }
    const manifest = [];
    for (const [series, entries] of Object.entries(catalog)) {
        for (const sr of [false, true]) {
            manifest.push(await render('products-list' + (sr ? '-sr' : '') + '.html', series));
            for (const code of Object.keys(entries)) {
                manifest.push(await render('product-detail' + (sr ? '-sr' : '') + '.html', series, code));
            }
        }
        process.stdout.write('Rendered ' + series + '\n');
    }
    // Nginx $arg_* values preserve percent encoding; parameter order and tracking parameters don't matter.
    const rows = manifest.map(item => {
        const key = '/pages/' + item.file + '|' + encodeURIComponent(item.series) + '|' +
            (item.code === undefined ? '' : encodeURIComponent(item.code));
        return '    ' + nginxRegex(key) + ' ' + JSON.stringify(item.target) + ';';
    });
    fs.writeFileSync(path.join(output, 'catalog-map.conf'),
        'map "$uri|$arg_series|$arg_code" $exalco_catalog_page {\n    default "";\n' + rows.join('\n') + '\n}\n');
    fs.writeFileSync(path.join(output, 'catalog-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    console.log(JSON.stringify({products:manifest.filter(x => x.code !== undefined).length,
        series:manifest.filter(x => x.code === undefined).length, output:publicDir}));
})().catch(error => { console.error(error); process.exitCode = 1; });
