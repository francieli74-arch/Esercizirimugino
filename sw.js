/* Service Worker — supporto offline per Gestire il Rimuginio v4 */
var CACHE = 'mct-v4';
var ASSETS = ['./','./index.html','./manifest.webmanifest','./icon.svg'];

function patchHTML(html) {
  /* 1. ATT: formulazione piu prudente */
  html = html.replace(
    'Questi esercizi allenano la tua attenzione a spostarsi via dalla preoccupazione. Come in palestra: risultati dopo 4&ndash;6 settimane di pratica costante, non dopo 2 giorni.',
    'Questi esercizi allenano la tua attenzione a spostarsi via dalla preoccupazione. L&rsquo;ATT (Attention Training Technique) &egrave; una tecnica attentiva usata in alcuni percorsi MCT e in altri contesti clinici: pu&ograve; essere utile come allenamento dell&rsquo;attenzione, ma non &egrave; un passaggio obbligatorio n&eacute; deve essere trattata come una cura in s&eacute;. La pratica va adattata al proprio percorso.'
  );
  html = html.replace(
    '<span>&#128259; 2 volte al giorno (mattina e sera)</span>\n      <span>&#128197; Per 6 settimane</span>',
    '<span>&#128259; Frequenza regolare, compatibile con il tuo percorso</span>\n      <span>&#128197; Periodo di pratica indicativo</span>'
  );
  /* 2. Radio: niente controllo del volume/soppressione */
  html = html.replace(
    'Progressione: Giorno 1&ndash;3: radio a 5 metri. Giorno 4&ndash;6: a 10 metri. Giorno 7+: in un&rsquo;altra stanza. Variante: abbassa il volume da 10 a 0 in 10 secondi.',
    'Progressione: Giorno 1&ndash;3: radio a 5 metri. Giorno 4&ndash;6: a 10 metri. Giorno 7+: in un&rsquo;altra stanza. L&rsquo;obiettivo non &egrave; abbassare o eliminare il pensiero, ma lasciarlo sullo sfondo senza seguirlo.'
  );
  /* 3. Anti-rituale: inserito subito dopo il blocco iniziale */
  var anchor = '<div class="exercise">\n    <h3><span class="num">&#9679;</span> Come usare questa guida</h3>';
  if (html.indexOf('class="anti-ritual-note"') === -1 && html.indexOf(anchor) !== -1) {
    html = html.replace(anchor, anchor + '\n    <div class="note anti-ritual-note"><strong>Anti-rituale:</strong> esercizi, caselle, timer, punteggi e diari sono strumenti, non obiettivi. Non devi completarli perfettamente, tutti i giorni, n&eacute; controllare continuamente se li stai usando &ldquo;bene&rdquo;. Se il monitoraggio del percorso diventa una nuova fonte di preoccupazione o controllo, riducilo e torna alle pratiche essenziali.</div>');
  }
  /* 4. Rassicurazione: distinguere verifica necessaria da checking ansioso */
  html = html.replace(
    'Per 24 ore, niente ricerca: niente Google, niente domande, niente ricontrolli. Se il bisogno torna, annota l&rsquo;ora e l&rsquo;intensit&agrave; (0&ndash;10) e rimanda di nuovo.',
    'Per 24 ore, prova a rinviare le ricerche, le domande o i ricontrolli che riconosci come rassicurazione ansiosa ripetitiva. Se il bisogno torna, puoi annotare l&rsquo;ora e l&rsquo;intensit&agrave; (0&ndash;10) e rimandare di nuovo. Questo esperimento non riguarda controlli medici, indicazioni professionali, scadenze o verifiche di sicurezza realmente necessarie.'
  );
  html = html.replace(
    'Dopo 24 ore, prima di cedere, valuta: &ldquo;è successo qualcosa di grave nel frattempo?&rdquo; Poi decidi se la rassicurazione serve ancora davvero.',
    'Dopo 24 ore, chiediti: &ldquo;La verifica che volevo fare era una necessit&agrave; concreta o soprattutto un tentativo ripetitivo di sentirmi certo?&rdquo; Se &egrave; una necessit&agrave; reale, falla seguendo le indicazioni appropriate; se &egrave; rassicurazione ripetitiva, puoi scegliere di non seguirla subito.'
  );
  /* 5. Progressione indicativa e flessibile */
  html = html.replace('La progressione è un orientamento, non un esame:', 'La progressione &egrave; un orientamento flessibile, non un protocollo obbligatorio:');
  html = html.replace('Si inizia SOLO dopo almeno 2 settimane di ATT. L&rsquo;ATT ti ha dato i &ldquo;muscoli attentivi&rdquo; per poter rimandare. Senza quelli, il rinvio fallisce.', 'Il Worry Postponement pu&ograve; essere introdotto quando le pratiche di base sono sufficientemente familiari. Le 2 settimane indicate qui sono un orientamento, non un requisito universale: non &egrave; necessario aspettare un numero preciso di giorni e non &egrave; necessario forzarlo se non &egrave; appropriato.');
  html = html.replace('Fai questi esercizi SOLO dopo almeno 4 settimane di ATT e DM. Servono a testare concretamente le tue paure:', 'Questi esercizi sono pi&ugrave; intensi e hanno senso solo se appropriati per te e se le pratiche precedenti sono sufficientemente familiari. Le settimane indicate sono un orientamento, non una soglia obbligatoria. Servono a testare concretamente le tue paure:');
  /* Correzione della distinzione problem solving/rimuginio */
  html = html.replace('Regola: se la risposta e&rsquo; un&rsquo;azione concreta, falla subito. Se e&rsquo; un&rsquo;altra preoccupazione, rimandala.', 'Regola pratica: quando esiste un&rsquo;azione concreta, necessaria e appropriata che puoi fare ora, valuta di farla; quando invece stai continuando a elaborare scenari senza arrivare a un&rsquo;azione utile, puoi rimandare il rimuginio.');
  return html;
}

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE).then(function(cache) { return cache.addAll(ASSETS); }).then(function() { return self.skipWaiting(); }));
});
self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
  }).then(function() { return self.clients.claim(); }));
});
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  if (url.origin !== location.origin || event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')) {
    event.respondWith(fetch(event.request).then(function(response) {
      if (!response || response.status !== 200) return response;
      return response.text().then(function(text) {
        var patched = patchHTML(text);
        var out = new Response(patched, {status:response.status,statusText:response.statusText,headers:response.headers});
        caches.open(CACHE).then(function(cache) { cache.put('./index.html', out.clone()); });
        return out;
      });
    }).catch(function() { return caches.match('./index.html'); }));
    return;
  }
  event.respondWith(caches.match(event.request).then(function(cached) {
    if (cached) return cached;
    return fetch(event.request).then(function(response) {
      if (response && response.status === 200) { var copy=response.clone(); caches.open(CACHE).then(function(cache){cache.put(event.request,copy);}); }
      return response;
    });
  }).catch(function(){ return caches.match('./index.html'); }));
});
