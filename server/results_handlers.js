const fs = require('fs');

const { setup_new_connection } = require ('./setup.js')

function save_file (result, ip) {

    const id = result.id
    const name = result.name
    const data = result.data
    const download_filepath = process.env.DOWNLOAD_FILEPATH+ "/" + ip + "/" + name;
    setup_new_connection(ip);
    try {
        fs.writeFileSync(download_filepath, data, 'utf8');
        console.log("Data written to file successfully!");
    } catch (err) {
        console.error("Error writing to file:", err);
    }
}

module.exports = { save_file }