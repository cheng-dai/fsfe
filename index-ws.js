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

process.on('SIGINT', () => {
    wss.clients.forEach((client) => client.close());
    server.close(() => {
        shutdownDB();
    });
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

    db.run(`
        INSERT INTO visitors (count, time) VALUES (?, ?)
        `, [numClients, new Date().toISOString()]);

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

// database
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )
        `)
})

function getCounts() {
    db.each("SELECT * FROM visitors", (err, row) => {
        console.log(row);
    })
}

function shutdownDB() {
    getCounts();
    console.log("Shutting down database");
    db.close();
}