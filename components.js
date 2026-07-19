/* components.js — shared across all pages */

// ── Navigation ──
function renderNav() {
  const links = [
    { href: '/', label: 'Today' },
    { href: '/days-between/', label: 'Days Between' },
    { href: '/countdown/', label: 'Countdowns' },
    { href: '/moon-phase/', label: 'Moon Phase' },
    { href: '/school-holidays/', label: 'School Holidays' },
  ];
  const moreLinks = [
    { href: '/weeks-between/', label: '📅 Weeks Between' },
    { href: '/months-between/', label: '📅 Months Between' },
    { href: '/date-calculator/', label: '🗓️ Date Calculator' },
    { href: '/age-calculator/', label: '🎂 Age Calculator' },
    { href: '/day-of-week/', label: '📆 Day of Week' },
    { href: '/week-number/', label: '🔢 Week Number' },
    { href: '/time-zone/', label: '🌍 Time Zone Converter' },
    { href: '/world-clock/', label: '🕰️ World Clock' },
    { href: '/stopwatch-timer/', label: '⏱️ Stopwatch & Timer' },
    { href: '/reminders/', label: '🔔 Date Reminders' },
    { href: '/tides/', label: '🌊 Tide Times' },
    { href: '/printable-calendar/', label: '🖨️ Printable Calendar' },
    { href: '/year-at-glance/', label: '📊 Year at a Glance' },
    { href: '/moon-phases/', label: '🌕 Moon Calendar' },
    { href: '/zodiac/', label: '♈ Zodiac Signs' },
    { href: '/unique-holidays/', label: '🎉 Unique Holidays' },
    { href: '/next-public-holiday/', label: '🏖️ Next Public Holiday' },
  ];
  return `
  <nav class="site-nav">
    <div class="nav-inner">
      <a href="/" class="nav-logo">
        <img src="/mycalendartools-logo.jpg" alt="MyCalendarTools" class="nav-logo-icon">
        <span class="nav-logo-text">MyCalendarTools</span>
      </a>
      <ul class="nav-links">
        ${links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
        <li class="nav-dropdown">
          <a class="nav-dropdown-toggle" href="/" aria-haspopup="true">More ▾</a>
          <div class="nav-dropdown-menu">
            ${moreLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
          </div>
        </li>
      </ul>
      <a href="https://www.wheelnamepicker.com.au" class="nav-sister-pill" target="_blank" rel="noopener" title="Wheel Name Picker">🎡 WheelPicker</a>
      <a href="https://www.mycalctools.net" class="nav-sister-pill" target="_blank" rel="noopener">🧮 MyCalcTools</a>
      <button class="nav-hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
  <div class="nav-mobile-menu" id="mobileMenu">
    ${links.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
    ${moreLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
    <a href="https://www.wheelnamepicker.com.au" target="_blank" rel="noopener">🎡 Wheel Name Picker</a>
    <a href="https://www.mycalctools.net" target="_blank" rel="noopener">🧮 MyCalcTools</a>
  </div>`;
}

// ── Brand Strip ──
function renderBrandStrip() {
  return `
  <div class="rs-brand-strip">
    <div class="rs-brand-left">
      <a href="https://pod.raven-sharp.com/login" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;text-decoration:none">
        <img src="/raven-sharp.jpg" alt="Raven Sharp" style="width:32px;height:32px;border-radius:8px;object-fit:cover;filter:drop-shadow(0 0 6px rgba(6,100,255,0.5))">
        <span style="font-weight:700;font-size:0.9rem;color:var(--text,#e8eaf6);letter-spacing:0.02em">Raven Sharp <span style="color:var(--muted,#94a3b8);font-weight:400">Tools</span></span>
      </a>
    </div>
    <a href="/about/#support" class="rs-support-pill">Support Us</a>
  </div>`;
}

// ── Site Footer ──
function renderSiteFooter() {
  // NOTE: previously hid the static fallback footer here once the dynamic
  // one loaded. Removed that — hidden (display:none) content that's
  // technically present in the HTML can read as concealed/cloaked content
  // to automated policy review, which very plausibly explains the earlier
  // AdSense policy rejection on this site. Both footers now stay visible.
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="nav-logo">
            <img src="/mycalendartools-logo.jpg" alt="MyCalendarTools" class="nav-logo-icon">
            <span class="nav-logo-text">MyCalendarTools</span>
          </a>
          <p>Free date tools, moon phases, school holidays and countdowns. No accounts. No noise. Just answers.</p>
          <p style="margin-top:8px;font-size:0.78rem;color:var(--dim)">Part of the Ascension Digital Group</p>
        </div>
        <div class="footer-col">
          <h4>Date Tools</h4>
          <ul>
            <li><a href="/days-between/">Days Between Dates</a></li>
            <li><a href="/weeks-between/">Weeks Between</a></li>
            <li><a href="/months-between/">Months Between</a></li>
            <li><a href="/date-calculator/">Date Calculator</a></li>
            <li><a href="/age-calculator/">Age Calculator</a></li>
            <li><a href="/day-of-week/">Day of Week</a></li>
            <li><a href="/week-number/">Week Number</a></li>
            <li><a href="/time-zone/">Time Zone Converter</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Calendar & Planning</h4>
          <ul>
            <li><a href="/printable-calendar/">Printable Calendar</a></li>
            <li><a href="/year-at-glance/">Year at a Glance</a></li>
            <li><a href="/next-public-holiday/">Next Public Holiday</a></li>
            <li><a href="/school-holidays/">School Holidays</a></li>
            <li><a href="/moon-phase/">Moon Phase</a></li>
            <li><a href="/moon-phases/">Moon Calendar</a></li>
            <li><a href="/zodiac/">Zodiac Signs</a></li>
            <li><a href="/unique-holidays/">Unique Holidays</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Info</h4>
          <ul>
            <li><a href="/about/">About</a></li>
            <li><a href="/contact/">Contact</a></li>
            <li><a href="/faq/">FAQ</a></li>
            <li><a href="/privacy/">Privacy Policy</a></li>
            <li><a href="/terms/">Terms of Use</a></li>
            <li><a href="/sitemap.html">Sitemap</a></li>
            <li><a href="https://www.mycalctools.net" target="_blank" rel="noopener">🧮 MyCalcTools</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 MyCalendarTools · Part of the <a href="https://ascensiondigitalgroup.com" target="_blank" rel="noopener" style="color:var(--cyan,#06d6ff);text-decoration:none"><strong>Ascension Digital Group</strong></a></p>
        <p><a href="https://www.mycalctools.net" target="_blank" rel="noopener" style="color:var(--dim)">Sister site: mycalctools.net</a></p>
      </div>
    </div>
  </footer>`;
}

// ── Ascension Group Footer ──
function renderGroupFooter() {
  return `
  <div class="rs-footer">
    <a href="https://ascensiondigitalgroup.com" target="_blank" rel="noopener">
      <img src="/ascension-digital.png" alt="Ascension Digital" class="ascension-logo" style="width:220px;height:auto;border-radius:12px;margin:0 auto 20px;display:block;filter:drop-shadow(0 0 16px rgba(6,214,255,0.3))">
    </a>
    <h3>Part of the Ascension Digital Group</h3>
    <p class="rs-footer-tagline">Elevating Your Digital Future</p>
    <div class="rs-footer-links" style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-bottom:24px;align-items:center">
      <a href="/" title="MyCalendarTools" style="opacity:0.85;transition:opacity 0.2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85">
        <img src="/mycalendartools-logo.jpg" alt="MyCalendarTools" style="width:52px;height:52px;border-radius:12px;object-fit:cover">
      </a>
      <a href="https://www.mycalctools.net" target="_blank" rel="noopener" title="MyCalcTools" style="opacity:0.85;transition:opacity 0.2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85">
        <img src="/mycalctools-logo.png" alt="MyCalcTools" style="width:52px;height:52px;border-radius:12px;object-fit:cover">
      </a>
      <a href="https://www.wheelnamepicker.com.au" target="_blank" rel="noopener" title="Wheel Name Picker" style="opacity:0.85;transition:opacity 0.2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85">
        <img src="/wheelnamepicker-logo.png" alt="Wheel Name Picker" style="width:52px;height:52px;border-radius:12px;object-fit:cover">
      </a>
      <a href="https://pod.raven-sharp.com/login" target="_blank" rel="noopener" title="Raven Sharp" style="opacity:0.85;transition:opacity 0.2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85">
        <img src="/raven-sharp.jpg" alt="Raven Sharp" style="width:52px;height:52px;border-radius:12px;object-fit:cover">
      </a>
      <a href="https://zyia-creations.printify.me/" target="_blank" rel="noopener" title="Zyia Creations">
        <img src="/zyia-creations.png" alt="Zyia Creations" style="width:52px;height:52px;border-radius:12px;object-fit:cover;opacity:0.85;transition:opacity 0.2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85">
      </a>
      <a href="https://zyiacreations.etsy.com" target="_blank" rel="noopener" title="ADG Downloads">
        <img src="/adg-downloads.png" alt="ADG Downloads" style="width:52px;height:52px;border-radius:12px;object-fit:cover;opacity:0.85;transition:opacity 0.2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85">
      </a>
      <a href="https://www.facebook.com/share/18Ma3KsJTo/" target="_blank" rel="noopener" title="Feed the Feed">
        <img src="/feed-the-feed.jpg" alt="Feed the Feed" style="width:52px;height:52px;border-radius:12px;object-fit:cover;opacity:0.85;transition:opacity 0.2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85">
      </a>
      <a href="http://www.youtube.com/@spewcrewkids" target="_blank" rel="noopener" title="Spew Crew Kids">
        <img src="/spew-crew.png" alt="Spew Crew Kids" style="width:52px;height:52px;border-radius:12px;object-fit:cover;background:#000;opacity:0.85;transition:opacity 0.2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85">
      </a>
      <a href="https://mysticalmoments.pages.dev" target="_blank" rel="noopener" title="Mystical Moments Photography">
        <img src="/mystical-moments.png" alt="Mystical Moments" style="width:52px;height:52px;border-radius:12px;object-fit:cover;opacity:0.85;transition:opacity 0.2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85">
      </a>
    </div>
    <a href="/about/#support" class="btn-primary">Support Us</a>
  </div>`;
}

// ── Hosting Affiliate Banner ──
function renderHostingAffiliate() {
  return `<div class="affiliate-banner card container"><a href="https://ventraip.com.au/affiliate/uJmhYi4h" target="_blank" rel="sponsored noopener"><img src="/ventraip-affiliate-banner.jpg" alt="VentraIP Australian website hosting affiliate banner"></a></div>`;
}

// ── FAQ init ──
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      document.querySelectorAll('.faq-question.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
}

// ── Hamburger ──
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
    });
  }
}

// ── Moon Phase calculation ──
function getMoonPhase(date) {
  const d = date || new Date();
  const year = d.getFullYear(), month = d.getMonth() + 1, day = d.getDate();
  let c = 0, e = 0, jd = 0;
  if (month < 3) { const y = year - 1; const m = month + 12; c = 365.25 * y; e = 30.6 * (m + 1); jd = c + e + day - 694039.09; }
  else { c = 365.25 * year; e = 30.6 * (month + 1); jd = c + e + day - 694039.09; }
  jd /= 29.5305882;
  const b = Math.floor(jd);
  jd -= b;
  const phase = Math.round(jd * 8) % 8;
  const phases = [
    { name: 'New Moon', emoji: '🌑', illumination: '0%' },
    { name: 'Waxing Crescent', emoji: '🌒', illumination: '~25%' },
    { name: 'First Quarter', emoji: '🌓', illumination: '50%' },
    { name: 'Waxing Gibbous', emoji: '🌔', illumination: '~75%' },
    { name: 'Full Moon', emoji: '🌕', illumination: '100%' },
    { name: 'Waning Gibbous', emoji: '🌖', illumination: '~75%' },
    { name: 'Last Quarter', emoji: '🌗', illumination: '50%' },
    { name: 'Waning Crescent', emoji: '🌘', illumination: '~25%' },
  ];
  return phases[phase];
}

// ── Zodiac ──
function getZodiac(date) {
  const d = date || new Date();
  const m = d.getMonth() + 1, day = d.getDate();
  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return { name: 'Aries', emoji: '♈', element: 'Fire', dates: 'Mar 21 – Apr 19' };
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return { name: 'Taurus', emoji: '♉', element: 'Earth', dates: 'Apr 20 – May 20' };
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return { name: 'Gemini', emoji: '♊', element: 'Air', dates: 'May 21 – Jun 20' };
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return { name: 'Cancer', emoji: '♋', element: 'Water', dates: 'Jun 21 – Jul 22' };
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return { name: 'Leo', emoji: '♌', element: 'Fire', dates: 'Jul 23 – Aug 22' };
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return { name: 'Virgo', emoji: '♍', element: 'Earth', dates: 'Aug 23 – Sep 22' };
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return { name: 'Libra', emoji: '♎', element: 'Air', dates: 'Sep 23 – Oct 22' };
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return { name: 'Scorpio', emoji: '♏', element: 'Water', dates: 'Oct 23 – Nov 21' };
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return { name: 'Sagittarius', emoji: '♐', element: 'Fire', dates: 'Nov 22 – Dec 21' };
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return { name: 'Capricorn', emoji: '♑', element: 'Earth', dates: 'Dec 22 – Jan 19' };
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return { name: 'Aquarius', emoji: '♒', element: 'Air', dates: 'Jan 20 – Feb 18' };
  return { name: 'Pisces', emoji: '♓', element: 'Water', dates: 'Feb 19 – Mar 20' };
}

function daysUntil(month, day) {
  const now = new Date();
  let target = new Date(now.getFullYear(), month - 1, day);
  if (target <= now) target.setFullYear(now.getFullYear() + 1);
  return Math.ceil((target - now) / 86400000);
}

function getEaster(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function daysUntilEaster() {
  const now = new Date();
  let easter = getEaster(now.getFullYear());
  if (easter <= now) easter = getEaster(now.getFullYear() + 1);
  return Math.ceil((easter - now) / 86400000);
}

const UNIQUE_HOLIDAYS = [
  { month: 1, day: 4, name: 'World Trivia Day', emoji: '🧠', desc: 'Celebrate knowledge and fun facts.' },
  { month: 2, day: 9, name: 'National Pizza Day', emoji: '🍕', desc: 'Celebrate everyone\'s favourite food.' },
  { month: 3, day: 14, name: 'Pi Day', emoji: '🥧', desc: '3.14159... and counting.' },
  { month: 4, day: 1, name: 'April Fools\' Day', emoji: '🤡', desc: 'Pranks and mischief all day.' },
  { month: 5, day: 4, name: 'Star Wars Day', emoji: '⚔️', desc: 'May the Fourth be with you.' },
  { month: 6, day: 8, name: 'World Ocean Day', emoji: '🌊', desc: 'Celebrate and protect our oceans.' },
  { month: 7, day: 17, name: 'World Emoji Day', emoji: '😊', desc: 'Because 📅 is the calendar emoji.' },
  { month: 8, day: 8, name: 'International Cat Day', emoji: '🐱', desc: 'All hail our feline overlords.' },
  { month: 9, day: 19, name: 'Talk Like a Pirate Day', emoji: '🏴‍☠️', desc: 'Arr, matey!' },
  { month: 10, day: 4, name: 'World Animal Day', emoji: '🐾', desc: 'Celebrate all creatures great and small.' },
  { month: 11, day: 13, name: 'World Kindness Day', emoji: '💛', desc: 'A small act can change someone\'s day.' },
  { month: 12, day: 9, name: 'Christmas Card Day', emoji: '💌', desc: 'Time to write those cards.' },
];

function getTodayHoliday() {
  const now = new Date();
  const m = now.getMonth() + 1, d = now.getDate();
  return UNIQUE_HOLIDAYS.find(h => h.month === m && h.day === d) || UNIQUE_HOLIDAYS[now.getDate() % UNIQUE_HOLIDAYS.length];
}

document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initHamburger();
});
