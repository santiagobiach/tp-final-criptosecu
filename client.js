const WebSocket = require('ws');

const serverUrl = 'ws://localhost:3000';
const ws = new WebSocket(serverUrl);

ws.on('open', () => {
    console.log('Connected to C2 server');
});

ws.on('message', message => {
    const command = JSON.parse(message);
    console.log('Received command:', command);

    // Simulate command execution and send result back to the server
    const result = {
        id: command.id,
        output: `Executed command: ${command.command}`
    };
    ws.send(JSON.stringify(result));
});

ws.on('close', () => {
    console.log('Disconnected from C2 server');
});
