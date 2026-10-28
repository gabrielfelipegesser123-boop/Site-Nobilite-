/* Área do lojista: login, cadastro de peças com foto, destaques e contato. */
(function () {
  "use strict";
  var N = window.Nobilite, store = N.store, esc = N.esc;
  var root = document.getElementById("adminRoot");
  var products = [], settings = null;
  var editing = null, pendingImg = null, armed = null, busy = false;
  var tab = "pecas", photos = [], armedPhoto = null;

  function toast(t) { var el = document.getElementById("toast"); el.textContent = t; el.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(function () { el.hidden = true; }, 2600); }
  function val(id) { return document.getElementById(id).value; }
  function modeTag() { return store.live ? '<span class="mode live">Conectado ao banco de dados</span>' : '<span class="mode">Modo demonstração: salva só neste navegador</span>'; }


  function prepare(file, max) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error("Não deu para ler o arquivo " + file.name + ".")); };
      reader.onload = function () {
        var im = new Image();
        im.onerror = function () { reject(new Error("O arquivo " + file.name + " não é uma imagem válida. Use JPG ou PNG.")); };
        im.onload = function () {
          var sc = Math.min(1, max / Math.max(im.width, im.height)), cv = document.createElement("canvas");
          cv.width = Math.round(im.width * sc); cv.height = Math.round(im.height * sc);
          cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
          var dataUrl = cv.toDataURL("image/jpeg", .84);
          cv.toBlob(function (blob) { resolve({ blob: blob, dataUrl: dataUrl }); }, "image/jpeg", .84);
        };
        im.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------- login ---------- */
  function renderLogin() {
    root.innerHTML = '<form class="login" id="loginForm"><a class="brand" href="index.html"><b>NOBILITE</b></a><h1>Área do lojista</h1>' +
      (store.live ? '<div class="field"><label for="email">E-mail</label><input id="email" type="email" autocomplete="username" required></div>' : "") +
      '<div class="field"><label for="pw">Senha</label><input id="pw" type="password" autocomplete="current-password" required></div>' +
      '<p class="err" id="loginErr" hidden></p><button class="btn solid" type="submit" id="loginBtn">Entrar</button>' +
      (store.live ? "" : '<p class="demo-note">Modo demonstração: a senha é "nobilite". Configure o Supabase para ter login real (veja o README).</p>') +
      '<a class="hint" href="index.html">← Voltar ao site</a></form>';
    document.getElementById("loginForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      var btn = document.getElementById("loginBtn"), err = document.getElementById("loginErr");
      btn.disabled = true; btn.textContent = "Entrando…"; err.hidden = true;
      try { await store.signIn(store.live ? val("email").trim() : "", val("pw")); await boot(); }
      catch (ex) { err.textContent = ex.message; err.hidden = false; btn.disabled = false; btn.textContent = "Entrar"; }
    });
  }


  /* ---------- fotos da loja ---------- */
  function photosView() {
    return '<div class="panel"><header><h2>Fotos da loja</h2><span class="hint">Aparecem na seção "Galeria" do site, na ordem abaixo.</span></header><div class="pad">' +
      '<div class="field"><label for="ph_files">Enviar fotos</label><input id="ph_files" type="file" accept="image/*" multiple><span class="hint">Pode escolher várias de uma vez. Use só fotos que a loja tem autorização para publicar.</span></div>' +
      '<div class="ph-grid">' + (photos.length ? photos.map(function (x, i) {
        return '<div class="ph' + (x.active ? "" : " off") + '"><img src="' + esc(x.url) + '" alt="' + esc(x.caption || "Foto da loja") + '" loading="lazy">' +
          '<input class="ph-cap" data-cap="' + esc(x.id) + '" value="' + esc(x.caption) + '" placeholder="Legenda (opcional)" aria-label="Legenda da foto ' + (i + 1) + '">' +
          '<div class="acts"><button class="linkbtn" data-mv="' + esc(x.id) + ':-1" ' + (i === 0 ? "disabled" : "") + ' aria-label="Mover para antes">←</button><button class="linkbtn" data-mv="' + esc(x.id) + ':1" ' + (i === photos.length - 1 ? "disabled" : "") + ' aria-label="Mover para depois">→</button>' +
          '<button class="linkbtn" data-phtoggle="' + esc(x.id) + '">' + (x.active ? "Ocultar" : "Mostrar") + '</button><button class="linkbtn danger' + (armedPhoto === x.id ? " armed" : "") + '" data-phdel="' + esc(x.id) + '">' + (armedPhoto === x.id ? "Confirmar" : "Excluir") + "</button></div></div>";
      }).join("") : '<p class="muted">Nenhuma foto ainda. Envie as primeiras acima e elas aparecem na galeria do site.</p>') + "</div></div></div>";
  }

  /* ---------- painel ---------- */
  function render() {
    var act = products.filter(function (p) { return p.active; }).length;
    var feat = products.filter(function (p) { return p.featured && p.active; }).length;
    var p = editing ? products.find(function (x) { return x.id === editing; }) : null;
    var f = p || { name: "", cat: "aneis", metal: N.METALS[0], detail: "", weight: "", price: "", desc: "", featured: false, active: true, img: "" };
    var img = pendingImg ? pendingImg.dataUrl : f.img;

    root.innerHTML =
      '<div class="admin-top"><div><div class="eyebrow">Área do lojista</div><h1>Painel Nobilite</h1></div><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">' + modeTag() +
      '<a class="btn ghost small" href="index.html" target="_blank" rel="noopener">Ver o site</a><button class="btn small" id="logout">Sair</button></div></div>' +
      '<div class="tabs" role="tablist"><button role="tab" class="tab" data-tab="pecas" aria-selected="' + (tab === "pecas") + '">Peças e contato</button><button role="tab" class="tab" data-tab="fotos" aria-selected="' + (tab === "fotos") + '">Fotos da loja <span class="count">' + photos.length + '</span></button></div>' +
      (tab === "fotos" ? photosView() : '<div class="stats"><div class="stat"><b>' + products.length + '</b><span>Peças cadastradas</span></div><div class="stat"><b>' + act + '</b><span>Na vitrine</span></div><div class="stat"><b>' + feat + '</b><span>Em destaque</span></div><div class="stat"><b>' + (products.length - act) + '</b><span>Ocultas</span></div></div>' +
      '<div class="admin-grid"><div class="panel"><header><h2>Peças</h2><button class="btn small" id="newBtn">Nova peça</button></header><div class="tablewrap">' +
      (products.length ? '<table><thead><tr><th></th><th>Peça</th><th>Categoria</th><th>Status</th><th></th></tr></thead><tbody>' +
        products.map(function (x) {
          return '<tr><td><div class="th">' + N.visual(x) + '</div></td><td><div>' + esc(x.name) + '</div><div class="spec">' + esc(x.metal) + (x.price ? " · " + esc(x.price) : "") + "</div></td><td>" + N.catOf(x.cat).name + "</td>" +
            "<td>" + (x.active ? '<span class="pill on">Na vitrine</span>' : '<span class="pill off">Oculta</span>') + (x.featured ? ' <span class="pill on">Destaque</span>' : "") + "</td>" +
            '<td><div class="acts"><button class="linkbtn" data-edit="' + esc(x.id) + '">Editar</button><button class="linkbtn" data-toggle="' + esc(x.id) + '">' + (x.active ? "Ocultar" : "Mostrar") + '</button><button class="linkbtn danger' + (armed === x.id ? " armed" : "") + '" data-del="' + esc(x.id) + '">' + (armed === x.id ? "Confirmar" : "Excluir") + "</button></div></td></tr>";
        }).join("") + "</tbody></table>"
        : '<div class="pad"><p class="muted">Nenhuma peça cadastrada ainda. Use "Nova peça" para colocar a primeira na vitrine.</p></div>') +
      "</div></div>" +
      '<div style="display:grid;gap:28px"><form class="panel" id="prodForm"><header><h2>' + (p ? "Editar peça" : "Nova peça") + "</h2>" + (p ? '<button type="button" class="linkbtn" id="cancelEdit">Cancelar</button>' : "") + '</header><div class="pad">' +
      '<div class="field"><label for="f_name">Nome</label><input id="f_name" required value="' + esc(f.name) + '" placeholder="Ex.: Anel Solitário Aurora"></div>' +
      '<div class="row2"><div class="field"><label for="f_cat">Categoria</label><select id="f_cat">' + N.CATS.map(function (c) { return '<option value="' + c.id + '"' + (c.id === f.cat ? " selected" : "") + ">" + c.name + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label for="f_metal">Metal</label><select id="f_metal">' + N.METALS.concat(N.METALS.indexOf(f.metal) < 0 && f.metal ? [f.metal] : []).map(function (m) { return "<option" + (m === f.metal ? " selected" : "") + ">" + esc(m) + "</option>"; }).join("") + "</select></div></div>" +
      '<div class="field"><label for="f_detail">Detalhes</label><input id="f_detail" value="' + esc(f.detail) + '" placeholder="Ex.: Zircônia 5 mm · aro 16"></div>' +
      '<div class="row2"><div class="field"><label for="f_weight">Peso</label><input id="f_weight" value="' + esc(f.weight) + '" placeholder="Ex.: 2,4 g"></div><div class="field"><label for="f_price">Valor</label><input id="f_price" value="' + esc(f.price) + '" placeholder="Vazio = sob consulta"></div></div>' +
      '<div class="field"><label for="f_desc">Descrição</label><textarea id="f_desc">' + esc(f.desc) + "</textarea></div>" +
      '<div class="field"><label for="f_img">Foto</label><div class="preview"><div class="th">' + (img ? '<img src="' + esc(img) + '" alt="">' : N.art(N.catOf(f.cat).art)) + '</div><div style="display:grid;gap:6px;min-width:0"><input id="f_img" type="file" accept="image/*"><span class="hint">Foto na vertical fica melhor. Sem foto, a vitrine mostra uma ilustração da categoria.</span></div></div></div>' +
      '<label class="check"><input type="checkbox" id="f_feat"' + (f.featured ? " checked" : "") + "> Mostrar como destaque</label>" +
      '<label class="check"><input type="checkbox" id="f_act"' + (f.active ? " checked" : "") + "> Visível na vitrine</label>" +
      '<button class="btn solid" type="submit" id="saveBtn">' + (p ? "Salvar alterações" : "Adicionar à vitrine") + "</button></div></form>" +
      '<form class="panel" id="setForm"><header><h2>Contato e aviso</h2></header><div class="pad">' +
      '<div class="field"><label for="s_wa">Número do WhatsApp (com 55 e DDD)</label><input id="s_wa" inputmode="numeric" value="' + esc(settings.whatsapp) + '"></div>' +
      '<div class="field"><label for="s_label">Telefone exibido no site</label><input id="s_label" value="' + esc(settings.phoneLabel) + '"></div>' +
      '<div class="field"><label for="s_ann">Faixa de aviso no topo</label><input id="s_ann" value="' + esc(settings.announce) + '" placeholder="Vazio = sem faixa"></div>' +
      '<button class="btn" type="submit">Salvar contato</button>' +
      (store.live ? "" : '<button class="linkbtn" type="button" id="resetDemo">Restaurar peças de exemplo</button>') +
      "</div></form></div></div>") ;
    bind();
  }

  function bind() {
    document.getElementById("logout").onclick = async function () { await store.signOut(); renderLogin(); };
    if (tab === "fotos") { bindPhotos(); return; }
    document.getElementById("newBtn").onclick = function () { editing = null; pendingImg = null; render(); document.getElementById("f_name").focus(); };
    var ce = document.getElementById("cancelEdit"); if (ce) ce.onclick = function () { editing = null; pendingImg = null; render(); };
    var rd = document.getElementById("resetDemo"); if (rd) rd.onclick = async function () { store.resetDemo(); editing = null; await refresh(); toast("Peças de exemplo restauradas"); };

    document.getElementById("f_img").onchange = async function (e) {
      var file = e.target.files[0]; if (!file) return;
      try {
        pendingImg = await prepare(file, 1200);
        document.querySelector("#prodForm .preview .th").innerHTML = '<img src="' + pendingImg.dataUrl + '" alt="">';
      } catch (ex) { toast(ex.message); }
    };

    document.getElementById("prodForm").addEventListener("submit", async function (e) {
      e.preventDefault(); if (busy) return;
      var data = { name: val("f_name").trim(), cat: val("f_cat"), metal: val("f_metal"), detail: val("f_detail").trim(), weight: val("f_weight").trim(), price: val("f_price").trim(), desc: val("f_desc").trim(), featured: document.getElementById("f_feat").checked, active: document.getElementById("f_act").checked };
      if (!data.name) return;
      var btn = document.getElementById("saveBtn"); busy = true; btn.disabled = true; btn.textContent = "Salvando…";
      try {
        var current = editing ? products.find(function (x) { return x.id === editing; }) : null;
        data.img = current ? current.img : "";
        if (pendingImg) data.img = await store.uploadImage(pendingImg.blob, pendingImg.dataUrl);
        if (editing) data.id = editing;
        await store.saveProduct(data);
        toast(editing ? "Peça atualizada" : "Peça adicionada à vitrine");
        editing = null; pendingImg = null;
        await refresh();
      } catch (ex) { toast(ex.message); btn.disabled = false; btn.textContent = "Tentar de novo"; }
      busy = false;
    });

    document.getElementById("setForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      var s = { whatsapp: val("s_wa").replace(/\D/g, "") || settings.whatsapp, phoneLabel: val("s_label").trim(), announce: val("s_ann").trim() };
      try { await store.saveSettings(s); settings = s; toast("Contato salvo"); } catch (ex) { toast(ex.message); }
    });
  }


  function bindPhotos() {
    document.getElementById("ph_files").onchange = async function (e) {
      var files = Array.prototype.slice.call(e.target.files); if (!files.length || busy) return;
      busy = true; var ok = 0;
      for (var i = 0; i < files.length; i++) {
        toast("Enviando foto " + (i + 1) + " de " + files.length + "…");
        try { var img = await prepare(files[i], 1600); var url = await store.uploadImage(img.blob, img.dataUrl); await store.addPhoto(url, ""); ok++; }
        catch (ex) { toast(ex.message); await new Promise(function (r) { setTimeout(r, 1800); }); }
      }
      busy = false; if (ok) toast(ok === 1 ? "Foto adicionada" : ok + " fotos adicionadas"); await refresh();
    };
    Array.prototype.forEach.call(document.querySelectorAll(".ph-cap"), function (inp) {
      inp.onchange = async function () { try { await store.updatePhoto(inp.dataset.cap, { caption: inp.value.trim() }); toast("Legenda salva"); } catch (ex) { toast(ex.message); } };
    });
  }

  root.addEventListener("click", async function (e) {
    var t = e.target.closest("[data-edit],[data-toggle],[data-del],[data-tab],[data-mv],[data-phtoggle],[data-phdel]"); if (!t || busy) return;
    try {
      if (t.dataset.tab) { tab = t.dataset.tab; armed = armedPhoto = null; render(); return; }
      if (t.dataset.mv) {
        var parts = t.dataset.mv.split(":"), i = photos.findIndex(function (x) { return x.id === parts[0]; }), j = i + Number(parts[1]);
        if (i < 0 || j < 0 || j >= photos.length) return;
        await store.swapPhotos(photos[i], photos[j]); await refresh(); return;
      }
      if (t.dataset.phtoggle) { var ph = photos.find(function (x) { return x.id === t.dataset.phtoggle; }); await store.updatePhoto(ph.id, { active: !ph.active }); toast(ph.active ? "Foto ocultada" : "Foto visível na galeria"); await refresh(); return; }
      if (t.dataset.phdel) {
        if (armedPhoto !== t.dataset.phdel) { armedPhoto = t.dataset.phdel; render(); return; }
        var del = photos.find(function (x) { return x.id === armedPhoto; }); await store.deletePhoto(del.id, del.url); armedPhoto = null; toast("Foto excluída"); await refresh(); return;
      }
      if (t.dataset.edit) {
        editing = t.dataset.edit; pendingImg = null; armed = null; render();
        document.getElementById("prodForm").scrollIntoView({ block: "start" });
      } else if (t.dataset.toggle) {
        var p = products.find(function (x) { return x.id === t.dataset.toggle; });
        await store.saveProduct(Object.assign({}, p, { active: !p.active }));
        toast(p.active ? "Peça ocultada" : "Peça visível na vitrine");
        await refresh();
      } else if (t.dataset.del) {
        if (armed !== t.dataset.del) { armed = t.dataset.del; render(); return; }
        await store.deleteProduct(armed);
        if (editing === armed) editing = null;
        armed = null; toast("Peça excluída");
        await refresh();
      }
    } catch (ex) { toast(ex.message); }
  });

  async function refresh() { var r = await Promise.all([store.listProducts(), store.listPhotos(true)]); products = r[0]; photos = r[1]; render(); }

  async function boot() {
    if (!(await store.signedIn())) { renderLogin(); return; }
    root.innerHTML = '<p class="muted" style="padding-block:60px">Carregando o painel…</p>';
    try {
      var r = await Promise.all([store.getSettings(), store.listProducts(), store.listPhotos(true)]);
      settings = r[0]; products = r[1]; photos = r[2]; render();
    } catch (ex) {
      root.innerHTML = '<p class="err" style="padding-block:60px">Não foi possível carregar o painel: ' + esc(ex.message) + "</p>";
    }
  }

  boot();
})();
