const fs = require('fs');

function setup () {
    try {
        fs.mkdirSync(process.env.DOWNLOAD_FILEPATH, { recursive: true });
        console.log('Directory created successfully or already exists!');
    } catch (err) {
        console.error('Error creating directory:', err);
    }
}

function setup_new_connection (ip) {
    try {
        fs.mkdirSync(process.env.DOWNLOAD_FILEPATH + "/" + ip, { recursive: true });
        console.log('Directory created successfully or already exists!');
    } catch (err) {
        console.error('Error creating directory:', err);
    }
}

module.exports = { setup, setup_new_connection }