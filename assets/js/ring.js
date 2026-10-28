/* Anel girando no topo da página (canvas). Com "reduzir movimento" ligado, desenha um quadro parado. */
(function () {
  "use strict";
  var c = document.getElementById("ring");
  if (!c) return;
  var ctx = c.getContext("2d");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sparks = [];
  for (var i = 0; i < 26; i++) sparks.push({ a: Math.random() * Math.PI * 2, r: .25 + Math.random() * .25, p: Math.random() * 6, s: .6 + Math.random() * 1.6 });

  function size() { var r = c.getBoundingClientRect(), d = window.devicePixelRatio || 1; c.width = r.width * d; c.height = r.height * d; }

  function draw(t) {
    var w = c.width, h = c.height, s = Math.min(w, h), cx = w / 2, cy = h * .56;
    ctx.clearRect(0, 0, w, h);
    var halo = ctx.createRadialGradient(cx, cy - s * .1, 0, cx, cy, s * .5);
    halo.addColorStop(0, "rgba(210,178,116,.16)"); halo.addColorStop(1, "rgba(210,178,116,0)");
    ctx.fillStyle = halo; ctx.fillRect(0, 0, w, h);
    var spin = t / 2600, R = s * .28, ry = R * (.32 + .2 * Math.abs(Math.sin(spin))), band = s * .045;

    function arc(from, to, light) {
      ctx.beginPath(); ctx.ellipse(cx, cy, R, ry, 0, from, to);
      var g = ctx.createLinearGradient(cx - R, cy - ry, cx + R, cy + ry);
      var sh = (Math.sin(spin * 2) + 1) / 2;
      g.addColorStop(0, light ? "#f6e3ae" : "#6e5224");
      g.addColorStop(Math.max(.05, Math.min(.95, sh)), light ? "#fff4d6" : "#a07e40");
      g.addColorStop(1, light ? "#9c7a3c" : "#4c3816");
      ctx.strokeStyle = g; ctx.lineWidth = band; ctx.lineCap = "butt"; ctx.stroke();
    }

    arc(Math.PI, Math.PI * 2, false); // metade de trás do aro

    var gy = cy - ry - band * .2, gw = s * .085, gh = s * .11;
    ctx.save(); ctx.translate(cx, gy);
    ctx.beginPath(); ctx.moveTo(-gw, -gh * .2); ctx.lineTo(-gw * .55, -gh * .75); ctx.lineTo(gw * .55, -gh * .75); ctx.lineTo(gw, -gh * .2); ctx.lineTo(0, gh * .55); ctx.closePath();
    var dg = ctx.createLinearGradient(-gw, -gh, gw, gh), f = (Math.sin(spin * 3) + 1) / 2;
    dg.addColorStop(0, "#ffffff"); dg.addColorStop(f * .8 + .1, "#bfe0e6"); dg.addColorStop(1, "#5f8a93");
    ctx.fillStyle = dg; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = Math.max(1, s * .002);
    ctx.beginPath(); ctx.moveTo(-gw, -gh * .2); ctx.lineTo(gw, -gh * .2); ctx.moveTo(-gw * .55, -gh * .75); ctx.lineTo(-gw * .2, -gh * .2); ctx.lineTo(0, gh * .55); ctx.moveTo(gw * .55, -gh * .75); ctx.lineTo(gw * .2, -gh * .2); ctx.lineTo(0, gh * .55); ctx.stroke();
    ctx.fillStyle = "#d2b274";
    [-gw * .95, gw * .95].forEach(function (x) { ctx.beginPath(); ctx.arc(x, -gh * .2, s * .008, 0, 7); ctx.fill(); });
    ctx.restore();

    arc(0, Math.PI, true); // metade da frente

    sparks.forEach(function (k) {
      var a = (Math.sin(t / 600 * k.s + k.p) + 1) / 2; if (a < .55) return;
      var x = cx + Math.cos(k.a) * s * k.r, y = cy - s * .08 + Math.sin(k.a) * s * k.r * .7, l = s * .018 * (a - .5) * 2;
      ctx.strokeStyle = "rgba(255,246,222," + (a - .5) * 2 + ")"; ctx.lineWidth = Math.max(1, s * .0025);
      ctx.beginPath(); ctx.moveTo(x - l, y); ctx.lineTo(x + l, y); ctx.moveTo(x, y - l); ctx.lineTo(x, y + l); ctx.stroke();
    });
  }

  size();
  addEventListener("resize", function () { size(); if (reduce) draw(1300); });
  if (reduce) { draw(1300); return; }
  (function loop(t) { draw(t || 1300); requestAnimationFrame(loop); })();
})();
