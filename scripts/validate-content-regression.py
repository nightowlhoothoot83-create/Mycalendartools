from pathlib import Path
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
]

errors=[]
for p in Path('.').rglob('*.html'):
    text=p.read_text(encoding='utf-8', errors='strict')
    for sig in BAD_SIGNATURES:
        if sig in text:
            errors.append(f'{p}: forbidden stale/generic signature: {sig!r}')
    controls=sorted({ord(c) for c in text if ord(c)<32 and c not in '\n\r\t'})
    if controls:
        errors.append(f'{p}: forbidden control characters: {controls}')

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
