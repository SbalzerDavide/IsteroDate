// Seleziona elementi del DOM
const form = document.getElementById('calcForm');
const resultsContainer = document.getElementById('results');
const datesListContainer = document.getElementById('datesList');
const errorContainer = document.getElementById('error');

// Event listener per il form
form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateDates();
});

/**
 * Funzione principale per calcolare le date disponibili
 */
function calculateDates() {
    // Nascondi messaggi precedenti
    hideMessages();

    // Ottieni i valori dal form
    const lastPeriodInput = document.getElementById('lastPeriod').value;
    const cycleDuration = parseInt(document.getElementById('cycleDuration').value);
    const periodDuration = parseInt(document.getElementById('periodDuration').value);

    // Validazione input
    if (!lastPeriodInput) {
        showError('Per favore inserisci la data dell\'ultima mestruazione.');
        return;
    }

    if (cycleDuration < 21 || cycleDuration > 35) {
        showError('La durata del ciclo deve essere tra 21 e 35 giorni.');
        return;
    }

    if (periodDuration < 2 || periodDuration > 10) {
        showError('La durata del flusso deve essere tra 2 e 10 giorni.');
        return;
    }

    // Converti la data dell'ultima mestruazione
    const lastPeriodDate = new Date(lastPeriodInput);
    lastPeriodDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verifica che la data non sia nel futuro (oggi è permesso)
    if (lastPeriodDate > today) {
        showError('La data dell\'ultima mestruazione non può essere nel futuro.');
        return;
    }

    // Calcola i prossimi 5 cicli mestruali con le date disponibili
    const cycles = [];
    
    for (let i = 0; i < 5; i++) {
        // Calcola la data di inizio del ciclo
        const cycleStartDate = new Date(lastPeriodDate);
        cycleStartDate.setDate(cycleStartDate.getDate() + (cycleDuration * i));
        
        // Calcola la fine del flusso mestruale per questo ciclo
        // Il giorno di inizio conta come giorno 1, quindi aggiungiamo (durata - 1)
        const endOfPeriod = new Date(cycleStartDate);
        endOfPeriod.setDate(endOfPeriod.getDate() + (periodDuration - 1));
        
        // Calcola la finestra temporale per l'isteroscopia
        const minDateForProcedure = new Date(endOfPeriod);
        minDateForProcedure.setDate(minDateForProcedure.getDate() + 1);
        
        const maxDateForProcedure = new Date(endOfPeriod);
        maxDateForProcedure.setDate(maxDateForProcedure.getDate() + 14);
        
        // Trova tutti i lunedì disponibili nell'intervallo
        const availableMondays = findMondaysInRange(minDateForProcedure, maxDateForProcedure);
        
        cycles.push({
            cycleNumber: i + 1,
            startDate: cycleStartDate,
            endOfPeriod: endOfPeriod,
            minDate: minDateForProcedure,
            maxDate: maxDateForProcedure,
            availableMondays: availableMondays
        });
    }

    // Mostra i risultati
    displayResults(cycles);
}

/**
 * Trova tutti i lunedì in un intervallo di date
 * @param {Date} startDate - Data minima dell'intervallo
 * @param {Date} endDate - Data massima dell'intervallo
 * @returns {Array<Date>} Array di date (tutti i lunedì nell'intervallo)
 */
function findMondaysInRange(startDate, endDate) {
    const mondays = [];
    let currentDate = new Date(startDate);

    // Trova il primo lunedì nell'intervallo (lunedì = 1 in JavaScript)
    while (currentDate.getDay() !== 1 && currentDate <= endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Aggiungi tutti i lunedì nell'intervallo
    while (currentDate <= endDate) {
        if (currentDate.getDay() === 1) {
            mondays.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 7); // Vai al prossimo lunedì
        } else {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    return mondays;
}

/**
 * Calcola i giorni tra due date
 * @param {Date} date1 - Prima data
 * @param {Date} date2 - Seconda data
 * @returns {number} Numero di giorni
 */
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((date2 - date1) / oneDay);
}

/**
 * Formatta una data in formato italiano (gg/mm/aaaa)
 * @param {Date} date - Data da formattare
 * @returns {string} Data formattata
 */
function formatDateIT(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Ottieni il nome del giorno della settimana in italiano
 * @param {Date} date - Data
 * @returns {string} Nome del giorno
 */
function getDayName(date) {
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    return days[date.getDay()];
}

/**
 * Mostra i risultati delle date disponibili per tutti i cicli
 * @param {Array<Object>} cycles - Array di cicli con le date disponibili
 */
function displayResults(cycles) {
    // Pulisci il container
    datesListContainer.innerHTML = '';

    // Crea una sezione per ogni ciclo
    cycles.forEach((cycle) => {
        // Container per il ciclo
        const cycleContainer = document.createElement('div');
        cycleContainer.className = 'cycle-container';

        // Header del ciclo
        const cycleHeader = document.createElement('div');
        cycleHeader.className = 'cycle-header';
        
        const cycleTitle = document.createElement('h3');
        cycleTitle.textContent = `Ciclo ${cycle.cycleNumber}`;
        
        // Data di inizio mestruazione evidenziata
        const menstruationStart = document.createElement('div');
        menstruationStart.className = 'menstruation-start';
        
        const menstruationBadge = document.createElement('span');
        menstruationBadge.className = 'badge menstruation';
        menstruationBadge.textContent = '🩸 Inizio Mestruazione';
        
        const menstruationDate = document.createElement('span');
        menstruationDate.className = 'menstruation-date';
        menstruationDate.textContent = formatDateIT(cycle.startDate);
        
        menstruationStart.appendChild(menstruationBadge);
        menstruationStart.appendChild(menstruationDate);
        
        const cycleInfo = document.createElement('p');
        cycleInfo.className = 'cycle-info';
        cycleInfo.textContent = `Fine flusso: ${formatDateIT(cycle.endOfPeriod)} | Intervallo valido per isteroscopia: ${formatDateIT(cycle.minDate)} - ${formatDateIT(cycle.maxDate)}`;
        
        cycleHeader.appendChild(cycleTitle);
        cycleHeader.appendChild(menstruationStart);
        cycleHeader.appendChild(cycleInfo);
        cycleContainer.appendChild(cycleHeader);

        // Dates disponibili
        const datesContainer = document.createElement('div');
        datesContainer.className = 'dates-container';

        if (cycle.availableMondays.length === 0) {
            // Nessun lunedì disponibile
            const noDateMessage = document.createElement('div');
            noDateMessage.className = 'no-dates-message';
            noDateMessage.textContent = '⚠️ Nessun lunedì disponibile in questo intervallo';
            datesContainer.appendChild(noDateMessage);
        } else {
            // Mostra le date disponibili
            cycle.availableMondays.forEach((date, index) => {
                const daysFromStart = daysBetween(cycle.startDate, date) + 1;
                const daysAfterPeriod = daysBetween(cycle.endOfPeriod, date);
                const isFirst = index === 0;

                const card = document.createElement('div');
                card.className = `date-card ${isFirst ? 'recommended' : ''}`;

                const badge = document.createElement('span');
                badge.className = `badge ${isFirst ? 'recommended' : 'alternative'}`;
                badge.textContent = isFirst ? '✅ Data Consigliata' : '📌 Alternativa';

                const dateMain = document.createElement('div');
                dateMain.className = 'date-main';
                dateMain.textContent = `${getDayName(date)}, ${formatDateIT(date)}`;

                const dateInfo = document.createElement('div');
                dateInfo.className = 'date-info';
                
                const daysFromStartDiv = document.createElement('div');
                daysFromStartDiv.className = 'date-detail';
                daysFromStartDiv.innerHTML = `<strong>Giorno ${daysFromStart}</strong> dall'inizio del ciclo`;
                
                const daysAfterPeriodDiv = document.createElement('div');
                daysAfterPeriodDiv.className = 'date-detail';
                daysAfterPeriodDiv.innerHTML = `<strong>${daysAfterPeriod} giorni</strong> dopo la fine del flusso`;
                
                dateInfo.appendChild(daysFromStartDiv);
                dateInfo.appendChild(daysAfterPeriodDiv);

                card.appendChild(badge);
                card.appendChild(dateMain);
                card.appendChild(dateInfo);
                datesContainer.appendChild(card);
            });
        }

        cycleContainer.appendChild(datesContainer);
        datesListContainer.appendChild(cycleContainer);
    });

    // Mostra il container dei risultati
    resultsContainer.style.display = 'block';

    // Scroll smooth verso i risultati
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Mostra un messaggio di errore
 * @param {string} message - Messaggio da mostrare
 */
function showError(message) {
    errorContainer.textContent = '⚠️ ' + message;
    errorContainer.style.display = 'block';
    resultsContainer.style.display = 'none';
}

/**
 * Nascondi tutti i messaggi
 */
function hideMessages() {
    errorContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
}

// Imposta la data di oggi come data massima selezionabile e come valore di default
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    const lastPeriodInput = document.getElementById('lastPeriod');
    lastPeriodInput.setAttribute('max', today);
    lastPeriodInput.value = today;
});
