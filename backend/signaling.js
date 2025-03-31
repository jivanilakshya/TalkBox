const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        switch (data.type) {
            case 'register':
                clients.set(data.userId, ws);
                break;
                
            case 'offer':
                const targetClient = clients.get(data.target);
                if (targetClient) {
                    targetClient.send(JSON.stringify({
                        type: 'offer',
                        offer: data.offer,
                        from: data.from
                    }));
                }
                break;
                
            case 'answer':
                const answerClient = clients.get(data.target);
                if (answerClient) {
                    answerClient.send(JSON.stringify({
                        type: 'answer',
                        answer: data.answer,
                        from: data.from
                    }));
                }
                break;
                
            case 'ice-candidate':
                const iceClient = clients.get(data.target);
                if (iceClient) {
                    iceClient.send(JSON.stringify({
                        type: 'ice-candidate',
                        candidate: data.candidate,
                        from: data.from
                    }));
                }
                break;
        }
    });

    ws.on('close', () => {
        // Remove client from the map
        for (const [userId, client] of clients.entries()) {
            if (client === ws) {
                clients.delete(userId);
                break;
            }
        }
    });
});

console.log('Signaling server running on port 8080'); 