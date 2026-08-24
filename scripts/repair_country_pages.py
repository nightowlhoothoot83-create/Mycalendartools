from pathlib import Path
import re

COUNTRIES = {
    "australia": ("Australia", "&#127462;&#127482;"),
    "united-kingdom": ("United Kingdom", "&#127468;&#127463;"),
    "united-states": ("United States", "&#127482;&#127480;"),
    "new-zealand": ("New Zealand", "&#127475;&#127487;"),
    "canada": ("Canada", "&#127464;&#127462;"),
    "south-africa": ("South Africa", "&#127487;&#127462;"),
}

GENERIC_BOOST = re.compile(r'\n?<section class="static-content-section container" data-content-boost="true">.*?Common examples include checking a deadline before booking travel.*?</section>', re.S)

for kind, label in [("school-holidays", "School Holidays"), ("school-term-dates", "School Term Dates")]:
    base = Path(kind)
    if not base.exists():
        continue
    for slug, (country, flag) in COUNTRIES.items():
        path = base / slug / "index.html"
        if not path.exists():
            continue
        html = path.read_text(encoding="utf-8")
        title = f"{country} {label} 2025"
        if kind == "school-holidays":
            desc = f"School holiday and term-break information for {country} in 2025. Check the relevant education authority or school for final local dates."
            hero_desc = f"School holiday and term-break dates for {country}."
        else:
            desc = f"School term start and end date information for {country} in 2025. Check the relevant education authority or school for final local dates."
            hero_desc = f"School term start and end dates for {country}."

        html = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', html, count=1)
        html = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{desc}">', html, count=1)
        html = re.sub(r'("description":\s*")[^"]*(")', lambda m: m.group(1)+desc+m.group(2), html, count=1)

        hero = re.compile(r'<section class="page-hero container">\s*<div class="page-hero-icon"([^>]*)>.*?</div>\s*<h1>.*?</h1><p>.*?</p>\s*</section>', re.S)
        replacement = f'''<section class="page-hero container">
    <div class="page-hero-icon"\1>{flag}</div>
    <h1>{title}</h1><p>{hero_desc}</p>
  </section>'''
        html, n = hero.subn(replacement, html, count=1)
        if n != 1:
            raise SystemExit(f"Hero pattern not found: {path}")

        html = GENERIC_BOOST.sub('', html)
        path.write_text(html, encoding="utf-8")

print("Repaired school country metadata, hero structure and known generic boost blocks")
