MyCalendarTools

Final AdSense readiness correction branch: adsense/final-readiness-20260829

Current correction scope is intentionally narrow: broken clean routes, measured performance/accessibility issues, page-specific enrichment of genuinely thin indexable pages, and corrections where the audit exposed misleading tool behaviour or data.

Content enrichment completed in this pass:
- days-between
- weeks-between
- months-between
- date-calculator
- day-of-week
- week-number
- age-calculator
- countdown
- birthday-countdown
- time-zone
- reminders
- next-public-holiday

Accuracy/function corrections completed in this pass:
- fixed clean routing for /privacy/, /days-until-christmas/ and /days-between/
- corrected week-number to use ISO 8601 week/week-year logic rather than the previous non-ISO January-1 calculation
- corrected time-zone copy/FAQ so it accurately states that the entered datetime is interpreted in the device's local time zone and converted to the six listed cities
- corrected reminders copy so it no longer claims operating-system/browser push notifications that the implementation does not request
- replaced the inaccurate generic next-public-holiday dataset with clearly scoped, source-linked schedules: Queensland, New Zealand national observed dates, England and Wales bank holidays, US federal holidays, and CRA-recognised Canadian 2026 dates

Performance corrections completed in this pass:
- below-the-fold ecosystem/group-footer images now use lazy loading, async decoding and intrinsic dimensions
- the large Ascension Digital group-footer PNG was replaced in the shared component with an existing much smaller JPG while preserving the visual identity
- navigation/brand images now have intrinsic dimensions
- VentraIP affiliate image is lazy-loaded with dimensions
- long-lived cache headers added for static image assets; shared CSS/JS/consent assets receive a longer cache lifetime

Pages already containing substantial page-specific guidance, such as World Clock and Stopwatch & Timer, are preserved rather than padded with duplicate filler.

Each enriched page keeps the existing tool, design, FAQ and related links while replacing brief generic static sections with useful page-specific guidance. Do not restore generic data-content-boost filler or pad pages solely for word count.
