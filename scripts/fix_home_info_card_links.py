from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

repls = {
'''          <div class="info-feature-card card">
            <div class="info-feature-icon">📅</div>
            <h3>Date Calculators</h3>''': '''          <a href="/date-calculator/" class="info-feature-card card" aria-label="Open Date Calculator">
            <div class="info-feature-icon">📅</div>
            <h3>Date Calculators</h3>''',
'''          <div class="info-feature-card card">
            <div class="info-feature-icon">⏳</div>
            <h3>Countdowns</h3>''': '''          <a href="/countdown/" class="info-feature-card card" aria-label="Open Custom Countdown">
            <div class="info-feature-icon">⏳</div>
            <h3>Countdowns</h3>''',
'''          <div class="info-feature-card card">
            <div class="info-feature-icon">🌕</div>
            <h3>Astronomy & Moon</h3>''': '''          <a href="/moon-phase/" class="info-feature-card card" aria-label="Open Moon Phase tool">
            <div class="info-feature-icon">🌕</div>
            <h3>Astronomy & Moon</h3>''',
'''          <div class="info-feature-card card">
            <div class="info-feature-icon">🏫</div>
            <h3>School & Public Holidays</h3>''': '''          <a href="/school-holidays/" class="info-feature-card card" aria-label="Open School Holidays tool">
            <div class="info-feature-icon">🏫</div>
            <h3>School & Public Holidays</h3>''',
'''          <div class="info-feature-card card">
            <div class="info-feature-icon">🕰️</div>
            <h3>Time & World Clock</h3>''': '''          <a href="/world-clock/" class="info-feature-card card" aria-label="Open World Clock">
            <div class="info-feature-icon">🕰️</div>
            <h3>Time & World Clock</h3>''',
'''          <div class="info-feature-card card">
            <div class="info-feature-icon">🖨️</div>
            <h3>Printable Calendars</h3>''': '''          <a href="/printable-calendar/" class="info-feature-card card" aria-label="Open Printable Calendar">
            <div class="info-feature-icon">🖨️</div>
            <h3>Printable Calendars</h3>''',
}

for old, new in repls.items():
    if old not in s:
        raise SystemExit(f'Missing expected card start: {old.splitlines()[-1]}')
    s = s.replace(old, new, 1)

# Convert the six matching closing tags in this section to anchor closings.
start = s.index('<h2 class="section-title">Everything You Need to Plan Your Time</h2>')
end = s.index('<div class="info-howto card"', start)
block = s[start:end]
for title in ['Date Calculators','Countdowns','Astronomy & Moon','School & Public Holidays','Time & World Clock','Printable Calendars']:
    pos = block.index(f'<h3>{title}</h3>')
    close = block.index('</div>', pos)
    block = block[:close] + '</a>' + block[close+6:]
s = s[:start] + block + s[end:]

# Ensure linked cards retain card appearance and do not inherit default anchor decoration.
style_marker = '</head>'
css = '''<style id="home-info-card-links-fix">\n.info-feature-card{display:block;color:inherit;text-decoration:none}\n.info-feature-card:hover,.info-feature-card:focus-visible{text-decoration:none}\n</style>\n'''
if 'home-info-card-links-fix' not in s:
    s = s.replace(style_marker, css + style_marker, 1)

p.write_text(s, encoding='utf-8')
out = p.read_text(encoding='utf-8')
checks = ['/date-calculator/','/countdown/','/moon-phase/','/school-holidays/','/world-clock/','/printable-calendar/']
for href in checks:
    assert f'href="{href}" class="info-feature-card card"' in out
print('Homepage planning cards now link to internal tools')
