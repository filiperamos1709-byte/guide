// La bandiera: tocchi "Non lo passo" sul primo test che non passi,
// la via si ferma lì e il tuo gradino si accende. Senza JS la guida si legge uguale.
(function () {
  var scala = document.querySelector('.scala');
  if (!scala) return;
  var prove = [].slice.call(scala.children);
  var fasi = [].slice.call(document.querySelectorAll('.fasi .fase:not(.solo-stampa)'));

  // "Gradino 3", "Gradino 1 – tecnica", "Gradini 1–5 – forza"
  fasi.forEach(function (fase) {
    var etichetta = fase.querySelector('h3 span');
    var m = etichetta && etichetta.textContent.match(/Gradin[oi]\s+(\d+)(?:\s*[–-]\s*(\d+))?/);
    if (!m) return;
    fase.dataset.da = m[1];
    fase.dataset.a = m[2] || m[1];
    if (!m[2] && !document.getElementById('gradino-' + m[1])) fase.id = 'gradino-' + m[1];
  });

  var chiave = 'gradino:' + location.pathname;
  var esito = document.createElement('p');
  esito.className = 'esito';
  esito.setAttribute('aria-live', 'polite');
  esito.hidden = true;

  prove.forEach(function (prova) {
    var n = prova.querySelector('.n');
    if (!n) return;
    prova.dataset.n = n.textContent.trim();
    var bottone = document.createElement('button');
    bottone.type = 'button';
    bottone.className = 'ferma';
    bottone.textContent = 'Non lo passo';
    bottone.setAttribute('aria-pressed', 'false');
    bottone.addEventListener('click', function () {
      segna(prova.classList.contains('qui') ? null : prova.dataset.n);
    });
    prova.querySelector('div').appendChild(bottone);
  });

  function segna(numero) {
    var trovata = false;
    prove.forEach(function (prova) {
      var qui = prova.dataset.n === numero;
      prova.classList.toggle('qui', qui);
      prova.classList.toggle('oltre', trovata);
      if (qui) trovata = true;
      var b = prova.querySelector('.ferma');
      if (b) b.setAttribute('aria-pressed', String(qui));
    });

    var mie = fasi.filter(function (f) {
      return numero !== null && +f.dataset.da <= +numero && +numero <= +f.dataset.a;
    });
    fasi.forEach(function (f) { f.classList.toggle('tuo', mie.indexOf(f) > -1); });

    if (numero === null) {
      esito.hidden = true;
      salva(null);
      return;
    }
    var prova = scala.querySelector('[data-n="' + numero + '"] div');
    prova.appendChild(esito);
    esito.hidden = false;
    esito.textContent = '';
    if (mie.length) {
      esito.appendChild(document.createTextNode('Il tuo gradino è il ' + numero + '. '));
      var vai = document.createElement('a');
      vai.href = '#' + (mie[0].id || 'gradino-' + numero);
      vai.textContent = 'Vai agli esercizi';
      esito.appendChild(vai);
    } else {
      esito.textContent = 'Sei prima della scala: parti da quello che dice il test ' + numero + '.';
    }
    salva(numero);
  }

  function salva(numero) {
    try {
      if (numero === null) localStorage.removeItem(chiave);
      else localStorage.setItem(chiave, numero);
    } catch (e) {}
  }

  try {
    var ricordato = localStorage.getItem(chiave);
    if (ricordato && scala.querySelector('[data-n="' + ricordato + '"]')) segna(ricordato);
  } catch (e) {}
})();
