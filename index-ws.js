const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Websocket
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    const numClients = wss.clients.size;
    console.log('Clients connected:', numClients);
    wss.broadcast(`Current number of clients: ${numClients}`);
    
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(`Welcome to the server!`);
    }
    ws.on('close', () => {
        wss.broadcast(`Client disconnected. Current number of clients: ${wss.clients.size}`);
    });
});

wss.broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};
