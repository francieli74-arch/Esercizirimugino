/* Service Worker — supporto offline per Gestire il Rimuginio v6 */
var CACHE = 'mct-v6';
var ASSETS = ['./','./index.html','./manifest.webmanifest','./icon.svg'];

function replaceExercise(html, id, title, timer, meta, body) {
  var re = new RegExp('<div class="exercise" id="' + id + '">[\\s\\S]*?<div class="chk-wrap">[\\s\\S]*?</div>\\s*</div>', 'i');
  var block = '<div class="exercise" id="' + id + '">' +
    '<h3><span class="num">' + title + '</span> <button class="timer-tag" data-time="300" data-label="' + timer + '">&#9200; 5 min</button></h3>' +
    '<div class="meta"><span>&#9200; 5 minuti</span><span>' + meta + '</span></div>' +
    body +
    '<div class="chk-wrap"><input type="checkbox" id="chk' + id.replace('ex','') + '"><label for="chk' + id.replace('ex','') + '">Ho fatto questo esperimento oggi</label></div>' +
    '</div>';
  return html.replace(re, block);
}

function patchHTML(html) {
  /* Nota anti-ritualizzazione */
  var anchor = '<h3><span class="num">&#9679;</span> Come usare questa guida</h3>';
  if (html.indexOf('anti-ritual-note') === -1 && html.indexOf(anchor) !== -1) {
    html = html.replace(anchor, anchor + '<div class="note anti-ritual-note"><strong>Anti-rituale:</strong> esercizi, caselle, timer, punteggi e diari sono strumenti, non obiettivi. Non devi completarli perfettamente né controllare continuamente se li stai usando “bene”. Se il monitoraggio diventa una nuova fonte di preoccupazione o controllo, riducilo e torna alle pratiche essenziali.</div>');
  }

  /* ATT: formulazione prudente */
  html = html.replace(/Questi esercizi allenano la tua attenzione a spostarsi via dalla preoccupazione\.[\s\S]{0,240}?risultati dopo 4&ndash;6 settimane di pratica costante, non dopo 2 giorni\./,
    'Questi esercizi allenano la tua attenzione a spostarsi via dalla preoccupazione. L&rsquo;ATT (Attention Training Technique) è una tecnica attentiva usata in alcuni percorsi MCT e in altri contesti clinici: può essere utile come allenamento dell&rsquo;attenzione, ma non è un passaggio obbligatorio né una cura in sé. La pratica va adattata al proprio percorso.');
  html = html.replace(/2 volte al giorno \(mattina e sera\)/g, 'Frequenza regolare, compatibile con il tuo percorso');
  html = html.replace(/Per 6 settimane/g, 'Periodo di pratica indicativo');

  /* Evita ATT durante la guida */
  html = html.replace(/Si fa anche in ufficio, in macchina \(a occhi aperti\), o prima di una riunione\./,
    '<strong>Può essere praticato in contesti quotidiani in cui puoi mantenere piena attenzione all&rsquo;ambiente.</strong> Non praticarlo mentre guidi o svolgi attività che richiedono attenzione continua alla sicurezza.');

  /* Radio: nessuna manipolazione del “volume” del pensiero */
  html = html.replace(/Variante: abbassa il volume da 10 a 0 in 10 secondi\.?/, 'L&rsquo;obiettivo non è abbassare o eliminare il pensiero, ma lasciarlo sullo sfondo senza seguirlo.');

  /* Etichettatura: niente classificazione obbligatoria */
  html = html.replace(/Per ognuno, dagli un’etichetta:/g, 'Quando è utile, dai ai pensieri più evidenti un’etichetta semplice:');
  html = html.replace(/Per ognuno, dagli un&rsquo;etichetta:/g, 'Quando è utile, dai ai pensieri più evidenti un’etichetta semplice:');
  html = html.replace(/Solo etichetta e passa al prossimo\./g, 'Non è necessario classificare ogni pensiero. Se stai controllando continuamente se lo stai facendo bene, lascia perdere l’etichetta e torna semplicemente a ciò che stai facendo.');

  /* Diario ATT */
  html = html.replace(/almeno 12 sessioni su 14/g, 'una pratica regolare ma sostenibile');
  html = html.replace(/La difficoltà media dovrebbe scendere col tempo\./g, 'Non serve ottenere una difficoltà sempre più bassa.');

  /* Micro-ATT */
  html = html.replace(/1–2 minuti × 5 volte al giorno/g, '1–2 minuti, quando è utile');
  html = html.replace(/1–2 minuti &times; 5 volte al giorno/g, '1–2 minuti, quando è utile');
  html = html.replace(/Scegli 5 momenti della giornata/g, 'Scegli uno o pochi momenti naturali della giornata');
  html = html.replace(/se devi riportare l’attenzione 50 volte, l’esercizio ha funzionato 50 volte\. Ogni ritorno è una ripetizione in palestra\./g, 'L&rsquo;obiettivo è tornare al compito senza trasformare i ritorni dell&rsquo;attenzione in un conteggio o in una prova da superare.');

  /* Monitoraggio delle minacce: niente rassicurazione */
  html = html.replace(/La risposta, quasi sempre, è: niente\. Il monitoraggio è un’abitudine, non una protezione\./g,
    'Non cercare una risposta rassicurante; osserva piuttosto cosa succede quando lasci il controllo sullo sfondo e torni all&rsquo;attività.');

  /* Rassicurazione: distinguere checking ansioso da controlli necessari */
  html = html.replace(/Per 24 ore, niente ricerca: niente Google, niente domande, niente ricontrolli\.[\s\S]{0,180}?rimanda di nuovo\./,
    'Per 24 ore, prova a rinviare ricerche, domande o ricontrolli che riconosci come rassicurazione ansiosa ripetitiva. Questo esperimento non riguarda controlli medici, indicazioni professionali, scadenze o verifiche di sicurezza necessarie.');
  html = html.replace(/Dopo 24 ore, prima di cedere, valuta:[\s\S]{0,180}?rassicurazione serve ancora davvero\./,
    'Dopo 24 ore, chiediti: “La verifica che volevo fare era una necessità concreta o soprattutto un tentativo ripetitivo di sentirmi certo?”. Se è una necessità reale, falla seguendo le indicazioni appropriate; se è rassicurazione ripetitiva, puoi scegliere di non seguirla subito.');

  /* Worry Postponement: nessuna soglia universale */
  html = html.replace(/Si inizia SOLO dopo almeno 2 settimane di ATT\.[\s\S]{0,180}?il rinvio fallisce\./,
    'Il Worry Postponement può essere introdotto quando le pratiche di base sono sufficientemente familiari. Le 2 settimane indicate qui sono un orientamento, non un requisito universale.');

  /* Problem solving */
  html = html.replace(/Regola: se la risposta[^<]{0,220}?rimandala\./g,
    'Regola pratica: quando esiste un’azione concreta, necessaria e appropriata che puoi fare ora, valuta di farla; quando invece continui a elaborare scenari senza arrivare a un’azione utile, puoi rimandare il rimuginio.');

  /* Esposizione: nessuna soglia rigida */
  html = html.replace(/Fai questi esercizi SOLO dopo almeno 4 settimane di ATT e DM\./,
    'Questi esercizi sono più intensi e hanno senso solo se appropriati per te e se le pratiche precedenti sono sufficientemente familiari. Le settimane indicate sono un orientamento, non una soglia obbligatoria.');

  /* Progressione generale */
  html = html.replace(/La progressione è un orientamento, non un esame:/g, 'La progressione è un orientamento flessibile, non un protocollo obbligatorio:');
  html = html.replace(/La progressione &egrave; un orientamento, non un esame:/g, 'La progressione &egrave; un orientamento flessibile, non un protocollo obbligatorio:');

  /* Esercizio 16: niente checking dell’ansia */
  html = html.replace(/Dopo 15 secondi, puoi valutare l’ansia da 0 a 10\.[\s\S]{0,120}?particolare livello di ansia\./,
    'Dopo 15 secondi, continua semplicemente con ciò che avevi deciso di fare. L’ansia può essere cambiata oppure no: non devi controllarla per stabilire se l’esercizio ha funzionato.');
  html = html.replace(/Dopo 15 secondi, puoi valutare l&rsquo;ansia da 0 a 10\.[\s\S]{0,120}?particolare livello di ansia\./,
    'Dopo 15 secondi, continua semplicemente con ciò che avevi deciso di fare. L&rsquo;ansia può essere cambiata oppure no: non devi controllarla per stabilire se l&rsquo;esercizio ha funzionato.');

  /* Esercizio 20: sostituzione strutturale definitiva */
  html = html.replace(
    /<div class="exercise" id="ex20">[\s\S]*?<div class="chk-wrap">[\s\S]*?<\/div>\s*<\/div>/i,
    '<div class="exercise" id="ex20">' +
      '<h3><span class="num">Esercizio 20</span> Esperimento di Generalizzazione <button class="timer-tag" data-time="300" data-label="Esperimento di Generalizzazione 5 min">&#9200; 5 min</button></h3>' +
      '<div class="meta"><span>&#9200; 5 minuti</span><span>&#128259; In una situazione reale, quando il rimuginio compare</span></div>' +
      '<p><strong>Obiettivo:</strong> verificare cosa succede quando riconosci il rimuginio e scegli di non seguirlo automaticamente, senza creare un nuovo appuntamento obbligatorio con il worry.</p>' +
      '<ol>' +
        '<li>Durante una situazione reale, nota un episodio di rimuginio.</li>' +
        '<li>Riconosci semplicemente: “Sto rimuginando”. Non devi stabilire se il pensiero è vero o falso.</li>' +
        '<li>Per alcuni minuti, lascia il pensiero sullo sfondo e torna all’attività che avevi scelto.</li>' +
        '<li>Nota cosa rende più facile o più difficile riprendere l’attività. Non misurare ansia, minuti o “successo”.</li>' +
        '<li>Alla fine chiediti soltanto: “Sono riuscito a scegliere cosa fare dopo, anche se il pensiero era ancora presente?”.</li>' +
      '</ol>' +
      '<div class="note"><strong>Ricorda:</strong> l’apprendimento riguarda il rapporto con il rimuginio e la possibilità di scegliere la risposta, non l’eliminazione dei pensieri. Se l’esercizio diventa una nuova procedura da controllare o ripetere perfettamente, lascialo cadere.</div>' +
      '<div class="chk-wrap"><input type="checkbox" id="chk20"><label for="chk20">Ho fatto questo esperimento oggi</label></div>' +
    '</div>'
  );

  /* Esercizio 21: diario non obbligatorio */
  html = html.replace(/Ogni sera prima di dormire/g, 'Occasionalmente, ad esempio una o due volte a settimana');
  html = html.replace(/ogni giorno/g, 'quando il diario è utile');

  /* Esercizio 27 */
  html = html.replace(/Il Tuo Coach Metacognitivo/g, 'Il Tuo Nuovo Piano Metacognitivo');

  /* Checklist iniziale */
  html = html.replace(/Prova ogni esercizio almeno 3–4 volte prima di decidere se ti serve\./g, 'Puoi provare un esercizio alcune volte, se è appropriato, prima di decidere se ti è utile. Non devi completare tutti gli esercizi.');
  html = html.replace(/Segui l’ordine della progressione consigliata in fondo alla pagina\./g, 'Usa la progressione consigliata come orientamento flessibile, non come sequenza obbligatoria.');

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
