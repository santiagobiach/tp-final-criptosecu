const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        console.log("Recibi una request")
        // Sleep for 0.5 seconds
        // Send response with status code 200
        // console.log("Enviando respuesta")
        res.writeHead(200);
        res.end();
    } else {
        // Method not allowed
        res.writeHead(405);
        res.end();
    }
});

const port = 7000;
server.listen(port, () => {
    console.log("Server creado");
});
