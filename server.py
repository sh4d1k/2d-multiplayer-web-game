import eventlet
eventlet.monkey_patch()

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
CORS(app)

# In-memory data structures for the game world
players = {}  # Dictionary to store player positions

@app.route('/')
def index():
    return 'Welcome to RealmCraft: Chronicles of Adventure!'

@app.route('/api/register', methods=['POST'])
def register_player():
    data = request.json
    player_name = data.get('player_name')
    if not player_name:
        return jsonify({'error': 'Please provide a valid player name'}), 400

    # Register the player and assign a unique player_id
    player_id = len(players) + 1
    players[player_id] = {'player_name': player_name, 'position_x': 0, 'position_y': 0}

    return jsonify({'message': 'Player registered successfully', 'player_id': player_id}), 201

@socketio.on('player_movement')
def handle_player_movement(data):
    player_id = data.get('player_id')
    position_x = data.get('position_x')
    position_y = data.get('position_y')

    if player_id not in players:
        return jsonify({'error': 'Player not found'}), 404

    # Update the player's position in the server data structure
    players[player_id]['position_x'] = position_x
    players[player_id]['position_y'] = position_y

    # Emit updated game state to all connected clients
    emit('game_state_update', {'player_id': player_id, 'position_x': position_x, 'position_y': position_y}, broadcast=True)

# Real-time communication with clients
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
