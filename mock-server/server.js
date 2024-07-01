const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const currentTime = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'America/Argentina/Buenos_Aires'
        }).format(new Date());
        console.log(`[${currentTime}] Recibi una request`)
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

const port = 7654;
server.listen(port, () => {
    console.log("Server creado");
});
