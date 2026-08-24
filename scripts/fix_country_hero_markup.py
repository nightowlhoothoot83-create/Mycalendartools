from pathlib import Path

style=' style="background:linear-gradient(135deg,rgba(6,214,255,0.12),rgba(139,92,246,0.12));border:1px solid rgba(6,214,255,0.2)"'
changed=[]
for base in (Path('school-holidays'), Path('school-term-dates')):
    if not base.exists():
        continue
    for path in base.glob('*/index.html'):
        html=path.read_text(encoding='utf-8', errors='strict')
        new=html.replace('<div class="page-hero-icon"\x01>', f'<div class="page-hero-icon"{style}>')
        if new != html:
            path.write_text(new, encoding='utf-8')
            changed.append(str(path))
print(f'Fixed hero markup in {len(changed)} country pages')
for p in changed: print('FIXED', p)
