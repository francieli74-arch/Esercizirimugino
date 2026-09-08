/* Service Worker — supporto offline per Gestire il Rimuginio v4 */
var CACHE = 'mct-v4';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg'
];

/*
 * Correzioni editoriali mirate alla guida:
 * 1) ATT descritta con formulazioni prudenti e non come passaggio obbligatorio/universale.
 * 2) rimossa la variante della radio che suggeriva di ridurre il volume a zero.
 * 3) aggiunta una barriera esplicita contro la trasformazione di esercizi/punteggi in rituali.
 * 4) resa più netta la distinzione tra rassicurazione ansiosa e verifiche realmente necessarie.
 * 5) progressione resa esplicitamente indicativa e adattabile, non prescrittiva.
 */
function patchHTML(html) {
  var replacements = [
    [
      'Questi esercizi allenano la tua attenzione a spostarsi via dalla preoccupazione. Come in palestra: risultati dopo 4&ndash;6 settimane di pratica costante, non dopo 2 giorni.',
      'Questi esercizi allenano la tua attenzione a spostarsi via dalla preoccupazione. L&rsquo;ATT (Attention Training Technique) &egrave; una tecnica attentiva usata in alcuni percorsi MCT e in altri contesti clinici: pu&ograve; essere utile come allenamento dell&rsquo;attenzione, ma non &egrave; un passaggio obbligatorio n&eacute; deve essere trattata come una cura in s&eacute;. La pratica va adattata al proprio percorso.'
    ],
    [
      '<span>&#128259; 2 volte al giorno (mattina e sera)</span>\n      <span>&#128197; Per 6 settimane</span>',
      '<span>&#128259; Frequenza regolare, compatibile con il tuo percorso</span>\n      <span>&#128197; Periodo di pratica indicativo</span>'
    ],
    [
      'Progressione: Giorno 1&ndash;3: radio a 5 metri. Giorno 4&ndash;6: a 10 metri. Giorno 7+: in un&rsquo;altra stanza. Variante: abbassa il volume da 10 a 0 in 10 secondi.',
      'Progressione: Giorno 1&ndash;3: radio a 5 metri. Giorno 4&ndash;6: a 10 metri. Giorno 7+: in un&rsquo;altra stanza. L&rsquo;obiettivo non &egrave; abbassare o eliminare il pensiero, ma lasciarlo sullo sfondo senza seguirlo.'
    ],
    [
      'Gli esercizi che farai interrompono questo circuito in punti diversi.</strong> L\'ATT scollega l\'attenzione dal monitoraggio. La DM impedisce di farsi risucchiare dai pensieri. Il WP spezza il ciclo rimuginio-urgenza.',
      'Gli esercizi di questa guida affrontano punti diversi del circuito. L&rsquo;ATT allena la flessibilit&agrave; attentiva; la DM aiuta a osservare i pensieri senza seguirli; il WP permette di sperimentare il rinvio del rimuginio. Nessuna singola tecnica deve essere considerata indispensabile per tutti.'
    ],
    [
      '<div class="exercise">\n    <h3><span class="num">&#9679;</span> Come usare questa guida</h3>',
      '<div class="exercise">\n    <h3><span class="num">&#9679;</span> Come usare questa guida</h3>\n    <div class="note"><strong>Anti-rituale:</strong> esercizi, caselle, timer, punteggi e diari sono strumenti, non obiettivi. Non devi completarli perfettamente, tutti i giorni, n&eacute; controllare continuamente se li stai usando "bene". Se il monitoraggio del percorso diventa esso stesso una fonte di preoccupazione o controllo, riducilo e torna alle pratiche essenziali.</div>'
    ],
    [
      'Per 24 ore, niente ricerca: niente Google, niente domande, niente ricontrolli. Se il bisogno torna, annota l&rsquo;ora e l&rsquo;intensit&agrave; (0&ndash;10) e rimanda di nuovo.',
      'Per 24 ore, prova a rinviare la ricerca, le domande o i ricontrolli che riconosci come rassicurazione ansiosa ripetitiva. Se il bisogno torna, puoi annotare l&rsquo;ora e l&rsquo;intensit&agrave; (0&ndash;10) e rimandare di nuovo. Questo esperimento non riguarda controlli medici, indicazioni professionali, scadenze o verifiche di sicurezza realmente necessarie.'
    ],
    [
      'Dopo 24 ore, prima di cedere, valuta: &ldquo;è successo qualcosa di grave nel frattempo?&rdquo; Poi decidi se la rassicurazione serve ancora davvero.',
      'Dopo 24 ore, chiediti: &ldquo;La verifica che volevo fare era una necessit&agrave; concreta o soprattutto un tentativo ripetitivo di sentirmi certo?&rdquo; Se &egrave; una necessit&agrave; reale, falla seguendo le indicazioni appropriate; se &egrave; rassicurazione ripetitiva, puoi scegliere di non seguirla subito.'
    ],
    [
      'Regola: se la risposta e&rsquo; un&rsquo;azione concreta, falla subito. Se e&rsquo; un&rsquo;altra preoccupazione, rimandala.',
      'Regola pratica: quando esiste un&rsquo;azione concreta, necessaria e appropriata che puoi fare ora, valuta di farla; quando invece stai continuando a elaborare scenari senza arrivare a un&rsquo;azione utile, puoi rimandare il rimuginio.'
    ],
    [
      'Si inizia SOLO dopo almeno 2 settimane di ATT. L&rsquo;ATT ti ha dato i &ldquo;muscoli attentivi&rdquo; per poter rimandare. Senza quelli, il rinvio fallisce.',
      'Il Worry Postponement pu&ograve; essere introdotto quando le pratiche di base sono sufficientemente familiari. Le 2 settimane indicate qui sono un orientamento, non un requisito universale: non &egrave; necessario aspettare un numero preciso di giorni se il passaggio &egrave; gi&agrave; appropriato, e non &egrave; necessario forzarlo se non lo &egrave;.'
    ],
    [
      '<p style="margin-bottom:16px;color:var(--text-secondary)">Fai questi esercizi SOLO dopo almeno 4 settimane di ATT e DM. Servono a testare concretamente le tue paure: &ldquo;Non riesco a smettere&rdquo; e &ldquo;Rimuginare mi far&agrave; impazzire&rdquo;.</p>',
      '<p style="margin-bottom:16px;color:var(--text-secondary)">Questi esercizi sono pi&ugrave; intensi e hanno senso solo se sono appropriati per il tuo problema e se le pratiche precedenti sono sufficientemente familiari. Le settimane indicate pi&ugrave; sotto sono un orientamento, non una soglia obbligatoria.</p>'
    ],
    [
      '<li><strong>Settimane 1&ndash;2:</strong> familiarizza con Esercizi 1&ndash;4 (ATT). Una pratica regolare &egrave; pi&ugrave; importante del numero perfetto di sessioni.</li>',
      '<li><strong>Settimane 1&ndash;2:</strong> come orientamento, familiarizza con Esercizi 1&ndash;4 (ATT). Una pratica regolare e sostenibile &egrave; pi&ugrave; importante del numero perfetto di sessioni.</li>'
    ],
    [
      '<li><strong>Settimane 3&ndash;4:</strong> se l&rsquo;ATT &egrave; diventato familiare, aggiungi alcuni esercizi 5&ndash;11 (Detached Mindfulness). Mantieni l&rsquo;ATT come pratica di base.</li>',
      '<li><strong>Settimane 3&ndash;4:</strong> se l&rsquo;ATT &egrave; diventato familiare, puoi aggiungere alcuni esercizi 5&ndash;11 (Detached Mindfulness). Mantieni solo le pratiche che risultano utili e sostenibili.</li>'
    ],
    [
      '<li><strong>Settimane 5&ndash;6:</strong> puoi introdurre Esercizi 12&ndash;14. Scegli quelli pi&ugrave; pertinenti al tuo pattern di rimuginio.</li>',
      '<li><strong>Settimane 5&ndash;6:</strong> puoi introdurre Esercizi 12&ndash;14 quando risultano pertinenti. Non &egrave; necessario seguirli tutti n&eacute; in quest&rsquo;ordine.</li>'
    ],
    [
      '<li><strong>Settimane 7&ndash;8:</strong> se il rinvio &egrave; appropriato per te, prova Esercizi 15&ndash;17 (Worry Postponement).</li>',
      '<li><strong>Settimane 7&ndash;8:</strong> se il rinvio &egrave; appropriato per te, puoi provare Esercizi 15&ndash;17 (Worry Postponement). La tempistica &egrave; indicativa.</li>'
    ],
    [
      '<li><strong>Settimane 9&ndash;10:</strong> Esercizi 18&ndash;20 sono esperimenti pi&ugrave; intensi: non sono obbligatori e, se hai un terapeuta, &egrave; preferibile concordarli con lui/lei.</li>',
      '<li><strong>Settimane 9&ndash;10:</strong> Esercizi 18&ndash;20 sono esperimenti pi&ugrave; intensi: non sono obbligatori e vanno scelti solo quando appropriati; se hai un terapeuta, &egrave; preferibile concordarli con lui/lei.</li>'
    ],
    [
      '<li data-week="11+"><strong>Dal mese 3:</strong> usa Esercizi 21&ndash;27 come strumenti di mantenimento e riflessione, senza trasformarli in controlli quotidiani obbligatori.</li>',
      '<li data-week="11+"><strong>Dal mese 3:</strong> usa Esercizi 21&ndash;27 come strumenti di mantenimento e riflessione, scegliendo con flessibilit&agrave; cosa mantenere. Evita di trasformarli in controlli quotidiani obbligatori.</li>'
    ],
    [
      '<tr><td>Worry Postponement</td><td>Lo uso sempre per le preoccupazioni quotidiane</td></tr>',
      '<tr><td>Worry Postponement</td><td>Lo uso quando &egrave; appropriato e utile; non come obbligo automatico.</td></tr>'
    ],
    [
      '<tr><td>Cosa fare al primo segnale</td><td>ATT 2&times;/die per 1&ndash;2 settimane + WP</td></tr>',
      '<tr><td>Cosa fare al primo segnale</td><td>Riprendo una o due pratiche che mi sono utili, senza trasformarle in un obbligo; se il problema persiste, valuto un confronto professionale.</td></tr>'
    ],
    [
      '<tr><td>ATT completo (15 min)</td><td>Ogni giorno. Subito se il rimuginio aumenta.</td></tr>',
      '<tr><td>ATT completo (15 min)</td><td>Pratica regolare se utile; non &egrave; necessario usarlo come risposta automatica a ogni aumento del rimuginio.</td></tr>'
    ],
    [
      '<tr><td>ATT breve (3 min)</td><td>Nei momenti di picco, quando sento di perdere il controllo.</td></tr>',
      '<tr><td>ATT breve (3 min)</td><td>Quando pu&ograve; aiutarmi a riallocare l&rsquo;attenzione; non per dimostrare che devo far scendere l&rsquo;ansia.</td></tr>'
    ],
    [
      '<tr><td>Rimuginio Volontario</td><td>Se ricomincio a credere &ldquo;non riesco a smettere&rdquo; &mdash; lo ripeto.</td></tr>',
      '<tr><td>Rimuginio Volontario</td><td>Solo come esperimento appropriato e non come risposta automatica a ogni aumento del rimuginio.</td></tr>'
    ],
    [
      '<p style="font-size:14px;color:var(--text-secondary);margin-top:8px"><strong>Obiettivo:</strong> almeno 12 sessioni su 14 nella settimana. La difficolt&agrave; media dovrebbe scendere col tempo.</p>',
      '<p style="font-size:14px;color:var(--text-secondary);margin-top:8px"><strong>Obiettivo:</strong> costruire una pratica sostenibile. Non serve raggiungere un numero perfetto di sessioni; usa il diario per osservare l&rsquo;andamento, non per controllarti.</p>'
    ]
  ];
  replacements.forEach(function(pair) {
    if (html.indexOf(pair[0]) !== -1) html = html.split(pair[0]).join(pair[1]);
  });
  return html;
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
          .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  if (url.origin !== location.origin || event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        if (!response || response.status !== 200) return response;
        return response.text().then(function(text) {
          var patched = patchHTML(text);
          var patchedResponse = new Response(patched, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
          caches.open(CACHE).then(function(cache) { cache.put('./index.html', patchedResponse.clone()); });
          return patchedResponse;
        });
      }).catch(function() {
        return caches.match('./index.html');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (response && response.status === 200) {
          var copy = response.clone();
          caches.open(CACHE).then(function(cache) { cache.put(event.request, copy); });
        }
        return response;
      });
    }).catch(function() {
      return caches.match('./index.html');
    })
  );
});
