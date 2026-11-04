(function () {
  var app = document.getElementById('app');
  var TYPES = { rod: 'Rød', hvid: 'Hvid', mousserende: 'Mousserende', rose: 'Rosé' };
  var BOTTLE = '<svg class="bottle" viewBox="0 0 96 300" aria-hidden="true">' +
    '<path class="glass" d="M36 6h24v84c0 26 28 40 28 76v122a10 10 0 0 1-10 10H18a10 10 0 0 1-10-10V166c0-36 28-50 28-76z"/>' +
    '<path class="cap" d="M35 4h26v58H35z"/>' +
    '<rect class="lab" x="8" y="178" width="80" height="84"/>' +
    '<rect class="ink" x="22" y="198" width="52" height="4"/>' +
    '<rect class="ink" x="30" y="212" width="36" height="2.5"/>' +
    '<rect class="ink" x="34" y="240" width="28" height="2.5"/>' +
    '</svg>';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }
  function safeUrl(u) {
    try { var p = new URL(u); return p.protocol === 'https:' ? p.href : null; } catch (e) { return null; }
  }
  function shelf(o) {
    var s = el('div', 'shelf ' + (TYPES[o.colour] ? o.colour : 'rod'));
    if (typeof o.discountPct === 'number') s.appendChild(el('span', 'badge', '−' + o.discountPct + ' %'));
    s.appendChild(el('span', 'type', TYPES[o.colour] || ''));
    var src = safeUrl(o.image);
    if (src) {
      var img = el('img', 'photo');
      img.alt = 'Flaske: ' + o.wine;
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.addEventListener('error', function () { img.remove(); s.insertAdjacentHTML('beforeend', BOTTLE); });
      img.src = src;
      s.appendChild(img);
    } else {
      s.insertAdjacentHTML('beforeend', BOTTLE);
    }
    return s;
  }
  function title(o) {
    var d = el('div');
    d.appendChild(el('span', 'producer', o.producer));
    d.appendChild(el('h3', '', o.wine));
    return d;
  }
  function price(o) {
    var p = el('div', 'price');
    p.appendChild(el('b', '', o.offerPrice));
    if (o.normalPrice) p.appendChild(el('s', '', o.normalPrice));
    if (o.priceNote) p.appendChild(el('small', '', o.priceNote));
    return p;
  }
  function facts(rows) {
    var dl = el('dl');
    rows.forEach(function (r) {
      var d = el('div');
      d.appendChild(el('dt', '', r[0]));
      d.appendChild(el('dd', '', r[1] || 'Ikke oplyst'));
      dl.appendChild(d);
    });
    return dl;
  }
  function link(o, text) {
    var url = safeUrl(o.url);
    if (!url) return el('span');
    var a = el('a', 'buy', text);
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    return a;
  }

  function render(data) {
    app.textContent = '';
    if (data.example) app.appendChild(el('p', 'notice', 'Eksempel på layout. Vinene og priserne er hentet fra Supervin 4. november 2026, men udvalget viser kun designet og er ikke en rigtig anbefaling.'));

    var h = el('header');
    h.appendChild(el('span', 'eyebrow', data.dateLabel));
    h.appendChild(el('h1', '', 'Bourgogne-vintilbud'));
    h.appendChild(el('p', 'lede', data.headline));
    app.appendChild(h);

    var offers = data.offers || [];
    var pcts = offers.map(function (o) { return o.discountPct; }).filter(function (n) { return typeof n === 'number'; });
    var stats = el('section', 'stats');
    stats.setAttribute('aria-label', 'Overblik');
    [[String(offers.length), 'tilbud'],
     [pcts.length ? Math.max.apply(null, pcts) + ' %' : '–', 'største rabat'],
     [String((data.checkedRetailers || []).length), 'forhandlere tjekket']].forEach(function (s) {
      var d = el('div', 'stat');
      d.appendChild(el('b', '', s[0]));
      d.appendChild(el('span', '', s[1]));
      stats.appendChild(d);
    });
    app.appendChild(stats);

    if (!offers.length) {
      app.appendChild(el('p', 'empty', 'Ingen relevante tilbud fundet i dag.'));
    } else {
      var top = offers[0];
      var ts = el('section');
      ts.appendChild(el('h2', '', 'Dagens bedste tilbud'));
      var art = el('article', 'top');
      art.appendChild(shelf(top));
      var body = el('div', 'top-body');
      body.appendChild(title(top));
      body.appendChild(price(top));
      if (top.why) body.appendChild(el('p', 'why', top.why));
      body.appendChild(facts([['Appellation', top.appellation], ['Årgang', top.vintage], ['Minimumskøb', top.minPurchase], ['Gyldig til', top.validUntil]]));
      body.appendChild(link(top, 'Se vinen hos ' + top.retailer));
      art.appendChild(body);
      ts.appendChild(art);
      app.appendChild(ts);

      if (offers.length > 1) {
        var ms = el('section');
        ms.appendChild(el('h2', '', 'Flere tilbud'));
        var grid = el('div', 'grid');
        offers.slice(1).forEach(function (o) {
          var c = el('article', 'card');
          c.appendChild(shelf(o));
          var b = el('div', 'card-body');
          b.appendChild(title(o));
          b.appendChild(price(o));
          if (o.why) b.appendChild(el('p', 'why', o.why));
          b.appendChild(facts([['Appellation', o.appellation], ['Årgang', o.vintage], ['Minimumskøb', o.minPurchase], ['Gyldig til', o.validUntil]]));
          b.appendChild(link(o, 'Se vinen hos ' + o.retailer));
          c.appendChild(b);
          grid.appendChild(c);
        });
        ms.appendChild(grid);
        app.appendChild(ms);
      }
    }

    var f = el('footer');
    function line(label, text) {
      var s = el('span');
      s.appendChild(el('b', '', label + ' '));
      s.appendChild(document.createTextNode(text));
      f.appendChild(s);
    }
    line('Tjekket:', (data.checkedRetailers || []).join(', ') || 'Ingen');
    if ((data.unreachable || []).length) line('Kunne ikke nås:', data.unreachable.join(', '));
    if (data.note) f.appendChild(el('span', '', data.note));
    app.appendChild(f);
  }

  fetch('data.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function () {
      app.textContent = '';
      app.appendChild(el('p', 'empty', 'Tilbuddene kunne ikke hentes. Tjek din forbindelse, og prøv igen.'));
    });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
