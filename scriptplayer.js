// Array zum Halten der Spielernamen, initial leer
let players_global = [];

// Hole das Modal und die Formularelemente
let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
let playerNamesForm = document.getElementById('playerNamesForm');
let errorMessageDiv = document.getElementById('errorMessage'); // Container für Fehlermeldungen

// Modal öffnen, um Spielernamen einzugeben
myModal.show();

// Ereignis-Handler für die Texteingabe im Formular — Überprüfung auf leere und doppelte Namen
playerNamesForm.addEventListener('keyup', function(evt) {
    // Hole die Werte aus den vier Eingabefeldern
    let player1 = document.getElementById("playerName1").value;
    let player2 = document.getElementById("playerName2").value;
    let player3 = document.getElementById("playerName3").value;
    let player4 = document.getElementById("playerName4").value;

    // Array mit den Spielernamen
    let inputPlayers = [player1, player2, player3, player4];
    let errorMessage = "";  // Fehlermeldung, falls vorhanden

    // Alte Fehlermeldung zurücksetzen
    errorMessageDiv.innerHTML = '';

    // Überprüfen auf leere Namen
    inputPlayers.forEach((name, index) => {
        if (!name.trim()) {
            errorMessage = `Der Name von Spieler ${index + 1} darf nicht leer sein!`;
        }
    });

    // Überprüfen auf doppelte Namen
    let uniqueNames = new Set(inputPlayers);
    if (uniqueNames.size !== inputPlayers.length) {
        errorMessage = "Alle Spielernamen müssen einzigartig sein!";
    }

    // Falls eine Fehlermeldung vorliegt, diese anzeigen
    if (errorMessage) {
        errorMessageDiv.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
    } else {
        errorMessageDiv.innerHTML = ''; // Fehlermeldung löschen, wenn keine Fehler vorliegen
    }
});

// Ereignis-Handler für das Absenden des Formulars
playerNamesForm.addEventListener('submit', function(evt) {
    console.log("Spieler hat auf den Button 'Spiel starten' geklickt!");
    
    // Verhindern, dass das Formular abgesendet wird
    evt.preventDefault();
    myModal.hide();

    // Hole die Spielernamen aus den Formulareingabefeldern
    let player1 = document.getElementById("playerName1").value;
    let player2 = document.getElementById("playerName2").value;
    let player3 = document.getElementById("playerName3").value;
    let player4 = document.getElementById("playerName4").value;

    let inputPlayers = [player1, player2, player3, player4];

    // Überprüfen auf leere Namen
    for (let i = 0; i < inputPlayers.length; i++) {
        if (!inputPlayers[i].trim()) {
            alert(`Der Name von Spieler ${i + 1} darf nicht leer sein!`);
            return;  // Stoppe die Ausführung, wenn ein Name leer ist
        }
    }

    // Überprüfen auf doppelte Namen
    let uniqueNames = new Set(inputPlayers);
    if (uniqueNames.size !== inputPlayers.length) {
        alert("Alle Spielernamen müssen einzigartig sein!");
        return;  // Stoppe die Ausführung, wenn die Namen nicht einzigartig sind
    }

    // Aktualisiere das globale Array mit den Spielernamen
    players_global = inputPlayers;

    console.log("Spielernamen: ", players_global);

    // Zeige die Spielernamen in einer Liste auf der Seite an
    let playerListHtmlUl = document.getElementById("liste_von_player");

    // Lösche die Liste, bevor neue Elemente hinzugefügt werden
    playerListHtmlUl.innerHTML = '';

    // Erstelle eine Liste mit den Spielernamen
    players_global.forEach(playerName => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        li.appendChild(span);
        playerListHtmlUl.appendChild(li);

        span.textContent = playerName;
    });
});
