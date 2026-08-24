from pathlib import Path
import re

pattern = re.compile(
    r'\n?<section class="static-content-section container" data-content-boost="true">.*?Common examples include checking a deadline before booking travel.*?</section>',
    re.S,
)
changed=[]
for path in Path('.').rglob('index.html'):
    html=path.read_text(encoding='utf-8', errors='ignore')
    new,n=pattern.subn('', html)
    if n:
        path.write_text(new, encoding='utf-8')
        changed.append((str(path), n))
print(f'Removed known generic boost blocks from {len(changed)} pages')
for p,n in changed:
    print('REMOVED', n, p)
