/* Service Worker — supporto offline per Gestire il Rimuginio v5 */
var CACHE = 'mct-v5';
var ASSETS = ['./','./index.html','./manifest.webmanifest','./icon.svg'];

function patchHTML(html) {
  /* ATT: formulazione prudente e non prescrittiva */
  html = html.replace(
    'Questi esercizi allenano la tua attenzione a spostarsi via dalla preoccupazione. Come in palestra: risultati dopo 4&ndash;6 settimane di pratica costante, non dopo 2 giorni.',
    'Questi esercizi allenano la tua attenzione a spostarsi via dalla preoccupazione. L&rsquo;ATT (Attention Training Technique) &egrave; una tecnica attentiva usata in alcuni percorsi MCT e in altri contesti clinici: pu&ograve; essere utile come allenamento dell&rsquo;attenzione, ma non &egrave; un passaggio obbligatorio n&eacute; deve essere trattata come una cura in s&eacute;. La pratica va adattata al proprio percorso.'
  );
  html = html.replace(
    '<span>&#128259; 2 volte al giorno (mattina e sera)</span>\n      <span>&#128197; Per 6 settimane</span>',
    '<span>&#128259; Frequenza regolare, compatibile con il tuo percorso</span>\n      <span>&#128197; Periodo di pratica indicativo</span>'
  );

  /* Esercizio 2: sicurezza */
  html = html.replace(
    'Si fa anche in ufficio, in macchina (a occhi aperti), o prima di una riunione.',
    '<strong>Pu&ograve; essere praticato in contesti quotidiani in cui puoi mantenere piena attenzione all&rsquo;ambiente.</strong> Non praticarlo mentre guidi o svolgi attivit&agrave; che richiedono attenzione continua alla sicurezza.'
  );

  /* Esercizio 3: distinguere variante da ATT standard */
  html = html.replace(
    '### Esercizio 3 ATT con gli Occhi Aperti',
    '### Esercizio 3 Allenamento della Flessibilit&agrave; Attentiva a Occhi Aperti'
  );
  html = html.replace(
    'Variante per quando non puoi chiudere gli occhi',
    'Variante di allenamento attentivo per quando non puoi chiudere gli occhi'
  );

  /* Esercizio 4: diario non ritualistico */
  html = html.replace(
    'Compila ogni giorno per monitorare la tua costanza.',
    'Puoi compilarlo per osservare la continuit&agrave; della pratica, senza trasformarlo in un controllo quotidiano obbligatorio.'
  );
  html = html.replace(
    'Obiettivo: almeno 12 sessioni su 14 nella settimana. La difficolt&agrave; media dovrebbe scendere col tempo.',
    'Obiettivo: costruire una pratica regolare ma sostenibile. Non serve raggiungere un numero perfetto di sessioni n&eacute; ottenere una difficolt&agrave; sempre pi&ugrave; bassa.'
  );
  html = html.replace(
    'Obiettivo: almeno 12 sessioni su 14 nella settimana. La difficoltà media dovrebbe scendere col tempo.',
    'Obiettivo: costruire una pratica regolare ma sostenibile. Non serve raggiungere un numero perfetto di sessioni né ottenere una difficoltà sempre più bassa.'
  );

  /* Esercizio 6: niente controllo del volume */
  html = html.replace(
    'Progressione: Giorno 1&ndash;3: radio a 5 metri. Giorno 4&ndash;6: a 10 metri. Giorno 7+: in un&rsquo;altra stanza. Variante: abbassa il volume da 10 a 0 in 10 secondi.',
    'Progressione: Giorno 1&ndash;3: radio a 5 metri. Giorno 4&ndash;6: a 10 metri. Giorno 7+: in un&rsquo;altra stanza. L&rsquo;obiettivo non &egrave; abbassare o eliminare il pensiero, ma lasciarlo sullo sfondo senza seguirlo.'
  );

  /* Esercizio 8: niente formula assoluta / niente rassicurazione */
  html = html.replace(
    'L\'importante è che la voce sia esterna a te — se le leggi tu mentalmente, l\'esercizio non funziona perché sei tu a generare gli stimoli.',
    'Una voce esterna pu&ograve; rendere l&rsquo;esercizio pi&ugrave; semplice da seguire, perch&eacute; permette di concentrarti sull&rsquo;esperienza invece che sulla produzione dello stimolo. Non &egrave; per&ograve; necessario considerarlo un requisito assoluto.'
  );
  html = html.replace(
    'L\'importante &egrave; che la voce sia esterna a te &mdash; se le leggi tu mentalmente, l\'esercizio non funziona perch&eacute; sei tu a generare gli stimoli.',
    'Una voce esterna pu&ograve; rendere l&rsquo;esercizio pi&ugrave; semplice da seguire, perch&eacute; permette di concentrarti sull&rsquo;esperienza invece che sulla produzione dello stimolo. Non &egrave; per&ograve; necessario considerarlo un requisito assoluto.'
  );
  html = html.replace(
    '“E’ solo una parola. Non può farmi nulla.”',
    '“E&rsquo; una parola che ha attivato qualcosa nella mia mente. Posso lasciarla presente senza doverla risolvere.”'
  );
  html = html.replace(
    '“E’ solo una parola. Non pu&ograve; farmi nulla.”',
    '“E&rsquo; una parola che ha attivato qualcosa nella mia mente. Posso lasciarla presente senza doverla risolvere.”'
  );

  /* Esercizio 9: etichettatura non obbligatoria */
  html = html.replace(
    '1. Per 3 minuti, nota i pensieri che arrivano.\n  2. Per ognuno, dagli un’etichetta:',
    '1. Per alcuni minuti, nota i pensieri pi&ugrave; evidenti che arrivano.\n  2. Quando &egrave; utile, dai loro un&rsquo;etichetta semplice:'
  );
  html = html.replace(
    '1. Per 3 minuti, nota i pensieri che arrivano.\n  2. Per ognuno, dagli un&rsquo;etichetta:',
    '1. Per alcuni minuti, nota i pensieri pi&ugrave; evidenti che arrivano.\n  2. Quando &egrave; utile, dai loro un&rsquo;etichetta semplice:'
  );
  html = html.replace(
    '3. Non analizzare il contenuto. Solo etichetta e passa al prossimo.',
    '3. Non analizzare il contenuto. Se ti accorgi che stai classificando continuamente i pensieri per farlo “bene”, lascia perdere l&rsquo;etichetta e torna semplicemente a ci&ograve; che stai facendo.'
  );

  /* Esercizio 11: togliere la formula identitaria */
  html = html.replace(
    '6. SONO l’osservatore dei miei pensieri, non i miei pensieri. Prova: per 1 minuto, osserva i pensieri come se fossero nuvole che passano. Tu sei il cielo, non le nuvole.',
    '6. NOTO la differenza tra un pensiero e ci&ograve; che sto facendo. Prova: osserva un pensiero per qualche secondo e poi torna all&rsquo;attivit&agrave; che avevi scelto, senza dover stabilire se quel pensiero sia vero o falso.'
  );
  html = html.replace(
    '6. SONO l’osservatore dei miei pensieri, non i miei pensieri. Prova: per 1 minuto, osserva i pensieri come se fossero nuvole che passano. Tu sei il cielo, non le nuvole.',
    '6. NOTO la differenza tra un pensiero e ciò che sto facendo. Prova: osserva un pensiero per qualche secondo e poi torna all’attività che avevi scelto, senza dover stabilire se quel pensiero sia vero o falso.'
  );

  /* Esercizio 12: niente quota giornaliera */
  html = html.replace(
    '⏰ 1–2 minuti × 5 volte al giorno🔃 Ogni giorno, durante la vita reale',
    '⏰ 1–2 minuti, quando è utile 🔃 Durante la vita reale'
  );
  html = html.replace(
    'Scegli 5 momenti della giornata in cui farai questo micro-esercizio (es. dopo i pasti, quando cambi stanza, quando apri il telefono).',
    'Scegli uno o pochi momenti naturali della giornata (es. dopo i pasti, quando cambi stanza, quando apri il telefono). Non serve accumulare un numero prestabilito di ripetizioni.'
  );
  html = html.replace(
    'Non è un test di concentrazione: se devi riportare l’attenzione 50 volte, l’esercizio ha funzionato 50 volte. Ogni ritorno è una ripetizione in palestra.',
    'Non è un test di concentrazione. L&rsquo;obiettivo &egrave; imparare a tornare al compito senza trasformare i ritorni dell&rsquo;attenzione in un conteggio o in una prova da superare.'
  );

  /* Esercizio 13: niente rassicurazione */
  html = html.replace(
    'Poi fai la domanda chiave: “cosa succederebbe se non lo facessi per un’ora?” La risposta, quasi sempre, è: niente. Il monitoraggio è un’abitudine, non una protezione.',
    'Puoi chiederti: “Cosa succederebbe se per un po&rsquo; non seguissi questo impulso a controllare?”. Non cercare una risposta rassicurante; osserva piuttosto che cosa succede quando lasci il controllo sullo sfondo e torni all&rsquo;attivit&agrave;.'
  );
  html = html.replace(
    'Poi fai la domanda chiave: “cosa succederebbe se non lo facessi per un’ora?” La risposta, quasi sempre, è: niente. Il monitoraggio è un’abitudine, non una protezione.',
    'Puoi chiederti: “Cosa succederebbe se per un po’ non seguissi questo impulso a controllare?”. Non cercare una risposta rassicurante; osserva piuttosto che cosa succede quando lasci il controllo sullo sfondo e torni all’attività.'
  );

  /* Esercizio 14: rassicurazione ansiosa vs necessità reale */
  html = html.replace(
    'Per 24 ore, niente ricerca: niente Google, niente domande, niente ricontrolli. Se il bisogno torna, annota l’ora e l’intensità (0–10) e rimanda di nuovo.',
    'Per 24 ore, prova a rinviare le ricerche, le domande o i ricontrolli che riconosci come rassicurazione ansiosa ripetitiva. Non è necessario trasformare il rinvio in una regola assoluta: l’esperimento riguarda la ricerca di certezza che ripeti senza ottenere nuove informazioni utili. Questo non vale per controlli medici, indicazioni professionali, scadenze o verifiche di sicurezza necessarie.'
  );
  html = html.replace(
    'Dopo 24 ore, prima di cedere, valuta: “è successo qualcosa di grave nel frattempo?” Poi decidi se la rassicurazione serve ancora davvero.',
    'Dopo 24 ore, chiediti: “La verifica che volevo fare era una necessità concreta o soprattutto un tentativo ripetitivo di sentirmi certo?”. Se è una necessità reale, falla seguendo le indicazioni appropriate; se è rassicurazione ripetitiva, puoi scegliere di non seguirla subito.'
  );
  html = html.replace(
    'Dopo 24 ore, prima di cedere, valuta: “è successo qualcosa di grave nel frattempo?” Poi decidi se la rassicurazione serve ancora davvero.',
    'Dopo 24 ore, chiediti: “La verifica che volevo fare era una necessità concreta o soprattutto un tentativo ripetitivo di sentirmi certo?”. Se è una necessità reale, falla seguendo le indicazioni appropriate; se è rassicurazione ripetitiva, puoi scegliere di non seguirla subito.'
  );

  /* WP: nessuna soglia universale */
  html = html.replace(
    'Si inizia SOLO dopo almeno 2 settimane di ATT. L’ATT ti ha dato i “muscoli attentivi” per poter rimandare. Senza quelli, il rinvio fallisce.',
    'Il Worry Postponement può essere introdotto quando le pratiche di base sono sufficientemente familiari. Le 2 settimane indicate qui sono un orientamento, non un requisito universale: non è necessario aspettare un numero preciso di giorni e non è necessario forzarlo se non è appropriato.'
  );
  html = html.replace(
    'Si inizia SOLO dopo almeno 2 settimane di ATT. L&rsquo;ATT ti ha dato i “muscoli attentivi” per poter rimandare. Senza quelli, il rinvio fallisce.',
    'Il Worry Postponement pu&ograve; essere introdotto quando le pratiche di base sono sufficientemente familiari. Le 2 settimane indicate qui sono un orientamento, non un requisito universale: non &egrave; necessario aspettare un numero preciso di giorni e non &egrave; necessario forzarlo se non &egrave; appropriato.'
  );

  /* Esercizio 15: wording meno rigido */
  html = html.replace(
    'Se NO → cancella (nella maggior parte dei casi non lo e’ più).',
    'Se NO → lascialo cadere: non è necessario continuare a elaborarlo.'
  );
  html = html.replace(
    'Se SI’ → “Posso fare qualcosa ORA?”. Se si’, fallo. Se no, cancella comunque.',
    'Se SÌ → “Esiste un’azione concreta, necessaria e appropriata che posso fare ora?”. Se sì, valuta di farla. Se no, non è necessario continuare il rimuginio: puoi tornare a ciò che stavi facendo.'
  );
  html = html.replace(
    'Regola: se la risposta e’ un’azione concreta, falla subito. Se e’ un’altra preoccupazione, rimandala.',
    'Regola pratica: quando esiste un’azione concreta, necessaria e appropriata che puoi fare ora, valuta di farla; quando invece stai continuando a elaborare scenari senza arrivare a un’azione utile, puoi rimandare il rimuginio.'
  );
  html = html.replace(
    'Regola: se la risposta è un’azione concreta, falla subito. Se è un’altra preoccupazione, rimandala.',
    'Regola pratica: quando esiste un’azione concreta, necessaria e appropriata che puoi fare ora, valuta di farla; quando invece stai continuando a elaborare scenari senza arrivare a un’azione utile, puoi rimandare il rimuginio.'
  );

  /* Esercizio 16: niente checking dell'ansia */
  html = html.replace(
    '5. Dopo 15 secondi, puoi valutare l’ansia da 0 a 10. Può essere cambiata oppure no: il test non serve a ottenere un particolare livello di ansia.',
    '5. Dopo 15 secondi, continua semplicemente con ciò che avevi deciso di fare. L&rsquo;ansia può essere cambiata oppure no: non devi controllarla per stabilire se l&rsquo;esercizio ha funzionato.'
  );
  html = html.replace(
    '5. Dopo 15 secondi, puoi valutare l&rsquo;ansia da 0 a 10. Può essere cambiata oppure no: il test non serve a ottenere un particolare livello di ansia.',
    '5. Dopo 15 secondi, continua semplicemente con ci&ograve; che avevi deciso di fare. L&rsquo;ansia pu&ograve; essere cambiata oppure no: non devi controllarla per stabilire se l&rsquo;esercizio ha funzionato.'
  );

  /* Esercizio 17: flessibilità nel tempo */
  html = html.replace(
    'Dal mese 2: Il worry period ti serve sempre meno. Tienilo come “rete di sicurezza” per le giornate no.',
    'Nel tempo: puoi verificare se il worry period ti serve ancora con la stessa frequenza. L’obiettivo è diventare più flessibile, non eliminare obbligatoriamente questa pratica.'
  );
  html = html.replace(
    'Dal mese 2: Il worry period ti serve sempre meno. Tienilo come &ldquo;rete di sicurezza&rdquo; per le giornate no.',
    'Nel tempo: puoi verificare se il worry period ti serve ancora con la stessa frequenza. L&rsquo;obiettivo &egrave; diventare pi&ugrave; flessibile, non eliminare obbligatoriamente questa pratica.'
  );

  /* Esposizione: nessuna soglia universale */
  html = html.replace(
    'Fai questi esercizi SOLO dopo almeno 4 settimane di ATT e DM. Servono a testare concretamente le tue paure:',
    'Questi esercizi sono più intensi e hanno senso solo se appropriati per te e se le pratiche precedenti sono sufficientemente familiari. Le settimane indicate sono un orientamento, non una soglia obbligatoria. Servono a testare concretamente le tue paure:'
  );
  html = html.replace(
    'Fai questi esercizi SOLO dopo almeno 4 settimane di ATT e DM. Servono a testare concretamente le tue paure:',
    'Questi esercizi sono pi&ugrave; intensi e hanno senso solo se appropriati per te e se le pratiche precedenti sono sufficientemente familiari. Le settimane indicate sono un orientamento, non una soglia obbligatoria. Servono a testare concretamente le tue paure:'
  );

  /* Es. 20: sostituito con generalizzazione, per evitare un nuovo rituale di worry */
  html = html.replace(
    /### Esercizio 20 Rimuginio Programmato a Casa[\s\S]*?<\/div>/,
    '### Esercizio 20 Esperimento di Generalizzazione [Button: ⏰ 5 min]\n\n⏰ 5 minuti 🔃 In una situazione reale, quando il rimuginio compare\n\nL’obiettivo è verificare cosa succede quando riconosci il rimuginio e scegli di non seguirlo automaticamente, senza creare un nuovo appuntamento obbligatorio con il worry.\n\n  1. Durante una situazione reale, nota un episodio di rimuginio.\n  2. Riconosci semplicemente: “Sto rimuginando”. Non devi stabilire se il pensiero è vero o falso.\n  3. Per alcuni minuti, lascia il pensiero sullo sfondo e torna all’attività che avevi scelto.\n  4. Nota cosa rende più facile o più difficile riprendere l’attività. Non misurare ansia, minuti o “successo”.\n  5. Alla fine chiediti soltanto: “Sono riuscito a scegliere cosa fare dopo, anche se il pensiero era ancora presente?”.\n\nL’apprendimento riguarda il rapporto con il rimuginio e la possibilità di scegliere la risposta, non l’eliminazione dei pensieri. Se l’esercizio diventa una nuova procedura da controllare o ripetere perfettamente, lascialo cadere.'
  );
  /* Fallback mirato: il contenuto HTML del repository non contiene necessariamente un wrapper </div> nello snippet */
  html = html.replace(
    /### Esercizio 20 Rimuginio Programmato a Casa \[Button: ⏰ 10 min\][\s\S]*?(?=<\/div>\s*## Parte 5|## Parte 5)/,
    '### Esercizio 20 Esperimento di Generalizzazione [Button: ⏰ 5 min]\n\n⏰ 5 minuti 🔃 In una situazione reale, quando il rimuginio compare\n\nL’obiettivo è verificare cosa succede quando riconosci il rimuginio e scegli di non seguirlo automaticamente, senza creare un nuovo appuntamento obbligatorio con il worry.\n\n  1. Durante una situazione reale, nota un episodio di rimuginio.\n  2. Riconosci semplicemente: “Sto rimuginando”. Non devi stabilire se il pensiero è vero o falso.\n  3. Per alcuni minuti, lascia il pensiero sullo sfondo e torna all’attività che avevi scelto.\n  4. Nota cosa rende più facile o più difficile riprendere l’attività. Non misurare ansia, minuti o “successo”.\n  5. Alla fine chiediti soltanto: “Sono riuscito a scegliere cosa fare dopo, anche se il pensiero era ancora presente?”.\n\nL’apprendimento riguarda il rapporto con il rimuginio e la possibilità di scegliere la risposta, non l’eliminazione dei pensieri. Se l’esercizio diventa una nuova procedura da controllare o ripetere perfettamente, lascialo cadere.\n\n'
  );

  /* Es. 21: diario non obbligatorio */
  html = html.replace(
    '⏰ 30 secondi🔃 Ogni sera prima di dormire',
    '⏰ 30 secondi 🔃 Occasionalmente, ad esempio una o due volte a settimana'
  );
  html = html.replace(
    'Rispondi a 3 domande su scala 0–10. Usa queste ancore per rispondere in modo coerente ogni giorno:',
    'Rispondi alle 3 domande su scala 0–10 solo quando il diario ti è utile. Non usarlo per controllare se stai migliorando abbastanza:'
  );
  html = html.replace(
    'Rispondi a 3 domande su scala 0–10. Usa queste ancore per rispondere in modo coerente ogni giorno:',
    'Rispondi alle 3 domande su scala 0–10 solo quando il diario ti è utile. Non usarlo per controllare se stai migliorando abbastanza:'
  );

  /* Es. 22: piano flessibile */
  html = html.replace(
    'Worry Postponement  | Lo uso sempre per le preoccupazioni quotidiane',
    'Worry Postponement  | Lo uso quando è pertinente e utile, senza trasformarlo in un obbligo'
  );
  html = html.replace(
    'DM veloce (tigre/radio)  | ______ minuti al giorno',
    'DM veloce (tigre/radio)  | ______ quando è utile'
  );
  html = html.replace(
    'Cosa fare al primo segnale  | ATT 2×/die per 1–2 settimane + WP',
    'Cosa fare al primo segnale  | Torno alle pratiche che mi sono state più utili, senza trasformarle in un obbligo; se il problema persiste, valuto un confronto con un professionista'
  );
  html = html.replace(
    'Se ricado forte (>7 giorni)  | Riprendo gli esercizi Parte 1 e 2, poi chiamo il terapeuta',
    'Se il problema aumenta in modo significativo  | Riprendo con flessibilità le pratiche che mi sono state utili e considero un confronto con un professionista'
  );

  /* Es. 23: nessun ATT alla guida e sonno meno protocollare */
  html = html.replace(
    'Ricevo una critica al lavoro  | Noto il pensiero → etichetta → ATT 1 min → rimando a WP',
    'Ricevo una critica al lavoro  | Noto il pensiero → non devo risolverlo mentalmente subito → torno a ciò che sto facendo'
  );
  html = html.replace(
    'Non riesco a dormire  | Mi alzo → scrivo le preoccupazioni → ATT → riprovo dopo 20 min',
    'Non riesco a dormire  | Evito di iniziare un lungo ciclo di analisi; se arrivano preoccupazioni, posso annotarle brevemente e poi tornare a ciò che sto facendo, senza usare gli esercizi per controllare il sonno'
  );
  html = html.replace(
    'Se succede questo…  | …io faccio questo',
    'Se succede questo…  | …io posso scegliere questa risposta'
  );

  /* Es. 24: prova non ritualistica */
  html = html.replace(
    '1. Per 2 settimane, fai ATT 2 volte al giorno (anche se non senti miglioramenti).',
    '1. Per 2 settimane, scegli una pratica regolare e sostenibile, usando le tecniche che ritieni pertinenti.'
  );
  html = html.replace(
    '2. Dal giorno 5, aggiungi il Worry Postponement.',
    '2. Introduci il Worry Postponement solo se è pertinente e sufficientemente familiare per te; il giorno 5 è solo un esempio, non una soglia.'
  );
  html = html.replace(
    '3. Ogni sera, compila la Valutazione Quotidiana (Esercizio 21).',
    '3. Osserva occasionalmente l’andamento generale, senza trasformare la valutazione in un controllo quotidiano.'
  );
  html = html.replace(
    'Alla fine: calcola la media dei 3 punteggi della prima settimana e della seconda. Confrontali. Anche 1 punto di miglioramento significa che il cervello PUÒ imparare.',
    'Alla fine osserva il quadro generale: il rimuginio occupa più o meno spazio? Riesci più facilmente a tornare alle attività? Le tue reazioni sono più flessibili? Non serve ottenere un punteggio prestabilito.'
  );

  /* Es. 25: scegliere, non reagire automaticamente */
  html = html.replace(
    'ATT completo (15 min)  | Ogni giorno. Subito se il rimuginio aumenta.',
    'ATT completo (15 min)  | Può essere una pratica regolare, se per te è utile; non è una risposta obbligatoria a ogni aumento del rimuginio.'
  );
  html = html.replace(
    'ATT breve (3 min)  | Nei momenti di picco, quando sento di perdere il controllo.',
    'ATT breve (3 min)  | Può aiutare a riallocare l’attenzione in alcuni momenti; non usarlo come modo obbligatorio per ridurre l’ansia.'
  );
  html = html.replace(
    'Worry Postponement  | Strategia quotidiana per le preoccupazioni.',
    'Worry Postponement  | Quando riconosco un episodio di worry che posso ragionevolmente rimandare.'
  );
  html = html.replace(
    'Rimuginio Volontario  | Se ricomincio a credere “non riesco a smettere” — lo ripeto.',
    'Rimuginio Volontario  | Esperimento più avanzato, da usare solo quando appropriato e non come risposta automatica a ogni aumento del rimuginio.'
  );

  /* Es. 26: flessibilità attentiva, non controllo ATT */
  html = html.replace(
    'Settimana  | Media rimuginio  | Media controllo ATT  | Media coping',
    'Settimana  | Media rimuginio  | Flessibilità attentiva  | Media coping'
  );
  html = html.replace(
    'Tienilo per almeno 8 settimane. Usa i numeri per osservare l’andamento, non come un voto da raggiungere.',
    'Usalo solo finché ti è utile. I numeri servono a osservare la tendenza generale, non a ottenere un punteggio migliore settimana dopo settimana.'
  );

  /* Es. 27: togliere l'ambiguità del terapeuta interiore */
  html = html.replace(
    '### Esercizio 27 Il Tuo Coach Metacognitivo',
    '### Esercizio 27 Il Tuo Nuovo Piano Metacognitivo'
  );

  /* Anti-rituale: inserito una sola volta */
  var anchor = '<div class="exercise">\n    <h3><span class="num">&#9679;</span> Come usare questa guida</h3>';
  if (html.indexOf('class="anti-ritual-note"') === -1 && html.indexOf(anchor) !== -1) {
    html = html.replace(anchor, anchor + '\n    <div class="note anti-ritual-note"><strong>Anti-rituale:</strong> esercizi, caselle, timer, punteggi e diari sono strumenti, non obiettivi. Non devi completarli perfettamente, tutti i giorni, né controllare continuamente se li stai usando “bene”. Se il monitoraggio del percorso diventa una nuova fonte di preoccupazione o controllo, riducilo e torna alle pratiche essenziali.</div>');
  }

  /* Progressione generale */
  html = html.replace('La progressione è un orientamento, non un esame:', 'La progressione è un orientamento flessibile, non un protocollo obbligatorio:');
  html = html.replace('La progressione &egrave; un orientamento, non un esame:', 'La progressione &egrave; un orientamento flessibile, non un protocollo obbligatorio:');

  /* Evita che la checklist iniziale diventi un protocollo rigido */
  html = html.replace(
    'Prova ogni esercizio almeno 3–4 volte prima di decidere se ti serve.',
    'Puoi provare un esercizio alcune volte, se è appropriato, prima di decidere se ti è utile. Non devi completare tutti gli esercizi.'
  );
  html = html.replace(
    'Segui l’ordine della progressione consigliata in fondo alla pagina.',
    'Usa la progressione consigliata come orientamento flessibile, non come sequenza obbligatoria.'
  );

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
