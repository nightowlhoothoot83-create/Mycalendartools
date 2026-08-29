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
    'Enter the dates, numbers or options requested by the form on this page',
    'quick checks, household planning, school or work tasks',
]

NON_TOOL_ROOTS = {'about','contact','cookies','faq','privacy','terms'}
MIN_TOOL_WORDS = 300
errors=[]
paragraphs={}

components=Path('components.js').read_text(encoding='utf-8')
if "fallbackFooter.remove()" not in components or "DOMContentLoaded" not in components:
    errors.append('components.js: dynamic footer must remove the static no-JavaScript fallback after parsing')
if "Both footers now stay visible" in components:
    errors.append('components.js: duplicate-footer implementation has returned')
if '/assets/perf/ascension-digital.webp' not in components:
    errors.append('components.js: approved Ascension Digital footer logo reference missing')


def visible_words(html):
    # Count substantive page copy, not scripts/styles/schema or shared fallback/footer chrome.
    s=re.sub(r'<script\b[^>]*>[\s\S]*?</script>', ' ', html, flags=re.I)
    s=re.sub(r'<style\b[^>]*>[\s\S]*?</style>', ' ', s, flags=re.I)
    s=re.sub(r'<footer\b[^>]*>[\s\S]*?</footer>', ' ', s, flags=re.I)
    s=re.sub(r'<nav\b[^>]*>[\s\S]*?</nav>', ' ', s, flags=re.I)
    s=re.sub(r'<[^>]+>', ' ', s)
    s=unescape(s)
    return re.findall(r"\b[A-Za-z0-9][A-Za-z0-9’'\-]*\b", s)

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

    # Every real tool/reference page should contain enough page-specific explanation
    # to stand alone. 300 is a floor, not a target; we do not pad pages to a magic 600/800.
    rel=p.as_posix()
    root=p.parts[0] if len(p.parts)>1 else ''
    is_tool=(p.name=='index.html' and root and root not in NON_TOOL_ROOTS) or (p.parent.name in {'school-holidays','school-term-dates'})
    if is_tool and 'noindex' not in text.lower():
        count=len(visible_words(text))
        if count < MIN_TOOL_WORDS:
            errors.append(f'{p}: thin indexable tool/reference page ({count} visible words; minimum {MIN_TOOL_WORDS})')

    # All indexable pages use the shared visual shell.
    if 'noindex' not in text.lower() and p.as_posix() != 'index.html':
        if '/components.js' not in text:
            errors.append(f'{p}: shared components.js shell missing')
        if 'id="site-footer"' not in text or 'id="group-footer"' not in text:
            errors.append(f'{p}: shared site/group footer mount missing')

for paragraph, files in paragraphs.items():
    if len(files) >= 3:
        errors.append(f'repeated generic paragraph across {len(files)} pages: {paragraph!r} ({", ".join(files)})')

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

redirects=Path('_redirects').read_text(encoding='utf-8')
if re.search(r'^/[^\s]+/\s+/[^\s]+\.html\s+200', redirects, re.M):
    errors.append('_redirects: reverse clean-route to .html rewrite returned')

if errors:
    print('\n'.join('ERROR '+e for e in errors))
    raise SystemExit(1)
print('MyCalendarTools content regression guard passed')
