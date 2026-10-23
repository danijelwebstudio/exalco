#!/usr/bin/env python3
"""Keep the published query URLs; never deduplicate by product code alone."""
import json
from pathlib import Path
from urllib.parse import urlencode
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://exalcoaluminium.com'
NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'
ET.register_namespace('', NS)


def generate(root=ROOT):
    urls = [BASE + '/', BASE + '/index-en.html']
    for page in ('about-us', 'ceo-message', 'contact', 'gallery', 'products', 'privacy'):
        urls.extend(BASE + '/pages/' + page + suffix + '.html' for suffix in ('-sr', ''))
    for source in sorted((root / 'data').glob('*.json')):
        if not source.stat().st_size:  # Unused series75 placeholder is not a catalog.
            continue
        data = json.loads(source.read_text(encoding='utf-8'))
        for suffix in ('-sr', ''):
            urls.append(BASE + '/pages/products-list' + suffix + '.html?' + urlencode({'series': source.stem}))
            for code in data:
                # encodeURIComponent uses %20 for spaces, not +.
                query = urlencode({'series': source.stem, 'code': code}).replace('+', '%20')
                urls.append(BASE + '/pages/product-detail' + suffix + '.html?' + query)
    tree = ET.Element('{' + NS + '}urlset')
    for url in urls:
        node = ET.SubElement(tree, '{' + NS + '}url')
        ET.SubElement(node, '{' + NS + '}loc').text = url
    ET.indent(tree, space='  ')
    return ET.tostring(tree, encoding='utf-8', xml_declaration=True) + b'\n'


if __name__ == '__main__':
    output = generate()
    (ROOT / 'sitemap.xml').write_bytes(output)
    print('Generated sitemap with', output.count(b'<loc>'), 'URLs')
