// Road to Ballparks: mark the phases that are done and the one that's up next.
(function () {
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var current = null;
  document.querySelectorAll('#road li').forEach(function (li) {
    var by = new Date(li.getAttribute('data-by') + 'T00:00:00');
    if (by < today) li.classList.add('done');
    else if (!current) { current = li; li.classList.add('next'); }
  });
})();

// "Last checked" note: a weekly GitHub Action compares this section's sources
// on ballparksofamerica.com and records the date in data/boa-check.json.
(function () {
  var el = document.getElementById('prep-checked');
  if (!el || !window.fetch) return;
  fetch('data/boa-check.json?_=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.lastChecked) return;
      var day = new Date(d.lastChecked + 'T00:00:00');
      el.textContent = 'Checked against ballparksofamerica.com weekly · last checked ' +
        day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      el.hidden = false;
    })
    .catch(function () {});
})();
