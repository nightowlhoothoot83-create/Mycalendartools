from pathlib import Path
from html import unescape
import re

BAD_SIGNATURES = [
    'is commonly used for:',
    'astronomical or tidal calculations',
    'School holiday dates for New 2025',
    'School term dates for New 2025',
    'School holiday and public holiday dates for New.',
    'School term start and end dates for New.',
    'Countdown to Mother It runs',
    'Countdown to Father It runs',
    'Live countdown to St Patrick It runs',
    'NOAA tide times for US coastal stations',
    'Common examples include checking a deadline before booking travel',
    'MyCalendarTools keeps these tools lightweight and, wherever practical',
    'Choose the relevant year where available',
]

errors=[]
paragraphs={}

components=Path('components.js').read_text(encoding='utf-8')
if "fallbackFooter.remove()" not in components or "DOMContentLoaded" not in components:
    errors.append('components.js: dynamic footer must remove the static no-JavaScript fallback after parsing')
if "Both footers now stay visible" in components:
    errors.append('components.js: duplicate-footer implementation has returned')

for p in Path('.').rglob('*.html'):
    text=p.read_text(encoding='utf-8', errors='strict')
    for sig in BAD_SIGNATURES:
        if sig in text:
            errors.append(f'{p}: forbidden stale/generic signature: {sig!r}')
    controls=sorted({ord(c) for c in text if ord(c)<32 and c not in '\n\r\t'})
    if controls:
        errors.append(f'{p}: forbidden control characters: {controls}')
    title=re.search(r'<title>(.*?)</title>', text, re.S)
    h1=re.search(r'<h1[^>]*>(.*?)</h1>', text, re.S)
    if title and re.search(r'\b2025\b', re.sub(r'<[^>]+>','',title.group(1))):
        errors.append(f'{p}: stale 2025 title')
    if h1:
        h1_text=re.sub(r'&#\d+;|<[^>]+>','',h1.group(1)).strip()
        if not re.search(r'[A-Za-z]', h1_text):
            errors.append(f'{p}: H1 has no descriptive text')
        if re.search(r'\b2025\b', h1_text):
            errors.append(f'{p}: stale 2025 H1')
    if ('school-holidays' in p.parts or 'school-term-dates' in p.parts):
        school_text=text.replace('&copy; 2025', '')
        if re.search(r'\b2025\b', school_text):
            errors.append(f'{p}: stale 2025 school-calendar content')
    for raw in re.findall(r'<p(?:\s[^>]*)?>(.*?)</p>', text, re.S | re.I):
        paragraph=re.sub(r'\s+', ' ', unescape(re.sub(r'<[^>]+>', ' ', raw))).strip()
        if len(paragraph) >= 80:
            paragraphs.setdefault(paragraph, []).append(str(p))

for paragraph, files in paragraphs.items():
    if len(files) >= 3:
        errors.append(f'repeated generic paragraph across {len(files)} pages: {paragraph!r} ({", ".join(files)})')

# Country school pages must keep semantic H1 titles rather than putting the flag in H1.
for base,label in [('school-holidays','School Holidays'),('school-term-dates','School Term Dates')]:
    root=Path(base)
    if not root.exists():
        continue
    for p in root.glob('*/index.html'):
        text=p.read_text(encoding='utf-8')
        m=re.search(r'<h1>(.*?)</h1>', text, re.S)
        if not m or label not in re.sub(r'<[^>]+>','',m.group(1)):
            errors.append(f'{p}: H1 no longer contains {label!r}')
        if re.search(r'<div class="page-hero-icon"[^>]*>\s*[^<]{8,80}(?:School Holidays|School Term Dates)', text):
            errors.append(f'{p}: title appears to have regressed into the icon container')

if errors:
    print('\n'.join('ERROR '+e for e in errors))
    raise SystemExit(1)
print('MyCalendarTools content regression guard passed')
