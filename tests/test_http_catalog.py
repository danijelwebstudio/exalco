"""Real nginx integration test; run after npm run build:catalog.

EXALCO_NGINX_BIN may point to an nginx executable outside PATH.
No production service is started, stopped, or modified.
"""
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Canonicals(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.urls.append(attrs.get('href'))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def main():
    binary = os.environ.get('EXALCO_NGINX_BIN') or shutil.which('nginx')
    if not binary:
        raise SystemExit('Install nginx or set EXALCO_NGINX_BIN to run HTTP integration checks.')
    manifest = json.loads((ROOT / 'build/catalog-manifest.json').read_text())
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        port = s.getsockname()[1]
    with tempfile.TemporaryDirectory(prefix='exalco-nginx-') as tmp:
        folder = Path(tmp)
        (folder / 'logs').mkdir()
        config = (ROOT / 'deploy/nginx.conf').read_text()
        config = config.replace('/etc/nginx/catalog-map.conf', str(ROOT / 'build/catalog-map.conf'))
        config = config.replace('/usr/share/nginx/html', str(ROOT / 'build/public'))
        config = config.replace('listen 80;', f'listen 127.0.0.1:{port};')
        mime_types = Path('/etc/nginx/mime.types')
        if not mime_types.is_file():
            mime_types = Path(binary).resolve().parent.parent / 'conf/mime.types'
        assert mime_types.is_file(), 'nginx mime.types is required for real asset MIME checks'
        (folder / 'nginx.conf').write_text(
            ('user root root;\n' if os.geteuid() == 0 else '') +
            f'daemon off; master_process off; pid {folder}/nginx.pid;\n'
            f'error_log {folder}/error.log; events {{ worker_connections 64; }}\n'
            'http { access_log off; include ' + str(mime_types) + '; ' + config + ' }\n')
        process = subprocess.Popen([binary, '-p', tmp, '-c', str(folder / 'nginx.conf')],
                                   stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        try:
            for attempt in range(100):
                if process.poll() is not None:
                    raise AssertionError(process.communicate()[1].decode())
                try:
                    with socket.create_connection(('127.0.0.1', port), timeout=.1):
                        break
                except OSError:
                    time.sleep(.05)
            else:
                raise AssertionError('nginx did not become ready')

            def get(path, host='exalcoaluminium.com'):
                request = urllib.request.Request(f'http://127.0.0.1:{port}' + path, headers={'Host': host})
                try:
                    result = opener.open(request, timeout=5)
                except urllib.error.HTTPError as error:
                    result = error
                with result:
                    return result.code, result.headers, result.read()

            # Every existing sitemap catalog URL must return its own initial HTML canonical.
            for item in manifest:
                url = urlsplit(item['url'])
                request_path = url.path + '?' + url.query
                status, headers, body = get(request_path)
                assert status == 200, (item['url'], status, body[:200])
                expected = (ROOT / 'build/public' / item['target'].lstrip('/')).read_bytes()
                assert body == expected, item['url']
                parser = Canonicals()
                parser.feed(body.decode())
                assert parser.urls == [item['url']], (item['url'], parser.urls)
                # Prevent a static file response accidentally downloading as octet-stream.
                assert headers.get_content_type() == 'text/html', (item['url'], headers)
            sample = next(x for x in manifest if x['series'] == 'w60' and x.get('code') == '1039')
            for query in ['code=1039&series=w60', 'series=w60&code=1039&utm_source=test']:
                status, _, body = get('/pages/product-detail.html?' + query)
                assert status == 200
                assert body == (ROOT / 'build/public' / sample['target'].lstrip('/')).read_bytes()
            assert get('/pages/product-detail.html?series=ex64&code=Double+sheet')[0] == 200
            for path in ['/pages/product-detail.html?series=w60&code=constructor',
                         '/pages/product-detail.html?series=unknown&code=1039',
                         '/pages/product-detail.html?series=w60',
                         '/pages/products-list.html?series=series75',
                         '/missing-page.html', sample['target']]:
                assert get(path)[0] == 404, path
            for path, target in [('/pages/', '/pages/products-sr.html'),
                                 ('/pages', '/pages/products-sr.html'),
                                 ('/index.html?utm_source=test', '/?utm_source=test'),
                                 ('/pages/product-detail.html', '/pages/products.html')]:
                status, headers, _ = get(path)
                assert status == 301, (path, status)
                assert headers['Location'] == 'https://exalcoaluminium.com' + target
            status, headers, _ = get('/pages/product-detail.html?series=w60&code=1039',
                                     'www.exalcoaluminium.com')
            assert status == 301
            assert headers['Location'] == sample['url']
            assert get('/')[0] == 200, 'Homepage redirect loop'
            assert get('/data/w60.json')[0] == 200, 'Browser hydration data'
            for path, content_type in [('/js/detail-loader.js', 'application/javascript'),
                                       ('/css/main.css', 'text/css'),
                                       ('/assets/images/product-unavailable.svg', 'image/svg+xml')]:
                status, headers, _ = get(path)
                assert status == 200
                assert headers.get_content_type() == content_type, (path, headers)
            print(json.dumps({'initial_html_routes': len(manifest), 'query_variants': 3,
                              'negative_routes': 6, 'redirect_cases': 5,
                              'homepage_and_json': 'passed'}))
        finally:
            process.terminate()
            process.communicate(timeout=5)


if __name__ == '__main__':
    main()
