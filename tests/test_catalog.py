import importlib.util
import re
import tempfile
import unittest
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
def load(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / 'scripts' / (name + '.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class CatalogChecks(unittest.TestCase):
    def test_asset_manifest_matches_current_catalog(self):
        audit = load('audit_catalog')
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / 'js').mkdir()
            audit.write_assets(audit.audit(), root)
            self.assertEqual((root / 'js/catalog-assets.js').read_text(), (ROOT / 'js/catalog-assets.js').read_text())

    def test_sitemap_covers_series_and_codes_without_changing_identity(self):
        generator = load('update_sitemap')
        self.assertEqual(generator.generate(), (ROOT / 'sitemap.xml').read_bytes())

    def test_static_canonical_and_language_pairs(self):
        pages = [*ROOT.glob('*.html'), *ROOT.glob('pages/*.html')]
        for page in pages:
            text = page.read_text()
            if page.stem.startswith(('product-detail', 'products-list')):
                continue
            with self.subTest(page=page.name):
                canonical = re.findall(r'<link[^>]*rel="canonical"[^>]*>', text)
                self.assertEqual(len(canonical), 1)
                self.assertEqual(len(re.findall(r'<link[^>]*hreflang=', text)), 3)
                sr = bool(re.search(r'<html\b[^>]*\blang="sr"', text))
                footer_start = text.index('<footer')
                self.assertIn('EXALCO zastupništvo' if sr else 'EXALCO aluminium profile', text[footer_start:])

    def test_all_static_local_references_exist(self):
        for page in [*ROOT.glob('*.html'), *ROOT.glob('pages/*.html')]:
            for value in re.findall(r'(?:src|href)="([^"]+)"', page.read_text()):
                if value.startswith(('http', 'mailto:', 'tel:', '#', 'data:')) or '${' in value:
                    continue
                part = unquote(urlsplit(value).path)
                if not part:
                    continue
                target = ROOT / part.lstrip('/') if part.startswith('/') else page.parent / part
                self.assertTrue(target.exists(), f'{page.name}: {value}')


if __name__ == '__main__':
    unittest.main()
