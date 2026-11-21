/* ajuste-celular.js
   Faz os menus e telas dos jogos caberem em telas pequenas (celular).
   1) Se um menu/tela cheia não cabe, diminui o conteúdo (zoom) até caber.
   2) Se mesmo diminuído não couber, libera a rolagem pelo toque.
   3) Se a própria página for maior que a tela, libera a rolagem dela.
   Não muda nada quando tudo já cabe (computador). */
(function () {
  if (window.__ajusteCelular) return;
  window.__ajusteCelular = true;

  var ZOOM_MIN = 0.55;
  var estilo = document.createElement('style');
  estilo.textContent =
    '.ac-rola{overflow-y:auto!important;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}' +
    '.ac-rola,.ac-rola *{touch-action:pan-y!important}' +
    '.ac-rola.ac-flex{justify-content:flex-start!important}' +
    '.ac-rola.ac-flex-linha{align-items:flex-start!important}' +
    '.ac-rola.ac-flex>*,.ac-rola.ac-flex-linha>*{margin-top:auto;margin-bottom:auto}' +
    'html.ac-rola-doc,html.ac-rola-doc body{overflow-y:auto!important}' +
    'html.ac-rola-doc,html.ac-rola-doc body,html.ac-rola-doc body *:not(canvas):not(button){touch-action:pan-y!important}';
  (document.head || document.documentElement).appendChild(estilo);

  function visivel(el, cs) {
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function temBotao(el) {
    return !!el.querySelector('button, [onclick], input, select, a[href], .btn');
  }

  // telas que ocupam (quase) a tela toda: menus, fim de jogo, garagem...
  function candidatos() {
    var W = innerWidth, H = innerHeight, lista = [];
    var todos = document.body.getElementsByTagName('*');
    for (var i = 0; i < todos.length; i++) {
      var el = todos[i];
      if (el.tagName === 'CANVAS' || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;
      var cs = getComputedStyle(el);
      if (cs.position !== 'fixed' && cs.position !== 'absolute') continue;
      if (!visivel(el, cs)) continue;
      var r = el.getBoundingClientRect();
      var grande = r.width >= W * 0.5 && r.height >= H * 0.5;
      // tela menor, mas cujo conteúdo transborda (ex.: menu dentro da área do jogo)
      var transborda = r.width >= W * 0.3 && el.scrollHeight > el.clientHeight + 4;
      if (!grande && !transborda) continue;
      if (!temBotao(el)) continue;
      lista.push(el);
    }
    // fica só com os mais internos
    return lista.filter(function (a) {
      return !lista.some(function (b) { return b !== a && a.contains(b); });
    });
  }

  function ajustaTela(c) {
    var filhos = [];
    for (var i = 0; i < c.children.length; i++) {
      var f = c.children[i];
      if (f.dataset.acZoom) { f.style.zoom = ''; delete f.dataset.acZoom; }
      filhos.push(f);
    }
    c.classList.remove('ac-rola', 'ac-flex', 'ac-flex-linha');

    var cs = getComputedStyle(c);
    var padV = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    var padH = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    var cr = c.getBoundingClientRect();
    var dispH = Math.min(cr.height, innerHeight) - padV;
    var dispW = Math.min(cr.width, innerWidth) - padH;

    var topo = Infinity, base = -Infinity, larg = 0, algum = false;
    filhos.forEach(function (f) {
      var fcs = getComputedStyle(f);
      if (!visivel(f, fcs)) return;
      if (fcs.position === 'absolute' || fcs.position === 'fixed') return; // HUD solto
      var r = f.getBoundingClientRect();
      var alt = Math.max(r.height, f.scrollHeight);
      topo = Math.min(topo, r.top);
      base = Math.max(base, r.top + alt);
      larg = Math.max(larg, Math.max(r.width, f.scrollWidth));
      algum = true;
    });
    if (!algum) return;

    var precisaH = base - topo;
    var k = Math.min(1, dispH / precisaH, dispW / larg);
    if (k > 0.98) return; // já cabe

    var zoom = Math.max(ZOOM_MIN, k);
    filhos.forEach(function (f) { f.style.zoom = zoom; f.dataset.acZoom = '1'; });

    if (precisaH * zoom > dispH + 1) {
      c.classList.add('ac-rola');
      if (cs.display.indexOf('flex') >= 0) {
        c.classList.add(cs.flexDirection.indexOf('column') === 0 ? 'ac-flex' : 'ac-flex-linha');
      }
    }
  }

  function ajustaPagina() {
    var html = document.documentElement;
    html.classList.remove('ac-rola-doc');
    var alto = Math.max(document.body.scrollHeight, html.scrollHeight);
    if (alto <= innerHeight + 4) return;
    // só intervém se o jogo travou a rolagem (overflow escondido ou toque bloqueado)
    var ch = getComputedStyle(html), cb = getComputedStyle(document.body);
    var travada = /hidden|clip/.test(ch.overflowY + cb.overflowY) ||
      /none/.test(ch.touchAction + cb.touchAction);
    if (travada) html.classList.add('ac-rola-doc');
  }

  var agendado = false, ultimo = 0;
  function ajusta() {
    agendado = false;
    ultimo = Date.now();
    if (!document.body) return;
    try {
      candidatos().forEach(ajustaTela);
      ajustaPagina();
    } catch (e) { /* nunca quebra o jogo */ }
  }
  function agenda() {
    if (agendado) return;
    agendado = true;
    // no máximo ~2 vezes por segundo, para não pesar durante o jogo
    setTimeout(ajusta, Math.max(60, 450 - (Date.now() - ultimo)));
  }

  function inicia() {
    ajusta();
    setTimeout(ajusta, 400);
    setTimeout(ajusta, 1500);
    addEventListener('resize', agenda);
    addEventListener('orientationchange', agenda);
    // menus que aparecem/somem (troca de classe, style, ou conteúdo novo)
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var t = muts[i].target;
        if (muts[i].type === 'attributes' && t.dataset && t.dataset.acZoom !== undefined && muts[i].attributeName === 'style') continue;
        if (t === document.documentElement && muts[i].attributeName === 'class') continue;
        if (t.classList && t.classList.contains('ac-rola') && muts[i].attributeName === 'class') continue;
        agenda();
        return;
      }
    }).observe(document.body, { attributes: true, attributeFilter: ['class', 'style', 'hidden'], childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inicia);
  else inicia();
})();
