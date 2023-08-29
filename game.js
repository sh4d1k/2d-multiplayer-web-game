const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// Sample player data (replace this with actual data from your server)
let playerData = {
    player_id: 1,
    position_x: 400,
    position_y: 300,
    playerName: '', // Add the playerName property to the playerData object
    // Add other player-related data here
};

// Server URL (replace this with your actual server URL)
const serverURL = 'ws://127.0.0.1:5000';

// WebSocket connection to the server
const socket = io(serverURL);

function initializeGame(playerName) {
    // Assign the playerName to the playerData object
    playerData.playerName = playerName;

    // Emit the player's initial position to the server
    socket.emit('player_movement', playerData);

    // Initialize other game elements and setup here
}

function preload() {
    this.load.image('player', 'assets/player.png');
    // Load game assets (images, sounds, etc.)
    // Example: this.load.image('player', 'assets/player.png');
}

let playerSprite;

function create() {
    // Set up the game world and objects
    // Example: this.add.image(400, 300, 'player');
    this.add.rectangle(400, 300, 100, 100, 0x00ff00); // Add a green square as the game map

    // Create the player sprite
    playerSprite = this.physics.add.sprite(playerData.position_x, playerData.position_y, 'player').setOrigin(0.5, 0.5);

    // Start the player movement loop
    this.input.keyboard.on('keydown', function (event) {
        if (event.key === 'ArrowUp' || event.key === 'w') {
            playerData.position_y -= 10;
        } else if (event.key === 'ArrowDown' || event.key === 's') {
            playerData.position_y += 10;
        } else if (event.key === 'ArrowLeft' || event.key === 'a') {
            playerData.position_x -= 10;
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            playerData.position_x += 10;
        }
        // Emit the player's position to the server upon movement
        socket.emit('player_movement', playerData);
    });
}

function update() {
    // Implement game logic and mechanics here
    playerSprite.x = playerData.position_x;
    playerSprite.y = playerData.position_y;
}
