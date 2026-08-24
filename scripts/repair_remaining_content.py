from pathlib import Path
import re

FESTIVALS = {
    "days-until-chinese-new-year": (
        "Chinese New Year (Lunar New Year)",
        "Chinese New Year follows a lunisolar calendar, so its Gregorian date changes each year and falls between late January and February.",
        "family celebrations, travel, community events and planning around the Lunar New Year period"
    ),
    "days-until-diwali": (
        "Diwali",
        "Diwali is observed according to a lunisolar calendar, so its Gregorian date changes from year to year.",
        "festival planning, family gatherings, travel, events and checking how long remains until Diwali"
    ),
    "days-until-hanukkah": (
        "Hanukkah",
        "Hanukkah begins on 25 Kislev in the Hebrew calendar, so its Gregorian start date changes from year to year.",
        "family planning, travel, events and checking how long remains until the first night of Hanukkah"
    ),
}

pattern = re.compile(r'<section class="static-content-section container" data-static-seo="true">.*?</section>', re.S)
for slug, (name, note, useful) in FESTIVALS.items():
    path = Path(slug) / "index.html"
    html = path.read_text(encoding="utf-8")
    section = f'''<section class="static-content-section container" data-static-seo="true">
  <h2>About this {name} countdown</h2>
  <p>See how much time remains until the next {name} observance. {note}</p>

  <h2>How to use this page</h2>
  <ol>
    <li>Open the page to see the next displayed {name} date.</li>
    <li>Read the live countdown in days, hours, minutes and seconds.</li>
    <li>Use the date when planning celebrations, travel or events.</li>
    <li>For important arrangements, confirm the observance date with an appropriate calendar or community source.</li>
  </ol>

  <h2>When this page is useful</h2>
  <p>Useful for {useful}.</p>

  <h2>Privacy and accuracy</h2>
  <p>The countdown runs in your browser and does not require an account. Calendar dates for lunisolar and religious observances can vary by convention or location, so confirm important plans with an appropriate authoritative source.</p>
</section>'''
    new, n = pattern.subn(section, html, count=1)
    if n != 1:
        raise SystemExit(f"Static content block not found: {path}")
    path.write_text(new, encoding="utf-8")

about = Path("about/index.html")
html = about.read_text(encoding="utf-8")
old = '<li><strong style="color:var(--text)">Coastal tools</strong> — NOAA tide times for US coastal stations</li>'
new = '<li><strong style="color:var(--text)">Coastal tools</strong> — global tide and sea-level forecast information using the data source described on the Tide Times page</li>'
if old not in html:
    raise SystemExit("Expected stale NOAA About copy not found")
about.write_text(html.replace(old, new, 1), encoding="utf-8")

print("Repaired 3 festival pages and About tide description")
