const fs = require('fs');

function save_file (result) {
    const download_filepath = process.env.DOWNLOAD_FILEPATH;

    const id = result.id
    const name = result.name
    const data = result.data

    try {
        fs.writeFileSync(download_filepath + "/" + name, data, 'utf8');
        console.log("Data written to file successfully!");
    } catch (err) {
        console.error("Error writing to file:", err);
    }
}

module.exports = { save_file }