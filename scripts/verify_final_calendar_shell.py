from pathlib import Path

REQUIRED = [
    'id="brand-strip"',
    'id="nav"',
    'id="site-footer"',
    'id="group-footer"',
    '/components.js',
]
LEGACY_LOGOS = [
    'ascension-digital-new.jpg',
    'ascension-digital.jpg',
    'ascension-digital.png',
]

html_files = sorted(Path('.').rglob('*.html'))
if not html_files:
    raise SystemExit('No HTML files found')

failures = []
for path in html_files:
    text = path.read_text(encoding='utf-8', errors='replace')
    missing = [token for token in REQUIRED if token not in text]
    legacy = [token for token in LEGACY_LOGOS if token in text]
    if missing or legacy:
        failures.append((str(path), missing, legacy))

components = Path('components.js').read_text(encoding='utf-8', errors='replace')
if '/assets/perf/ascension-digital.webp' not in components:
    failures.append(('components.js', ['approved Ascension logo source'], []))
if 'style="width:220px' not in components and 'width:220px' not in components:
    failures.append(('components.js', ['approved 220px Ascension presentation'], []))

style = Path('style.css').read_text(encoding='utf-8', errors='replace')
if '.planning-card' not in style and '.card' not in style:
    failures.append(('style.css', ['card styling selectors'], []))

if failures:
    print(f'Calendar shell verification FAILED across {len(html_files)} HTML files')
    for path, missing, legacy in failures:
        print(f'- {path}')
        if missing:
            print('  missing: ' + ', '.join(missing))
        if legacy:
            print('  legacy logos: ' + ', '.join(legacy))
    raise SystemExit(1)

print(f'Calendar shell verification PASS: {len(html_files)} HTML files checked')
print('Approved Ascension logo source and presentation confirmed in components.js')
