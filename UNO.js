document.getElementById('start-game-button').addEventListener('click', startGame);

// Function to start the game
function startGame() {
    const players = ["1", "2", "3", "4"];

    // Make an API call to start the game
    fetch('https://nowaunoweb.azurewebsites.net/api/game/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(players)
    })
    .then(response => response.json())  // Parse response as JSON
    .then(data => {
        // Show game ID if available
        const gameIdElement = document.getElementById('game-id');
        if (data.Id) {
            gameIdElement.textContent = `Spiel-ID: ${data.Id}`;
        } else {
            gameIdElement.textContent = "Spiel-ID nicht verfügbar";
        }

        // Show "Actual Player Cards" section after game starts
        document.getElementById('player-cards-title').style.display = 'block';

        // Display player cards
        displayCards(data.Players && data.Players[0] && data.Players[0].Cards);
    })
    .catch(error => console.error('Fehler:', error));  // Handle any errors
}

// Function to map color and text to the appropriate image filename
function getCardImageFileName(color, text) {
    const colorMap = {
        "Blue": "b",
        "Red": "r",
        "Green": "g",
        "Yellow": "y",
        "Wild": "w"
    };

    const textMap = {
        "Reverse": "r",
        "Skip": "s",
        "Draw Two": "d2",
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
        "Wild Draw Four": "wd4",
        "Wild Card": "wild"
    };

    // Get the prefix for color
    const colorPrefix = colorMap[color] || "";
    
    // Get the suffix for text
    const textSuffix = textMap[text] || text.toLowerCase();  // Convert number to string or default text
    
    return `${colorPrefix}${textSuffix}.png`;  // Construct image filename
}

// Function to display card images on the webpage
function displayCards(cards) {
    const container = document.getElementById("player-hand");
    container.innerHTML = ""; // Clear previous cards

    if (!cards || cards.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Keine Karten verfügbar";
        container.appendChild(li);
        return;
    }

    cards.forEach(card => {
        // Get the image filename based on card properties
        const imgFileName = getCardImageFileName(card.Color, card.Text);
        const imgUrl = `cards/${imgFileName}`;

        // Create an image element
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `${card.Color} ${card.Text}`;
        img.style.width = "50px";  // Standardize width of cards
        img.style.height = "auto"; // Keep the aspect ratio intact

        // Handle image error and provide fallback image
        img.onerror = function() {
            console.log(`Error loading image: ${img.src}`);
            img.src = 'cards/r3.png'; // Fallback image if the specific image is not found
        };

        // Append the image to the list item
        const li = document.createElement("li");
        li.appendChild(img);
        container.appendChild(li);
    });
}

            // Define a pattern for the image URLs (images hosted on the Azure server)
            return `https://nowaunoweb.azurewebsites.net/Cards/${color}_${text}.png`; // Adjust the path if necessary
        }
    
