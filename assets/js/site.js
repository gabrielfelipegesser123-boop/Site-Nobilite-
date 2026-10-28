/* Página pública: coleções, vitrine, ficha da peça e links de WhatsApp. */
(function () {
  "use strict";
  var N = window.Nobilite, esc = N.esc;
  var products = [], settings = null, filter = "todas", loaded = false;

  function toast(t) { var el = document.getElementById("toast"); el.textContent = t; el.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(function () { el.hidden = true; }, 2200); }
  function wa(msg) { return N.waLink(settings.whatsapp, msg); }

  function render() {
    var live = products.filter(function (p) { return p.active; });
    var ann = document.getElementById("announce");
    ann.textContent = settings.announce; ann.hidden = !settings.announce;
    var hello = "Olá! Vim pelo site da Nobilite Joias e gostaria de atendimento.";
    ["navWa", "heroWa", "visitWa", "floatWa"].forEach(function (id) { document.getElementById(id).href = wa(hello); });
    document.getElementById("phoneTxt").textContent = settings.phoneLabel;
    document.getElementById("copyPhone").setAttribute("data-copy", settings.phoneLabel);

    document.getElementById("cols").innerHTML = N.CATS.filter(function (c) { return c.id !== "pulseiras"; }).map(function (c) {
      var n = live.filter(function (p) { return p.cat === c.id; }).length;
      return '<button class="col" data-cat="' + c.id + '">' + N.art(c.art) + '<div><h3>' + c.name + '</h3><div class="n">' +
        (loaded ? n + (n === 1 ? " peça" : " peças") + " na vitrine" : "&nbsp;") + "</div></div></button>";
    }).join("");

    document.getElementById("filters").innerHTML = [{ id: "todas", name: "Todas" }].concat(N.CATS).map(function (c) {
      return '<button class="chip" data-filter="' + c.id + '" aria-pressed="' + (filter === c.id) + '">' + c.name + "</button>";
    }).join("");

    var grid = document.getElementById("grid");
    if (!loaded) { grid.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>'; return; }
    var list = live.filter(function (p) { return filter === "todas" || p.cat === filter; });
    grid.innerHTML = list.length ? list.map(function (p) {
      return '<button class="card" data-id="' + esc(p.id) + '"><div class="img">' + (p.featured ? '<span class="badge">Destaque</span>' : "") + N.visual(p) + "</div>" +
        "<div><h3>" + esc(p.name) + '</h3><div class="spec">' + esc(p.metal) + (p.detail ? " · " + esc(p.detail) : "") + "</div></div>" +
        '<div class="price">' + (p.price ? esc(p.price) : "Valor sob consulta") + "</div></button>";
    }).join("") : '<div class="empty">Nenhuma peça nesta categoria por enquanto. Pergunte pelo WhatsApp: temos mais modelos na loja.</div>';
  }

  function openProduct(id) {
    var p = products.find(function (x) { return String(x.id) === id; }); if (!p) return;
    var msg = "Olá! Tenho interesse na peça \"" + p.name + "\" (" + p.metal + ") que vi no site. Pode me passar mais detalhes?";
    var m = document.getElementById("modal");
    m.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(p.name) + '"><div class="img">' + N.visual(p) + '</div><div class="body">' +
      '<button class="close" data-close>Fechar ✕</button><div class="eyebrow">' + N.catOf(p.cat).name + "</div><h3>" + esc(p.name) + '</h3><p class="muted">' + esc(p.desc) + "</p>" +
      "<dl><dt>Metal</dt><dd>" + esc(p.metal) + "</dd><dt>Detalhes</dt><dd>" + esc(p.detail || "—") + "</dd><dt>Peso</dt><dd>" + esc(p.weight || "—") + "</dd><dt>Valor</dt><dd>" + (p.price ? esc(p.price) : "Sob consulta") + "</dd></dl>" +
      '<a class="btn solid" href="' + wa(msg) + '" target="_blank" rel="noopener">Pedir esta peça no WhatsApp</a>' +
      '<p class="hint">Se o WhatsApp não abrir, chame no número ' + esc(settings.phoneLabel) + ".</p></div></div>";
    m.hidden = false; m.querySelector("[data-close]").focus();
  }

  document.addEventListener("click", function (e) {
    if (e.target.id === "modal") { e.target.hidden = true; return; }
    var t = e.target.closest("[data-cat],[data-filter],.card,[data-close],.copy"); if (!t) return;
    if (t.hasAttribute("data-cat")) { filter = t.getAttribute("data-cat"); render(); document.getElementById("vitrine").scrollIntoView(); }
    else if (t.hasAttribute("data-filter")) { filter = t.getAttribute("data-filter"); render(); }
    else if (t.classList.contains("card")) openProduct(t.getAttribute("data-id"));
    else if (t.hasAttribute("data-close")) document.getElementById("modal").hidden = true;
    else if (t.classList.contains("copy")) {
      var txt = t.getAttribute("data-copy");
      try { navigator.clipboard.writeText(txt).then(function () { toast("Copiado"); }, function () { toast(txt); }); } catch (err) { toast(txt); }
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") document.getElementById("modal").hidden = true; });

  document.getElementById("yr").textContent = new Date().getFullYear();
  settings = { whatsapp: "554733829961", phoneLabel: "(47) 3382-9961", announce: "" };
  render();
  Promise.all([N.store.getSettings(), N.store.listProducts()]).then(function (r) {
    settings = r[0]; products = r[1]; loaded = true; render();
  }).catch(function (err) {
    console.error(err); loaded = true; render();
    document.getElementById("grid").innerHTML = '<div class="empty">Não foi possível carregar a vitrine agora. Chame a gente no WhatsApp ' + esc(settings.phoneLabel) + " para ver as peças.</div>";
  });
})();
