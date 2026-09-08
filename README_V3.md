# Gestire il Rimuginio — V7

Versione 7 della guida web di auto-aiuto ispirata ai principi della Terapia Metacognitiva (MCT).

## Cosa cambia in V3

- Revisione clinica del linguaggio per ridurre promesse, assoluti e rassicurazioni implicite.
- Nuova sezione di sicurezza/triage.
- Parte 4 resa più prudente: gli esperimenti intensi non sono obbligatori e non chiedono di "perdere il controllo".
- Esercizio 27 rinominato in "Il Tuo Nuovo Piano Metacognitivo".
- Monitoraggio e questionario resi meno orientati alla performance.
- Nuova card "Il tuo passo di oggi" che porta al primo esercizio non completato senza enfatizzare il totale 0/27.
- Progress indicator con linguaggio meno prestazionale.
- Migliorata accessibilità del timer: dialog modal, focus, Escape, tab trap e annunci di stato.
- Service worker v7, cache/offline senza patching runtime dell’HTML; HTML in network-first per facilitare gli aggiornamenti.
- Nomi file normalizzati: `index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg`.
- Disclaimer aggiornato: materiale educativo/self-help, non sostitutivo di terapia o valutazione clinica.

## Avvio

Servire la cartella con un web server HTTPS (necessario per alcune funzioni PWA/Wake Lock).

Esempio: `python -m http.server 8000` e poi aprire `http://localhost:8000/`.

## Nota clinica

La V3 non pretende di sostituire un protocollo clinico MCT personalizzato. In particolare, gli esercizi della Parte 4 sono presentati come esperimenti opzionali e vanno valutati con prudenza.

## Versione

V7 è la fonte corrente del progetto. `index.html` contiene direttamente il contenuto pubblicato; `sw.js` gestisce solo cache e fallback offline.
