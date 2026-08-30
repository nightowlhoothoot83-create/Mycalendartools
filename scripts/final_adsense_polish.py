from pathlib import Path

MARKER = "/* ADG FINAL ADSENSE POLISH 2026-08-30 */"
CSS = r'''

/* ADG FINAL ADSENSE POLISH 2026-08-30 */
:where(.card,.tool-card,.info-card,.related-card,.feature-card,.planning-card,.static-content-section,.faq-item){
  border-color:rgba(139,92,246,.30)!important;
  box-shadow:0 10px 30px rgba(0,0,0,.20),0 0 20px rgba(6,214,255,.07),0 0 16px rgba(139,92,246,.06);
}
:where(.card,.tool-card,.info-card,.related-card,.feature-card,.planning-card,.static-content-section,.faq-item):hover{
  border-color:rgba(6,214,255,.42)!important;
  box-shadow:0 12px 34px rgba(0,0,0,.24),0 0 24px rgba(6,214,255,.12),0 0 20px rgba(139,92,246,.10);
}
:where(.btn-primary,.btn-secondary,.rs-support-pill,.faq-question,button[type="submit"],a[class*="btn"],button[class*="btn"]){
  box-shadow:0 0 18px rgba(139,92,246,.18),0 0 12px rgba(6,214,255,.08);
}
:where(.ascension-logo,.foot-adg-logo,img[alt="Ascension Digital"],img[alt="Ascension Digital Group"]){
  display:block!important;width:min(220px,72vw)!important;max-width:220px!important;height:auto!important;object-fit:contain!important;margin-left:auto!important;margin-right:auto!important;
}
@media(max-width:768px){
  .site-nav,.card,.tool-card,.info-card{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
  body::before{background-image:none!important}
  :where(.card,.tool-card,.info-card,.related-card,.feature-card,.planning-card,.static-content-section,.faq-item){box-shadow:0 6px 18px rgba(0,0,0,.18),0 0 10px rgba(139,92,246,.06)}
  :where(.btn-primary,.btn-secondary,.rs-support-pill,.faq-question,button[type="submit"],a[class*="btn"],button[class*="btn"]){box-shadow:0 0 10px rgba(139,92,246,.12)}
}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
'''

root = Path('.')
style = root / 'style.css'
text = style.read_text(encoding='utf-8')
if MARKER not in text:
    style.write_text(text.rstrip() + CSS + "\n", encoding='utf-8')

replacements = {
    '/ascension-digital.jpg': '/assets/perf/ascension-digital.webp',
    'ascension-digital.jpg': '/assets/perf/ascension-digital.webp',
    '/ascension-digital.png': '/assets/perf/ascension-digital.webp',
    'ascension-digital.png': '/assets/perf/ascension-digital.webp',
    '/ascension-digital-new.jpg': '/assets/perf/ascension-digital.webp',
    'ascension-digital-new.jpg': '/assets/perf/ascension-digital.webp',
}
BOOT = '''\n<script data-adg-shell-bootstrap="true">\ndocument.addEventListener('DOMContentLoaded',function(){\n  var b=document.getElementById('brand-strip'),n=document.getElementById('nav'),s=document.getElementById('site-footer'),g=document.getElementById('group-footer');\n  if(b&&typeof renderBrandStrip==='function')b.innerHTML=renderBrandStrip();\n  if(n&&typeof renderNav==='function')n.innerHTML=renderNav();\n  if(s&&typeof renderSiteFooter==='function')s.innerHTML=renderSiteFooter();\n  if(g&&typeof renderGroupFooter==='function')g.innerHTML=renderGroupFooter();\n});\n</script>\n'''

for p in root.rglob('*.html'):
    if '.git' in p.parts:
        continue
    data = p.read_text(encoding='utf-8', errors='ignore')
    new = data
    for old, rep in replacements.items():
        new = new.replace(old, rep)

    lower = new.lower()
    if '<body' in lower:
        body_end = new.find('>', lower.find('<body')) + 1
        top = ''
        if 'id="brand-strip"' not in lower and "id='brand-strip'" not in lower:
            top += '\n<div id="brand-strip"></div>'
        if 'id="nav"' not in lower and "id='nav'" not in lower:
            top += '\n<div id="nav"></div>'
        if top:
            new = new[:body_end] + top + new[body_end:]

    lower = new.lower()
    tail = ''
    if 'id="site-footer"' not in lower and "id='site-footer'" not in lower:
        tail += '\n<div id="site-footer"></div>'
    if 'id="group-footer"' not in lower and "id='group-footer'" not in lower:
        tail += '\n<div id="group-footer"></div>'
    if tail and '</body>' in lower:
        idx = lower.rfind('</body>')
        new = new[:idx] + tail + new[idx:]

    lower = new.lower()
    if '/components.js' not in lower and '</body>' in lower:
        idx = lower.rfind('</body>')
        new = new[:idx] + '\n<script src="/components.js"></script>\n' + BOOT + new[idx:]
    elif 'data-adg-shell-bootstrap' not in lower and '</body>' in lower:
        # Existing pages often contain page-local render calls; only add fallback when none are present.
        if 'renderbrandstrip()' not in lower or 'rendersitefooter()' not in lower or 'rendergroupfooter()' not in lower:
            idx = lower.rfind('</body>')
            new = new[:idx] + BOOT + new[idx:]

    if new != data:
        p.write_text(new, encoding='utf-8')

for p in root.rglob('*.js'):
    if '.git' in p.parts:
        continue
    data = p.read_text(encoding='utf-8', errors='ignore')
    new = data
    for old, rep in replacements.items():
        new = new.replace(old, rep)
    if new != data:
        p.write_text(new, encoding='utf-8')
