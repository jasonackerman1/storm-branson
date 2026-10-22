(function () {
  'use strict';

  var CONFIG = window.BRANSON_CONFIG || {};
  // The whole tracker is one tab. Every name in the Player column gets a jersey
  // (its # can be on any of that player's rows); rows with an Amount are money
  // received; Sponsor rows with a Status and no Amount have been asked but
  // haven't paid yet.
  var TAB = { name: 'Tracker', needs: ['player', 'number', 'from', 'amount'] };
  // Back of a baseball jersey (where the name and number go): ribbed collar,
  // short set-in sleeves with striped cuffs, shirttail hem with side slits.
  var JERSEY_PATH = 'M45 8 Q60 2.5 75 8 Q88 10 102 15 L118 42 L100 53 L91 39 L92 100 L93 103 C86 112 72 116 60 116 C48 116 34 112 27 103 L28 100 L29 39 L20 53 L2 42 L18 15 Q32 10 45 8 Z';
  var FILL_TOP = 8, FILL_BOTTOM = 116;
  // Fabric drawn over the fill (clipped to the jersey), so it still reads as a
  // jersey at any fill level: knit texture, lighting, soft folds, seams, cuff
  // stripes, collar band and hem stitching.
  var JERSEY_DETAILS =
    '<rect width="120" height="120" fill="url(#g-knit)"/>' +
    '<rect width="120" height="120" fill="url(#g-light)"/>' +
    '<rect width="120" height="120" fill="url(#g-shade)"/>' +
    '<g filter="url(#f-soft)" fill="none" stroke-linecap="round">' +
      '<g stroke="#000" stroke-opacity=".55">' +
        '<path d="M22 19 Q28 29 27 40 M98 19 Q92 29 93 40" stroke-width="3"/>' +
        '<path d="M31 45 Q41 53 45 66 M89 45 Q79 53 75 66" stroke-width="3.2"/>' +
        '<path d="M34 84 Q50 79 66 86 Q76 90 86 83" stroke-width="2.4" stroke-opacity=".5"/>' +
        '<path d="M38 94 Q41 102 38 111 M84 92 Q81 101 83 110" stroke-width="2" stroke-opacity=".45"/>' +
        '<path d="M9 34 Q15 37 18 47 M111 34 Q105 37 102 47" stroke-width="2.6"/>' +
        '<path d="M47 15 Q60 18 73 15" stroke-width="1.6" stroke-opacity=".4"/>' +
      '</g>' +
      '<g stroke="#fff" stroke-opacity=".16">' +
        '<path d="M34 43 Q44 51 48 64 M86 43 Q76 51 72 64" stroke-width="2.2"/>' +
        '<path d="M35 81 Q50 76 65 83" stroke-width="1.8"/>' +
        '<path d="M36 24 Q46 21 54 27 M84 24 Q74 21 66 27" stroke-width="3"/>' +
        '<path d="M12 31 Q18 33 22 41" stroke-width="2"/>' +
      '</g>' +
    '</g>' +
    '<path d="M24 13 Q31 26 29 39 M96 13 Q89 26 91 39" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="1"/>' +
    '<path d="M25.4 13.6 Q32.4 26 30.4 39 M94.6 13.6 Q87.6 26 89.6 39" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".45" stroke-dasharray="1.2 1"/>' +
    '<path d="M-1 37 L26 53 M121 37 L94 53" stroke="#f4ede1" stroke-width="2.2"/>' +
    '<path d="M0.6 34.6 L27.2 50.8 M119.4 34.6 L92.8 50.8" stroke="#d00018" stroke-width="1.3"/>' +
    '<path d="M28 97 C35 107 48 111 60 111 C72 111 85 107 92 97" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width=".5" stroke-dasharray="1.3 1.1"/>' +
    '';
  // Back collar: the inside of the front collar shows as a thin dark sliver
  // behind a nearly flat back collar band, with a logo patch below it (drawn
  // outside the clip so the fill never covers it).
  var JERSEY_COLLAR =
    '<path d="M45 8 Q60 2.5 75 8 Q60 13 45 8 Z" fill="#050505"/>' +
    '<path d="M46.5 7.4 Q60 3.2 73.5 7.4" fill="none" stroke="#f4ede1" stroke-opacity=".5" stroke-width="1"/>' +
    '<path d="M48 8.4 Q60 6 72 8.4" fill="none" stroke="#1a1a1a" stroke-width="1.6"/>' +
    '<path d="M44.6 8.3 Q60 13.4 75.4 8.3" fill="none" stroke="#f4ede1" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M45.6 10.8 Q60 15.8 74.4 10.8" fill="none" stroke="#d00018" stroke-width="1.1" stroke-linecap="round"/>' +
    '<rect x="56.4" y="16.4" width="7.2" height="4.6" rx="1" fill="#d00018" stroke="#f4ede1" stroke-width=".6"/>' +
    '<path d="M58.2 20 Q60 17.6 61.8 17.6" fill="none" stroke="#f4ede1" stroke-width=".8" stroke-linecap="round"/>';
  var STORE_PREFIX = 'storm-branson:';

  var sheetId = new URLSearchParams(location.search).get('sheet') || CONFIG.sheetId || '';
  var model = null;
  var sortMode = store('sort') || 'most';
  var prevLevels = {};      // player key -> last jersey fill level, so refreshes animate from where they were
  var shownTotal = 0;
  var lastFocus = null;

  var $ = function (id) { return document.getElementById(id); };

  // ---------- small helpers ----------
  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(STORE_PREFIX + key);
      localStorage.setItem(STORE_PREFIX + key, value);
    } catch (e) { return null; }
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }
  function num(v) {
    var n = parseFloat(String(v == null ? '' : v).replace(/[$,\s]/g, ''));
    return isFinite(n) ? n : 0;
  }
  function money(n) {
    var cents = Math.round(n * 100) % 100 !== 0;
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
  }
  function parseDate(v) {
    var s = String(v || '').trim(), m;
    if (!s) return null;
    if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return new Date(+m[1], +m[2] - 1, +m[3]);
    if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/))) {
      var y = +m[3]; if (y < 100) y += 2000;
      return new Date(y, +m[1] - 1, +m[2]);
    }
    var d = new Date(s);
    return isNaN(d) ? null : d;
  }
  function shortDate(d) { return d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''; }
  function lastName(name) {
    var parts = String(name).trim().split(/\s+/);
    return (parts.length > 1 ? parts.slice(1).join(' ') : parts[0]).toUpperCase();
  }
  function firstName(name) { return String(name).trim().split(/\s+/)[0]; }

  // ---------- CSV (Google's gviz export) ----------
  function parseCSV(text) {
    var rows = [], row = [], field = '', i = 0, q = false;
    for (; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
        else field += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field); rows.push(row); row = []; field = '';
      } else field += c;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
  }
  function headerKey(h) {
    return String(h).trim() === '#' ? 'number' : norm(h).replace(/[^a-z0-9]/g, '');
  }
  function toObjects(rows) {
    if (!rows.length) return [];
    var keys = rows[0].map(headerKey);
    return rows.slice(1).map(function (r) {
      var o = {};
      keys.forEach(function (k, i) { if (k) o[k] = (r[i] || '').trim(); });
      return o;
    }).filter(function (o) {
      return Object.keys(o).some(function (k) { return o[k] !== ''; });
    });
  }

  function fetchTracker() {
    var url = 'https://docs.google.com/spreadsheets/d/' + encodeURIComponent(sheetId) +
      '/gviz/tq?tqx=out:csv&headers=1&sheet=' + encodeURIComponent(TAB.name) + '&_=' + Date.now();
    return fetch(url, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error('The sheet answered with an error (' + res.status + ').');
      return res.text();
    }).then(function (text) {
      if (/^\s*</.test(text)) throw new Error('The sheet isn’t shared as “Anyone with the link can view.”');
      var rows = parseCSV(text);
      // Google quietly returns the first tab when a tab name doesn't exist,
      // so check the columns we expect are really there.
      var have = (rows[0] || []).map(headerKey);
      TAB.needs.forEach(function (n) {
        if (have.indexOf(n) === -1) throw new Error('Couldn’t find the “' + TAB.name + '” tab (or its column headers were changed).');
      });
      return toObjects(rows);
    });
  }

  function loadRaw() {
    if (!sheetId) return Promise.resolve({ raw: window.BRANSON_SAMPLE, source: 'sample' });
    return fetchTracker().then(function (rows) {
      var raw = { rows: rows };
      store('cache:' + sheetId, JSON.stringify({ at: Date.now(), raw: raw }));
      return { raw: raw, source: 'live' };
    }).catch(function (err) {
      var cached = null;
      try { cached = JSON.parse(store('cache:' + sheetId) || 'null'); } catch (e) { cached = null; }
      if (cached && cached.raw && cached.raw.rows) return { raw: cached.raw, source: 'cache', at: cached.at, error: err };
      throw err;
    });
  }

  // Split the one-tab rows into roster, money received, and sponsors.
  function splitRows(rows) {
    var players = [], seen = {}, payments = [], sponsors = {}, sponsorOrder = [];
    var rank = { paid: 0, pledged: 1, asked: 2, declined: 3 };
    rows.forEach(function (r) {
      if (r.player) {
        var pk = norm(r.player);
        if (!seen[pk]) { seen[pk] = { number: '', name: r.player.trim() }; players.push(seen[pk]); }
        if (!seen[pk].number && r.number) seen[pk].number = r.number.trim();
      }
      if (num(r.amount)) payments.push(r);
      var isSponsor = r.from && r.player && (norm(r.type) === 'sponsor' || r.status);
      if (!isSponsor) return;
      var key = norm(r.player) + '|' + norm(r.from);
      var status = r.status || (num(r.amount) ? 'Paid' : 'Asked');
      var cur = sponsors[key];
      if (!cur) {
        sponsors[key] = { player: r.player, company: r.from, status: status, notes: num(r.amount) ? '' : (r.notes || '') };
        sponsorOrder.push(key);
      } else {
        if ((rank[norm(status)] != null ? rank[norm(status)] : 2) < (rank[norm(cur.status)] != null ? rank[norm(cur.status)] : 2)) cur.status = status;
        if (!num(r.amount) && r.notes) cur.notes = [cur.notes, r.notes].filter(Boolean).join(' · ');
      }
    });
    return {
      players: players, payments: payments,
      sponsors: sponsorOrder.map(function (k) { return sponsors[k]; }),
      // A name with no # anywhere is usually a new player or a typo.
      noNumber: players.filter(function (p) { return !p.number; }).map(function (p) { return p.name; })
    };
  }

  // ---------- turn sheet rows into totals ----------
  function build(raw) {
    var settings = {
      goal: num(CONFIG.goalPerPlayer) || 1000,
      deposit: num(CONFIG.depositAmount) || 50,
      deadline: parseDate(CONFIG.depositDeadline),
      discount: num(CONFIG.teamDiscount),
      trip: CONFIG.tripName || 'Ballparks of America, Branson, MO'
    };
    var rows = raw.rows || [];
    raw = splitRows(rows);

    var players = [], byKey = {};
    (raw.players || []).forEach(function (p) {
      if (!p.name) return;
      var key = norm(p.name);
      if (byKey[key]) return;
      var player = {
        key: key, name: p.name.trim(), number: (p.number || '').trim() || '?',
        total: 0, depositPaid: 0, depositDate: null, payments: [], sponsors: []
      };
      byKey[key] = player;
      players.push(player);
    });

    var general = { total: 0, payments: [] };
    var warnings = { payments: {}, sponsors: {}, noNumber: raw.noNumber || [] };

    (raw.payments || []).forEach(function (r) {
      var amount = num(r.amount);
      if (!amount) return;
      var pay = {
        date: parseDate(r.date), dateText: r.date || '', from: r.from || '', amount: amount,
        method: r.method || '', type: r.type || '', notes: r.notes || ''
      };
      var who = norm(r.player);
      var player = who ? byKey[who] : null;
      if (who && !player) {
        warnings.payments[r.player.trim()] = (warnings.payments[r.player.trim()] || 0) + 1;
        pay.unmatched = r.player.trim();
      }
      if (player) {
        player.total += amount;
        player.payments.push(pay);
        if (norm(pay.type) === 'deposit') {
          player.depositPaid += amount;
          if (!player.depositDate && player.depositPaid >= settings.deposit - 0.001) player.depositDate = pay.date;
        }
      } else {
        general.total += amount;
        general.payments.push(pay);
      }
    });

    (raw.sponsors || []).forEach(function (r) {
      if (!r.company) return;
      var player = byKey[norm(r.player)];
      if (!player) {
        if (r.player) warnings.sponsors[r.player.trim()] = true;
        return;
      }
      var company = norm(r.company);
      // A payment from a listed sponsor belongs to that sponsor, so it's shown
      // once (under Sponsors) instead of again under Money Collected.
      var paid = player.payments.filter(function (p) { return !p.sponsor && norm(p.from) === company; });
      var sponsor = {
        company: r.company, contact: '', status: (r.status || 'Asked').trim(),
        pledged: 0, notes: r.notes || '', payments: paid,
        received: paid.reduce(function (sum, p) { return sum + p.amount; }, 0)
      };
      if (sponsor.received && norm(sponsor.status) !== 'declined') sponsor.status = 'Paid';
      paid.forEach(function (p) { p.sponsor = sponsor; });
      player.sponsors.push(sponsor);
    });

    var byDateDesc = function (a, b) { return (b.date || 0) - (a.date || 0); };
    players.forEach(function (p) {
      // Sponsor-type payments from a company that isn't on the Sponsors tab
      // still count as sponsors: add them as Paid.
      p.payments.forEach(function (pay) {
        if (pay.sponsor || norm(pay.type) !== 'sponsor' || !pay.from) return;
        var match = p.sponsors.filter(function (s) { return s.auto && norm(s.company) === norm(pay.from); })[0];
        if (!match) {
          match = { company: pay.from, contact: '', status: 'Paid', pledged: 0, notes: '', payments: [], received: 0, auto: true };
          p.sponsors.push(match);
        }
        match.payments.push(pay);
        match.received += pay.amount;
        pay.sponsor = match;
      });
      p.sponsors.forEach(function (s) { s.payments.sort(byDateDesc); });
      p.sponsorTotal = p.sponsors.reduce(function (sum, s) { return sum + s.received; }, 0);
      p.collected = p.payments.filter(function (pay) { return !pay.sponsor; });
      p.collectedTotal = p.total - p.sponsorTotal;
      p.payments.sort(byDateDesc);
      p.collected.sort(byDateDesc);
      p.hasDeposit = p.depositPaid >= settings.deposit - 0.001;
      p.full = p.total >= settings.goal;
      p.pct = settings.goal ? p.total / settings.goal : 0;
    });
    general.payments.sort(byDateDesc);

    var playerMoney = players.reduce(function (s, p) { return s + p.total; }, 0);
    // Test rows from the starter spreadsheet have Notes starting with "SAMPLE".
    var sampleRows = rows.filter(function (r) {
      return /^\s*sample\b/i.test(r.notes || '');
    }).length;
    return {
      sampleRows: sampleRows,
      settings: settings, players: players, general: general, warnings: warnings,
      grandTotal: playerMoney + general.total,
      playerMoney: playerMoney,
      teamGoal: settings.goal * players.length
    };
  }

  // ---------- jersey graphic ----------
  function fillLevel(pct) {
    var p = Math.max(0, Math.min(1, pct));
    if (p <= 0) return FILL_BOTTOM + 8;   // hide the wave crest when there's no money yet
    return FILL_BOTTOM - p * (FILL_BOTTOM - FILL_TOP);
  }
  function jerseySVG(p, uid) {
    var last = lastName(p.name);
    var waveTop = 'M-60 0 q15 -5 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 L180 130 L-60 130 Z';
    var num = esc(p.number), numStyle = 'font-size:' + textSize.num + 'px';
    return '<svg class="jersey" viewBox="0 0 120 120" aria-hidden="true">' +
      '<defs><clipPath id="clip-' + uid + '"><path d="' + JERSEY_PATH + '"/></clipPath>' +
        '<path id="arc-' + uid + '" d="M22 45 Q60 27 98 45"/></defs>' +
      '<path class="jersey-body" d="' + JERSEY_PATH + '" filter="url(#f-drop)"/>' +
      '<g clip-path="url(#clip-' + uid + ')">' +
        '<g class="jersey-fill" data-level="' + fillLevel(p.pct) + '" style="transform:translateY(' + (prevLevels[uid] != null ? prevLevels[uid] : FILL_BOTTOM) + 'px)">' +
          '<g class="jersey-wave"><path d="' + waveTop + '" fill="url(#' + (p.full ? 'g-gold' : 'g-red') + ')"/></g>' +
        '</g>' +
        JERSEY_DETAILS +
      '</g>' +
      '<path d="' + JERSEY_PATH + '" fill="none" stroke="' + (p.full ? '#f8b000' : '#000') + '" stroke-opacity="' + (p.full ? 1 : .8) + '" stroke-width="1.2" stroke-linejoin="round"/>' +
      JERSEY_COLLAR +
      '<text class="jersey-name" style="font-size:' + textSize.name + 'px"><textPath href="#arc-' + uid + '" startOffset="50%">' + esc(last) + '</textPath></text>' +
      '<text class="jersey-num-edge" x="60" y="87" style="' + numStyle + '">' + num + '</text>' +
      '<text class="jersey-num" x="60" y="87" style="' + numStyle + '">' + num + '</text>' +
      '</svg>';
  }
  // One name size and one number size for every jersey: the largest that lets
  // the longest last name (and widest number) fit across the chest.
  var CHEST_WIDTH = 58, NAME_WIDTH = 52, NAME_MAX = 13, NUM_MAX = 40;
  var textSize = { name: NAME_MAX, num: NUM_MAX };
  function fitJerseyText() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.setAttribute('width', '120'); svg.setAttribute('height', '120');
    svg.style.cssText = 'position:absolute;visibility:hidden;left:-9999px';
    document.body.appendChild(svg);
    function widest(cls, size, texts) {
      return texts.reduce(function (max, t) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        el.setAttribute('class', cls);
        el.style.fontSize = size + 'px';
        el.textContent = t;
        svg.appendChild(el);
        var w = el.getComputedTextLength();
        svg.removeChild(el);
        return Math.max(max, w);
      }, 0);
    }
    var nameW = widest('jersey-name', NAME_MAX, model.players.map(function (p) { return lastName(p.name); }));
    var numW = widest('jersey-num', NUM_MAX, model.players.map(function (p) { return p.number; }));
    document.body.removeChild(svg);
    textSize.name = nameW > NAME_WIDTH ? +(NAME_MAX * NAME_WIDTH / nameW).toFixed(2) : NAME_MAX;
    textSize.num = numW > CHEST_WIDTH ? +(NUM_MAX * CHEST_WIDTH / numW).toFixed(2) : NUM_MAX;
  }

  function animateFills(root) {
    var fills = root.querySelectorAll('.jersey-fill[data-level]');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        fills.forEach(function (g) { g.style.transform = 'translateY(' + g.getAttribute('data-level') + 'px)'; });
      });
    });
  }
  // A small tile of fabric grain (fine noise plus a faint knit rib), drawn once.
  function knitTexture() {
    var c = document.createElement('canvas'), n = 64;
    c.width = c.height = n;
    var ctx = c.getContext('2d'), img = ctx.createImageData(n, n);
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var i = (y * n + x) * 4, light = Math.random() < .5;
      var rib = (x % 4 === 0) ? 18 : 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = light ? 255 : 0;
      img.data[i + 3] = Math.round(Math.random() * 26) + rib;
    }
    ctx.putImageData(img, 0, 0);
    try { return c.toDataURL(); } catch (e) { return ''; }
  }
  function addGradients() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.innerHTML =
      '<defs>' +
      '<linearGradient id="g-red" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff2a3d"/><stop offset=".35" stop-color="#d00018"/><stop offset="1" stop-color="#6e0010"/></linearGradient>' +
      '<linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd35a"/><stop offset=".4" stop-color="#f8b000"/><stop offset="1" stop-color="#a87400"/></linearGradient>' +
      '<linearGradient id="g-shade" gradientUnits="userSpaceOnUse" x1="26" y1="0" x2="94" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".16" stop-color="#000" stop-opacity="0"/><stop offset=".84" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient>' +
      '<radialGradient id="g-light" gradientUnits="userSpaceOnUse" cx="46" cy="34" r="80"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>' +
      '<pattern id="g-knit" patternUnits="userSpaceOnUse" width="16" height="16"><image href="' + knitTexture() + '" width="16" height="16"/></pattern>' +
      '<filter id="f-soft" filterUnits="userSpaceOnUse" x="-10" y="-10" width="140" height="140"><feGaussianBlur stdDeviation="1.5"/></filter>' +
      '<filter id="f-drop" filterUnits="userSpaceOnUse" x="-10" y="-10" width="140" height="145"><feDropShadow dx="0" dy="2.5" stdDeviation="2.2" flood-color="#000" flood-opacity=".7"/></filter>' +
      '</defs>';
    document.body.appendChild(svg);
  }

  // ---------- render ----------
  function render() {
    var m = model, st = m.settings;
    $('trip-name').textContent = st.trip;
    document.querySelectorAll('.legend-goal').forEach(function (el) { el.textContent = st.goal.toLocaleString('en-US'); });

    countTo(m.grandTotal);
    var teamPct = m.teamGoal ? m.grandTotal / m.teamGoal : 0;
    $('team-pct').textContent = Math.round(teamPct * 100) + '%';
    $('team-goal').textContent = money(m.teamGoal);
    requestAnimationFrame(function () { $('team-bar-fill').style.width = Math.min(100, teamPct * 100) + '%'; });

    var n = m.players.length;
    var deposits = m.players.filter(function (p) { return p.hasDeposit; }).length;
    var full = m.players.filter(function (p) { return p.full; }).length;
    var stillNeeded = m.players.reduce(function (s, p) { return s + Math.max(0, st.goal - p.total); }, 0);

    $('stat-deposits').textContent = deposits;
    $('stat-deposits-of').textContent = '/' + n;
    $('stat-deadline').textContent = deadlineText(st.deadline);
    $('stat-full').textContent = full;
    $('stat-full-of').textContent = '/' + n;
    $('stat-full-sub').textContent = stillNeeded ? money(stillNeeded) + ' still to go' : 'Every bucket is full!';
    $('stat-general-value').textContent = money(m.general.total);
    $('stat-avg').textContent = money(n ? Math.round(m.playerMoney / n) : 0);
    $('stat-avg-sub').textContent = 'Goal ' + money(st.goal) + ' each';

    renderDiscount(deposits, n);
    fitJerseyText();
    renderGrid();
    renderWarnings();
  }

  function deadlineText(d) {
    if (!d) return 'Deadline TBD';
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var days = Math.round((d - today) / 86400000);
    if (days > 1) return 'Due ' + shortDate(d) + ' · ' + days + ' days left';
    if (days === 1) return 'Due tomorrow';
    if (days === 0) return 'Due today!';
    return 'Deadline was ' + shortDate(d);
  }

  function renderDiscount(deposits, n) {
    var el = $('discount'), st = model.settings;
    if (!n) { el.hidden = true; return; }
    el.hidden = false;
    var by = st.deadline ? ' by ' + st.deadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : '';
    var off = st.discount ? money(st.discount) + ' off' : 'the discounted price';
    if (deposits >= n) {
      el.className = 'discount won';
      el.innerHTML = '🎉 <strong>All ' + n + ' deposits are in.</strong> Team discount: ' + esc(off) + ' for every player!';
      return;
    }
    el.className = 'discount';
    var firstCount = {};
    model.players.forEach(function (p) { var f = norm(firstName(p.name)); firstCount[f] = (firstCount[f] || 0) + 1; });
    var waiting = model.players.filter(function (p) { return !p.hasDeposit; }).map(function (p) {
      var f = firstName(p.name);
      // Two Liams on the team: add a last initial whenever a first name repeats.
      return esc(firstCount[norm(f)] > 1 ? f + ' ' + lastName(p.name).charAt(0) + '.' : f);
    });
    el.innerHTML = '<strong>Team discount:</strong> if all ' + n + ' players get their ' + money(st.deposit) +
      ' deposit in' + esc(by) + ', everyone gets ' + esc(off) + '. <strong>' + deposits + ' of ' + n + ' in.</strong> ' +
      'Still waiting on ' + waiting.join(', ').replace(/\.$/, '') + '.';
  }

  function sortedPlayers() {
    var list = model.players.slice();
    var numOf = function (p) { var v = parseInt(p.number, 10); return isNaN(v) ? 1e9 : v; };
    if (sortMode === 'most') list.sort(function (a, b) { return b.total - a.total || numOf(a) - numOf(b); });
    else if (sortMode === 'least') list.sort(function (a, b) { return a.total - b.total || numOf(a) - numOf(b); });
    else if (sortMode === 'name') list.sort(function (a, b) { return lastName(a.name).localeCompare(lastName(b.name)); });
    else list.sort(function (a, b) { return numOf(a) - numOf(b) || a.name.localeCompare(b.name); });
    return list;
  }

  function renderGrid() {
    var grid = $('grid'), goal = model.settings.goal;
    grid.innerHTML = sortedPlayers().map(function (p, i) {
      var uid = 'p' + model.players.indexOf(p);
      var over = p.total - goal;
      return '<button type="button" class="card' + (p.full ? ' full' : '') + '" data-key="' + esc(p.key) + '" ' +
        'aria-label="' + esc(p.name) + ', ' + money(p.total) + ' of ' + money(goal) + (p.hasDeposit ? ', deposit in' : ', deposit not in yet') + '">' +
        (over > 0 ? '<span class="over-chip">+' + money(over) + '</span>' : '') +
        '<span class="dep' + (p.hasDeposit ? ' on' : '') + '" title="' + (p.hasDeposit ? 'Deposit in' : 'Deposit not in yet') + '">' + (p.hasDeposit ? '✓' : '$') + '</span>' +
        jerseySVG(p, uid) +
        '<div class="card-name">' + esc(p.name) + '</div>' +
        '<div class="card-amount">' + money(p.total) + ' <small>/ ' + money(goal) + '</small></div>' +
        '<div class="mini-bar"><div style="width:' + Math.min(100, p.pct * 100) + '%"></div></div>' +
        '</button>';
    }).join('');
    animateFills(grid);
    model.players.forEach(function (p, i) { prevLevels['p' + i] = fillLevel(p.pct); });
  }

  function renderWarnings() {
    var w = model.warnings, lines = [];
    Object.keys(w.payments).forEach(function (name) {
      lines.push(w.payments[name] + ' payment' + (w.payments[name] > 1 ? 's name' : ' names') + ' “' + esc(name) +
        '”, who isn’t on the roster (no row with that name and a #). Counted in the General Fund until the name matches.');
    });
    Object.keys(w.sponsors).forEach(function (name) {
      if (w.payments[name]) return;   // already flagged above
      lines.push('A sponsor row names “' + esc(name) + '”, who isn’t on the roster, so it isn’t shown.');
    });
    w.noNumber.forEach(function (name) {
      lines.push('“' + esc(name) + '” doesn’t have a # on any row, so his jersey shows “?”. ' +
        'If he’s new, add his number on one of his rows. If it’s a misspelling, fix the name to match his other rows.');
    });
    var el = $('warnings');
    el.hidden = !lines.length;
    el.innerHTML = lines.length ? '<strong>For the organizers:</strong><br>' + lines.join('<br>') : '';
  }

  function countTo(target) {
    var el = $('grand-total'), from = shownTotal, start = null, dur = 1300;
    shownTotal = target;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || from === target) {
      el.textContent = money(target); return;
    }
    function step(t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = k < 1 ? money(Math.round(from + (target - from) * e)) : money(target);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- detail sheet ----------
  function sectionHead(title, total) {
    return '<h4><span>' + esc(title) + '</span><span class="h4-total">' + money(total) + '</span></h4>';
  }

  function paymentRows(list, showPlayer) {
    if (!list.length) return '<p class="empty">Nothing collected yet.</p>';
    return '<ul class="rows">' + list.map(function (p) {
      var bits = [p.date ? shortDate(p.date) : p.dateText, p.method, p.type].filter(Boolean);
      if (showPlayer && p.unmatched) bits.push('listed as “' + p.unmatched + '”');
      return '<li><div class="row-main"><div class="row-title">' + esc(p.from || 'Unknown') + '</div>' +
        '<div class="row-sub">' + esc(bits.join(' · ')) + (p.notes ? ' · ' + esc(p.notes) : '') + '</div></div>' +
        '<div class="row-amt">' + money(p.amount) + '</div></li>';
    }).join('') + '</ul>';
  }

  function sponsorRows(list) {
    if (!list.length) return '<p class="empty">No sponsors listed yet.</p>';
    var order = { paid: 0, pledged: 1, asked: 2, declined: 3 };
    list = list.slice().sort(function (a, b) {
      return (order[norm(a.status)] != null ? order[norm(a.status)] : 2) - (order[norm(b.status)] != null ? order[norm(b.status)] : 2);
    });
    return '<ul class="rows">' + list.map(function (s) {
      var cls = 'status-' + (order[norm(s.status)] != null ? norm(s.status) : 'asked');
      var sub = s.payments.map(function (p) {
        return [p.date ? shortDate(p.date) : p.dateText, p.method].filter(Boolean).join(' · ');
      }).filter(Boolean);
      if (s.pledged && s.received < s.pledged) {
        sub.push(money(s.pledged) + ' pledged' + (s.received ? ', ' + money(s.pledged - s.received) + ' still coming' : ''));
      }
      sub = sub.concat([s.contact, s.notes].filter(Boolean));
      return '<li><div class="row-main"><div class="row-title">' + esc(s.company) +
        '<span class="status ' + cls + '">' + esc(s.status) + '</span></div>' +
        '<div class="row-sub">' + esc(sub.join(' · ')) + '</div></div>' +
        '<div class="row-amt' + (s.received ? '' : ' row-amt-none') + '">' + (s.received ? money(s.received) : '—') + '</div></li>';
    }).join('') + '</ul>';
  }

  function openPlayer(key) {
    var p = model.players.filter(function (x) { return x.key === key; })[0];
    if (!p) return;
    var goal = model.settings.goal, over = p.total - goal;
    var status = p.full
      ? (over > 0 ? '<strong>Bucket full</strong>, and ' + money(over) + ' over the goal!' : '<strong>Bucket full!</strong>')
      : '<strong>' + money(goal - p.total) + '</strong> to go';
    var dep = p.hasDeposit
      ? '<span class="pill good">✓ Deposit in' + (p.depositDate ? ' · ' + shortDate(p.depositDate) : '') + '</span>'
      : '<span class="pill">Deposit not in yet (' + money(model.settings.deposit) + ')</span>';
    var uid = 'detail';
    prevLevels[uid] = FILL_BOTTOM;
    openSheet(
      '<div class="detail">' +
        '<div class="detail-top">' + jerseySVG(p, uid) +
          '<div><h3 id="sheet-title">' + esc(p.name) + '</h3>' +
          '<div class="detail-amount">' + money(p.total) + ' <small>of ' + money(goal) + '</small></div>' +
          '<div class="detail-status">' + status + '</div></div>' +
        '</div>' +
        '<div class="detail-bar' + (p.full ? ' full' : '') + '"><div style="width:' + Math.min(100, p.pct * 100) + '%"></div></div>' +
        '<div class="pill-row">' + dep +
          (p.full ? '<span class="pill gold">★ Goal reached</span>' : '') +
          '<span class="pill">' + Math.round(p.pct * 100) + '% of goal</span>' +
        '</div>' +
        sectionHead('Sponsors', p.sponsorTotal) + sponsorRows(p.sponsors) +
        sectionHead('Money collected', p.collectedTotal) + paymentRows(p.collected) +
      '</div>'
    );
  }

  function openGeneral() {
    openSheet(
      '<div class="detail">' +
        '<h3 id="sheet-title" class="general-title" style="font-family:var(--jersey-font);font-weight:400;font-size:28px;text-transform:uppercase;margin:0">General Fund</h3>' +
        '<div class="detail-amount">' + money(model.general.total) + '</div>' +
        '<div class="detail-status">Donations that aren’t for a specific player. They count toward the team total.</div>' +
        sectionHead('Money collected', model.general.total) + paymentRows(model.general.payments, true) +
      '</div>'
    );
  }

  function openSheet(html) {
    lastFocus = document.activeElement;
    $('sheet-body').innerHTML = html;
    $('sheet').hidden = false;
    document.body.style.overflow = 'hidden';
    animateFills($('sheet-body'));
    $('sheet').querySelector('.sheet-close').focus();
  }
  function closeSheet() {
    if ($('sheet').hidden) return;
    $('sheet').hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // ---------- loading ----------
  var loading = false;
  function refresh() {
    if (loading) return;
    loading = true;
    $('refresh').disabled = true;
    var fontReady = document.fonts && document.fonts.load
      ? document.fonts.load('40px Anton').catch(function () {}) : Promise.resolve();
    Promise.all([loadRaw(), fontReady]).then(function (all) {
      var res = all[0];
      model = build(res.raw);
      var banner = $('sample-banner');
      if (res.source === 'sample') banner.textContent = 'Sample data · not the real numbers yet';
      else if (model.sampleRows) banner.textContent = 'The sheet still has ' + model.sampleRows + ' SAMPLE row' + (model.sampleRows === 1 ? '' : 's') + ' · delete them before sharing';
      banner.hidden = !(res.source === 'sample' || model.sampleRows);
      render();
      var time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      if (res.source === 'sample') $('updated').textContent = 'Showing sample data';
      else if (res.source === 'cache') {
        $('updated').innerHTML = '<span class="error">Couldn’t reach the sheet (' + esc(res.error.message) +
          ') Showing numbers from ' + esc(new Date(res.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })) + '.</span>';
      } else $('updated').textContent = 'Live from the team sheet · updated ' + time;
    }).catch(function (err) {
      $('updated').innerHTML = '<span class="error">Couldn’t load the team sheet. ' + esc(err.message) + '</span>';
    }).then(function () {
      loading = false;
      $('refresh').disabled = false;
    });
  }

  // ---------- wire up ----------
  addGradients();
  document.querySelectorAll('.sort button').forEach(function (b) {
    b.classList.toggle('active', b.getAttribute('data-sort') === sortMode);
    b.addEventListener('click', function () {
      sortMode = b.getAttribute('data-sort');
      store('sort', sortMode);
      document.querySelectorAll('.sort button').forEach(function (x) { x.classList.toggle('active', x === b); });
      if (model) renderGrid();
    });
  });
  $('grid').addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (card) openPlayer(card.getAttribute('data-key'));
  });
  $('stat-general').addEventListener('click', function () { if (model) openGeneral(); });
  $('sheet').addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
  $('refresh').addEventListener('click', refresh);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && sheetId) refresh(); });
  if (sheetId) setInterval(function () { if (document.visibilityState === 'visible') refresh(); }, Math.max(15, CONFIG.refreshSeconds || 60) * 1000);

  refresh();
})();
