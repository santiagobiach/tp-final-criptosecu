const fs = require('fs');

const { setup_new_connection } = require ('./setup.js')
const crypto = require("crypto");

function save_file (result, ip) {

    const id = result.id
    const name = result.name
    const data = result.data
    const hash = result.hash
    const download_filepath = process.env.DOWNLOAD_FILEPATH+ "/" + ip + "/" + name;
    setup_new_connection(ip);
    try {
        const server_hash = crypto.createHash('sha256');

        // Update the hash with the file data
        server_hash.update(data);

        // Generate the hash digest in hexadecimal format
        const hashHex = server_hash.digest('hex');
        if (hashHex === hash){
            fs.writeFileSync(download_filepath, data, 'utf8');
            console.log("Data written to file successfully!");
        } else {
            console.error("Error writing to file: Hashes do not match");
        }

    } catch (err) {
        console.error("Error writing to file:", err);
    }
}

module.exports = { save_file }