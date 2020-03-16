import fs from 'fs';
const path = require('path');
const OS = require('os');
const endOfLine = OS.EOL;

function logger(data) {
    const currentDate = new Date();
    fs.appendFile(path.join(__dirname, '..', '..', 'log', 'server.log'), endOfLine + currentDate + '||' + data, () => {
    });
}

export { logger };
