// Queue calls immediately; do not count local builds or prerendering.
if (!navigator.webdriver && !['localhost', '127.0.0.1'].includes(location.hostname)) {
  window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
  window.ym.l = Date.now();
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://mc.yandex.ru/metrika/tag.js';
  document.head.appendChild(tag);
  ym(111108791, 'init', { defer: true, clickmap: true, webvisor: true, accurateTrackBounce: true, trackLinks: true });
}
