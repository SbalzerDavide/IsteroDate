# IsteroDate - PWA Setup

## Icone create

Ho aggiunto il supporto PWA (Progressive Web App) per l'applicazione. Ecco cosa è stato fatto:

### File aggiunti:

1. **manifest.json** - Configurazione PWA con nome app, colori e riferimenti alle icone
2. **icon.svg** - Icona sorgente in formato vettoriale
3. **generate-icons.html** - Tool per generare le icone PNG

### Come generare le icone:

1. Apri il file `generate-icons.html` nel browser
2. Clicca sui pulsanti per scaricare `icon-192.png` e `icon-512.png`
3. Salva entrambi i file nella cartella principale del progetto

### Caratteristiche PWA:

- ✅ Installabile su dispositivi mobili (iOS e Android)
- ✅ Icona personalizzata con calendario e simbolo medico
- ✅ Nome app: "IsteroDate"
- ✅ Colore tema: #4A90E2 (blu)
- ✅ Modalità standalone (app a schermo intero)
- ✅ Supporto per iOS (apple-touch-icon)

### Come testare:

1. Genera le icone come descritto sopra
2. Servi l'app tramite HTTPS (richiesto per PWA)
3. Su Chrome Android: menu → "Installa app"
4. Su Safari iOS: Condividi → "Aggiungi a Home"

L'app sarà installabile e funzionerà come un'app nativa sul dispositivo mobile!
