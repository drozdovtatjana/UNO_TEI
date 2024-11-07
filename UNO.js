        document.getElementById('start-game-button').addEventListener('click', startGame);

        // Start game function
        function startGame() {
            const players = ["1", "2", "3", "4"];

            // API-CALL
            fetch('https://nowaunoweb.azurewebsites.net/api/game/start', {
                method: 'POST', // HTTP-Methode POST to send data
                headers: {
                    'Content-Type': 'application/json' // format - JSON
                },
                body: JSON.stringify(players) // send Player names as JSON  
            })
                .then(response => response.json()) // Antwort in JSON umwandeln
                .then(data => {
                    // show game ID if exists
                    if (data.Id) {
                        document.getElementById('game-id').textContent = `Spiel-ID: ${data.Id}`;
                    } else {
                        document.getElementById('game-id').textContent = "Spiel-ID nicht verfügbar";
                    }

                    // Show "Actual Player Cards" title after the game starts
                    document.getElementById('player-cards-title').style.display = 'block';

                    // Clear existing cards in the list
                    const playerHand = document.getElementById('player-hand');
                    playerHand.innerHTML = '';

                    // If cards exist
                    if (data.Players && data.Players[0] && data.Players[0].Cards) {
                        // Show cards for the first player as images
                        data.Players[0].Cards.forEach(card => {
                            const li = document.createElement('li');
                            
                            // Create an image element for the card
                            const img = document.createElement('img');
                            img.src = getCardImage(card); // Get the image source based on the card
                            img.alt = `${card.Color} ${card.Text}`; // Alt text for accessibility
                            img.style.width = '50px'; // Set a standard size for all card images
                            img.style.height = 'auto';

                            // Append the image to the list item
                            li.appendChild(img);
                            playerHand.appendChild(li);
                        });
                    } else {
                        // If no cards are available
                        const li = document.createElement('li');
                        li.textContent = "Keine Karten verfügbar";
                        playerHand.appendChild(li);
                    }
                })
                .catch(error => console.error('Fehler:', error)); // API error
        }

        // Function to get the image URL for a card
        function getCardImage(card) {
            const color = card.Color.toLowerCase();
            const text = card.Text.toLowerCase().replace(' ', '_'); // Replace spaces with underscores in card text

            // Define a pattern for the image URLs (images hosted on the Azure server)
            return `https://nowaunoweb.azurewebsites.net/Cards/${color}_${text}.png`; // Adjust the path if necessary
        }
    
