const gameID =document.getElementById("startGameBtn").addEventListener("click", startGame);
// const gameId = startGame();
players = []; // Globale Variable zum speichern der Spielerreihenfolge um die Richtung anzeigen zu können

// Funktion zum Starten des Spiels
async function startGame() {
    try {
        const response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([ //hardcode -> hier sollen die Namenseingaben übergeben werden
                "Player Nr 1",
                "Player Nr 2",
                "Player Nr 3",
                "Player Nr 4"
            ])
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("Spiel erfolgreich gestartet:", data);
            alert("Spiel erfolgreich gestartet! Spiel ID: " + data.Id);

            // Zeige die Handkarten des aktiven Spielers an
            document.getElementById("activePlayerCardsContainer").style.display = "flex";
            displayCards(data.Players[0].Cards);

            // Zeige verdeckte Karten für die nicht aktiven Spieler an
            displayHiddenCardsForOtherPlayers(data.Players, 0);

            // Zeige die "Top Card" an
            displayTopCard(data.TopCard);

        } else {
            console.error("Fehler beim Starten des Spiels:", response.status);
            alert("Fehler beim Starten des Spiels.");
        }
    } catch (error) {
        console.error("Netzwerkfehler:", error);
        alert("Netzwerkfehler. Bitte versuchen Sie es später erneut.");
    }
    // returns GameId
    return data.Id
}



// Funktion zur Anzeige der Handkarten des aktiven Spielers
function displayCards(cards) {
    const container = document.getElementById("activePlayerCardsContainer");
    container.innerHTML = ""; // Lösche vorhandene Karten

    cards.forEach(card => {
        const imgFileName = getCardImageFileName(card.Color, card.Text);
        const imgUrl = `https://nowaunoweb.azurewebsites.net/Content/Cards/${imgFileName}`;

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `${card.Color} ${card.Text}`;
        img.style.width = "100px";
        img.style.height = "auto";

        container.appendChild(img);
    });
}
// Funktion zur Anzeige der verdeckten Karten und Namen der nicht aktiven Spieler
function displayHiddenCardsForOtherPlayers(players, activePlayerIndex) {
    // Definiere die IDs der Container für die nicht-aktiven Spieler in der Reihenfolge: links, oben, rechts
    const positionContainers = ["playerLeftCards", "playerTopCards", "playerRightCards"];

    // Berechne die Reihenfolge der nicht-aktiven Spieler basierend auf dem aktiven Spieler
    let playerPositions = [];
    for (let i = 1; i < players.length; i++) {
        playerPositions.push((activePlayerIndex + i) % players.length);
    }

    // Füge die nicht-aktiven Spieler in den entsprechenden Containern hinzu
    playerPositions.forEach((playerIndex, positionIndex) => {
        const player = players[playerIndex];
        const containerId = positionContainers[positionIndex];
        const hiddenCardsContainer = document.getElementById(containerId);

        // Überprüfe, ob der Kartencontainer existiert
        if (hiddenCardsContainer) {
            hiddenCardsContainer.innerHTML = ""; // Vorherige Inhalte löschen

            // Spielername dynamisch in das Eltern-Element des Kartencontainers einfügen
            const playerContainer = hiddenCardsContainer.closest(".player");
            if (playerContainer) {
                const playerNameElement = playerContainer.querySelector(".player-name");
                if (playerNameElement) {
                    playerNameElement.textContent = player.Player; // Spielernamen setzen
                }
            }

            // Füge für jede Karte eine verdeckte Karte hinzu
            player.Cards.forEach(() => {
                const hiddenCard = document.createElement("div");
                hiddenCard.classList.add("hidden-card");
                hiddenCardsContainer.appendChild(hiddenCard);
            });
        } else {
            console.warn(`Container mit ID ${containerId} nicht gefunden.`);
        }
    });
}


// Funktion zur Anzeige der verdeckten Karten und Namen der nicht aktiven Spieler
function displayHiddenCardsForOtherPlayersOLD(players, activePlayerIndex) {
    const otherPlayersContainer = document.getElementById("otherPlayersContainer");
    otherPlayersContainer.innerHTML = ""; // Vorherige Spieler-Container löschen

    players.forEach((player, index) => {
        if (index !== activePlayerIndex) {
            // Spielercontainer erstellen
            const playerContainer = document.createElement("div");
            playerContainer.classList.add("player-container");

            // Spielername hinzufügen
            const playerName = document.createElement("div");
            playerName.classList.add("player-name");
            playerName.textContent = player.Player;
            playerContainer.appendChild(playerName);

            // Kartencontainer erstellen und verdeckte Karten hinzufügen
            const hiddenCardsContainer = document.createElement("div");
            hiddenCardsContainer.classList.add("hidden-cards-container");

            player.Cards.forEach(() => {
                const hiddenCard = document.createElement("div");
                hiddenCard.classList.add("hidden-card");
                hiddenCardsContainer.appendChild(hiddenCard);
            });

            // Kartencontainer und Spielername zum Hauptcontainer hinzufügen
            playerContainer.appendChild(hiddenCardsContainer);
            otherPlayersContainer.appendChild(playerContainer);
        }
    });
}

// Funktion zur Anzeige der "Top Card" auf dem Ablagestapel
function displayTopCard(topCard) {
    const imgFileName = getCardImageFileName(topCard.Color, topCard.Text);
    const imgPath = `/CardImages/${imgFileName}`;

    const topCardElement = document.getElementById("topCard");
    topCardElement.src = imgPath;
    topCardElement.style.display = "block"; // Zeige die Top Card an
}

// Funktion zur Zuordnung der Farbe und des Textes zu einem Dateinamen
function getCardImageFileName(color, text) {
    const colorMap = {
        "Blue": "b",
        "Red": "r",
        "Green": "g",
        "Yellow": "y",
        "Black": "w"
    };
    const colorPrefix = colorMap[color] || "";

    const textMap = {
        "Reverse": "r",
        "Skip": "s",
        "Draw2": "d2",
        "Zero": "0",
        "One": "1",
        "Two": "2",
        "Three": "3",
        "Four": "4",
        "Five": "5",
        "Six": "6",
        "Seven": "7",
        "Eight": "8",
        "Nine": "9",
        "Draw4": "d4",
        "ChangeColor": "ild"
    };
    const textSuffix = textMap[text] || text;

    return `${colorPrefix}${textSuffix}.png`;
}
// Funktion zum Abrufen der Kartendaten der Karte am Ablegestapel
async function fetchCardData(gameId) {
    const apiUrl = `https://nowaunoweb.azurewebsites.net/api/cards/${gameId}`; 
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const cardData = await response.json();
        return {
            color: cardData.Color,
            text: cardData.Text,
            value: cardData.Value,
            score: cardData.Score
        };
    } catch (error) {
        console.error("Fehler beim Abrufen der Kartendaten:", error);
        return null;
    }
}
// Funktion zum ziehen einer Karte vom Abhebestapel, wenn keine Karte gelegt werden kann (on click)
async function drawCard(gameId) {
    const apiUrl = `https://nowaunoweb.azurewebsites.netapi/Game/DrawCard/${gameId}`; 
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const pickupCardData = await response.json();
        return {
            nextPlayer: pickupCardData.NextPlayer,
            player: pickupCardData.Player,
            card: {
                color: pickupCardData.Card.Color,
                text: pickupCardData.Card.Text,
                value: pickupCardData.Card.Value,
                score: pickupCardData.Card.Score
            }
        };
    } catch (error) {
        console.error("Fehler beim Abrufen der DrawCard-Daten:", error);
        return null;
    }
}


// Beispielaufrufe der Funktionen
fetchCardData(gameId) 
    .then(cardData => {
        if (cardData) {
            console.log("Kartendaten:", cardData);
        } else {
            console.log("Keine Kartendaten verfügbar.");
        }
    });

drawCard(gameId) 
    .then(drawCardData => {
        if (drawCardData) {
            console.log("DrawCard-Daten:", drawCardData);
        } else {
            console.log("Keine DrawCard-Daten verfügbar.");
        }
    });