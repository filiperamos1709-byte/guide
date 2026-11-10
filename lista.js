// Lista d'attesa FAR: manda email e consenso al recettore e risponde nella pagina.
// Senza JS il modulo fa un POST normale allo stesso indirizzo.
(function () {
  var RECETTORE = 'https://far-lista.ista--ancio-v1.workers.dev/';
  var prova = new URLSearchParams(location.search).get('lista');
  if (prova && /^http:\/\/localhost:\d+\/?$/.test(prova)) RECETTORE = prova;

  [].forEach.call(document.querySelectorAll('form.lista'), function (modulo) {
    modulo.action = RECETTORE;
    modulo.elements.pagina.value = location.pathname;
    var esito = modulo.querySelector('.esito-lista');
    var bottone = modulo.querySelector('button');

    modulo.addEventListener('submit', function (e) {
      e.preventDefault();
      bottone.disabled = true;
      esito.textContent = '';
      fetch(RECETTORE, { method: 'POST', body: new FormData(modulo) })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok && d.ok, errore: d.errore }; }); })
        .then(function (r) {
          if (r.ok) {
            modulo.classList.add('fatto');
            esito.textContent = 'Fatto. Ti scrivo il giorno in cui arriva.';
          } else {
            esito.textContent = r.errore === 'email' ? 'Controlla l\'indirizzo email.' : 'Non è andata. Riprova tra poco.';
            bottone.disabled = false;
          }
        })
        .catch(function () {
          esito.textContent = 'Non è andata. Riprova tra poco.';
          bottone.disabled = false;
        });
    });
  });
})();
