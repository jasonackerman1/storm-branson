// Banner: the Ballparks of America photo shows right away (CSS background).
// Their Vimeo video loads behind it and fades in only once it's actually
// playing, so the banner is never empty. If it never plays (Low Power Mode,
// blocked, slow connection), the photo just stays.
(function () {
  var VIDEO_ID = '1196142378';
  var media = document.getElementById('banner-media');
  var pageBg = document.getElementById('page-bg');
  var breakdown = document.querySelector('.roster-head');
  if (!media || !pageBg) return;

  // The background ends (fully faded) just above "The Breakdown". The cards
  // above it change height as data loads, so keep re-measuring.
  function sizeBg() {
    if (!breakdown) return;
    var top = breakdown.getBoundingClientRect().top - pageBg.offsetParent.getBoundingClientRect().top;
    pageBg.style.height = Math.max(200, Math.round(top - 8)) + 'px';
  }
  sizeBg();
  window.addEventListener('resize', sizeBg);
  window.addEventListener('load', sizeBg);
  if (window.ResizeObserver) new ResizeObserver(sizeBg).observe(document.querySelector('main') || document.body);

  // Keep the dashed route line level with the centers of the two logos.
  var route = document.querySelector('.route');
  var logos = document.querySelectorAll('.wordmark, .boa-logo');
  function alignRoute() {
    if (!route || logos.length < 2) return;
    var r = route.getBoundingClientRect();
    var a = logos[0].getBoundingClientRect(), b = logos[1].getBoundingClientRect();
    var logoMid = ((a.top + a.height / 2) + (b.top + b.height / 2)) / 2;
    route.style.setProperty('--route-offset', (r.top + r.height / 2 - logoMid).toFixed(1) + 'px');
  }
  alignRoute();
  window.addEventListener('resize', alignRoute);
  window.addEventListener('load', alignRoute);
  logos.forEach(function (img) { img.addEventListener('load', alignRoute); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignRoute);
  if (window.ResizeObserver && route) new ResizeObserver(alignRoute).observe(route.parentNode);

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (reduceMotion || saveData) return;

  var iframe = document.createElement('iframe');
  iframe.src = 'https://player.vimeo.com/video/' + VIDEO_ID + '?background=1&dnt=1&keyboard=0';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.title = '';
  iframe.tabIndex = -1;
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

  // Size the 16:9 video to cover the banner, like background-size: cover.
  function fit() {
    var w = media.offsetWidth, h = media.offsetHeight;
    if (w / h > 16 / 9) { iframe.style.width = w + 'px'; iframe.style.height = Math.ceil(w * 9 / 16) + 'px'; }
    else { iframe.style.height = h + 'px'; iframe.style.width = Math.ceil(h * 16 / 9) + 'px'; }
  }

  function send(msg) {
    if (iframe.contentWindow) iframe.contentWindow.postMessage(JSON.stringify(msg), 'https://player.vimeo.com');
  }

  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://player.vimeo.com' || e.source !== iframe.contentWindow) return;
    var data = e.data;
    if (typeof data === 'string') { try { data = JSON.parse(data); } catch (err) { return; } }
    if (!data) return;
    if (data.event === 'ready') {
      send({ method: 'addEventListener', value: 'timeupdate' });
    } else if ((data.event === 'playProgress' || data.event === 'timeupdate') && data.data && data.data.seconds > 0.25) {
      // Wait until frames are actually moving, so there's no black flash.
      media.classList.add('video-on');
    }
  });

  fit();
  window.addEventListener('resize', fit);
  if (window.ResizeObserver) new ResizeObserver(fit).observe(media);
  media.appendChild(iframe);
})();
