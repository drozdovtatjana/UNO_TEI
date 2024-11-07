document.addEventListener('DOMContentLoaded', () => {
    initializeModal();
    initializeStartGameButton();
});

// Initialize Player Name Modal on Page Load
function initializeModal() {
    $('#playerNamesModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    const playerInputs = document.getElementById("playerInputs");

    // Create player input fields dynamically
    for (let i = 1; i <= 4; i++) {
        playerInputs.innerHTML += `
            <div class="form-group">
                <label for="player${i}Name">Player ${i} Name</label>
                <input type="text" class="form-control" id="player${i}Name" placeholder="Enter Player ${i} Name" required>
            </div>
        `;
    }
}

// Enable Start Button Only When All Fields Are Filled
function initializeStartGameButton() {
    const playerInputs = Array.from(document.querySelectorAll('#playerInputs input'));
    const startGameButton = document.getElementById('start-game-button');

    playerInputs.forEach(input => input.addEventListener('input', () => {
        // Enable button if all player name fields are filled
        startGameButton.disabled = !playerInputs.every(input => input.value.trim() !== "");
    }));

    startGameButton.addEventListener('click', () => {
        startGame();
        $('#playerNamesModal').modal('hide');
    });
}

// Start the Game
async function startGame() {
    const playerNames = getPlayerNames();

    try {
        const response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerNames)
        });

        if (response.ok) {
            const data = await response.json();
            setupGame(data, playerNames);
        } else {
            alert("Error starting the game.");
        }
    } catch (error) {
        alert("Network error. Please try again later.");
    }
}

// Get Player Names
function getPlayerNames() {
    return Array.from({ length: 4 }, (_, i) => 
        document.getElementById(`player${i + 1}Name`).value || `Player ${i + 1}`
    );
}

// Set Up Game Table with Player Names and Cards
function setupGame(data, playerNames) {
    document.getElementById("playersContainer").style.display = "block";
    document.getElementById("playerContainers").innerHTML = playerNames.map((name, index) => `
        <div id="player${index + 1}Container">
            <h4>${name}</h4>
            <div id="cardsPlayer${index + 1}" class="card-container"></div>
        </div>
    `).join('');

    displayTopCard(data.TopCard);
    data.Players.forEach((player, index) => displayCards(player.Cards, index));
}

// Function to map color and text to the appropriate filename prefix
function getCardImageFileName(color, text) {
    const colorMap = {
        "Blue": "b",
        "Red": "r",
        "Green": "g",
        "Yellow": "y",
        "WildColor": "w"
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
        "Draw4": "d4"
    };
    const textSuffix = textMap[text] || text; // Default to text if not special

    return `${colorPrefix}${textSuffix}.png`;
}

// Display the Top Card
function displayTopCard(topCard) {
    if (topCard) {
        const img = document.createElement("img");
        img.src = getCardImageFileName(topCard.Color, topCard.Text);
        img.alt = `${topCard.Color} ${topCard.Text}`;
        img.onerror = () => img.src = 'cards/r3.png';  // Default image on error

        const topCardContainer = document.getElementById("topCard");
        topCardContainer.innerHTML = "";  // Clear previous top card
        topCardContainer.appendChild(img);
    } else {
        console.log("Top card is not available or has an incorrect format.");
    }
}

// Function to display card images based on card properties
function displayCards(cards, playerIndex) {
    const container = document.getElementById(`cardsPlayer${playerIndex + 1}`);
    container.innerHTML = ""; // Clear previous cards

    cards.forEach(card => {
        const imgFileName = getCardImageFileName(card.Color, card.Text);
        const imgUrl = `https://nowaunoweb.azurewebsites.net/Content/Cards/${imgFileName}`;

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `${card.Color} ${card.Text}`;
        img.style.width = "100px"; // Adjust the width as needed
        img.style.height = "auto"; // Keep aspect ratio

        container.appendChild(img);
    });
}


            // Define a pattern for the image URLs (images hosted on the Azure server)
            return `https://nowaunoweb.azurewebsites.net/Cards/${color}_${text}.png`; // Adjust the path if necessary
        }
    
