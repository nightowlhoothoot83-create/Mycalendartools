/* cookie-consent.js — MyCalendarTools */
(function () {
  'use strict';

  var CONSENT_KEY = 'cookieConsent';
  var adsReady = false;

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  /* Load and initialise AdSense only after consent is granted. */
  function activateAds() {
    function initialiseSlots() {
      var ads = document.querySelectorAll('ins.adsbygoogle');
      ads.forEach(function (ins) {
        if (!ins.dataset.adsbygoogleStatus) {
          try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
        }
      });
    }

    var existing = document.getElementById('consent-adsense-script');
    if (existing) {
      if (adsReady) initialiseSlots();
      else existing.addEventListener('load', initialiseSlots, { once: true });
      return;
    }

    var script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.id = 'consent-adsense-script';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1904958390525375';
    script.addEventListener('load', function () {
      adsReady = true;
      initialiseSlots();
    });
    document.head.appendChild(script);
  }

  function buildBanner() {
    var banner = document.createElement('div');
    banner.id = 'mct-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:99999',
      'background:rgba(8,8,20,0.97)', 'border-top:1px solid rgba(96,165,250,0.25)',
      'padding:16px 20px', 'display:flex', 'align-items:center',
      'justify-content:space-between', 'gap:16px', 'flex-wrap:wrap',
      'font-family:sans-serif', 'font-size:0.88rem', 'color:#cbd5e1',
      'backdrop-filter:blur(8px)'
    ].join(';');

    var msg = document.createElement('p');
    msg.style.cssText = 'margin:0;flex:1;min-width:200px;line-height:1.5';
    msg.innerHTML = 'We use essential storage to remember your choice. With permission, advertising cookies help keep these tools free. ' +
      '<a href="/cookies/" style="color:#60a5fa;text-decoration:underline">Cookie Policy</a> &middot; ' +
      '<a href="/privacy/" style="color:#60a5fa;text-decoration:underline">Privacy Policy</a>';

    var btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:10px;flex-shrink:0';

    var acceptBtn = document.createElement('button');
    acceptBtn.textContent = 'Accept';
    acceptBtn.style.cssText = 'background:#3b82f6;color:#fff;border:none;border-radius:8px;' +
      'padding:9px 18px;cursor:pointer;font-size:0.88rem;font-weight:600;white-space:nowrap';
    acceptBtn.addEventListener('click', function () {
      setConsent('granted');
      hideBanner();
      activateAds();
    });

    var declineBtn = document.createElement('button');
    declineBtn.textContent = 'Decline';
    declineBtn.style.cssText = 'background:transparent;color:#94a3b8;border:1px solid rgba(148,163,184,0.3);' +
      'border-radius:8px;padding:9px 18px;cursor:pointer;font-size:0.88rem;font-weight:600;white-space:nowrap';
    declineBtn.addEventListener('click', function () {
      var adsWereLoaded = !!document.getElementById('consent-adsense-script');
      setConsent('declined');
      hideBanner();
      if (adsWereLoaded) window.location.reload();
    });

    btns.appendChild(acceptBtn);
    btns.appendChild(declineBtn);
    banner.appendChild(msg);
    banner.appendChild(btns);
    return banner;
  }

  function hideBanner() {
    var b = document.getElementById('mct-cookie-banner');
    if (b) b.remove();
  }

  function addSettingsButton() {
    if (document.getElementById('mct-cookie-settings')) return;
    var button = document.createElement('button');
    button.id = 'mct-cookie-settings';
    button.type = 'button';
    button.textContent = 'Cookie settings';
    button.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99998;background:#080814;color:#cbd5e1;border:1px solid rgba(148,163,184,.4);border-radius:8px;padding:7px 10px;cursor:pointer;font:12px sans-serif';
    button.addEventListener('click', window.reopenCookiePreferences);
    document.body.appendChild(button);
  }

  /* Public: allow user to reopen preferences */
  window.reopenCookiePreferences = function () {
    hideBanner();
    var banner = buildBanner();
    document.body.appendChild(banner);
  };

  /* Init */
  function init() {
    addSettingsButton();
    var consent = getConsent();
    if (consent === 'granted') {
      activateAds();
    } else if (consent === 'declined') {
      /* No ads pushed */
    } else {
      /* Show banner */
      var banner = buildBanner();
      document.body.appendChild(banner);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
