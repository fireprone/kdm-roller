import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config({ path: '../.env' });

const app = express();
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());

app.post('/api/token', async (req, res) => {
  // Exchange the code for an access_token
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.VITE_DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: req.body.code,
    }),
  });

  // Retrieve the access_token from the response
  const { access_token } = await response.json();

  // Return the access_token to our client as { access_token: "..."}
  res.send({ access_token });
});

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const onSocketPreError = (error) => {
  console.log(error);
};

const onSocketPostError = (error) => {
  console.log(error);
};

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  // Catch any errors on the HTTP server while trying to upgrade
  socket.on('error', onSocketPreError);

  wss.handleUpgrade(req, socket, head, (ws) => {
    // Upgrade is done, remove error listener
    socket.removeListener('error', onSocketPreError);
    // Start connection
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws, req) => {
  // Catch any errors on the WebSocket server
  ws.on('error', onSocketPostError);

  ws.on('message', (msg, isBinary) => {
    const numberOfDice = Number(msg);
    const diceArray = [];

    for (let i = 0; i < numberOfDice; i++) {
      const rotation = {
        x: 2 * Math.PI * Math.random(),
        y: 0,
        z: 2 * Math.PI * Math.random(),
      };
      const force = 3 + 5 * Math.random();

      diceArray.push({ rotation, force });
    }
    console.log(Number(msg));

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // If no need to send to self, include 'ws !== client' in conditional
        client.send(JSON.stringify({ action: 'roll', data: diceArray }));
      }
    });
  });

  ws.on('close', () => {
    // Cleanup
    console.log('connection "closed"');

    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ action: 'disconnect' }));
    });
  });
});
