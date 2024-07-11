import { Server } from 'ws';

const wss = new Server({ noServer: true });

wss.on('connection', ws => {
  ws.on('message', message => {
    // handle incoming messages here
    console.log('received: %s', message);
    // broadcast message to all connected clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.send('something');
});

export default wss ;