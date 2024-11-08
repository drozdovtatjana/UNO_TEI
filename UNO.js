document.getElementById("startGameBtn").addEventListener("click", startGame);

// Funktion zum Starten des Spiels
async function startGame() {
    try {
        const response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([
                "Player One",
                "Player Two",
                "Player Three",
                "Player Four"
            ])
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("Spiel erfolgreich gestartet:", data);
            alert("Spiel erfolgreich gestartet! Spiel ID: " + data.Id);

            // Zeige die Handkarten des aktiven Spielers an
            document.getElementById("cardsContainer").style.display = "flex";
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
}

// Funktion zur Anzeige der Handkarten des aktiven Spielers
function displayCards(cards) {
    const container = document.getElementById("cardsContainer");
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
    const imgUrl = `https://nowaunoweb.azurewebsites.net/Content/Cards/${imgFileName}`;

    const topCardElement = document.getElementById("topCard");
    topCardElement.src = imgUrl;
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
 
// Funktion zum Starten eines neuen Spiels
