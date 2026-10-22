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
