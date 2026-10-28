/* Dados compartilhados entre o site e o painel.
   Com Supabase configurado em config.js, lê e grava no banco.
   Sem ele, roda em modo demonstração com localStorage. */
(function () {
  "use strict";

  var CATS = [
    { id: "aliancas", name: "Alianças", art: "alianca" },
    { id: "aneis", name: "Anéis", art: "anel" },
    { id: "colares", name: "Colares", art: "colar" },
    { id: "brincos", name: "Brincos", art: "brinco" },
    { id: "pulseiras", name: "Pulseiras", art: "pulseira" }
  ];
  var METALS = ["Ouro 18k (750)", "Prata 925", "Ouro branco 18k (750)", "Ouro rosé 18k (750)", "Folheado a ouro"];
  var SEED = [
    { id: "p1", name: "Aliança Clássica Timbó", cat: "aliancas", metal: "Ouro 18k (750)", detail: "Par · 4 mm · anatômica", weight: "8,0 g o par", price: "", desc: "Perfil anatômico, acabamento polido e gravação interna inclusa.", featured: true, active: true, img: "" },
    { id: "p2", name: "Solitário Aurora", cat: "aneis", metal: "Ouro 18k (750)", detail: "Zircônia 5 mm · 6 garras", weight: "2,4 g", price: "", desc: "O anel de noivado clássico, com garras altas que deixam a luz entrar pela pedra.", featured: true, active: true, img: "" },
    { id: "p3", name: "Colar Ponto de Luz", cat: "colares", metal: "Ouro 18k (750)", detail: "Corrente 45 cm · zircônia 4 mm", weight: "1,9 g", price: "", desc: "Uma pedra só, presa na corrente veneziana. Discreto para usar todo dia.", featured: false, active: true, img: "" },
    { id: "p4", name: "Brinco Gota de Pérola", cat: "brincos", metal: "Prata 925", detail: "Pérola shell 8 mm", weight: "3,1 g o par", price: "", desc: "Pérola em gota sobre base de prata com banho de ródio.", featured: true, active: true, img: "" },
    { id: "p5", name: "Pulseira Riviera", cat: "pulseiras", metal: "Prata 925", detail: "18 cm · zircônias cravadas", weight: "7,6 g", price: "", desc: "Linha contínua de pedras com fecho de segurança duplo.", featured: false, active: true, img: "" },
    { id: "p6", name: "Aliança Vale Europeu", cat: "aliancas", metal: "Ouro 18k (750)", detail: "Par · 6 mm · fosca com friso", weight: "11,2 g o par", price: "", desc: "Acabamento escovado com friso polido no centro.", featured: false, active: true, img: "" },
    { id: "p7", name: "Anel Trilogia", cat: "aneis", metal: "Ouro 18k (750)", detail: "3 zircônias · aro 1,8 mm", weight: "2,1 g", price: "", desc: "Três pedras para passado, presente e futuro.", featured: false, active: true, img: "" },
    { id: "p8", name: "Argola Minimal", cat: "brincos", metal: "Ouro 18k (750)", detail: "Diâmetro 12 mm", weight: "1,2 g o par", price: "", desc: "Argola fina de uso diário, com trava click.", featured: false, active: true, img: "" }
  ];
  var DEFAULTS = { whatsapp: "554733829961", phoneLabel: "(47) 3382-9961", announce: "Alianças sob medida com gravação inclusa. Fale com a gente pelo WhatsApp." };
  var DEMO_PASS = "nobilite";

  var cfg = window.NOBILITE_CONFIG || {};
  var live = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  var sb = live ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function catOf(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i]; return CATS[0]; }
  function load(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { throw new Error("O navegador não deixou salvar. Libere o armazenamento do site e tente de novo."); } }
  function fail(error) { if (error) throw new Error(error.message || "Erro ao falar com o banco de dados."); }

  /* Ilustração dourada usada quando a peça não tem foto */
  var gid = 0;
  function art(kind) {
    var g = "nb" + (++gid);
    var defs = '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3dfa8"/><stop offset=".45" stop-color="#c9a35d"/><stop offset="1" stop-color="#7d5e2a"/></linearGradient>' +
      '<linearGradient id="' + g + 's" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9d3d6"/></linearGradient></defs>';
    var G = "url(#" + g + ")", S = "url(#" + g + "s)", body = "";
    if (kind === "anel") body = '<ellipse cx="50" cy="62" rx="27" ry="27" fill="none" stroke="' + G + '" stroke-width="6"/><path d="M38 33 50 18 62 33 50 42Z" fill="' + S + '" stroke="#e9eef0" stroke-width=".6"/><path d="M38 33h24M50 18v24" stroke="#ffffff" stroke-opacity=".5" stroke-width=".5"/>';
    else if (kind === "alianca") body = '<ellipse cx="40" cy="55" rx="24" ry="24" fill="none" stroke="' + G + '" stroke-width="7"/><ellipse cx="62" cy="50" rx="22" ry="22" fill="none" stroke="' + G + '" stroke-width="5" opacity=".9"/>';
    else if (kind === "colar") body = '<path d="M14 14C18 52 34 66 50 66S82 52 86 14" fill="none" stroke="' + G + '" stroke-width="2" stroke-dasharray="1 2.4" stroke-linecap="round"/><circle cx="50" cy="70" r="3" fill="none" stroke="' + G + '" stroke-width="1.6"/><path d="M50 73 57 81 50 91 43 81Z" fill="' + S + '"/>';
    else if (kind === "brinco") body = '<path d="M34 12c-6 0-8 6-5 10l5 6" fill="none" stroke="' + G + '" stroke-width="2"/><circle cx="34" cy="30" r="3" fill="' + G + '"/><ellipse cx="34" cy="50" rx="10" ry="13" fill="#efe9e2"/><ellipse cx="31" cy="45" rx="3" ry="4" fill="#ffffff" opacity=".8"/><path d="M68 12c-6 0-8 6-5 10l5 6" fill="none" stroke="' + G + '" stroke-width="2"/><circle cx="68" cy="30" r="3" fill="' + G + '"/><ellipse cx="68" cy="50" rx="10" ry="13" fill="#efe9e2"/><ellipse cx="65" cy="45" rx="3" ry="4" fill="#ffffff" opacity=".8"/>';
    else if (kind === "pulseira") { body = '<ellipse cx="50" cy="52" rx="36" ry="20" fill="none" stroke="' + G + '" stroke-width="3"/>'; for (var i = 0; i < 14; i++) { var a = i / 14 * Math.PI * 2; body += '<circle cx="' + (50 + 36 * Math.cos(a)).toFixed(1) + '" cy="' + (52 + 20 * Math.sin(a)).toFixed(1) + '" r="3.2" fill="' + S + '"/>'; } }
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + defs + body + "</svg>";
  }
  function visual(p) { return p.img ? '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' : art(catOf(p.cat).art); }

  /* ---------- conversão banco <-> tela ---------- */
  function fromRow(r) { return { id: r.id, name: r.nome, cat: r.categoria, metal: r.metal || "", detail: r.detalhes || "", weight: r.peso || "", price: r.preco || "", desc: r.descricao || "", featured: !!r.destaque, active: !!r.ativo, img: r.foto_url || "" }; }
  function toRow(p) { return { nome: p.name, categoria: p.cat, metal: p.metal, detalhes: p.detail, peso: p.weight, preco: p.price, descricao: p.desc, destaque: p.featured, ativo: p.active, foto_url: p.img || null }; }
  function sortProducts(list) { return list.slice().sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); }); }

  /* ---------- API ---------- */
  var store = {
    live: live,

    listProducts: async function () {
      if (!live) return sortProducts(load("nob_products", SEED));
      var res = await sb.from("produtos").select("*").order("destaque", { ascending: false }).order("criado_em", { ascending: false });
      fail(res.error);
      return res.data.map(fromRow);
    },

    saveProduct: async function (p) {
      if (!live) {
        var list = load("nob_products", SEED);
        if (p.id) list = list.map(function (x) { return x.id === p.id ? Object.assign({}, x, p) : x; });
        else { p.id = "p" + Date.now(); list.unshift(p); }
        save("nob_products", list);
        return p;
      }
      var res = p.id
        ? await sb.from("produtos").update(toRow(p)).eq("id", p.id).select().single()
        : await sb.from("produtos").insert(toRow(p)).select().single();
      fail(res.error);
      return fromRow(res.data);
    },

    deleteProduct: async function (id) {
      if (!live) { save("nob_products", load("nob_products", SEED).filter(function (x) { return x.id !== id; })); return; }
      var res = await sb.from("produtos").delete().eq("id", id);
      fail(res.error);
    },

    resetDemo: function () { save("nob_products", SEED); },

    /* Recebe a foto já reduzida (Blob JPEG + dataURL) e devolve a URL a gravar */
    uploadImage: async function (blob, dataUrl) {
      if (!live) return dataUrl;
      var path = "pecas/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
      var res = await sb.storage.from("fotos").upload(path, blob, { contentType: "image/jpeg", upsert: false });
      fail(res.error);
      return sb.storage.from("fotos").getPublicUrl(path).data.publicUrl;
    },

    getSettings: async function () {
      if (!live) return Object.assign({}, DEFAULTS, load("nob_settings", {}));
      var res = await sb.from("configuracoes").select("*").eq("id", 1).maybeSingle();
      fail(res.error);
      var r = res.data || {};
      return { whatsapp: r.whatsapp || DEFAULTS.whatsapp, phoneLabel: r.telefone || DEFAULTS.phoneLabel, announce: r.aviso == null ? DEFAULTS.announce : r.aviso };
    },

    saveSettings: async function (s) {
      if (!live) { save("nob_settings", s); return; }
      var res = await sb.from("configuracoes").update({ whatsapp: s.whatsapp, telefone: s.phoneLabel, aviso: s.announce }).eq("id", 1);
      fail(res.error);
    },

    /* ---------- login do lojista ---------- */
    signedIn: async function () {
      if (!live) { try { return sessionStorage.getItem("nob_admin") === "1"; } catch (e) { return !!store._mem; } }
      var res = await sb.auth.getSession();
      return !!(res.data && res.data.session);
    },
    signIn: async function (email, password) {
      if (!live) {
        if (password !== DEMO_PASS) throw new Error("Senha incorreta. Confira e tente de novo.");
        store._mem = true; try { sessionStorage.setItem("nob_admin", "1"); } catch (e) {}
        return;
      }
      var res = await sb.auth.signInWithPassword({ email: email, password: password });
      if (res.error) throw new Error("E-mail ou senha incorretos. Confira e tente de novo.");
    },
    signOut: async function () {
      if (!live) { store._mem = false; try { sessionStorage.removeItem("nob_admin"); } catch (e) {} return; }
      await sb.auth.signOut();
    }
  };

  function waLink(number, msg) { return "https://wa.me/" + String(number).replace(/\D/g, "") + (msg ? "?text=" + encodeURIComponent(msg) : ""); }

  window.Nobilite = { CATS: CATS, METALS: METALS, store: store, art: art, visual: visual, catOf: catOf, esc: esc, waLink: waLink };
})();
